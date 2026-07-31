import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '@/lib/axios';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data, data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[2rem] shadow-2xl max-w-md w-full border border-slate-100"
      >
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="VetNova Training Institute" className="h-16 w-auto object-contain" />
        </div>
        <h1 className="text-3xl font-bold font-poppins text-center text-slate-900 mb-2">Admin Portal</h1>
        <p className="text-center text-slate-500 mb-8">Sign in to manage VetNova Training Institute</p>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-brand-primary/50 outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-lg border border-slate-300 px-4 focus:ring-2 focus:ring-brand-primary/50 outline-none" 
              required 
            />
          </div>
          <Button disabled={loading} className="w-full h-12 text-base rounded-lg">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
