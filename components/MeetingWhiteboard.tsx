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
    <div className={cn('fixed inset-0 z-[50] flex items-center justify-center p-4 md:p-10 bg-black/50 backdrop-blur-sm', className)}>
      <div className="relative h-full w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-2xl">
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
          
          <div className="h-full w-full isolate">
             <Tldraw persistenceKey="meeting-whiteboard" />
          </div>
      </div>
    </div>
  );
};

export default MeetingWhiteboard;
