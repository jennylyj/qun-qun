import React from 'react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Circle, Triangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Availability } from '../types';

interface DateDetailsPopupProps {
  date: Date | null;
  data: Record<string, Availability>;
  onClose: () => void;
}

export const DateDetailsPopup: React.FC<DateDetailsPopupProps> = ({ date, data, onClose }) => {
  if (!date) return null;

  const usersByAvailability: Record<Availability, string[]> = {
    'O': [],
    'V': [],
    'X': []
  };

  Object.entries(data).forEach(([user, status]) => {
    if (usersByAvailability[status]) {
      usersByAvailability[status].push(user);
    }
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              {format(date, 'M月d日 (E)', { locale: zhTW })} 的統計
            </h3>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* O Sections */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <Circle className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">有空 ({usersByAvailability['O'].length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {usersByAvailability['O'].length > 0 ? (
                  usersByAvailability['O'].map(user => (
                    <span key={user} className="px-3 py-1 bg-white rounded-lg text-sm text-slate-700 shadow-sm border border-green-100">
                      {user}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-green-600/60 italic">目前無人</span>
                )}
              </div>
            </div>

            {/* V Sections */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <Triangle className="w-5 h-5 text-amber-600 fill-current" />
                <span className="font-bold text-amber-800">不確定 ({usersByAvailability['V'].length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {usersByAvailability['V'].length > 0 ? (
                  usersByAvailability['V'].map(user => (
                    <span key={user} className="px-3 py-1 bg-white rounded-lg text-sm text-slate-700 shadow-sm border border-amber-100">
                      {user}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-amber-600/60 italic">目前無人</span>
                )}
              </div>
            </div>

            {/* X Sections */}
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
              <div className="flex items-center gap-2 mb-3">
                <X className="w-5 h-5 text-rose-600" />
                <span className="font-bold text-rose-800">沒空 ({usersByAvailability['X'].length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {usersByAvailability['X'].length > 0 ? (
                  usersByAvailability['X'].map(user => (
                    <span key={user} className="px-3 py-1 bg-white rounded-lg text-sm text-slate-700 shadow-sm border border-rose-100">
                      {user}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-rose-600/60 italic">目前無人</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
