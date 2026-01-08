'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeCardProps {
  className?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ className, icon: Icon, title, description, handleClick }: HomeCardProps) => {
  return (
    <section
      className={cn(
        'px-4 py-6 flex flex-col justify-between w-full min-h-[260px] rounded-[14px] cursor-pointer hover:scale-[1.02] transition-all',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Icon size={27} className="text-white" />
      </div>
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-lg font-normal text-white">{description}</p>
      </div>
    </section>
  );
};

export default HomeCard;