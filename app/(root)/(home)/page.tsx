'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import MeetingTypeList from '@/components/MeetingTypeList';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

const Home = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  const [upcomingCalls, setUpcomingCalls] = useState<Call[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const client = useStreamVideoClient();
  const { user } = useUser();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const loadData = async () => {
      if (!client || !user) return;
      
      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: 1 }],
          filter_conditions: {
            starts_at: { $gt: new Date().toISOString() },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });
        setUpcomingCalls(calls);
      } catch (error) {
        console.error("Failed to fetch upcoming calls", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Time update logic
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
      setDate(
        new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now)
      );
    };

    updateTime();
    interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [client, user]);

  const upcomingMeeting = upcomingCalls && upcomingCalls.length > 0 ? upcomingCalls[0] : null;

  const meetingTime = upcomingMeeting?.state?.startsAt?.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }) || 
                      (upcomingMeeting?.state?.custom?.description); // Fallback to description if startsAt is weird? Stream usually ensures startsAt.

  // Better formatted time for the upcoming meeting banner
  const upcomingMeetingTime = upcomingMeeting 
    ? upcomingMeeting.state.startsAt?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : null;


  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="relative h-[300px] w-full overflow-hidden rounded-[20px] bg-hero bg-cover">
          {/* New Moody/Abstract Meeting Background */}
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" /> 
          
          <div className="relative flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
            <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
              {upcomingMeetingTime 
                ? `Upcoming Meeting at: ${upcomingMeetingTime}` 
                : "No Upcoming Meetings"}
            </h2>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-extrabold lg:text-7xl">
                {time}
              </h1>
              <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
            </div>
          </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;