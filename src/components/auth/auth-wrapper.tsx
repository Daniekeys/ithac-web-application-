import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthFormWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
  className?: string;
}

export function AuthFormWrapper({
  children,
  title,
  description,
  footerText,
  footerLink,
  footerLinkText,
  className,
}: AuthFormWrapperProps) {
  return (
    <div className={cn("mx-auto w-full max-w-md space-y-6", className)}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
            {children}
        </div>
      </div>
      {(footerText || footerLink) && (
        <div className="text-center text-sm text-muted-foreground">
          {footerText}{" "}
          {footerLink && footerLinkText && (
            <Link
              href={footerLink}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {footerLinkText}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
