'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Menu 
            size={36} 
            className="cursor-pointer sm:hidden text-slate-950 dark:text-white" 
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white dark:bg-slate-950">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/logo.svg"
              width={32}
              height={32}
              alt="yoom logo"
              className="max-sm:size-10"
            />
            <p className="text-[26px] font-extrabold text-slate-950 dark:text-white">
              HOLOMEET
            </p>
          </Link>

          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route;
                  // Create variable for the icon
                  const IconComponent = item.icon;

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn(
                          'flex gap-4 items-center p-4 rounded-xl w-full max-w-60 transition-all',
                          {
                            'bg-blue-600 text-white shadow-md': isActive,
                            'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800': !isActive,
                          }
                        )}
                      >
                        {/* Render icon component */}
                        <IconComponent size={20} />
                        <p className="font-semibold">{item.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;