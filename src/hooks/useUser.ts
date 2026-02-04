import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { toast } from "@/hooks/use-toast";
import { PasswordUpdateSettings, UserProfileUpdate } from "@/types/auth";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UserProfileUpdate) => userService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.error || "Failed to update profile",
                variant: "destructive",
            });
        },
    });
};

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: (data: PasswordUpdateSettings) => userService.updatePassword(data),
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Password updated successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.error || "Failed to update password",
                variant: "destructive",
            });
        },
    });
};
