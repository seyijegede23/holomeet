import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-white dark:bg-slate-950">
      {/* Spinning Icon */}
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      
      {/* Pulsing Text */}
      <p className="animate-pulse text-lg font-medium text-slate-500 dark:text-slate-400">
        Loading your experience...
      </p>
    </div>
  );
};

export default Loader;