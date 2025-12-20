"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface ErrorDisplayProps {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

// Animated error illustration - broken/cracked error theme
const ErrorIllustration = () => {
  return (
    <div className="w-48 h-48 md:w-56 md:h-56 relative flex items-center justify-center">
      <motion.svg
        width="240"
        height="120"
        viewBox="0 0 240 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Main error icon - broken/warning triangle */}
        <motion.g transform="translate(120, 120)">
          {/* Outer triangle - pulsing glow */}
          <motion.path
            d="M 0 -60 L 52 30 L -52 30 Z"
            fill="currentColor"
            fillOpacity="0.15"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Main triangle */}
          <motion.path
            d="M 0 -50 L 43 25 L -43 25 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Exclamation mark */}
          <motion.g
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Dot */}
            <circle cx="0" cy="5" r="6" fill="currentColor" />
            {/* Line */}
            <rect
              x="-3"
              y="-20"
              width="6"
              height="20"
              rx="3"
              fill="currentColor"
            />
          </motion.g>

          {/* Cracks in the triangle - animated */}
          <motion.g
            opacity={0.6}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          >
            {/* Left crack */}
            <motion.path
              d="M -25 -20 L -35 0"
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0,
              }}
            />

            {/* Right crack */}
            <motion.path
              d="M 25 -20 L 35 0"
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />

            {/* Bottom crack */}
            <motion.path
              d="M 0 25 L 0 35"
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.g>

          {/* Floating error fragments */}
          <motion.g
            animate={{
              y: [0, -8, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <text
              x="-45"
              y="-35"
              fill="currentColor"
              fontSize="14"
              fontWeight="bold"
              opacity="0.4"
              fontFamily="monospace"
            >
              ERR
            </text>
          </motion.g>

          <motion.g
            animate={{
              y: [0, -10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <text
              x="30"
              y="-35"
              fill="currentColor"
              fontSize="14"
              fontWeight="bold"
              opacity="0.4"
              fontFamily="monospace"
            >
              OPS
            </text>
          </motion.g>

          {/* Broken pieces floating away */}
          <motion.g
            animate={{
              x: [0, 8, 0],
              y: [0, 8, 0],
              rotate: [0, 15, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path
              d="M 40 20 L 50 25 L 45 30 Z"
              fill="currentColor"
              opacity="0.3"
            />
          </motion.g>

          <motion.g
            animate={{
              x: [0, -8, 0],
              y: [0, 8, 0],
              rotate: [0, -15, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            <path
              d="M -40 20 L -50 25 L -45 30 Z"
              fill="currentColor"
              opacity="0.3"
            />
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
};

export default function ErrorDisplay({
  error,
  onRetry,
  title = "Something went wrong",
  description,
  className,
}: ErrorDisplayProps) {
  const errorMessage = error?.message || "An unexpected error occurred";
  const displayDescription = description || errorMessage;

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 min-h-[400px] ${className || ""}`}
    >
      <div className="flex flex-col items-center text-center max-w-lg">
        {/* Error Illustration */}
        <div className="text-destructive">
          <ErrorIllustration />
        </div>

        {/* Title */}
        <div className="space-y-1 mb-3">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {displayDescription}
          </p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
