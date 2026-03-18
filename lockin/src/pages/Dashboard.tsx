import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  Circle,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  duration: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  timeSlot?: string;
}

export function Dashboard() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState({
    subjects: '',
    goals: '',
    availableHours: '4'
  });

  const generatePlan = async () => {
    if (!userInput.subjects || !userInput.goals) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a detailed study plan for today. 
        Subjects: ${userInput.subjects}
        Goals: ${userInput.goals}
        Available Hours: ${userInput.availableHours}
        
        Return the plan as a JSON array of tasks. Each task must have:
        - subject (string)
        - topic (string)
        - duration (string, e.g. "45 mins")
        - priority (string: "low", "medium", or "high")
        - timeSlot (string, e.g. "09:00 AM - 09:45 AM")`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const planData = JSON.parse(response.text || '[]');
      const newTasks = planData.map((task: any) => ({
        ...task,
        id: Math.random().toString(36).substr(2, 9),
        completed: false
      }));
      
      setTasks(newTasks);
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="text-emerald-500" size={20} />
              AI Planner
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Subjects</label>
                <input 
                  type="text" 
                  placeholder="Math, Physics, History..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={userInput.subjects}
                  onChange={e => setUserInput(prev => ({ ...prev, subjects: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Today's Goals</label>
                <textarea 
                  placeholder="Finish chapter 4, practice calculus..."
                  rows={3}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  value={userInput.goals}
                  onChange={e => setUserInput(prev => ({ ...prev, goals: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Available Hours</label>
                <select 
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={userInput.availableHours}
                  onChange={e => setUserInput(prev => ({ ...prev, availableHours: e.target.value }))}
                >
                  {[1,2,3,4,5,6,7,8,9,10,12].map(h => (
                    <option key={h} value={h}>{h} Hours</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={generatePlan}
                disabled={isGenerating || !userInput.subjects || !userInput.goals}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Study Plan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/20">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">Daily Progress</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-4xl font-black">{Math.round(progress)}%</span>
              <span className="text-sm font-medium">{completedCount}/{tasks.length} Tasks</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white"
              />
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight uppercase">Today's Schedule</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
              <Calendar size={14} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900/30 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800"
              >
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 mb-4">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2">No active study plan</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs text-center">
                  Use the AI Planner on the left to generate a personalized schedule for today.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group relative bg-white dark:bg-zinc-900 p-5 rounded-3xl border transition-all",
                      task.completed 
                        ? "border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/5" 
                        : "border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "mt-1 transition-colors",
                          task.completed ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-700 hover:text-emerald-500"
                        )}
                      >
                        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                            task.priority === 'high' ? "bg-red-500/10 text-red-500" :
                            task.priority === 'medium' ? "bg-orange-500/10 text-orange-500" :
                            "bg-blue-500/10 text-blue-500"
                          )}>
                            {task.priority}
                          </span>
                          {task.timeSlot && (
                            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                              <Clock size={10} /> {task.timeSlot}
                            </span>
                          )}
                        </div>
                        
                        <h3 className={cn(
                          "text-lg font-bold truncate",
                          task.completed && "text-zinc-400 line-through"
                        )}>
                          {task.subject}: {task.topic}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                          <Clock size={14} /> {task.duration}
                        </p>
                      </div>

                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
