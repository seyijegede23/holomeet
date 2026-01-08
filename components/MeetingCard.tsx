"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { avatarImages } from "@/constants";
import { useToast } from "./ui/use-toast";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-950 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <Image src={icon} alt="upcoming" width={28} height={28} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">
              {title}
            </h1>
            <p className="text-base font-normal text-slate-500 dark:text-slate-400">
              {date}
            </p>
          </div>
        </div>
      </article>

      <article className={cn("flex justify-center relative", {})}>
        <div className="relative flex w-full max-sm:hidden">
          <div className="flex -space-x-4 overflow-hidden p-1">
            {avatarImages.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt="attendees"
                width={40}
                height={40}
                className="inline-block size-10 rounded-full ring-2 ring-white dark:ring-slate-950"
              />
            ))}
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white dark:bg-slate-800 dark:ring-slate-950">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                +5
              </span>
            </div>
          </div>
        </div>

        {!isPreviousMeeting && (
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              onClick={handleClick}
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
            >
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
              )}
              {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                });
              }}
              className="gap-2 bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <Image
                src="/icons/copy.svg"
                alt="feature"
                width={20}
                height={20}
              />
              Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;