"use client";

import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Authenticated, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useTransition } from "react";

export default function ClearWatchlistDialog() {
  const [open, setOpen] = useState(false);
  const clearWatchlist = useMutation(api.watchlist.clearWatchlist);
  const [isPending, startTransition] = useTransition();
  const handleConfirm = async () => {
    try {
      startTransition(async () => {
        const count = await clearWatchlist();
        toast.success(
          `Removed ${count} item${count !== 1 ? "s" : ""} from your watchlist`,
        );
        setOpen(false);
      });
    } catch (error) {
      console.error("Error clearing watchlist:", error);
      toast.error("Failed to clear watchlist. Please try again.");
    }
  };

  return (
    <Authenticated>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" onClick={() => setOpen(true)}>
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear Watchlist</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Watchlist?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all items from your watchlist?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Clear Watchlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Authenticated>
  );
}
