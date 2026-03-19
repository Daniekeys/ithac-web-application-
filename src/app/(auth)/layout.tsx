import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen grid lg:max-w-none lg:grid-cols-2">
      {/* Mobile Creative Background */}
      <div className="absolute inset-0 lg:hidden overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/images/auth-image.jpg')] opacity-20 mix-blend-overlay bg-cover bg-center" />
      </div>

      <div className="relative hidden h-full flex-col bg-slate-900 p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 z-10">
            <Image 
               src="/images/auth-image.jpg" 
               alt="Background" 
               fill
               className="object-cover"
            />
            {/* Dark Overlay for better text and logo visibility */}
            <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/">
             <div className="flex items-center space-x-2 bg-white p-2 rounded-xl  border border-white/20">
                <Image src="/ithac-logo.png" alt="ITHAC Logo" width={140} height={40} className="object-contain " />
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
      
      {/* Form Container */}
      <div className="relative z-10 lg:p-8 flex flex-col justify-center min-h-screen items-center px-4 py-12">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8 w-full flex justify-center drop-shadow-md">
           <div className="bg-white/95 p-4 rounded-2xl shadow-xl backdrop-blur-md">
              <Image src="/ithac-logo.png" alt="ITHAC Logo" width={140} height={40} className="object-contain" />
           </div>
        </div>
        
        <div className="w-full max-w-[400px]">
             {children}
        </div>
      </div>
    </div>
  );
}
