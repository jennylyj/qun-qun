import React, { useState } from 'react';

interface UserEntryProps {
  onUserSet: (name: string, code: string) => void;
}

export const UserEntry: React.FC<UserEntryProps> = ({ onUserSet }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Simple logic to generate a code: first character of the name
    // The user can customize this logic later if needed
    const code = name.trim().charAt(0).toUpperCase();
    onUserSet(name.trim(), code);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">歡迎</h2>
        <p className="text-slate-500 mt-2">請輸入您的姓名</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
            我的名字是
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
            placeholder="例如：賈寶玉"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg shadow-blue-500/25"
        >
          登入
        </button>
      </form>
    </div>
  );
};
