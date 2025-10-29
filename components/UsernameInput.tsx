"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usernameSchema } from "@/lib/validation";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, Check, HelpCircle, Loader2 } from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onErrorChange?: (error: string) => void;
  onInteraction?: () => void;
}

export const UsernameInput = memo(function UsernameInput({
  value,
  onChange,
  error: externalError,
  onErrorChange,
  onInteraction,
}: UsernameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [internalError, setInternalError] = useState("");
  const lastCheckedRef = useRef<string>("");
  const lastExternalValueRef = useRef<string>(value);

  // Sync when external value changes (e.g., on discard)
  useEffect(() => {
    if (value !== lastExternalValueRef.current) {
      lastExternalValueRef.current = value;
      setDisplayValue(value);
      setDebouncedValue(value);
      if (inputRef.current) {
        inputRef.current.value = value;
      }
    }
  }, [value]);

  // Create stable debounced functions
  const debouncedOnChange = useMemo(
    () =>
      debounce((val: string) => {
        onChange(val);
      }, 600),
    [onChange],
  );

  const debouncedUpdate = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedValue(val);
        // Also notify parent when debounced value is set
        onChange(val);
      }, 600),
    [onChange],
  );

  // Debounce display value updates
  useEffect(() => {
    debouncedUpdate(displayValue);
    return () => {
      debouncedUpdate.cancel();
    };
  }, [displayValue, debouncedUpdate]);

  // Validate debounced value
  const isValidForCheck = useMemo(() => {
    if (!debouncedValue || debouncedValue.length < 4) return false;
    if (debouncedValue === lastCheckedRef.current) return false;
    return usernameSchema.safeParse(debouncedValue).success;
  }, [debouncedValue]);

  const isUsernameAvailable = useQuery(
    api.userProfiles.isUsernameAvailable,
    isValidForCheck ? { username: debouncedValue } : "skip",
  );

  // Track last checked
  useEffect(() => {
    if (
      isUsernameAvailable !== undefined &&
      isValidForCheck &&
      debouncedValue
    ) {
      lastCheckedRef.current = debouncedValue;
    }
  }, [isUsernameAvailable, debouncedValue, isValidForCheck]);

  // Create stable debounced error callback
  const debouncedErrorChange = useMemo(
    () =>
      debounce((error: string) => {
        onErrorChange?.(error);
      }, 300),
    [onErrorChange],
  );

  // Validate debounced value
  useEffect(() => {
    if (debouncedValue) {
      const validation = usernameSchema.safeParse(debouncedValue);
      if (!validation.success) {
        const errorMsg = validation.error.issues[0].message;
        setInternalError(errorMsg);
        debouncedErrorChange(errorMsg);
      } else {
        setInternalError("");
        debouncedErrorChange("");
      }
    } else if (displayValue.length === 0) {
      setInternalError("");
      debouncedErrorChange("");
    }

    return () => {
      debouncedErrorChange.cancel();
    };
  }, [debouncedValue, displayValue, debouncedErrorChange]);

  // Track checking state
  const isChecking = isValidForCheck && isUsernameAvailable === undefined;

  const handleChange = (newValue: string) => {
    // Convert to lowercase to match Clerk's requirements
    const lowerValue = newValue.toLowerCase();
    // Input is uncontrolled - React doesn't control value, so typing is instant!
    // Just update display value for status calculations (debounced in useEffect)
    setDisplayValue(lowerValue);
    // Parent notification and validation happen via debounced effects
    onInteraction?.();
  };

  const error = externalError || internalError;
  const isDebouncedMatch = displayValue === debouncedValue;
  const showStatusIcon = isDebouncedMatch && displayValue;

  const inputClassName = useMemo(() => {
    const hasError =
      error || (isUsernameAvailable === false && isDebouncedMatch);
    return `pr-10 ${hasError ? "border-red-500" : ""}`;
  }, [error, isUsernameAvailable, isDebouncedMatch]);

  const statusIcon = useMemo(() => {
    if (!showStatusIcon) return null;
    if (error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
    if (isUsernameAvailable === true) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (isUsernameAvailable === false) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  }, [showStatusIcon, error, isChecking, isUsernameAvailable]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="username">Username</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="size-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              4-64 characters, lowercase letters, numbers, underscores, and
              hyphens only
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="relative">
        <Input
          ref={inputRef}
          id="username"
          type="text"
          defaultValue={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Choose a unique username"
          className={inputClassName}
        />
        {statusIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {statusIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {isDebouncedMatch && !error && isUsernameAvailable === false && (
        <p className="text-xs text-red-500">Username is already taken</p>
      )}
    </div>
  );
});
