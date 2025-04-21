import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "./AuthProvider";
import { getUserSessions, SessionHistory } from "../utils/supabase";
import { ChevronLeft, History, LogOut } from "lucide-react";

interface HistorySidebarProps {
  onSelectSession: (session: SessionHistory) => void;
  onSignOut: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  onSelectSession,
  onSignOut,
}) => {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const sessionsData = await getUserSessions(user.id);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleSelectSession = (session: SessionHistory) => {
    onSelectSession(session);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='fixed top-4 left-4 z-10'>
          <History className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-80 sm:w-96 p-0'>
        <div className='flex flex-col h-full'>
          <div className='p-4 border-b'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>History</h2>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setOpen(false)}
                className='rounded-full'>
                <ChevronLeft className='h-5 w-5' />
              </Button>
            </div>
            {user && (
              <div className='mt-2 flex items-center justify-between'>
                <div className='text-sm text-neutral-500 truncate mr-2'>
                  {user.email}
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={onSignOut}
                  className='text-xs flex items-center gap-1'>
                  <LogOut className='h-3 w-3' />
                  Sign out
                </Button>
              </div>
            )}
          </div>

          <div className='flex-grow overflow-auto'>
            {loading ? (
              <div className='flex justify-center items-center h-24'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
              </div>
            ) : sessions.length > 0 ? (
              <Accordion type='multiple' className='w-full'>
                {sessions.map((session) => (
                  <AccordionItem key={session.id} value={session.id}>
                    <AccordionTrigger className='px-4 py-3 hover:bg-neutral-50'>
                      <div className='text-left overflow-hidden'>
                        <div className='font-medium truncate'>
                          {session.title}
                        </div>
                        <div className='text-xs text-neutral-500'>
                          {formatDate(session.created_at)}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='px-4 pb-3 pt-0'>
                      <div className='text-sm text-neutral-600 line-clamp-3 mb-2'>
                        {session.description.substring(0, 150)}
                        {session.description.length > 150 ? "..." : ""}
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full'
                        onClick={() => handleSelectSession(session)}>
                        Load Session
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className='flex flex-col items-center justify-center h-40 p-4 text-center'>
                <History className='h-8 w-8 text-neutral-400 mb-2' />
                <h3 className='text-neutral-600 font-medium'>No history yet</h3>
                <p className='text-sm text-neutral-500 mt-1'>
                  Your session history will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistorySidebar;
