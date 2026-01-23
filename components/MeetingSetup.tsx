'use client';

import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import Alert from './Alert';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#call-state
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  }

  // https://getstream.io/video/docs/react/ui-cookbook/replacing-call-controls/
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  // Check for password
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const meetingPassword = call.state.custom?.password;
  const isHost = call.state.createdBy?.id === user?.id;

  // If there is a password and user is not verified and not host
  if (meetingPassword && !isPasswordVerified && !isHost) {
      return (
          <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-slate-950 p-4 text-white">
              <h1 className="text-center text-2xl font-bold">Password Protected</h1>
              <p className="text-slate-300">This meeting requires a password to join.</p>
              
              <div className="flex flex-col gap-4 w-full max-w-sm">
                  <Input 
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-slate-800 bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                      onClick={() => {
                          if (password === meetingPassword) {
                              setIsPasswordVerified(true);
                              toast({ title: "Authorized" });
                          } else {
                              toast({ title: "Incorrect Password", variant: "destructive" });
                          }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 w-full"
                  >
                      Submit
                  </Button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-slate-950 p-4 text-white">
      <h1 className="text-center text-2xl font-bold">Meeting Setup</h1>
      
      <div className="flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
        <VideoPreview className="min-h-[200px] w-full max-w-[500px]" />
        
        <div className="flex h-16 items-center justify-center gap-3">
          <label className="flex cursor-pointer items-center justify-center gap-2 font-medium hover:text-slate-200">
            <input
              type="checkbox"
              checked={isMicCamToggled}
              onChange={(e) => setIsMicCamToggled(e.target.checked)}
              className="size-4 rounded border-slate-300"
            />
            Join with mic and camera off
          </label>
          <DeviceSettings />
        </div>
      </div>

      <Button
        className="rounded-md bg-green-500 px-8 py-4 text-base font-semibold hover:bg-green-600"
        size="lg"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
      >
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;