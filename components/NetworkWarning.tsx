"use client";

import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface NetworkWarningProps {
  isLoading: boolean;
  loadingDuration?: number;
  mock?: {
    isSlow?: boolean;
    effectiveType?: NetworkInformation["effectiveType"];
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
}

export default function NetworkWarning({
  isLoading,
  loadingDuration = 5000,
  mock,
}: NetworkWarningProps) {
  const realNetworkStatus = useNetworkStatus();
  const [isSlowByTimeout, setIsSlowByTimeout] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use mock data if provided, otherwise use real network status
  const networkStatus = mock
    ? {
        isSlow: mock.isSlow ?? true,
        effectiveType: mock.effectiveType,
        downlink: mock.downlink,
        rtt: mock.rtt,
        saveData: mock.saveData,
      }
    : realNetworkStatus;

  // Timeout-based detection: if loading takes too long, assume slow network
  useEffect(() => {
    // Skip timeout logic if using mock mode
    if (mock) {
      return;
    }

    if (isLoading) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset slow timeout state
      setIsSlowByTimeout(false);

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        setIsSlowByTimeout(true);
      }, loadingDuration);
    } else {
      // Clear timeout and reset when loading completes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsSlowByTimeout(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, loadingDuration, mock]);

  // Determine if network is slow (either by API detection or timeout)
  const isSlow = mock
    ? networkStatus.isSlow
    : networkStatus.isSlow || isSlowByTimeout;

  // Only show warning if loading and network is detected as slow
  if (!isLoading || !isSlow) {
    return null;
  }

  const getWarningMessage = () => {
    if (networkStatus.effectiveType) {
      switch (networkStatus.effectiveType) {
        case "slow-2g":
          return "Your connection appears to be very slow (2G). Content may take longer to load.";
        case "2g":
          return "Your connection appears to be slow (2G). Please be patient while content loads.";
        default:
          if (networkStatus.downlink && networkStatus.downlink < 1) {
            return "Your connection speed is low. Content may take longer to load.";
          }
          if (networkStatus.rtt && networkStatus.rtt > 500) {
            return "Your connection has high latency. Content may take longer to load.";
          }
          return "Your connection appears to be slow. Content may take longer to load.";
      }
    }
    return "Your connection appears to be slow. Content may take longer to load.";
  };

  return (
    <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
      {networkStatus.effectiveType === "slow-2g" ||
      networkStatus.effectiveType === "2g" ? (
        <WifiOff className="text-amber-500!" />
      ) : (
        <Wifi className="text-amber-500!" />
      )}
      <AlertTitle className="text-amber-600 dark:text-amber-400">
        Slow Network Detected
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300">
        {getWarningMessage()}
        {networkStatus.saveData && (
          <span className="block mt-1 text-sm">
            Data Saver mode is enabled, which may affect loading speed.
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
}
