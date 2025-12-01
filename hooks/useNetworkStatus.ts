import { useEffect, useState } from "react";

interface NetworkStatus {
  isSlow: boolean;
  effectiveType?: NetworkInformation["effectiveType"];
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

/**
 * Hook to detect slow network connections
 * Uses Network Information API when available, falls back to timeout-based detection
 */
export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isSlow: false,
  });

  useEffect(() => {
    // Check if Network Information API is available
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    const updateNetworkStatus = () => {
      if (connection) {
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink;
        const rtt = connection.rtt;
        const saveData = connection.saveData;

        // Consider network slow if:
        // - effectiveType is 'slow-2g' or '2g'
        // - downlink is less than 1 Mbps
        // - rtt is greater than 500ms
        const isSlow =
          effectiveType === "slow-2g" ||
          effectiveType === "2g" ||
          (downlink !== undefined && downlink < 1) ||
          (rtt !== undefined && rtt > 500);

        setNetworkStatus({
          isSlow,
          effectiveType,
          downlink,
          rtt,
          saveData,
        });
      } else {
        // If Network API is not available, we'll rely on timeout-based detection in the component
        setNetworkStatus({ isSlow: false });
      }
    };

    // Initial check
    updateNetworkStatus();

    // Listen for connection changes
    if (connection) {
      connection.addEventListener("change", updateNetworkStatus);
      return () => {
        connection.removeEventListener("change", updateNetworkStatus);
      };
    }
  }, []);

  return networkStatus;
}
