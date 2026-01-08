import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { Video } from 'lucide-react';

import MobileNav from './MobileNav';

const Navbar = () => {
  return (
    <nav className="fixed z-50 flex w-full items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950 lg:px-10">
      <Link href="/" className="flex items-center gap-2">
        {/* Replaced Image with Lucide Icon */}
        <Video size={32} className="text-blue-600 max-sm:size-10" />
        <p className="text-[26px] font-extrabold text-slate-950 dark:text-white max-sm:hidden">
          HoloMeet
        </p>
      </Link>

      <div className="flex items-center gap-5">
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;