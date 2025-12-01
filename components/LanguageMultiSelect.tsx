"use client";

import { ChevronDown, Loader2, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Language {
  iso_639_1: string;
  english_name: string;
}

interface LanguageMultiSelectProps {
  id: string;
  label: string;
  description?: string;
  languages: string[]; // Selected language codes
  onLanguagesChange: (languages: string[]) => void;
  languagesData?: Language[];
  isLoading?: boolean;
  onInteraction?: () => void;
}

export const LanguageMultiSelect = memo(function LanguageMultiSelect({
  id,
  label,
  description,
  languages,
  onLanguagesChange,
  languagesData,
  isLoading,
  onInteraction,
}: LanguageMultiSelectProps) {
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const commandInputRef = useRef<HTMLDivElement>(null);

  // Sync when external changes (e.g., on discard)
  const lastExternalLanguagesRef = useRef<string[]>(languages);
  useEffect(() => {
    if (
      JSON.stringify(languages) !==
      JSON.stringify(lastExternalLanguagesRef.current)
    ) {
      lastExternalLanguagesRef.current = languages;
    }
  }, [languages]);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!dropdownOpen) {
      setDebouncedSearchValue("");
      // Find and clear the input element inside CommandInput
      if (commandInputRef.current) {
        const input = commandInputRef.current.querySelector<HTMLInputElement>(
          'input[data-slot="command-input"]',
        );
        if (input) {
          input.value = "";
        }
      }
      // Clear any pending debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    }
  }, [dropdownOpen]);

  // Memoize sorted languages
  const sortedLanguages = useMemo(() => {
    if (!languagesData) return [];
    return [...languagesData].sort((a, b) =>
      a.english_name.localeCompare(b.english_name),
    );
  }, [languagesData]);

  // Memoize filtered languages based on debounced search
  const filteredLanguages = useMemo(() => {
    if (!debouncedSearchValue) return sortedLanguages;
    const searchLower = debouncedSearchValue.toLowerCase();
    return sortedLanguages.filter((lang) =>
      lang.english_name.toLowerCase().includes(searchLower),
    );
  }, [sortedLanguages, debouncedSearchValue]);

  // Convert languages array to Set for O(1) lookups
  const languagesSet = useMemo(() => new Set(languages), [languages]);

  const handleSearchChange = useCallback(
    (value: string) => {
      // Input is uncontrolled - React doesn't control value, so typing is instant!
      // Only update filtering state after debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedSearchValue(value);
      }, 150);
      onInteraction?.();
    },
    [onInteraction],
  );

  const handleLanguageToggle = useCallback(
    (langCode: string) => {
      const newLanguages = languagesSet.has(langCode)
        ? languages.filter((l) => l !== langCode)
        : [...languages, langCode];
      onLanguagesChange(newLanguages);
      onInteraction?.();
    },
    [languages, languagesSet, onLanguagesChange, onInteraction],
  );

  return (
    <div>
      <div>
        <Label htmlFor={id}>{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center p-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              className="w-full justify-between mt-2"
            >
              <span className="text-muted-foreground tabular-nums">
                {languages.length === 0
                  ? "Select languages..."
                  : `${languages.length} language${
                      languages.length > 1 ? "s" : ""
                    } selected`}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command shouldFilter={false}>
              <CommandList>
                <div
                  ref={commandInputRef}
                  className="sticky top-0 z-10 bg-popover"
                >
                  <CommandInput
                    placeholder="Search languages..."
                    onValueChange={handleSearchChange}
                  />
                </div>
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {filteredLanguages.map((lang) => (
                    <CommandItem
                      key={lang.iso_639_1}
                      onSelect={() => {
                        // Handle toggle on entire item click
                        handleLanguageToggle(lang.iso_639_1);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={languagesSet.has(lang.iso_639_1)}
                        onCheckedChange={() =>
                          handleLanguageToggle(lang.iso_639_1)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="[&_svg]:text-white!"
                      />
                      <span className="flex-1">{lang.english_name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {languages.map((langCode) => {
            const lang = languagesData?.find((l) => l.iso_639_1 === langCode);
            if (!lang) return null;
            return (
              <Badge
                key={langCode}
                variant="secondary"
                className="text-xs py-0.5 flex items-center gap-1"
              >
                {lang.english_name}
                <button
                  type="button"
                  className="ml-px cursor-pointer hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-ring rounded-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLanguageToggle(langCode);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
});
