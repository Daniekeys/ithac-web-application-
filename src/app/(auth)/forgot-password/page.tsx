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
import { Suspense } from "react";

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

  // Form 1: Request OTP
  const requestForm = useForm<RequestFormValues>({
      resolver: zodResolver(requestSchema),
      defaultValues: {
          email: "",
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

  const onRequestSubmit = (data: RequestFormValues) => {
      forgotPasswordRequest.mutate(data);
  };

  const onResetSubmit = (data: ResetFormValues) => {
      if (!emailParam) {
          // Fallback or error if email lost?
          // We need email for resetPassword payload (see useAuth).
          // Assuming we need email. If Postman said we need email, we need it.
          // User has to re-enter email? 
          // For now assume passed in URL. If not, maybe add hidden field or ask user again.
          // Let's rely on URL for now.
          return; 
      }
      resetPassword.mutate({
          email: emailParam,
          token: data.token,
          password: data.password
      });
  };

  if (isVerifyStep) {
      return (
        <AuthFormWrapper
          title="Reset Password"
          description={`Enter the OTP sent to ${emailParam} and your new password`}
          footerText="Remember your password?"
          footerLink="/login"
          footerLinkText="Sign in"
        >
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
               {!emailParam && <div className="text-red-500 text-sm">Email missing from link. Please start over.</div>}
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
              <Button className="w-full" type="submit" disabled={resetPassword.isPending || !emailParam}>
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
