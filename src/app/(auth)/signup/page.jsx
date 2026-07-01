// app/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Form, Input, Label, TextField, FieldError, Description, toast } from "@heroui/react";
import { FiEye, FiEyeOff, FiCamera, FiLoader, FiUserPlus } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoBase64, setPhotoBase64] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.danger("Invalid file", { description: "Please select an image file." });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.danger("File too large", { description: "Photo must be under 2MB." });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPhotoPreview(reader.result);
            setPhotoBase64(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name")?.toString().trim();
        const email = formData.get("email")?.toString().trim();
        const pwd = formData.get("password")?.toString();

        setIsSubmitting(true);

        const { error, data } = await authClient.signUp.email({
            name,
            email,
            password: pwd,
            image: photoBase64 || undefined,
            callbackURL: "/login",
        });

        console.log(data)

        setIsSubmitting(false);

        if (error) {
            toast.danger("Signup failed", {
                description: error.message || "Something went wrong. Please try again.",
            });
            return;
        }

        toast.success("Account created", {
            description: "Welcome aboard! Redirecting you to login...",
        });

        setTimeout(() => router.push("/login"), 1200);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-25 text-foreground">
            <div className="w-full max-w-md rounded-2xl border border-border bg-background/60 p-8 shadow-xl backdrop-blur-sm dark:bg-neutral-900/60">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-neutral-400">
                        Join us — it only takes a minute.
                    </p>
                </div>

                <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
                    {/* Photo upload */}
                    <div className="flex flex-col items-center gap-2">
                        <label
                            htmlFor="photo"
                            className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-neutral-100 transition hover:border-accent dark:bg-neutral-800"
                        >
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <FiCamera className="h-6 w-6 text-neutral-400 group-hover:text-accent" />
                            )}
                            <input
                                id="photo"
                                name="photo"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                            />
                        </label>
                        <span className="text-xs text-muted-foreground dark:text-neutral-400">
                            Profile photo (optional)
                        </span>
                    </div>

                    {/* Name */}
                    <TextField isRequired name="name" type="text">
                        <Label>Full name</Label>
                        <Input placeholder="Jane Doe" />
                        <FieldError />
                    </TextField>

                    {/* Email */}
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        validate={(value) => {
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                return "Please enter a valid email address";
                            }
                            return null;
                        }}
                    >
                        <Label>Email</Label>
                        <Input placeholder="jane@example.com" />
                        <FieldError />
                    </TextField>

                    {/* Password */}
                    <TextField
                        isRequired
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={setPassword}
                        validate={(value) => {
                            if (value.length < 8) return "Password must be at least 8 characters";
                            if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter";
                            if (!/[0-9]/.test(value)) return "Add at least one number";
                            return null;
                        }}
                    >
                        <Label>Password</Label>
                        <div className="relative">
                            <Input placeholder="Enter your password" className="pr-10" />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-foreground"
                                tabIndex={-1}
                            >
                                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                            </button>
                        </div>
                        <Description>At least 8 characters, 1 uppercase letter, 1 number</Description>
                        <FieldError />
                    </TextField>

                    {/* Confirm password */}
                    <TextField
                        isRequired
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        validate={(value) => {
                            if (value !== password) return "Passwords do not match";
                            return null;
                        }}
                    >
                        <Label>Confirm password</Label>
                        <div className="relative">
                            <Input placeholder="Re-enter your password" className="pr-10" />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-foreground"
                                tabIndex={-1}
                            >
                                {showConfirm ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                            </button>
                        </div>
                        <FieldError />
                    </TextField>

                    <Button type="submit" isDisabled={isSubmitting} className="mt-2 w-full  bg-violet-600 text-white">
                        {isSubmitting ? (
                            <>
                                <FiLoader className="h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                <FiUserPlus className="h-4 w-4" />
                                Sign up
                            </>
                        )}
                    </Button>
                </Form>

                <p className="mt-6 text-center text-sm text-muted-foreground dark:text-neutral-400">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium hover:underline  text-violet-600">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}