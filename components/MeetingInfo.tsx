'use client';

import { useState } from 'react';
import { useCall } from '@stream-io/video-react-sdk';
import { Copy, Check, Info } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from './ui/use-toast';

const MeetingInfo = () => {
  const call = useCall();
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Get Meeting Link
  const meetingLink = typeof window !== 'undefined' ? window.location.href : '';
  
  // Get Password (safely access custom data)
  const password = call?.state.custom?.password || '';

  const copyToClipboard = (text: string, type: 'link' | 'password') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast({ title: "Link Copied", description: "Meeting link copied to clipboard" });
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
      toast({ title: "Password Copied", description: "Meeting password copied to clipboard" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700 rounded-full h-10 w-10">
           <Info size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Meeting Info</DialogTitle>
          <DialogDescription className="text-slate-400">
            Share these details to invite others to the meeting.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          
          {/* Meeting Link */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="link" className="text-sm font-medium">Meeting Link</Label>
            <div className="flex items-center gap-2">
              <Input
                id="link"
                readOnly
                value={meetingLink}
                className="bg-slate-950 border-slate-700 text-slate-200 focus-visible:ring-offset-0"
              />
              <Button
                size="icon"
                variant="outline"
                className="bg-slate-800 border-slate-700 hover:bg-slate-700 shrink-0"
                onClick={() => copyToClipboard(meetingLink, 'link')}
              >
                {copiedLink ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          {/* Password (only if exists) */}
          {password && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="password"
                  readOnly
                  value={password}
                  // type="password" // Optionally hide, but showing it is usually better for sharing
                  className="bg-slate-950 border-slate-700 text-slate-200 focus-visible:ring-offset-0"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700 shrink-0"
                  onClick={() => copyToClipboard(password as string, 'password')}
                >
                  {copiedPassword ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingInfo;
