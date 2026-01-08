'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
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
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="relative h-[300px] w-full overflow-hidden rounded-[20px]">
        {/* New Scenic Landscape Image */}
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"
          alt="Scenic landscape view"
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Content Overlay */}
        <div className="relative flex h-full flex-col justify-end bg-black/40 max-md:px-5 max-md:py-8 lg:p-11">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">
              {time || '--:-- --'}
            </h1>
            <p className="text-lg font-medium text-blue-100 lg:text-2xl">
              {date || 'Loading...'}
            </p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;