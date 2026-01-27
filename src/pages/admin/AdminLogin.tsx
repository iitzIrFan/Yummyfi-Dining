import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const { loginAdmin } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock auth
    if (password === 'admin123') {
      loginAdmin();
      navigate('/admin/dashboard');
    } else {
      alert('Invalid password! Try: admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-offWhite p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-brand-maroon">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-maroon">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-brand-maroon">Staff Login</h2>
          <p className="text-gray-500">Secure access for restaurant staff only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none transition-all"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-2">Hint: admin123</p>
          </div>
          <button 
            type="submit"
            className="w-full bg-brand-maroon text-white font-bold py-3 rounded-lg hover:bg-brand-burgundy transition-colors shadow-lg shadow-brand-maroon/20"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
