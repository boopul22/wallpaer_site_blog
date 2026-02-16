import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { adminLogin, isLoggedIn } from '../../lib/api';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, []);

  if (isLoggedIn()) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(password);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.08] mb-4">
            <Lock size={20} className="text-neutral-400" />
          </div>
          <h1 className="text-xl font-semibold text-white">Admin Login</h1>
          <p className="mt-1.5 text-sm text-neutral-500">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-white/20 focus:bg-white/[0.06] focus:outline-none transition-all duration-200"
          />
          {error && <p className="text-red-400/90 text-[13px]">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-950 hover:bg-neutral-100 transition-colors duration-200 disabled:opacity-40 disabled:hover:bg-white"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
