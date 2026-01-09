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
import { AuthFormWrapper } from "@/components/auth/auth-wrapper";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const verifySchema = z.object({
  token: z.string().min(1, "OTP is required"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { verifyEmail } = useAuth();

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = (data: VerifyFormValues) => {
    if (!id) {
        // Should not happen if flow is correct, but handle it
        return; 
    }
    verifyEmail.mutate({
        id: id,
        token: data.token
    });
  };

  if (!id) {
      return (
          <AuthFormWrapper title="Verification Error" description="Invalid verification link. Please sign up again.">
             <Button variant="outline" className="w-full" onClick={() => window.location.href='/register'}>Back to Register</Button>
          </AuthFormWrapper>
      );
  }

  return (
    <AuthFormWrapper
      title="Verify Email"
      description="Enter the OTP sent to your email"
      footerText="Didn't receive code?"
      footerLink="#"
      footerLinkText="Resend"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
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
          <Button className="w-full" type="submit" disabled={verifyEmail.isPending}>
             {verifyEmail.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verify Email
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
