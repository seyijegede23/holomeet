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
    <div className={cn('relative h-full w-full bg-white text-black overflow-hidden rounded-xl border-2 border-slate-200', className)}>
      <div className="absolute right-4 top-4 z-[99999]">
         <Button 
            onClick={onClose} 
            variant="destructive" 
            size="icon"
            className="rounded-full shadow-md hover:scale-110 transition-transform"
         >
            <X className="h-5 w-5" />
         </Button>
      </div>
      {/* 
        persistenceKey ensures the state is saved/loaded correctly without conflicts.
        top-12 to avoid overlap with the close button if needed, but absolute is fine.
      */}
      <div className="h-full w-full">
         <Tldraw persistenceKey="meeting-whiteboard" />
      </div>
    </div>
  );
};

export default MeetingWhiteboard;
