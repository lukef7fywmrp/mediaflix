"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import {
  ArrowRight,
  Bug,
  ImagePlus,
  Lightbulb,
  Loader2,
  MessageSquare,
  // Star, // Commented out - rating feature disabled for now
  Smile,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useFeedbackDialog } from "./FeedbackDialogContext";
import { useIsMobile } from "@/hooks/use-mobile";

const FEEDBACK_TYPES = [
  {
    value: "general" as const,
    label: "General",
    shortLabel: "General",
    icon: Smile,
  },
  {
    value: "bug" as const,
    label: "Bug Report",
    shortLabel: "Bug",
    icon: Bug,
  },
  {
    value: "feature" as const,
    label: "Feature Request",
    shortLabel: "Feature",
    icon: Lightbulb,
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const MAX_MESSAGE_LENGTH = 1000;

const feedbackFormSchema = z.object({
  type: z.enum(["general", "bug", "feature"]),
  message: z
    .string()
    .min(1, "Please enter your feedback")
    .max(
      MAX_MESSAGE_LENGTH,
      `Message must be ${MAX_MESSAGE_LENGTH} characters or less`,
    ),
  // rating: z.number({ error: "Please select a rating" }).min(1).max(5), // Commented out - rating feature disabled for now
  email: z.email("Please enter a valid email").optional().or(z.literal("")),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export function FeedbackButton() {
  const { isOpen, setIsOpen, setFeedbackSubmitted, openedFromBanner } =
    useFeedbackDialog();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
    null,
  );
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  // const [hoveredStar, setHoveredStar] = useState(0); // Commented out - rating feature disabled for now
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useUser();
  const generateUploadUrl = useMutation(api.feedback.generateUploadUrl);
  const submitFeedback = useMutation(api.feedback.submitFeedback);
  const isMobile = useIsMobile();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      type: "general",
      message: "",
      // rating: undefined, // Commented out - rating feature disabled for now
      email: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setAttachmentError("File too large. Maximum size is 5MB.");
      return;
    }

    // Validate file type (images only)
    if (!file.type.startsWith("image/")) {
      setAttachmentError("Only images are allowed.");
      return;
    }

    setAttachmentError(null);
    setAttachment(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAttachmentPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    setAttachmentError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: FeedbackFormValues) => {
    setIsSubmitting(true);

    try {
      let attachmentId: Id<"_storage"> | undefined;

      // Upload attachment if present
      if (attachment) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": attachment.type },
          body: attachment,
        });

        if (!response.ok) {
          throw new Error("Failed to upload attachment");
        }

        const { storageId } = await response.json();
        attachmentId = storageId;
      }

      await submitFeedback({
        type: values.type,
        message: values.message.trim(),
        // rating: values.rating, // Commented out - rating feature disabled for now
        email: values.email?.trim() || user?.emailAddresses?.[0]?.emailAddress,
        page: typeof window !== "undefined" ? window.location.href : undefined,
        attachmentId,
      });

      // Only show toast if not opened from the announcement banner
      if (!openedFromBanner) {
        toast.success("Thank you for your feedback!");
      }
      setFeedbackSubmitted(true);
      setIsOpen(false);
      form.reset();
      removeAttachment();
    } catch {
      form.setError("root", {
        message: "Failed to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      // setHoveredStar(0); // Commented out - rating feature disabled for now
      removeAttachment();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-muted-foreground text-xs md:text-sm py-0 h-fit gap-1 transition-colors hover:text-foreground"
        >
          <MessageSquare className="h-3 w-3" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Feedback
          </DialogTitle>
          <DialogDescription className="text-left">
            Help us improve MediaFlix! Share your thoughts, report bugs, or
            suggest features.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Feedback Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Tabs
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.clearErrors("message");
                    }}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      {FEEDBACK_TYPES.map((feedbackType) => {
                        const Icon = feedbackType.icon;
                        return (
                          <TabsTrigger
                            key={feedbackType.value}
                            value={feedbackType.value}
                            className="text-xs gap-1.5"
                          >
                            <Icon className="hidden md:block !h-4 !w-4" />
                            <span className="md:hidden">
                              {feedbackType.shortLabel}
                            </span>
                            <span className="hidden md:inline">
                              {feedbackType.label}
                            </span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Star Rating - Commented out for now
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled =
                        star <= (hoveredStar || field.value || 0);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="p-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              isFilled
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/40 hover:text-primary/60"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            */}

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder={
                          form.watch("type") === "bug"
                            ? isMobile
                              ? "What went wrong?"
                              : "Describe the issue you're facing..."
                            : form.watch("type") === "feature"
                              ? isMobile
                                ? "Your idea..."
                                : "Describe the feature you'd like to see..."
                              : isMobile
                                ? "Your message..."
                                : "Share your thoughts with us..."
                        }
                        className="min-h-[120px] max-h-[200px] resize-none pb-7 pr-18 break-all"
                        maxLength={MAX_MESSAGE_LENGTH}
                        aria-invalid={!!fieldState.error}
                        {...field}
                      />
                      <span className="absolute bottom-2 right-3 text-xs text-muted-foreground tabular-nums pointer-events-none">
                        {(field.value || "").length}/{MAX_MESSAGE_LENGTH}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attachment */}
            <div className="space-y-2">
              <FormLabel className="gap-1">
                Attachment
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </FormLabel>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="feedback-attachment"
              />

              {attachmentPreview ? (
                <div className="relative inline-block min-w-[50%]">
                  <img
                    src={attachmentPreview}
                    alt="Attachment preview"
                    className="w-full max-h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                    onClick={removeAttachment}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9 w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-4 w-4" />
                  Add Screenshot
                </Button>
              )}

              {attachmentError && (
                <p className="text-destructive text-sm">{attachmentError}</p>
              )}
            </div>

            {/* Email (optional, pre-filled if logged in) */}
            {!user && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="gap-1 flex items-center w-fit">
                      Email
                      <span className="text-muted-foreground text-xs font-normal">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Root Error */}
            {form.formState.errors.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            {/* Submit Button */}
            <div className="w-full flex items-center justify-end">
              <Button type="submit" className="gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    Sending...
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Feedback
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
