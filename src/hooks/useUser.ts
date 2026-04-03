import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@/hooks/use-toast";
import { PasswordUpdateSettings, UserProfileUpdate } from "@/types/auth";
import { User } from "@/types/auth";

export const useProfile = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            const data = await userService.getProfile();
            if (token && data) {
                 setUser(data, token);
            }
            return data;
        },
        enabled: !!token,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);
    const token = useAuthStore((state) => state.token);

    return useMutation({
        mutationFn: (data: UserProfileUpdate) => userService.updateProfile(data),
        onSuccess: (freshUser: User) => {
            // Sync the fresh server data into the auth store so every
            // component reading useAuthStore gets the latest values
            if (token) {
                setUser(freshUser, token);
            }
            // Bust any cached profile queries
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
