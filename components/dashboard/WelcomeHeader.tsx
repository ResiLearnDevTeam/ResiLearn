'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function WelcomeHeader() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || 'Learner';
  
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          {getTimeGreeting()}, <span className="text-orange-600">{userName}</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Ready to master some resistor codes today?
        </p>
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </motion.div>
  );
}
