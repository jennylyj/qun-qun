import React from 'react';
import { Circle, Triangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Availability } from '../types';

interface AvailabilityPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (availability: Availability) => void;
}

export const AvailabilityPopup: React.FC<AvailabilityPopupProps> = ({ isOpen, onClose, onSelect }) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm relative"
          >
            <h3 className="text-xl font-bold text-center mb-8 text-slate-800">
              這段時間你有空嗎？
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => onSelect('O')}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-green-50 transition-all group border border-transparent hover:border-green-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Circle className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-sm font-bold text-slate-600">可以</span>
              </button>

              <button
                onClick={() => onSelect('V')}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-amber-50 transition-all group border border-transparent hover:border-amber-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Triangle className="w-8 h-8 text-amber-600 fill-current" />
                </div>
                <span className="text-sm font-bold text-slate-600">不偏好</span>
              </button>

              <button
                onClick={() => onSelect('X')}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-red-50 transition-all group border border-transparent hover:border-red-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <span className="text-sm font-bold text-slate-600">無法</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="mt-8 w-full py-3 text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors"
            >
              結束
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
