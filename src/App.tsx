import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { UserEntry } from './components/UserEntry';
import { Calendar } from './components/Calendar';
import { AvailabilityPopup } from './components/AvailabilityPopup';
import { DateDetailsPopup } from './components/DateDetailsPopup';
import { subscribeToMonth, saveAvailability } from './services/availability';
import type { User, Availability, DateEntry } from './types';

// Mock database type
type AvailabilityData = Record<string, Record<string, Availability>>;

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingDates, setPendingDates] = useState<Date[]>([]);
  const [detailsDate, setDetailsDate] = useState<Date | null>(null);

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1; // 1-indexed for service
    
    const unsubscribe = subscribeToMonth(year, month, (entries: DateEntry[]) => {
      const newData: AvailabilityData = {};
      entries.forEach(entry => {
        newData[entry.date] = entry.availabilities;
      });
      setAvailabilityData(newData);
    });

    return () => unsubscribe();
  }, [currentMonth]);

  const handleUserSet = (name: string, code: string) => {
    setCurrentUser({ name, code });
  };

  const handleSelectionComplete = (dates: Date[]) => {
    setPendingDates(dates);
    setIsPopupOpen(true);
  };

  const handleDayContextMenu = (date: Date, e: React.MouseEvent) => {
    e.preventDefault();
    setDetailsDate(date);
  };

  const handleAvailabilitySelect = async (availability: Availability) => {
    if (!currentUser) return;

    // Save to Firestore
    const promises = pendingDates.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return saveAvailability(dateStr, currentUser.name, availability);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("儲存失敗，請檢查網路連線");
    }

    setIsPopupOpen(false);
    setPendingDates([]);
  };

  return (
    
    <div className="app-container min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="py-12 px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          群群約時間
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto whitespace-pre-line">
          請選擇有空的日期，時間以晚上 6:30~8:30 為主。 
          目前的目標是：
          1. 在開學前兩週約出景福校友參訪的「檢討會」
          2. 在二月約出（可能的）七月文藝復興參訪的「說明會」
          3. 未來這個學期共約出8次聚會時間。
          從二月開始投票吧～
        </p>
        {currentUser && (
          <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200">
            <span className="text-slate-600 mr-2">目前使用者：</span>
            <span className="font-bold text-blue-600">{currentUser.name}</span>
            <span className="ml-2 text-slate-400 text-sm">({currentUser.code})</span>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-20">
        {!currentUser ? (
          <div className="flex justify-center">
            <UserEntry onUserSet={handleUserSet} />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Calendar 
              onSelectionComplete={handleSelectionComplete}
              data={availabilityData}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              onDayContextMenu={handleDayContextMenu}
              currentUser={currentUser}
            />
          </motion.div>
        )}
      </main>

      <AvailabilityPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSelect={handleAvailabilitySelect}
      />

      <DateDetailsPopup
        date={detailsDate}
        data={detailsDate ? availabilityData[format(detailsDate, 'yyyy-MM-dd')] || {} : {}}
        onClose={() => setDetailsDate(null)}
      />
    </div>
    
  );
}      
export default App;
