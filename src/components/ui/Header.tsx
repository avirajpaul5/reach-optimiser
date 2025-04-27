import React from "react";
import { Button } from "./button";
import { History } from "lucide-react";
import { Sheet, SheetTrigger } from "./sheet";

interface HeaderProps {
  onOpenHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenHistory }) => {
  return (
    <header className='fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1 className='text-xl font-bold text-orange-800 dark:text-orange-300'>
            Reach Optimizer
          </h1>
        </div>
        <div className='flex items-center gap-2'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                className='rounded-lg text-orange-700 hover:bg-orange-100 hover:text-orange-800 border-orange-200 flex items-center gap-2'
                onClick={onOpenHistory}>
                <History className='h-4 w-4' />
                <span>History</span>
              </Button>
            </SheetTrigger>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
