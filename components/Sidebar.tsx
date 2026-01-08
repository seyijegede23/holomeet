'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-slate-200 bg-white p-6 pt-28 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:shadow-none max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-4">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          // Create a variable for the icon component
          const IconComponent = item.icon;
          
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex gap-4 items-center p-4 rounded-xl justify-start transition-all duration-200',
                {
                  'bg-blue-600 text-white shadow-md hover:bg-blue-700': isActive,
                  'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800': !isActive,
                }
              )}
            >
              {/* Render the icon component with a fixed size */}
              <IconComponent size={24} />
              <p className="text-lg font-semibold max-lg:hidden">
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;