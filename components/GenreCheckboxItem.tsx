import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type React from "react";

interface GenreCheckboxItemProps {
  id: string;
  name: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  prefix?: string;
}

export function GenreCheckboxItem({
  id,
  name,
  checked,
  onCheckedChange,
  prefix = "",
}: GenreCheckboxItemProps) {
  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't toggle if clicking directly on checkbox or label
    const target = e.target as HTMLElement;
    if (target.closest('input[type="checkbox"]') || target.closest("label")) {
      return;
    }
    // Toggle the checkbox state
    onCheckedChange(!checked);
  };

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer w-40"
      onClick={handleDivClick}
    >
      <Checkbox
        id={`${prefix}${id}`}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label
        htmlFor={`${prefix}${id}`}
        className="text-sm font-normal cursor-pointer"
      >
        {name}
      </Label>
    </div>
  );
}
