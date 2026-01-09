import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/services/http";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { courseService } from "@/services/course.service";

// Define types based on Postman (approximate)
interface LoginPayload {
  email: string;
  password?: string;
}

interface RegisterPayload {
  email: string;
  password?: string;
}

interface VerifyEmailPayload {
  id: string; // The ID from the URL :id
  token: string;
}

interface ForgotPasswordRequestPayload {
  email: string;
}

interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
}

interface OnboardingPayload {
  firstname: string;
  lastname: string;
  skill: "beginner" | "intermediate" | "advanced";
  area?: string[];
}

// ... imports

export const useAuth = () => {
  const router = useRouter();
  const { setUser, clearUser } = useAuthStore();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await httpClient.post("/api/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Check if email is verified
        if (data.user._email === false) {
           clearUser(); // Ensure state is clean
           toast({
               title: "Email verification required",
               description: "Please verify your email address to continue.",
               // variant: "default", 
           });
           router.push(`/verify-email?id=${data.user._id}`);
           return;
        }

        // Save user and token to store
        setUser(data.user, data.token);
        
        toast({
            title: "Logged in successfully",
            description: "Welcome back!",
        });

        if (data.user.role === 'admin') {
             router.push("/admin");
             return;
        }

        // Check Onboarding status via history call (as requested)
        // If action is "onboard", the http interceptor will handle the redirection.
        try {
            courseService.getUserHistory().then(() => {
                 // If success (and no redirect happen), go to dashboard
                 router.push("/user");
            }).catch(() => {
                 // If failed, interceptor might catch it. 
                 // If not caught by interceptor (e.g. 500), we still default to dashboard or handle error.
                 // Assuming interceptor handles "onboard" action.
                 // For now, if catch happens and we are still here, try dashboard or stay.
                 router.push("/user");
            });
        } catch {
             router.push("/user");
        }
      } else {
         toast({
            title: "Login failed",
            description: data.error || "Please check your credentials",
            variant: "destructive",
         });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await httpClient.post("/api/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
       if(data.success) {
           toast({
               title: "Registration successful",
               description: "Please verify your email",
           });
           if (data.data && data.data._id) {
               router.push(`/verify-email?id=${data.data._id}`);
           } else {
               router.push("/login");
           }
       }
    },
    onError: (error: Error) => {
        toast({
            title: "Registration failed",
            description: error.message || "Please try again",
            variant: "destructive",
        });
    }
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async ({ id, token }: VerifyEmailPayload) => {
         return (await httpClient.post("/api/auth/verify", { id, token })).data;
    },
    onSuccess: (data) => {
        if(data.success) {
            toast({
                title: "Email verified!",
                description: "Proceeding to onboarding...",
            });
            router.push("/onboarding");
        }
    },
    onError: (error: Error) => {
         toast({
            title: "Verification failed",
            description: error.message || "Invalid or expired token",
            variant: "destructive",
         });
    }
  });

  const forgotPasswordRequestMutation = useMutation({
      mutationFn: async (data: ForgotPasswordRequestPayload) => {
          return (await httpClient.post("/api/auth/forgot-password/request", data)).data;
      },
      onSuccess: (data) => {
          toast({
              title: "OTP sent",
              description: "Check your email for the reset code",
          });
          const email = data?.data?.email || data?.email || ""; // Adjust based on actual API response
          router.push(`/forgot-password?step=verify${email ? `&email=${encodeURIComponent(email)}` : ""}`); 
      },
      onError: (error: Error) => {
           toast({
              title: "Request failed",
              description: error.message,
              variant: "destructive",
           });
      }
  });

  const resetPasswordMutation = useMutation({
      mutationFn: async (data: ResetPasswordPayload) => {
          return (await httpClient.post("/api/auth/forgot-password/reset", data)).data;
      },
       onSuccess: () => {
           toast({
               title: "Password reset successful",
               description: "Please login with your new password",
           });
           router.push("/login");
       },
       onError: (error: Error) => {
            toast({
                title: "Reset failed",
                description: error.message,
                variant: "destructive",
            });
       }
  });

  const onboardingMutation = useMutation({
      mutationFn: async (data: OnboardingPayload) => {
          return (await httpClient.post("/api/auth/onboard", data)).data;
      },
      onSuccess: () => {
          toast({
              title: "Onboarding complete",
              description: "Please login to access your dashboard.",
          });
          router.push("/login"); // User requested "onboarding screen > login"
      },
      onError: (error: Error) => {
           toast({
               title: "Onboarding failed",
               description: error.message,
               variant: "destructive",
           });
      }
  });

  const adminLoginMutation = useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await httpClient.post("/api/auth/admin-login", data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Save user and token to store
        // Note: Admin API might return data in data.data or data.user, verify based on response
        // Assuming data.data based on typical pattern or data.user
        setUser(data.data || data.user, data.token);
        
        toast({
            title: "Admin Login successful",
            description: "Welcome Admin!",
        });
        
        router.push("/admin");
      } else {
         toast({
            title: "Login failed",
            description: data.error || "Please check your credentials",
            variant: "destructive",
         });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
      mutationFn: async () => {
          return (await httpClient.post("/api/auth/logout", {})).data;
      },
      onSuccess: () => {
          clearUser();
          router.push("/login");
          toast({
              title: "Logged out",
          });
      },
      onError: () => {
            // Force logout local even if server fail
             clearUser();
             router.push("/login");
      }
  });

  return {
    login: loginMutation,
    register: registerMutation,
    verifyEmail: verifyEmailMutation,
    forgotPasswordRequest: forgotPasswordRequestMutation,
    resetPassword: resetPasswordMutation,
    onboard: onboardingMutation,
    logout: logoutMutation,
    adminLogin: adminLoginMutation
  };
};
