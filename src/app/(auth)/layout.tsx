import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 z-10">
            <img 
               src="/auth-bg.png" 
               alt="Background" 
               className="h-full w-full object-cover opacity-50"
            />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/">
             <div className="flex items-center space-x-2">
                <span className="font-bold text-2xl tracking-tight">Ithac</span>
             </div>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl font-light italic text-gray-200">
              &ldquo;Education is the passport to the future, for tomorrow belongs to those who prepare for it today.&rdquo;
            </p>
            <footer className="text-sm font-medium text-gray-400">Malcolm X</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
             {children}
        </div>
      </div>
    </div>
  );
}
