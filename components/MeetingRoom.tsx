'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
  DeviceSettings,
  CallParticipantsList,
} from '@stream-io/video-react-sdk';
import { LayoutList, Users, Check, X, Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, Settings, Disc, Smile, MoreHorizontal } from 'lucide-react';

import { useUser } from '@clerk/nextjs';
import WaitingScreen from './WaitingScreen';
import { useToast } from './ui/use-toast';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button'; // Importing your reusable Button
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const { toast } = useToast();

  const { user } = useUser();
  const call = useCall();
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { isEnabled: isMicEnabled } = useMicrophoneState();
  const { isEnabled: isCamEnabled } = useCameraState();
  // Simplified screen share check (can be advanced with observable)
  const isScreenSharing = false; // Placeholder until correct hook found or implemented via state listener

  const [isAdmitted, setIsAdmitted] = useState<boolean>(false);
  const [requestingUsers, setRequestingUsers] = useState<{ id: string; name: string }[]>([]);

  const callingState = useCallCallingState();

  useEffect(() => {
    if (user && call?.state.createdBy && call.state.createdBy.id === user.id) {
      setIsAdmitted(true);
    }
  }, [user, call]);

  useEffect(() => {
    if (callingState === CallingState.JOINED && !isAdmitted && call && user) {
      const interval = setInterval(() => {
        call.sendCustomEvent({
          type: 'request_entry',
          data: { id: user.id, name: user.fullName || user.id },
        });
      }, 3000);

      const handleAllow = (event: any) => {
        if (event.type === 'allow_entry' && event.data?.id === user.id) {
          setIsAdmitted(true);
        }
      };

      call.on('custom', handleAllow);

      return () => {
        clearInterval(interval);
        call.off('custom', handleAllow);
      };
    }
  }, [isAdmitted, callingState, call, user]);

  useEffect(() => {
    if (callingState === CallingState.JOINED && isAdmitted && call && user && call.state.createdBy?.id === user.id) {
      const handleRequest = (event: any) => {
        if (event.type === 'request_entry') {
          setRequestingUsers((prev) => {
            if (prev.find((u) => u.id === event.data.id)) return prev;
            return [...prev, { id: event.data.id, name: event.data.name }];
          });
        }
      };
      call.on('custom', handleRequest);
      return () => call.off('custom', handleRequest);
    }
  }, [isAdmitted, callingState, call, user]);

  if (callingState !== CallingState.JOINED) return <Loader />;

  if (!isAdmitted) return <WaitingScreen />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        


        {/* Requests Overlay */}
        {requestingUsers.length > 0 && (
          <div className="absolute top-10 right-4 z-50 flex w-80 flex-col gap-2 rounded-xl bg-slate-900/90 p-4 border border-slate-700 shadow-2xl backdrop-blur-sm">
             <h3 className="text-sm font-semibold text-slate-200 mb-2">Joining Requests ({requestingUsers.length})</h3>
            {requestingUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-lg bg-slate-800 p-3 shadow-md"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-white text-sm">{u.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 p-0 text-white"
                    onClick={() => {
                      call?.sendCustomEvent({
                        type: 'allow_entry',
                        data: { id: u.id },
                      });
                      setRequestingUsers((prev) =>
                        prev.filter((req) => req.id !== u.id)
                      );
                    }}
                  >
                    <Check size={16} />
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 p-0 text-white"
                    onClick={() => {
                      setRequestingUsers((prev) =>
                        prev.filter((req) => req.id !== u.id)
                      );
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Video Layout and Call Controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 p-4 pb-8 sm:px-10">
        <div className="flex items-center justify-center gap-4 rounded-full glassmorphism2 p-3 shadow-2xl">
          
          {/* Microphone Toggle */}
          <Button
            onClick={() => call?.microphone.toggle()}
            className={cn(
              "h-12 w-12 rounded-full transition-all duration-300",
              isMicEnabled 
                ? "bg-slate-700 hover:bg-slate-600 text-white" 
                : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
            )}
          >
            {isMicEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </Button>

          {/* Camera Toggle */}
          <Button
            onClick={() => call?.camera.toggle()}
            className={cn(
              "h-12 w-12 rounded-full transition-all duration-300",
              isCamEnabled 
                ? "bg-slate-700 hover:bg-slate-600 text-white" 
                : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
            )}
          >
            {isCamEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </Button>

          {/* Desktop Only Controls - Hidden on mobile */ }
          <div className="hidden md:flex items-center gap-4">
               {/* Screen Share Toggle */}
              <Button
                onClick={() => call?.screenShare.toggle()}
                className={cn(
                  "h-12 w-12 rounded-full transition-all duration-300",
                  isScreenSharing
                    ? "bg-slate-700 hover:bg-slate-600 text-white" 
                    : "bg-slate-700 hover:bg-slate-600 text-white"
                )}
              >
                <MonitorUp size={20} />
              </Button>

              {/* Recording Toggle */}
              <Button
                onClick={async () => {
                  try {
                    if (call?.state.recording) {
                      await call.stopRecording();
                      toast({ title: "Recording stopped" });
                    } else {
                      await call?.startRecording();
                      toast({ title: "Recording started" });
                    }
                  } catch (error) {
                    toast({ title: "Failed to toggle recording", variant: "destructive" });
                  }
                }}
                className={cn(
                  "h-12 w-12 rounded-full transition-all duration-300",
                  call?.state.recording
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 animate-pulse" 
                    : "bg-slate-700 hover:bg-slate-600 text-white"
                )}
              >
               <Disc size={20} />
              </Button>

               {/* Reactions Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-12 w-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white">
                    <Smile size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mb-4 bg-slate-900 border-slate-700 text-white w-full max-w-[200px] flex gap-2 p-2 flex-wrap justify-center translate-y-[-10px]">
                    {['👍', '❤️', '😂', '👏', '🎉', '👋'].map((emoji) => (
                       <Button
                          key={emoji}
                          variant="ghost"
                          className="h-10 w-10 p-0 hover:bg-slate-800 text-2xl"
                          onClick={async () => {
                            try {
                               await call?.sendReaction({ type: 'reaction', custom: { emoji } });
                            } catch (error) {
                               // silently fail or toast
                            }
                          }}
                       >
                         {emoji}
                       </Button>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>



               {/* Layout Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="h-12 w-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <LayoutList size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mb-4 bg-slate-900 border-slate-700 text-white">
                  {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                    <div key={index}>
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-slate-800 focus:text-white"
                        onClick={() =>
                          setLayout(item.toLowerCase() as CallLayoutType)
                        }
                      >
                        {item}
                      </DropdownMenuItem>
                      {index < 2 && <DropdownMenuSeparator className="bg-slate-700" />}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

               <CallStatsButton />
               
                {/* Device Settings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-12 w-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white">
                    <Settings size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-slate-900 border-slate-700 p-4 text-white">
                   <h4 className="mb-4 text-lg font-semibold">Settings</h4>
                   <DeviceSettings />
                </DropdownMenuContent>
              </DropdownMenu>

          </div>

          {/* Mobile "More" Menu - Visible only on mobile */}
          <div className="md:hidden">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-12 w-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white">
                    <MoreHorizontal size={24} />
                  </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent className="mb-4 w-56 bg-slate-900 border-slate-700 text-white">
                    <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer" onClick={() => call?.screenShare.toggle()}>
                        <MonitorUp size={16} className="mr-2" /> Screen Share
                    </DropdownMenuItem>
                     <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer" onClick={async () => {
                          if (call?.state.recording) {
                              await call.stopRecording();
                              toast({ title: "Recording stopped" });
                          } else {
                              await call?.startRecording();
                              toast({ title: "Recording started" });
                          }
                     }}>
                        <Disc size={16} className="mr-2" /> {call?.state.recording ? "Stop Recording" : "Start Recording"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">
                         {/* Simple embedded emoji list for mobile might be cleaner, or improved later */}
                         <div className="flex gap-1 flex-wrap">
                            {['👍', '❤️', '😂', '👏', '🎉'].map((emoji) => (
                               <span key={emoji} className="text-xl p-1 cursor-pointer" onClick={() => call?.sendReaction({ type: 'reaction', custom: { emoji } })}>
                                 {emoji}
                               </span>
                            ))}
                         </div>
                    </DropdownMenuItem>

                     <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">
                        <Settings size={16} className="mr-2" /> Settings (Use Desktop for full)
                    </DropdownMenuItem>
                 </DropdownMenuContent>
             </DropdownMenu>
          </div>



          {/* Participants Toggle */}
          <Button
            onClick={() => setShowParticipants((prev) => !prev)}
             className={cn(
              "h-12 w-12 rounded-full transition-all duration-300",
              showParticipants 
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                : "bg-slate-700 hover:bg-slate-600 text-white"
            )}
          >
            <Users size={20} />
          </Button>

          {/* End Call Button - Wrapped or Replaced */}
          {!isPersonalRoom && (
              <div onClick={async () => {
                await call?.leave();
                router.push('/');
              }}>
                 <Button className="h-12 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg">
                    <PhoneOff size={24} />
                 </Button>
              </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MeetingRoom;