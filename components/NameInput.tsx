"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nameSchema } from "@/lib/validation";

interface NameInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onErrorChange?: (error: string) => void;
  onInteraction?: () => void;
  placeholder?: string;
}

export const NameInput = memo(function NameInput({
  id,
  label,
  value,
  onChange,
  error: externalError,
  onErrorChange,
  onInteraction,
  placeholder,
}: NameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const [internalError, setInternalError] = useState("");
  const lastExternalValueRef = useRef<string>(value);

  // Sync when external value changes (e.g., on discard)
  useEffect(() => {
    if (value !== lastExternalValueRef.current) {
      lastExternalValueRef.current = value;
      setDisplayValue(value);
      if (inputRef.current) {
        inputRef.current.value = value;
      }
    }
  }, [value]);

  // Validate display value (only show errors after user stops typing)
  useEffect(() => {
    if (displayValue.length > 0) {
      const validation = nameSchema.safeParse(displayValue);
      if (!validation.success) {
        const errorMsg = validation.error.issues[0].message;
        setInternalError(errorMsg);
        onErrorChange?.(errorMsg);
      } else {
        setInternalError("");
        onErrorChange?.("");
      }
    } else {
      setInternalError("");
      onErrorChange?.("");
    }
  }, [displayValue, onErrorChange]);

  const handleChange = (newValue: string) => {
    // Input is uncontrolled - React doesn't control value, so typing is instant!
    // Just update display value for validation (debounced in useEffect)
    setDisplayValue(newValue);
    // Parent notification happens via debounced effect
    onInteraction?.();
  };

  // Debounce parent notification
  useEffect(() => {
    // Only notify parent after a short delay (when user stops typing)
    const timeoutId = setTimeout(() => {
      if (displayValue !== value) {
        onChange(displayValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [displayValue, value, onChange]);

  const error = externalError || internalError;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        defaultValue={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});
