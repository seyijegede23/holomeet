import React from 'react';

const WaitingScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-dark-2 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        {/* You can add a spinner or icon here if you have one available, e.g., from Loader.tsx */}
        <h1 className="text-4xl font-extrabold text-white">Waiting Room</h1>
        <p className="text-lg text-sky-100">
          Please wait... The host will let you in shortly.
        </p>
      </div>
    </div>
  );
};

export default WaitingScreen;
