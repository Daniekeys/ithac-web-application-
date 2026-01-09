import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Contributor, CreateContributorDTO } from "@/types/contributor.types";
import { useAdminCreateContributor, useAdminUpdateContributor } from "@/hooks/useContributor";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ContributorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contributor?: Contributor | null;
}

export function ContributorDialog({
  open,
  onOpenChange,
  contributor,
}: ContributorDialogProps) {
  const createContributor = useAdminCreateContributor();
  const updateContributor = useAdminUpdateContributor();
  
  const isEditing = !!contributor;

  const { register, handleSubmit, reset, setValue } = useForm<CreateContributorDTO>();

  useEffect(() => {
    if (contributor) {
      setValue("name", contributor.name);
      setValue("email", contributor.email);
      setValue("nickname", contributor.nickname);
      setValue("address", contributor.address);
      setValue("profession", contributor.profession);
      setValue("phone", contributor.phone);
      setValue("detail", contributor.detail);
      setValue("image", contributor.image);
    } else {
      reset({
        name: "",
        email: "",
        nickname: "",
        address: "",
        profession: "",
        phone: "",
        detail: "",
        image: "",
      });
    }
  }, [contributor, setValue, reset, open]);

  const onSubmit = async (data: CreateContributorDTO) => {
    try {
      if (isEditing && contributor) {
        // For update, exclude email if it's not allowed to be changed, or if backend ignores it.
        // Postman doc says email omitted.
        const { email, ...updateData } = data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        void email; 
        await updateContributor.mutateAsync({
           id: contributor._id,
           data: updateData
        });
        toast({ title: "Success", description: "Contributor updated successfully" });
      } else {
        await createContributor.mutateAsync(data);
        toast({ title: "Success", description: "Contributor created successfully" });
      }
      onOpenChange(false);
    } catch (error) {
        console.error(error);
      toast({ 
        title: "Error", 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: (error as any)?.response?.data?.error || "Something went wrong", 
        variant: "destructive" 
      });
    }
  };

  const isLoading = createContributor.isPending || updateContributor.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Contributor" : "Add Contributor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" {...register("name", { required: true })} placeholder="John Doe" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              {...register("email", { required: true })} 
              placeholder="john@example.com"
              disabled={isEditing} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input id="nickname" {...register("nickname")} placeholder="Johnny" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input id="profession" {...register("profession")} placeholder="Software Engineer" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} placeholder="+1234567890" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} placeholder="123 Main St" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" {...register("image")} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail">Detail/Bio</Label>
            <Textarea id="detail" {...register("detail")} placeholder="Bio..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
