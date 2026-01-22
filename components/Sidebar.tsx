'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <section 
      className={cn(
        "sticky left-0 top-0 flex h-screen flex-col justify-between glassmorphism2 p-6 pt-28 shadow-sm max-sm:hidden transition-all duration-300 ease-in-out z-20",
        isCollapsed ? "w-[100px]" : "w-[264px]"
      )}
    >
      <div className="flex flex-1 flex-col gap-4">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          const IconComponent = item.icon;
          
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex gap-4 items-center p-4 rounded-xl justify-start transition-all duration-200',
                {
                  'bg-gradient-to-r from-blue-1 to-blue-2 text-white shadow-md hover:shadow-lg': isActive,
                  'text-slate-300 hover:bg-white/10': !isActive,
                  'justify-center': isCollapsed
                }
              )}
            >
              <IconComponent size={24} />
              {!isCollapsed && (
                <p className="text-lg font-semibold max-lg:hidden animate-accordion-down">
                  {item.label}
                </p>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Toggle Button */}
      <div className="flex justify-end mt-4">
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10 rounded-full"
         >
             {isCollapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
         </Button>
      </div>
    </section>
  );
};

export default Sidebar;