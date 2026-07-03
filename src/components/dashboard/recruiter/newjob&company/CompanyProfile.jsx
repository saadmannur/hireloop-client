'use client';

import React, { useState } from 'react';
import { toast, useOverlayState } from '@heroui/react';
import EmptyState from '@/components/dashboard/recruiter/company/EmptyState';
import CompanyDetails from '@/components/dashboard/recruiter/company/CompanyDetails';
import CompanyFormModal from '@/components/dashboard/recruiter/company/CompanyFormModal';
import { createCompany } from '@/lib/actions/companies';
import { useRouter } from 'next/navigation';

const INITIAL_FORM = {
    name: '',
    industry: '',
    website: '',
    location: '',
    employeeRange: '',
    description: '',
    logoFile: null,
    logoPreview: '',
};

const RecruiterCompany = ({ recruiter, recruiterCompany }) => {
    const router = useRouter();
    // null => no company registered yet
    const [company, setCompany] = useState(recruiterCompany);
    const state = useOverlayState();
    const [form, setForm] = useState(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFieldChange = (field) => (value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field) => (value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const MAX_SIZE = 1 * 1024 * 1024; // 1MB
        if (file.size > MAX_SIZE) {
            toast.danger('File too large', {
                description: 'Logo must be under 1MB.',
            });
            e.target.value = ''; // reset the input so the same file can be re-picked after compressing
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.danger('Invalid file', {
                description: 'Please select an image file.',
            });
            e.target.value = '';
            return;
        }

        setForm((prev) => ({
            ...prev,
            logoFile: file,
            logoPreview: URL.createObjectURL(file),
        }));
    };

    const openForRegister = () => {
        setForm(INITIAL_FORM);
        state.open();
    };

    const openForEdit = () => {
        if (company) setForm({ ...company, logoFile: null, logoPreview: company.logoUrl || '' });
        state.open();
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Only re-encode when the user actually picked a new file.
            // Otherwise keep whatever logoUrl the company already had.
            let logoUrl = company?.logoUrl || '';
            if (form.logoFile) {
                logoUrl = await fileToBase64(form.logoFile); // data:image/...;base64,....
            }

            // Never send the raw File/blob-url to the server — only the
            // base64 string (or the previous logoUrl if unchanged).
            const { logoFile, logoPreview, ...rest } = form;
            const newCompanyData = {
                ...rest,
                logoUrl,
                status: company?.status ?? 'pending',
                recruiterId: recruiter.id,
            };

            const data = await createCompany(newCompanyData);

            if (data?.acknowledged) {
                setCompany({ ...newCompanyData, _id: data.insertedId ?? company?._id });
                toast.success('Company saved successfully', {
                    description: 'Your changes are now pending admin approval.',
                });
                state.close();
                router.refresh();
            } else {
                throw new Error(data?.error || 'Failed to save company.');
            }
        } catch (err) {
            toast.danger('Submission failed', { description: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-xl font-semibold mb-6">My Company</h1>

                {!company?._id ? (
                    <EmptyState onRegister={openForRegister} />
                ) : (
                    <CompanyDetails company={company} onEdit={openForEdit} />
                )}
            </div>

            <CompanyFormModal
                state={state}
                form={form}
                onFieldChange={handleFieldChange}
                onSelectChange={handleSelectChange}
                onLogoChange={handleLogoChange}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isEditing={!!company?._id}
            />
        </div>
    );
};

// FileReader wrapped in a promise so it can be awaited inline.
// Result is a full data URI: "data:image/png;base64,iVBORw0KG..."
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default RecruiterCompany;