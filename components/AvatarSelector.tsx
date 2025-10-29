"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { createAvatar, type Style } from "@dicebear/core";
import {
  avataaars,
  lorelei,
  personas,
  adventurer,
  bigSmile,
  bottts,
  croodles,
  funEmoji,
  identicon,
  initials,
  micah,
  miniavs,
  notionists,
  openPeeps,
  adventurerNeutral,
  botttsNeutral,
  croodlesNeutral,
  bigEars,
  bigEarsNeutral,
  dylan,
  notionistsNeutral,
  pixelArt,
  avataaarsNeutral,
  loreleiNeutral,
  pixelArtNeutral,
  rings,
} from "@dicebear/collection";
import { Button } from "@/components/ui/button";
import { Shuffle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarSelectorProps {
  selectedAvatar: string;
  onAvatarSelectAction: (avatarUrl: string) => void;
  firstName?: string;
  lastName?: string;
}

type AvatarStyle = {
  id: string;
  name: string;
  description: string;
  style: Style<Record<string, unknown>>;
  color: string;
};

const avatarStyles: AvatarStyle[] = [
  {
    id: "avataaars",
    name: "Avataaars",
    description: "Professional & Clean",
    style: avataaars,
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: "lorelei",
    name: "Lorelei",
    description: "Elegant & Modern",
    style: lorelei,
    color: "bg-purple-50 border-purple-200",
  },
  {
    id: "personas",
    name: "Personas",
    description: "Diverse & Inclusive",
    style: personas,
    color: "bg-green-50 border-green-200",
  },
  {
    id: "adventurer",
    name: "Adventurer",
    description: "Fun & Playful",
    style: adventurer,
    color: "bg-orange-50 border-orange-200",
  },
  {
    id: "adventurerNeutral",
    name: "Adventurer Neutral",
    description: "Fun & Neutral",
    style: adventurerNeutral,
    color: "bg-orange-50 border-orange-200",
  },
  {
    id: "bigSmile",
    name: "Big Smile",
    description: "Happy & Cheerful",
    style: bigSmile,
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    id: "bottts",
    name: "Bottts",
    description: "Robotic & Tech",
    style: bottts,
    color: "bg-gray-50 border-gray-200",
  },
  {
    id: "botttsNeutral",
    name: "Bottts Neutral",
    description: "Robotic & Neutral",
    style: botttsNeutral,
    color: "bg-gray-50 border-gray-200",
  },
  {
    id: "croodles",
    name: "Croodles",
    description: "Doodle Style",
    style: croodles,
    color: "bg-pink-50 border-pink-200",
  },
  {
    id: "croodlesNeutral",
    name: "Croodles Neutral",
    description: "Doodle & Neutral",
    style: croodlesNeutral,
    color: "bg-pink-50 border-pink-200",
  },
  {
    id: "funEmoji",
    name: "Fun Emoji",
    description: "Emoji Based",
    style: funEmoji,
    color: "bg-red-50 border-red-200",
  },
  {
    id: "openPeeps",
    name: "Open Peeps",
    description: "Hand-drawn Style",
    style: openPeeps,
    color: "bg-indigo-50 border-indigo-200",
  },
  {
    id: "bigEars",
    name: "Big Ears",
    description: "Cute & Playful",
    style: bigEars,
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    id: "bigEarsNeutral",
    name: "Big Ears Neutral",
    description: "Cute & Neutral",
    style: bigEarsNeutral,
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    id: "dylan",
    name: "Dylan",
    description: "Unique & Creative",
    style: dylan,
    color: "bg-cyan-50 border-cyan-200",
  },
  {
    id: "identicon",
    name: "Identicon",
    description: "Geometric & Unique",
    style: identicon,
    color: "bg-amber-50 border-amber-200",
  },
  {
    id: "initials",
    name: "Initials",
    description: "Simple & Text-based",
    style: initials,
    color: "bg-teal-50 border-teal-200",
  },
  {
    id: "micah",
    name: "Micah",
    description: "Artistic & Detailed",
    style: micah,
    color: "bg-rose-50 border-rose-200",
  },
  {
    id: "miniavs",
    name: "Miniavs",
    description: "Minimal & Clean",
    style: miniavs,
    color: "bg-lime-50 border-lime-200",
  },
  {
    id: "notionists",
    name: "Notionists",
    description: "Modern & Professional",
    style: notionists,
    color: "bg-sky-50 border-sky-200",
  },
  {
    id: "notionistsNeutral",
    name: "Notionists Neutral",
    description: "Modern & Neutral",
    style: notionistsNeutral,
    color: "bg-sky-50 border-sky-200",
  },
  {
    id: "pixelArt",
    name: "Pixel Art",
    description: "Retro & Pixelated",
    style: pixelArt,
    color: "bg-fuchsia-50 border-fuchsia-200",
  },
  {
    id: "pixelArtNeutral",
    name: "Pixel Art Neutral",
    description: "Retro & Neutral",
    style: pixelArtNeutral,
    color: "bg-fuchsia-50 border-fuchsia-200",
  },
  {
    id: "rings",
    name: "Rings",
    description: "Geometric & Circular",
    style: rings,
    color: "bg-stone-50 border-stone-200",
  },
  {
    id: "avataaarsNeutral",
    name: "Avataaars Neutral",
    description: "Simple & Neutral",
    style: avataaarsNeutral,
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: "loreleiNeutral",
    name: "Lorelei Neutral",
    description: "Elegant & Neutral",
    style: loreleiNeutral,
    color: "bg-purple-50 border-purple-200",
  },
];

export default function AvatarSelector({
  selectedAvatar,
  onAvatarSelectAction,
  firstName,
  lastName,
}: AvatarSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState("avataaars");
  const [generatedAvatars, setGeneratedAvatars] = useState<
    Record<string, string[]>
  >({});
  const [showFade, setShowFade] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate avatars for each style
  const generateAvatars = (styleId: string, count: number = 8) => {
    const style = avatarStyles.find((s) => s.id === styleId);
    if (!style) return [];

    // Special handling for initials style - only show one avatar with user's initials
    if (styleId === "initials") {
      const firstInitial = firstName?.charAt(0).toUpperCase() || "";
      const lastInitial = lastName?.charAt(0).toUpperCase() || "";

      try {
        const config: Record<string, unknown> = {
          seed: `${firstInitial} ${lastInitial}` || "User", // Pass full name for initials to be generated
        };
        const avatar = createAvatar(style.style, config);
        return [avatar.toDataUri()];
      } catch (error) {
        console.error(`Error generating initials avatar:`, error);
        return [];
      }
    }

    const backgroundColors = [
      "f0f9ff",
      "fef3c7",
      "f3e8ff",
      "ecfdf5",
      "fef2f2",
      "f0fdf4",
      "fefce8",
      "f0f9ff",
    ];

    const avatars = Array.from({ length: count }, (_, i) => {
      const seed = `${styleId}-${i}-${Date.now()}`;
      try {
        // Create base configuration
        const config: Record<string, unknown> = {
          size: 128,
          seed: seed,
        };

        // Only add backgroundColor if the style supports it
        // Some styles like rings don't support backgroundColor
        if (styleId !== "rings") {
          config.backgroundColor =
            backgroundColors[i % backgroundColors.length];
        }

        return createAvatar(style.style, config).toDataUri();
      } catch (error) {
        console.error(`Error generating avatar for style ${styleId}:`, error);
        return "";
      }
    });

    return avatars.filter(Boolean);
  };

  // Get or generate avatars for the selected style
  const currentAvatars = useMemo(() => {
    if (!generatedAvatars[selectedStyle]) {
      const newAvatars = generateAvatars(selectedStyle);
      setGeneratedAvatars((prev) => ({
        ...prev,
        [selectedStyle]: newAvatars,
      }));
      return newAvatars;
    }
    return generatedAvatars[selectedStyle];
  }, [selectedStyle, generatedAvatars, firstName, lastName]);

  // Regenerate initials avatar when firstName or lastName changes
  useEffect(() => {
    if (generatedAvatars["initials"]) {
      const newAvatars = generateAvatars("initials");
      setGeneratedAvatars((prev) => ({
        ...prev,
        initials: newAvatars,
      }));

      // If initials is the currently selected style, update the selected avatar
      if (selectedStyle === "initials" && newAvatars[0]) {
        onAvatarSelectAction(newAvatars[0]);
      }
    }
  }, [firstName, lastName]);

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleRandomize = () => {
    const newAvatars = generateAvatars(selectedStyle);
    setGeneratedAvatars((prev) => ({
      ...prev,
      [selectedStyle]: newAvatars,
    }));
  };

  const handleAvatarClick = (avatarUrl: string) => {
    onAvatarSelectAction(avatarUrl);
  };

  // Scroll handler to hide/show fade
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      // Only show fade if there's actual scrollable content
      if (scrollHeight > clientHeight) {
        // Show fade only when at the top, hide when at the bottom
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1; // -1 for rounding errors
        setShowFade(isAtTop && !isAtBottom);
      } else {
        setShowFade(false); // No scrollbar, no fade needed
      }
    }
  };

  // Initial check for scrollability and fade visibility
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } =
        scrollContainerRef.current;
      // Only show fade if there's scrollable content and we're at the top
      if (scrollHeight > clientHeight) {
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        setShowFade(isAtTop && !isAtBottom);
      } else {
        setShowFade(false);
      }
    }
  }, [selectedStyle, generatedAvatars]); // Re-check if avatars or style changes

  return (
    <div className="space-y-6">
      {/* Style Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Avatar Style</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRandomize}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <Shuffle className="h-3 w-3 mr-1" />
            Randomize
          </Button>
        </div>

        {/* Styles Grid with Fade */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-54 overflow-y-auto pr-2"
          >
            {avatarStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleChange(style.id)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-colors",
                  selectedStyle === style.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50",
                )}
              >
                <div className="text-xs font-medium">{style.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {style.description}
                </div>
              </button>
            ))}
          </div>

          {/* Fade element */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none transition-opacity duration-300",
              showFade ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>

      {/* Avatar Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Choose Avatar</h4>
        <div className="grid grid-cols-3 gap-3">
          {currentAvatars.map((avatarUrl, index) => (
            <button
              key={`${selectedStyle}-${index}`}
              onClick={() => handleAvatarClick(avatarUrl)}
              className={cn(
                "relative p-2 rounded-lg border transition-colors",
                selectedAvatar === avatarUrl
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/50 hover:bg-muted/30",
              )}
            >
              <img
                src={avatarUrl}
                alt={`${selectedStyle} avatar ${index + 1}`}
                className="w-full h-16 object-contain rounded-md"
              />
              {selectedAvatar === avatarUrl && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
