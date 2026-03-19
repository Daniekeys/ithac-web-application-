"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthFormWrapper } from "@/components/auth/auth-wrapper";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";

const FORGOT_EMAIL_KEY = "forgotPasswordEmail";

// Schema for Step 1: Request OTP
const requestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Schema for Step 2: Reset Password
const resetSchema = z.object({
  token: z.string().min(1, "OTP is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RequestFormValues = z.infer<typeof requestSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const emailParam = searchParams.get("email");
  
  const { forgotPasswordRequest, resetPassword } = useAuth();
  
  const isVerifyStep = step === "verify";

  // Form 1: Request OTP — pre-fill from localStorage if available
  const requestForm = useForm<RequestFormValues>({
      resolver: zodResolver(requestSchema),
      defaultValues: {
          email: (typeof window !== "undefined" && localStorage.getItem(FORGOT_EMAIL_KEY)) || "",
      }
  });

  // Form 2: Reset Password
  const resetForm = useForm<ResetFormValues>({
      resolver: zodResolver(resetSchema),
      defaultValues: {
          token: "",
          password: "",
          confirmPassword: "",
      }
  });

  // Sync localStorage email into form on mount (handles SSR hydration gap)
  useEffect(() => {
      const saved = localStorage.getItem(FORGOT_EMAIL_KEY);
      if (saved && !requestForm.getValues("email")) {
          requestForm.setValue("email", saved);
      }
  }, [requestForm]);

  const onRequestSubmit = (data: RequestFormValues) => {
      forgotPasswordRequest.mutate(data, {
          onSuccess: () => {
              // Persist the email so it survives a refresh on the verify step
              localStorage.setItem(FORGOT_EMAIL_KEY, data.email);
          },
      });
  };

  const onResetSubmit = (data: ResetFormValues) => {
      const email = emailParam || localStorage.getItem(FORGOT_EMAIL_KEY) || "";
      if (!email) {
          return;
      }
      resetPassword.mutate(
          { email, token: data.token, password: data.password },
          {
              onSuccess: () => {
                  // Clear the persisted email once password is successfully reset
                  localStorage.removeItem(FORGOT_EMAIL_KEY);
              },
          }
      );
  };


  if (isVerifyStep) {
      const resolvedEmail = emailParam || (typeof window !== "undefined" ? localStorage.getItem(FORGOT_EMAIL_KEY) : null) || "";
      return (
        <AuthFormWrapper
          title="Reset Password"
          description={`Enter the OTP sent to ${resolvedEmail || "your email"} and your new password`}
          footerText="Remember your password?"
          footerLink="/login"
          footerLinkText="Sign in"
        >
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
               {!resolvedEmail && <div className="text-red-500 text-sm">Email missing. Please start over.</div>}
              <FormField
                control={resetForm.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={resetPassword.isPending || !resolvedEmail}>
                {resetPassword.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reset Password
              </Button>
            </form>
          </Form>
        </AuthFormWrapper>
      );
  }

  return (
    <AuthFormWrapper
      title="Forgot Password?"
      description="Enter your email address and we'll send you a OTP to reset your password."
      footerText="Remember your password?"
      footerLink="/login"
      footerLinkText="Sign in"
    >
      <Form {...requestForm}>
        <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
          <FormField
            control={requestForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={forgotPasswordRequest.isPending}>
            {forgotPasswordRequest.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send OTP
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForgotPasswordContent />
        </Suspense>
    );
}
