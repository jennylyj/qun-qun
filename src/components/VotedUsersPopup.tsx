import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';

interface VotedUsersPopupProps {
  isOpen: boolean;
  onClose: () => void;
  votedUsers: string[];
}

export const VotedUsersPopup: React.FC<VotedUsersPopupProps> = ({ isOpen, onClose, votedUsers }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[60] overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">已投票人員</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {votedUsers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-medium">
                  本月尚無人投票
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {votedUsers.map((user) => (
                    <div 
                      key={user}
                      className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 group hover:border-blue-200 hover:bg-blue-50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 text-xs">
                        {user.slice(0, 1)}
                      </div>
                      <span className="font-semibold text-slate-700 group-hover:text-blue-700 truncate">
                        {user}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-400">
                目前共有 <span className="font-bold text-blue-600">{votedUsers.length}</span> 位夥伴參與投票
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
