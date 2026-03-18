import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Moon, Sun, BookOpen, LayoutDashboard, Home as HomeIcon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { cn } from '../lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <BookOpen size={20} />
            </div>
            <span>LOCK IN</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-500",
                  location.pathname === item.path ? "text-emerald-500" : "text-zinc-500 dark:text-zinc-400"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Link
              to="/dashboard"
              className="hidden sm:flex px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-medium transition-all transform active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg border border-zinc-200 dark:border-zinc-800 rounded-full px-6 py-3 shadow-2xl flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              location.pathname === item.path ? "text-emerald-500" : "text-zinc-400"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1 text-zinc-400 hover:text-emerald-500 transition-colors"
          aria-label="Toggle theme"
        >
          <div className="relative w-5 h-5">
            <motion.div
              initial={false}
              animate={{ 
                rotate: theme === 'light' ? 0 : 180,
                opacity: theme === 'light' ? 1 : 0,
                scale: theme === 'light' ? 1 : 0.5
              }}
              className="absolute inset-0"
            >
              <Moon size={20} />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ 
                rotate: theme === 'dark' ? 0 : -180,
                opacity: theme === 'dark' ? 1 : 0,
                scale: theme === 'dark' ? 1 : 0.5
              }}
              className="absolute inset-0"
            >
              <Sun size={20} />
            </motion.div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Theme</span>
        </motion.button>
      </div>
    </div>
  );
}
