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
import { LayoutList, Users, Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, Settings, Disc, Smile, MoreHorizontal, PenTool } from 'lucide-react';
import dynamic from 'next/dynamic';
import MeetingInfo from './MeetingInfo';
import MeetingReactionOverlay from './MeetingReactionOverlay';

import { useUser } from '@clerk/nextjs';
// Removed WaitingScreen import
import { useToast } from './ui/use-toast';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('grid');
  const [showParticipants, setShowParticipants] = useState(false);

  // useCallCallingState hook is used later, duplicate removed here
  // const { useCallCallingState } = useCallStateHooks();
  const { toast } = useToast();

  const { user } = useUser();
  const call = useCall();
  const { useMicrophoneState, useCameraState, useCallCallingState, useHasOngoingScreenShare } = useCallStateHooks();
  const { isEnabled: isMicEnabled } = useMicrophoneState();
  const { isEnabled: isCamEnabled } = useCameraState();
  
  // We need to know if *anyone* is screen sharing to switch layout
  const hasOngoingScreenShare = useHasOngoingScreenShare();
  const callingState = useCallCallingState(); 

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id; 

  // Landscaping: simple hook to detect mobile size for layout adjustments
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  if (callingState !== CallingState.JOINED) return <Loader />;



  const CallLayout = () => {
    if (isMobile) {
        // Mobile Layout Logic:
        // 1. If Screen Share is active -> Speaker Layout (Focus on content)
        // 2. Otherwise -> Paginated Grid (Google Meet style)
        if (hasOngoingScreenShare) {
            return <SpeakerLayout participantsBarPosition="bottom" />;
        }
        return <PaginatedGridLayout />;
    }

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
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="h-full w-full">
          <CallLayout />
        </div>
        
        <div className="absolute left-4 top-4 z-50 hidden md:block">
          <MeetingInfo />
        </div>
        <MeetingReactionOverlay />
        


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
          
          {/* Microphone Toggle - Desktop Only */}
          <Button
            onClick={() => call?.microphone.toggle()}
            className={cn(
              "hidden md:flex h-12 w-12 rounded-full transition-all duration-300",
              isMicEnabled 
                ? "bg-slate-700 hover:bg-slate-600 text-white" 
                : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
            )}
          >
            {isMicEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </Button>

          {/* Camera Toggle - Desktop Only (Duplicate removed logic below handles both if needed, but keeping this explicitly for desktop layout) */}
          <Button
            onClick={() => call?.camera.toggle()}
            className={cn(
              "hidden md:flex h-12 w-12 rounded-full transition-all duration-300",
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
                onClick={async () => {
                    try {
                        await call?.screenShare.toggle();
                    } catch(error) {
                        console.error(error);
                    }
                }}
                className={cn(
                  "h-12 w-12 rounded-full transition-all duration-300",
                  // Check explicitly if *local* participant is sharing? 
                  // For now, we can check if the button should be 'active' if *we* are sharing.
                  // But the hook `useHasOngoingScreenShare` is global.
                  // For simplicity in this fix, we just keep the button state neutral or active if *someone* is sharing?
                  // Better: check screenShare state if possible from call object or local participant.
                  // For now, simpler UI:
                   "bg-slate-700 hover:bg-slate-600 text-white"
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

          {/* Mobile Logic: Show Mic, Cam, End, and More */}
          <div className="flex md:hidden items-center gap-3">
             {/* Mic Toggle Mobile */}
             <Button
                onClick={() => call?.microphone.toggle()}
                className={cn(
                  "h-10 w-10 rounded-full transition-all duration-300 p-0",
                  isMicEnabled 
                    ? "bg-slate-700 hover:bg-slate-600 text-white" 
                    : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                )}
              >
                {isMicEnabled ? <Mic size={18} /> : <MicOff size={18} />}
              </Button>

              {/* Cam Toggle Mobile */}
              <Button
                onClick={() => call?.camera.toggle()}
                className={cn(
                  "h-10 w-10 rounded-full transition-all duration-300 p-0",
                  isCamEnabled 
                    ? "bg-slate-700 hover:bg-slate-600 text-white" 
                    : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                )}
              >
                {isCamEnabled ? <Video size={18} /> : <VideoOff size={18} />}
              </Button>

              {/* End Call Mobile */}
               {!isPersonalRoom && (
                  <div onClick={async () => {
                       if (isMeetingOwner) {
                           // Simple confirm for mobile host
                            if (window.confirm("Do you want to end the meeting for everyone? Press 'OK' to End, 'Cancel' to just Leave.")) {
                                await call?.endCall();
                            } else {
                                await call?.leave();
                            }
                       } else {
                            await call?.leave();
                       }
                       router.push('/');
                  }}>
                     <Button className="h-10 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg p-0">
                        <PhoneOff size={20} />
                     </Button>
                  </div>
              )}

             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-10 w-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white p-0">
                    <MoreHorizontal size={20} />
                  </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent className="mb-4 w-56 bg-slate-900 border-slate-700 text-white">
                    {/* Screen Share is often not supported on mobile browsers (especially iOS) */ }
                    {!isMobile && (
                        <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer" onClick={async () => {
                            try {
                              await call?.screenShare.toggle();
                            } catch (error: any) {
                              toast({ title: "Screen Share Failed", description: error.message || "Not supported on this browser.", variant: "destructive" });
                            }
                        }}>
                            <MonitorUp size={16} className="mr-2" /> Screen Share
                        </DropdownMenuItem>
                    )}
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

                    <div className="md:hidden w-full border-t border-slate-700 pt-1 mt-1">
                       <MeetingInfo />
                    </div>
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

          {/* End Call Button - Desktop Only */}
          {!isPersonalRoom && (
              <div className="hidden md:block">
                 {isMeetingOwner ? (
                     <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                             <Button className="h-12 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg">
                                <PhoneOff size={24} />
                             </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className="bg-slate-900 border-slate-700 text-white mb-2">
                             <DropdownMenuItem 
                                 className="text-red-500 focus:bg-red-900/20 focus:text-red-500 cursor-pointer"
                                 onClick={async () => {
                                     await call.endCall();
                                     router.push('/');
                                 }}
                             >
                                 End call for everyone
                             </DropdownMenuItem>
                             <DropdownMenuItem 
                                 className="cursor-pointer focus:bg-slate-800"
                                 onClick={async () => {
                                     await call.leave();
                                     router.push('/');
                                 }}
                             >
                                 Leave call
                             </DropdownMenuItem>
                         </DropdownMenuContent>
                     </DropdownMenu>
                 ) : (
                    <Button 
                        onClick={async () => {
                            await call?.leave();
                            router.push('/');
                        }}
                        className="h-12 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    >
                        <PhoneOff size={24} />
                    </Button>
                 )}
              </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MeetingRoom;