import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, isWithinInterval, min, max } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Availability, User } from '../types';
import { VotedUsersPopup } from './VotedUsersPopup';

interface CalendarProps {
  onSelectionComplete: (dates: Date[]) => void;
  data: Record<string, Record<string, Availability>>;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDayContextMenu: (date: Date, e: React.MouseEvent) => void;
  currentUser: User | null;
}

export const Calendar: React.FC<CalendarProps> = ({ 
  onSelectionComplete, 
  data, 
  currentMonth, 
  onMonthChange,
  onDayContextMenu,
  currentUser
}) => {
  const [direction, setDirection] = useState(0);
  const [isVotedUsersOpen, setIsVotedUsersOpen] = useState(false);
  
  // Selection state
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | null>(null);

  // Refs for stable access in event listeners
  const isDraggingRef = useRef(isDragging);
  const selectedDatesRef = useRef(selectedDates);
  const onSelectionCompleteRef = useRef(onSelectionComplete);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    selectedDatesRef.current = selectedDates;
  }, [selectedDates]);

  useEffect(() => {
    onSelectionCompleteRef.current = onSelectionComplete;
  }, [onSelectionComplete]);

  // Clear selection when data updates (submission complete)
  useEffect(() => {
    setSelectedDates([]);
  }, [data]);

  const nextMonth = () => {
    setDirection(1);
    onMonthChange(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setDirection(-1);
    onMonthChange(subMonths(currentMonth, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const handleMouseDown = (day: Date) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    setDragStart(day);
    setSelectedDates([day]);
    selectedDatesRef.current = [day];
  };

  const handleMouseEnter = (day: Date) => {
    if (isDragging && dragStart) {
      const start = min([dragStart, day]);
      const end = max([dragStart, day]);
      const interval = { start, end };
      const newSelection = calendarDays.filter(d => isWithinInterval(d, interval));
      setSelectedDates(newSelection);
      selectedDatesRef.current = newSelection;
    }
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      setIsDragging(false);
      isDraggingRef.current = false;
      setDragStart(null);
      if (selectedDatesRef.current.length > 0) {
        setLastSelectedDate(selectedDatesRef.current[selectedDatesRef.current.length - 1]);
        onSelectionCompleteRef.current(selectedDatesRef.current);
      }
    }
  };

  const handleClick = (day: Date, e: React.MouseEvent) => {
    if (e.shiftKey && lastSelectedDate) {
      const start = min([lastSelectedDate, day]);
      const end = max([lastSelectedDate, day]);
      const interval = { start, end };
      const newSelection = eachDayOfInterval(interval);
      setSelectedDates(newSelection);
      selectedDatesRef.current = newSelection;
      onSelectionComplete(newSelection);
      setLastSelectedDate(day);
      return;
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const getDayScore = (dateStr: string) => {
    const dayData = data[dateStr];
    if (!dayData) return 0;
    
    return Object.values(dayData).reduce((acc, val) => {
      if (val === 'O') return acc + 1;
      if (val === 'X') return acc - 1;
      return acc;
    }, 0);
  };

  const getDayColor = (score: number, hasData: boolean) => {
    if (!hasData) return '';
    if (score > 5) return 'bg-emerald-100 text-emerald-800';
    if (score > 0) return 'bg-emerald-50 text-emerald-700';
    if (score === 0) return 'bg-amber-50 text-amber-700';
    return score > 0 ? 'bg-emerald-50 text-emerald-700' : 
           score === 0 ? 'bg-amber-50 text-amber-700' : 
           'bg-rose-50 text-rose-700';
  };

  const getVotedUsers = () => {
    const users = new Set<string>();
    Object.values(data).forEach(dayData => {
      Object.keys(dayData).forEach(userName => {
        users.add(userName);
      });
    });
    return Array.from(users).sort();
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden select-none border border-slate-100">
      <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
        <button 
          onClick={prevMonth} 
          className="p-3 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          {format(currentMonth, 'yyyy年 M月', { locale: zhTW })}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsVotedUsersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl transition-all border border-slate-200 active:scale-95"
            title="查看已投票人員"
          >
            <Users className="w-5 h-5" />
            <span className="text-sm font-bold hidden sm:inline">已投票人員</span>
          </button>
          <button 
            onClick={nextMonth} 
            className="p-3 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
            {day}
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden" style={{ height: '540px' }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 grid grid-cols-7 grid-rows-6"
          >
            {calendarDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDates.some(d => isSameDay(d, day));
              const isToday = isSameDay(day, new Date());
              
              const hasData = !!data[dateStr];
              const isVoted = currentUser ? !!data[dateStr]?.[currentUser.name] : false;
              const score = getDayScore(dateStr);
              const colorClass = getDayColor(score, hasData && isVoted);

              return (
                <div
                  key={day.toISOString()}
                  onMouseDown={(e) => { 
                    if (e.button === 0) { // Only handle left click dragging
                      e.preventDefault(); 
                      handleMouseDown(day); 
                    }
                  }}
                  onMouseEnter={() => handleMouseEnter(day)}
                  onClick={(e) => handleClick(day, e)}
                  onContextMenu={(e) => onDayContextMenu(day, e)}
                  className={twMerge(
                    "border-b border-r border-slate-50 p-3 relative cursor-pointer transition-all flex flex-col justify-between group",
                    !isCurrentMonth && "bg-slate-50/30 text-slate-300",
                    isCurrentMonth && !colorClass && "bg-white text-slate-600 hover:bg-slate-50",
                    isCurrentMonth && colorClass,
                    isSelected && "bg-blue-50 ring-2 ring-inset ring-blue-500/30 z-10"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className={clsx(
                      "text-sm font-bold w-8 h-8 flex items-center justify-center rounded-xl transition-all",
                      isToday && !isSelected && "bg-blue-600 text-white shadow-lg shadow-blue-500/30",
                      isToday && isSelected && "bg-blue-600 text-white",
                      !isToday && isSelected && "text-blue-600",
                      !isToday && !isSelected && "group-hover:scale-110"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  
                  {hasData && (
                    <div className="mt-1 flex justify-center">
                      <span className={clsx(
                        "text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm",
                        score > 0 ? "bg-emerald-200 text-emerald-900" : 
                        score < 0 ? "bg-rose-200 text-rose-900" : 
                        "bg-amber-200 text-amber-900"
                      )}>
                        {score > 0 ? '+' : ''}{score}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <VotedUsersPopup 
        isOpen={isVotedUsersOpen}
        onClose={() => setIsVotedUsersOpen(false)}
        votedUsers={getVotedUsers()}
      />
    </div>
  );
};
