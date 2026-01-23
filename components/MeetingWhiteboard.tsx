'use client';

import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface MeetingWhiteboardProps {
  className?: string;
  onClose?: () => void;
}

const MeetingWhiteboard = ({ className, onClose }: MeetingWhiteboardProps) => {
  return (
    <div className={cn('relative h-full w-full bg-white text-black', className)}>
      <div className="absolute right-4 top-4 z-[99999]">
         <Button 
            onClick={onClose} 
            variant="destructive" 
            size="icon"
            className="rounded-full opacity-80 hover:opacity-100"
         >
            <X className="h-5 w-5" />
         </Button>
      </div>
      <Tldraw />
    </div>
  );
};

export default MeetingWhiteboard;
