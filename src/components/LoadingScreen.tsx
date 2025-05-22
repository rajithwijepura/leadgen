import React from 'react';
import { Zap } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <Zap size={48} className="text-[#833ab4] animate-pulse" />
        <div className="absolute -inset-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] animate-spin blur-xl opacity-50"></div>
        </div>
      </div>
      
      <h2 className="mt-8 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] animate-pulse">
        Loading LeadReel Analysis...
      </h2>
      
      <div className="mt-4 w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] animate-loadingBar"></div>
      </div>
    </div>
  );
};