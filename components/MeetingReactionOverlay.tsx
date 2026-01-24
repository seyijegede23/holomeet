'use client';

import { useCall } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';

const MeetingReactionOverlay = () => {
  const call = useCall();
  const [reactions, setReactions] = useState<
    { id: string; emoji: string; x: number; y: number }[]
  >([]);

  useEffect(() => {
    if (!call) return;

    const handleReaction = (event: any) => {
      // Stream passes `custom` data in the reaction event
      const emoji = event.reaction?.custom?.emoji || event.reaction?.type; // fallback
      
      if (emoji) {
        const newReaction = {
          id: Math.random().toString(36).substr(2, 9),
          emoji,
          x: Math.random() * 80 + 10, // Random X position (10% - 90%)
          y: Math.random() * 20 + 70, // Start from bottom area
        };

        setReactions((prev) => [...prev, newReaction]);

        // Remove reaction after animation duration
        setTimeout(() => {
          setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
        }, 4000);
      }
    };

    call.on('call.reaction_new', handleReaction);

    return () => {
      call.off('call.reaction_new', handleReaction);
    };
  }, [call]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[40]">
      {reactions.map((r) => (
        <div
          key={r.id}
          className="animate-float-up absolute text-4xl"
          style={{
            left: `${r.x}%`,
            bottom: '100px', // Start point
            // We can add random rotation or scale here if desired in CSS
          }}
        >
          {r.emoji}
        </div>
      ))}
    </div>
  );
};

export default MeetingReactionOverlay;
