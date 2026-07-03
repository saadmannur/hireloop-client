import React from 'react';
import {
    Modal,
    TextField,
    Label,
    Input,
    InputGroup,
    TextArea,
    Description,
    Select,
    ListBox,
    Button,
} from '@heroui/react';
import { HiOutlineUpload, HiOutlineLocationMarker } from 'react-icons/hi';
import Image from 'next/image';

const INDUSTRY_OPTIONS = [
    'Technology',
    'Finance',
    'Healthcare',
    'E-commerce',
    'Education',
    'Manufacturing',
];

const EMPLOYEE_RANGES = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees',
];

const CompanyFormModal = ({
    state,
    form,
    onFieldChange,
    onSelectChange,
    onLogoChange,
    onSubmit,
    isEditing,
}) => (
    <Modal state={state}>
        <Modal.Backdrop variant="blur">
            <Modal.Container size="lg" scroll="inside">
                <Modal.Dialog>
                    {({ close }) => (
                        <>
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading>
                                    {isEditing ? 'Edit Company' : 'Register New Company'}
                                </Modal.Heading>
                            </Modal.Header>

                            <Modal.Body className="gap-4 flex flex-col">
                                <p className="text-sm text-muted -mt-2">
                                    Enter your business details to start hiring on HireLoop.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <TextField
                                        name="name"
                                        value={form.name}
                                        onChange={onFieldChange('name')}
                                    >
                                        <Label>Company Name</Label>
                                        <Input placeholder="e.g. Acme Corp" />
                                    </TextField>

                                    <Select
                                        value={form.industry || null}
                                        onChange={onSelectChange('industry')}
                                        placeholder="Select industry"
                                    >
                                        <Label>Industry / Category</Label>
                                        <Select.Trigger>
                                            <Select.Value />
                                            <Select.Indicator />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            <ListBox>
                                                {INDUSTRY_OPTIONS.map((opt) => (
                                                    <ListBox.Item key={opt} id={opt} textValue={opt}>
                                                        {opt}
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <TextField
                                        name="website"
                                        value={form.website}
                                        onChange={onFieldChange('website')}
                                    >
                                        <Label>Website URL</Label>
                                        <InputGroup>
                                            <InputGroup.Prefix>
                                                <span className="text-muted text-sm">https://</span>
                                            </InputGroup.Prefix>
                                            <InputGroup.Input placeholder="www.company.com" />
                                        </InputGroup>
                                    </TextField>

                                    <TextField
                                        name="location"
                                        value={form.location}
                                        onChange={onFieldChange('location')}
                                    >
                                        <Label>Location</Label>
                                        <InputGroup>
                                            <InputGroup.Prefix>
                                                <HiOutlineLocationMarker className="text-muted" />
                                            </InputGroup.Prefix>
                                            <InputGroup.Input placeholder="City, Country" />
                                        </InputGroup>
                                    </TextField>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Select
                                        value={form.employeeRange || null}
                                        onChange={onSelectChange('employeeRange')}
                                        placeholder="Select range"
                                    >
                                        <Label>Employee Count Range</Label>
                                        <Select.Trigger>
                                            <Select.Value />
                                            <Select.Indicator />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            <ListBox>
                                                {EMPLOYEE_RANGES.map((opt) => (
                                                    <ListBox.Item key={opt} id={opt} textValue={opt}>
                                                        {opt}
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>

                                    <div>
                                        <label className="text-sm text-foreground mb-1.5 block font-medium">
                                            Company Logo
                                        </label>
                                        <label
                                            htmlFor="logo-upload"
                                            className="flex items-center gap-3 border-2 border-dashed border-border rounded-lg px-3 py-2.5 cursor-pointer hover:border-accent transition-colors"
                                        >
                                            <div className="size-8 rounded-lg bg-surface-secondary flex items-center justify-center shrink-0">
                                                {
                                                    form.logoPreview ? <div>
                                                        <Image
                                                            src={form.logoPreview}
                                                            alt="Logo Preview"
                                                            width={100}
                                                            height={50}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div> : <HiOutlineUpload className="text-muted" />
                                                }
                                            </div>
                                            <div className="text-sm">
                                                <p className="text-foreground">
                                                    {form.logoFile ? form.logoFile.name : 'Upload image'}
                                                </p>
                                                <p className="text-muted text-xs">
                                                    PNG, JPG up to 5MB
                                                </p>
                                            </div>
                                        </label>
                                        <input
                                            id="logo-upload"
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            className="hidden"
                                            onChange={onLogoChange}
                                        />
                                    </div>
                                </div>

                                <TextField
                                    name="description"
                                    value={form.description}
                                    onChange={onFieldChange('description')}
                                >
                                    <Label>Brief Description</Label>
                                    <TextArea placeholder="Tell us about your company's mission and culture..." />
                                    <Description>
                                        A short summary shown on your public company profile.
                                    </Description>
                                </TextField>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="tertiary" onPress={close}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    isDisabled={!form.name}
                                    onPress={() => {
                                        onSubmit();
                                        close();
                                    }}
                                >
                                    {isEditing ? 'Save Changes' : 'Register Company'}
                                </Button>
                            </Modal.Footer>
                        </>
                    )}
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>
);

export default CompanyFormModal;