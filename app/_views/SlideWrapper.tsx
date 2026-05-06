'use client';

import { motion } from 'framer-motion';
import { cn } from '@/app/_views/ui/cn';

interface SlideWrapperProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  direction?: number;
}

export default function SlideWrapper({ children, className, gradient, direction = 1 }: SlideWrapperProps) {
  return (
    <motion.div
      className={cn('relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden', gradient, className)}
      initial={{ opacity: 0, x: direction * 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -60 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
