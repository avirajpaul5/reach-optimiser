import React, { useEffect, useState } from "react";
import { Sheet } from "./ui/sheet";
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
import { ChevronRight, History, LogOut } from "lucide-react";
import { CustomSheetContent } from "./ui/CustomSheetContent";

interface HistorySidebarProps {
  onSelectSession: (session: SessionHistory) => void;
  onSignOut: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  onSelectSession,
  onSignOut,
  open,
  setOpen,
}) => {
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
      <CustomSheetContent
        side='right'
        className='p-0 border-l border-orange-200 overflow-hidden w-80 sm:w-96'>
        <div className='flex flex-col h-full bg-gradient-to-b from-orange-50 to-white'>
          <div className='p-5 border-b border-orange-100 bg-gradient-to-r from-orange-100/50 to-orange-50/50 backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <History className='h-5 w-5 text-orange-700' />
                <h2 className='text-xl font-bold text-orange-800 truncate'>
                  History
                </h2>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setOpen(false)}
                className='rounded-full text-orange-700 hover:bg-orange-100 hover:text-orange-800 flex-shrink-0'>
                <ChevronRight className='h-5 w-5' />
              </Button>
            </div>
            {user && (
              <div className='mt-3 flex items-center justify-between bg-white/70 p-2 rounded-lg shadow-sm'>
                <div className='text-sm text-orange-700 font-medium truncate max-w-[65%]'>
                  {user.email}
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={onSignOut}
                  className='text-xs flex items-center gap-1 text-orange-700 hover:bg-orange-100 hover:text-orange-800 flex-shrink-0'>
                  <LogOut className='h-3 w-3' />
                  Sign out
                </Button>
              </div>
            )}
          </div>

          <div className='flex-grow overflow-y-auto overflow-x-hidden'>
            {loading ? (
              <div className='flex justify-center items-center h-24'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600'></div>
              </div>
            ) : sessions.length > 0 ? (
              <Accordion type='multiple' className='w-full'>
                {sessions.map((session) => (
                  <AccordionItem
                    key={session.id}
                    value={session.id}
                    className='border-b border-orange-100/50'>
                    <AccordionTrigger className='px-5 py-4 hover:bg-orange-50/70 transition-colors w-full'>
                      <div className='text-left overflow-hidden w-full pr-4'>
                        <div className='font-medium truncate text-orange-800 max-w-full'>
                          {session.title}
                        </div>
                        <div className='text-xs text-orange-500 mt-1 truncate max-w-full'>
                          {formatDate(session.created_at)}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='px-5 pb-4 pt-0 bg-white/50 overflow-hidden'>
                      <div className='text-sm text-orange-700 mb-3 bg-orange-50/50 p-3 rounded-lg break-words'>
                        <div className='line-clamp-3 overflow-hidden'>
                          {session.description.substring(0, 150)}
                          {session.description.length > 150 ? "..." : ""}
                        </div>
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800'
                        onClick={() => handleSelectSession(session)}>
                        <span className='truncate w-full'>Load Session</span>
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className='flex flex-col items-center justify-center h-40 p-4 text-center'>
                <div className='w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-3'>
                  <History className='h-7 w-7 text-orange-400' />
                </div>
                <h3 className='text-orange-700 font-medium'>No history yet</h3>
                <p className='text-sm text-orange-500 mt-1 px-4 break-words'>
                  Your session history will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </CustomSheetContent>
    </Sheet>
  );
};

export default HistorySidebar;
