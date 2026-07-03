"use client";

import { useState } from "react";
import {
    Briefcase,
    Wallet,
    MapPin,
    Calendar,
    TextAlignLeft,
    ListCheck,
    Gift,
    CircleCheck,
    CircleExclamation,
    House,
} from "@gravity-ui/icons";
import {
    Form,
    Fieldset,
    TextField,
    Label,
    Input,
    TextArea,
    Description,
    FieldError,
    Select,
    ListBox,
    Switch,
    Button,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Chip,
    Alert,
    toast,
} from "@heroui/react";
import { createJob } from "@/lib/actions/jobs";
import { redirect } from "next/navigation";

// --- Static option lists -----------------------------------------------
const JOB_CATEGORIES = [
    "Engineering",
    "Design",
    "Product",
    "Marketing",
    "Sales",
    "Customer Support",
    "Operations",
    "Finance",
    "Human Resources",
    "Other",
];

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const CURRENCIES = ["USD", "EUR", "GBP", "BDT", "INR"];


const NewJob = ({ companyA }) => {
    const company = {
        ...companyA, isApproved: true,
    }
    // console.log(company);

    const [isRemote, setIsRemote] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!company.isApproved) return;

        setSubmitError(null);
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const payload = {
            title: formData.get("title"),
            category: formData.get("category"),
            jobType: formData.get("jobType"),
            salaryMin: Number(formData.get("salaryMin")),
            salaryMax: Number(formData.get("salaryMax")),
            currency: formData.get("currency"),
            isRemote,
            city: isRemote ? null : formData.get("city"),
            country: isRemote ? null : formData.get("country"),
            applicationDeadline: formData.get("applicationDeadline"),
            responsibilities: formData.get("responsibilities"),
            requirements: formData.get("requirements"),
            benefits: formData.get("benefits") || null,
            companyId: company._id,
            companyName: company.name,
            companyImage: company.logoUrl,
            status: "active",
        };
        // console.log(payload);

        try {
            // const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs`, {
            //     method: "POST",
            //     headers: { 
            //         "Content-Type": "application/json",
            //      },
            //     body: JSON.stringify(payload),
            // });
            // if (!res.ok) throw new Error("Failed to publish job");

            const data = await createJob(payload)
            // console.log(data);
            

            if (data.acknowledged === true) {
                toast.success("Add Job Successfully", {
                    description: "Thankyou for contributing",
                });
            }

            // TODO: redirect to /dashboard/recruiter/jobs or show a success toast
            event.target.reset();
            setIsRemote(false);
        } catch (err) {
            setSubmitError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
        redirect('/dashboard/recruiter')
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-black dark:text-white">
                    Post a job
                </h1>
                <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                    Fill in the details below. Your listing goes live to job seekers as
                    soon as you publish it.
                </p>
            </div>

            {!company.isApproved && (
                <Alert className="mb-6" variant="danger">
                    <CircleExclamation className="h-4 w-4" />
                    Your company, {company.name}, hasn&apos;t been approved yet. You
                    can&apos;t publish jobs until an admin approves your company.
                </Alert>
            )}

            {submitError && (
                <Alert className="mb-6" variant="danger">
                    <CircleExclamation className="h-4 w-4" />
                    {submitError}
                </Alert>
            )}

            <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* ---------------- Company (auto-filled, read-only) --------------- */}
                <Fieldset
                    className="rounded-2xl border border-black/10 bg-white p-6
            dark:border-white/10 dark:bg-[#141414]"
                >
                    <Fieldset.Legend className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
                        <House className="h-4 w-4 text-black/60 dark:text-white/60" />
                        Company
                    </Fieldset.Legend>
                    <Fieldset.Group>
                        <div className="flex items-center gap-3 rounded-xl bg-black/5 p-3 dark:bg-white/5">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={company.logoUrl} alt={company.name} />
                                <AvatarFallback>{company.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-black dark:text-white">
                                    {company.name}
                                </p>
                                <p className="text-xs text-black/50 dark:text-white/50">
                                    This job will be published under your registered company.
                                </p>
                            </div>
                            <Chip color={company.isApproved ? "success" : "danger"}>
                                <CircleCheck className="h-3.5 w-3.5" />
                                {company.isApproved ? "Approved" : "Pending approval"}
                            </Chip>
                        </div>
                    </Fieldset.Group>
                </Fieldset>

                {/* ---------------------------- Job Info --------------------------- */}
                <Fieldset
                    className="rounded-2xl border border-black/10 bg-white p-6
            dark:border-white/10 dark:bg-[#141414]"
                >
                    <Fieldset.Legend className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
                        <Briefcase className="h-4 w-4 text-black/60 dark:text-white/60" />
                        Job info
                    </Fieldset.Legend>

                    <Fieldset.Group className="gap-4">
                        <TextField name="title" isRequired fullWidth>
                            <Label>Job title</Label>
                            <Input placeholder="e.g. Senior Frontend Engineer" />
                            <FieldError />
                        </TextField>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Select name="category" placeholder="Select a category" isRequired fullWidth>
                                <Label>Job category</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {JOB_CATEGORIES.map((category) => (
                                            <ListBox.Item key={category} id={category} textValue={category}>
                                                {category}
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                                <FieldError />
                            </Select>

                            <Select name="jobType" placeholder="Select a job type" isRequired fullWidth>
                                <Label>Job type</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {JOB_TYPES.map((type) => (
                                            <ListBox.Item key={type} id={type} textValue={type}>
                                                {type}
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                                <FieldError />
                            </Select>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <TextField name="salaryMin" type="number" isRequired fullWidth>
                                <Label className="flex items-center gap-1.5">
                                    <Wallet className="h-3.5 w-3.5 text-black/50 dark:text-white/50" />
                                    Min salary
                                </Label>
                                <Input placeholder="40000" min={0} />
                                <FieldError />
                            </TextField>

                            <TextField name="salaryMax" type="number" isRequired fullWidth>
                                <Label>Max salary</Label>
                                <Input placeholder="65000" min={0} />
                                <FieldError />
                            </TextField>

                            <Select name="currency" placeholder="Currency" defaultSelectedKey="USD" isRequired fullWidth>
                                <Label>Currency</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {CURRENCIES.map((currency) => (
                                            <ListBox.Item key={currency} id={currency} textValue={currency}>
                                                {currency}
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                                <FieldError />
                            </Select>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-black/5 p-3 dark:bg-white/5">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-black/60 dark:text-white/60" />
                                <div>
                                    <p className="text-sm font-medium text-black dark:text-white">
                                        Remote job
                                    </p>
                                    <p className="text-xs text-black/50 dark:text-white/50">
                                        Turn on if this role can be done from anywhere.
                                    </p>
                                </div>
                            </div>
                            <Switch
                                isSelected={isRemote}
                                onChange={(e) => setIsRemote(e)}
                                aria-label="Remote Job"
                            >
                                <Switch.Content>
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch.Content>
                            </Switch>
                        </div>

                        {!isRemote && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <TextField name="city" isRequired={!isRemote} fullWidth>
                                    <Label>City</Label>
                                    <Input placeholder="e.g. Dhaka" />
                                    <FieldError />
                                </TextField>

                                <TextField name="country" isRequired={!isRemote} fullWidth>
                                    <Label>Country</Label>
                                    <Input placeholder="e.g. Bangladesh" />
                                    <FieldError />
                                </TextField>
                            </div>
                        )}

                        <TextField name="applicationDeadline" type="date" isRequired fullWidth>
                            <Label className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-black/50 dark:text-white/50" />
                                Application deadline
                            </Label>
                            <Input />
                            <FieldError />
                        </TextField>
                    </Fieldset.Group>
                </Fieldset>

                {/* ------------------------ Job Description ------------------------ */}
                <Fieldset
                    className="rounded-2xl border border-black/10 bg-white p-6
            dark:border-white/10 dark:bg-[#141414]"
                >
                    <Fieldset.Legend className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
                        <TextAlignLeft className="h-4 w-4 text-black/60 dark:text-white/60" />
                        Job description
                    </Fieldset.Legend>

                    <Fieldset.Group className="gap-4">
                        <TextField name="responsibilities" isRequired fullWidth>
                            <Label className="flex items-center gap-1.5">
                                <ListCheck className="h-3.5 w-3.5 text-black/50 dark:text-white/50" />
                                Responsibilities
                            </Label>
                            <TextArea
                                rows={5}
                                placeholder="What will this person do day to day?"
                            />
                            <FieldError />
                        </TextField>

                        <TextField name="requirements" isRequired fullWidth>
                            <Label>Requirements</Label>
                            <TextArea
                                rows={5}
                                placeholder="Skills, experience, and qualifications needed."
                            />
                            <FieldError />
                        </TextField>

                        <TextField name="benefits" fullWidth>
                            <Label className="flex items-center gap-1.5">
                                <Gift className="h-3.5 w-3.5 text-black/50 dark:text-white/50" />
                                Benefits
                            </Label>
                            <TextArea rows={4} placeholder="Optional — health insurance, remote stipend, etc." />
                            <Description>Leave blank if not applicable.</Description>
                        </TextField>
                    </Fieldset.Group>
                </Fieldset>

                {/* -------------------------------- Actions ------------------------------- */}
                <div className="flex items-center justify-end gap-3">
                    <Button type="reset" variant="secondary" isDisabled={isSubmitting}>
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        isDisabled={!company.isApproved || isSubmitting}
                        isPending={isSubmitting}
                    >
                        {isSubmitting ? "Publishing…" : "Publish job"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default NewJob;