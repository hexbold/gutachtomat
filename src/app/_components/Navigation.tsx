'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-gray-50 dark:bg-gray-900 shadow-sm w-full" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
      <div className="max-w-[1800px] mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <img
            src="/Gehirn Logo oben links.png"
            alt="Gutachtomat Logo"
            width={240}
            height={48}
            className="h-14 w-auto scale-365 origin-left"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${pathname === '/'
                ? 'text-foreground border-blue-600 dark:border-blue-400'
                : 'text-foreground/70 hover:text-foreground border-transparent hover:border-foreground/20'
              }`}
          >
            Home
          </Link>
          <Link
            href="/gutachten-erstellen"
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${pathname === '/gutachten-erstellen'
                ? 'text-foreground border-blue-600 dark:border-blue-400'
                : 'text-foreground/70 hover:text-foreground border-transparent hover:border-foreground/20'
              }`}
          >
            Gutachtenerstellung
          </Link>
          <Link
            href="/tutorial"
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${pathname === '/tutorial'
                ? 'text-foreground border-blue-600 dark:border-blue-400'
                : 'text-foreground/70 hover:text-foreground border-transparent hover:border-foreground/20'
              }`}
          >
            Tutorial
          </Link>
          <Link
            href="/ueber"
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${pathname === '/ueber'
                ? 'text-foreground border-blue-600 dark:border-blue-400'
                : 'text-foreground/70 hover:text-foreground border-transparent hover:border-foreground/20'
              }`}
          >
            Über
          </Link>
          <Link
            href="/kontakt"
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${pathname === '/kontakt'
                ? 'text-foreground border-blue-600 dark:border-blue-400'
                : 'text-foreground/70 hover:text-foreground border-transparent hover:border-foreground/20'
              }`}
          >
            Kontakt
          </Link>
          <Link
            href="/faqs"
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${pathname === '/faqs'
                ? 'text-foreground border-blue-600 dark:border-blue-400'
                : 'text-foreground/70 hover:text-foreground border-transparent hover:border-foreground/20'
              }`}
          >
            FAQs
          </Link>
        </nav>

        {/* Account/Login */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-foreground/70 hover:text-foreground transition-colors font-medium cursor-pointer">
                Anmelden
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer">
                Registrieren
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground p-2 cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
