// app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Form, Input, Label, TextField, FieldError, toast } from "@heroui/react";
import { FiEye, FiEyeOff, FiLoader, FiLogIn } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email")?.toString().trim();
        const password = formData.get("password")?.toString();

        setIsSubmitting(true);

        const { error , data} = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/",
        });

        setIsSubmitting(false);
        // console.log(data);

        if (error) {
            toast.danger("Login failed", {
                description: error.message || "Check your email and password and try again.",
            });
            return;
        }

        toast.success("Welcome back", {
            description: "Logged in successfully. Redirecting...",
        });

        setTimeout(() => router.push("/"), 800);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4  text-foreground">
            <div className="w-full max-w-md rounded-2xl border border-border bg-background/60 p-8 shadow-xl backdrop-blur-sm dark:bg-neutral-900/60">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-neutral-400">
                        Log in to continue to your account.
                    </p>
                </div>

                <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
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
                        validate={(value) => {
                            if (value.length < 1) return "Password is required";
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
                        <FieldError />
                    </TextField>

                    <Button type="submit" isDisabled={isSubmitting} className="mt-2 w-full bg-violet-600 text-white">
                        {isSubmitting ? (
                            <>
                                <FiLoader className="h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            <>
                                <FiLogIn className="h-4 w-4" />
                                Log in
                            </>
                        )}
                    </Button>
                </Form>

                <p className="mt-6 text-center text-sm text-muted-foreground dark:text-neutral-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="font-medium hover:underline text-violet-600">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}