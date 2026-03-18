import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Calendar, Clock, Sparkles, Target, Zap, BookOpen } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Scheduling",
      description: "Our advanced algorithms analyze your workload and energy levels to create the perfect study plan."
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set long-term academic goals and break them down into manageable daily tasks."
    },
    {
      icon: Zap,
      title: "Focus Optimization",
      description: "Smart breaks and focus timers integrated directly into your personalized schedule."
    },
    {
      icon: Calendar,
      title: "Adaptive Planning",
      description: "Missed a session? No problem. Lock In automatically recalibrates your plan to keep you on track."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold tracking-wider uppercase mb-6">
                <Sparkles size={14} /> The Future of Studying
              </span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                STOP WISHING.<br />
                <span className="text-emerald-500">START LOCKING IN.</span>
              </h1>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                The AI-powered study planner that adapts to your life, your pace, and your goals. 
                Experience the most personalized academic management tool ever built.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  Get Started for Free
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="px-8 py-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-lg font-bold transition-all"
                >
                  See How it Works
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 dark:opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4 uppercase">Engineered for Excellence</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Everything you need to dominate your curriculum and reclaim your time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 border-y border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-emerald-500 mb-1">98%</div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-500 mb-1">10k+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-500 mb-1">2.5h</div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">Avg. Time Saved</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-500 mb-1">4.9/5</div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="bg-zinc-900 dark:bg-emerald-500 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 max-w-3xl mx-auto">
                READY TO UNLOCK YOUR FULL POTENTIAL?
              </h2>
              <Link
                to="/dashboard"
                className="inline-flex px-10 py-5 bg-white text-zinc-900 dark:text-emerald-500 rounded-full text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                LOCK IN NOW
              </Link>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <BookOpen size={20} />
            </div>
            <span>LOCK IN</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500 font-medium">
            <a href="#" className="hover:text-emerald-500">Privacy</a>
            <a href="#" className="hover:text-emerald-500">Terms</a>
            <a href="#" className="hover:text-emerald-500">Contact</a>
          </div>
          <div className="text-sm text-zinc-400">
            © 2024 Lock In AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
