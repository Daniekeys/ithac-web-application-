import * as React from "react"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Courses', href: '#courses' },
    { name: 'About Us', href: '#about' },
]

export const HeroSection = () => {
    const [menuState, setMenuState] = React.useState(false)
    return (
        <div>
            <header>
                <nav
                    data-state={menuState && 'active'}
                    className="group fixed z-50 w-full border-b border-dashed border-indigo-100 bg-white/80 backdrop-blur-lg md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                    <div className="m-auto max-w-7xl px-6 md:px-12">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0 lg:py-6">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link
                                    href="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <Image src="/ithac-logo.png" alt="ITHAC Logo" width={120} height={32} className="object-contain" />
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-indigo-950">
                                    <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>

                            <div className="bg-white group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-indigo-100 p-6 shadow-2xl shadow-indigo-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm font-medium">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="text-slate-600 hover:text-indigo-600 block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:border-indigo-100 lg:pl-6">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                        <Link href="/login">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6">
                                        <Link href="/register">
                                            <span>Get Started</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-60 contain-strict hidden lg:block">
                    {/* Indigo/Blue radial gradients for a modern brand background */}
                    <div className="w-[35rem] h-[80rem] -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(79,70,229,0.1)_0,rgba(59,130,246,0.03)_50%,transparent_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(99,102,241,0.08)_0,rgba(59,130,246,0.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-87.5 absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(79,70,229,0.05)_0,rgba(59,130,246,0.02)_80%,transparent_100%)]" />
                </div>

                <section className="overflow-hidden bg-slate-50 relative pt-32 pb-20 md:pt-48 md:pb-32">
                    <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-16">
                        <div className="relative z-10 mx-auto max-w-3xl text-center">
                            <h1 className="text-balance text-5xl font-extrabold md:text-6xl lg:text-7xl tracking-tight text-slate-900">
                                Master your future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">Premium Education</span>
                            </h1>
                            <p className="mx-auto my-8 max-w-2xl text-xl text-slate-600">Elevate your skills tracking world-class courses, hands-on projects, and interactive curriculums built by industry leaders.</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full sm:w-auto px-8 py-6 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl shadow-indigo-600/30">
                                    <Link href="/register">
                                        <span className="btn-label">Start Learning Free</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto px-8 py-6 text-lg rounded-full border-slate-200 hover:bg-slate-100 text-slate-700">
                                    <Link href="#features">
                                        <span className="btn-label">Explore Curriculum</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto mt-8 max-w-7xl [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
                        <div className="[perspective:1200px] [mask-image:linear-gradient(to_right,black_60%,transparent_100%)] -mr-16 pl-16 lg:-mr-56 lg:pl-56">
                            <div className="[transform:rotateX(15deg);]">
                                <div className="lg:h-[44rem] relative skew-x-[.2rad]">
                                    <Image
                                        className="rounded-2xl z-[2] relative border border-slate-200/50 shadow-2xl shadow-indigo-500/20"
                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2880&auto=format&fit=crop"
                                        alt="Modern dashboard interface representation"
                                        width={2880}
                                        height={1600}
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-white relative z-10 py-20 border-t border-slate-100">
                    <div className="m-auto max-w-5xl px-6">
                        <h2 className="text-center text-lg font-medium text-slate-500">Trusted by modern companies and leading educators</h2>
                        <div className="mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center justify-center gap-x-8 gap-y-10 opacity-70  hover:grayscale-0 transition-all duration-500">
                            <div className="flex justify-center">
                                <Image
                                    className="h-10 w-auto object-contain mix-blend-multiply"
                                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=100&fit=crop&q=80"
                                    alt="Company 1 Logo"
                                    width={120}
                                    height={40}
                                />
                            </div>
                            <div className="flex justify-center">
                                <Image
                                    className="h-10 w-auto object-contain mix-blend-multiply"
                                    src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=100&fit=crop&q=80"
                                    alt="Company 2 Logo"
                                    width={120}
                                    height={40}
                                />
                            </div>
                            <div className="flex justify-center">
                                <Image
                                    className="h-10 w-auto object-contain mix-blend-multiply"
                                    src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80"
                                    alt="Company 3 Logo"
                                    width={120}
                                    height={40}
                                />
                            </div>
                            <div className="flex justify-center">
                                <Image
                                    className="h-10 w-auto object-contain mix-blend-multiply"
                                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=100&fit=crop&q=80"
                                    alt="Company 4 Logo"
                                    width={120}
                                    height={40}
                                />
                            </div>
                            <div className="flex justify-center">
                                <Image
                                    className="h-10 w-auto object-contain mix-blend-multiply"
                                    src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=100&fit=crop&q=80"
                                    alt="Company 5 Logo"
                                    width={120}
                                    height={40}
                                />
                            </div>
                            <div className="flex justify-center">
                                <Image
                                    className="h-10 w-auto object-contain mix-blend-multiply"
                                    src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=100&fit=crop&q=80"
                                    alt="Company 6 Logo"
                                    width={120}
                                    height={40}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
