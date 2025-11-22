/**
 * Type definitions for Network Information API
 * This API is experimental and not part of the standard DOM types
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
 */

interface NetworkInformation extends EventTarget {
  readonly effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
  readonly type:
    | "bluetooth"
    | "cellular"
    | "ethernet"
    | "none"
    | "wifi"
    | "wimax"
    | "other"
    | "unknown";
  onchange: ((this: NetworkInformation, ev: Event) => unknown) | null;
}

interface Navigator {
  readonly connection?: NetworkInformation;
  readonly mozConnection?: NetworkInformation;
  readonly webkitConnection?: NetworkInformation;
}
