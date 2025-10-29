"use client";

import AvatarSelector from "@/components/AvatarSelector";
import { NameInput } from "@/components/NameInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CountryDropdown,
  type Country,
} from "@/components/ui/country-dropdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UsernameInput } from "@/components/UsernameInput";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { convertSvgToPng, dataUriToBlob } from "@/lib/utils";
import { birthDateSchema, countrySchema, nameSchema } from "@/lib/validation";
import { useReverification, useUser } from "@clerk/nextjs";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/nextjs/errors";
import {
  Authenticated,
  AuthLoading,
  useMutation,
  useQuery,
} from "convex/react";
import { countries } from "country-data-list";
import {
  Calendar as CalendarIcon,
  Loader2,
  Undo2,
  Upload,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ProfileSetupPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined,
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.imageUrl || "");
  const [avatarDataUri, setAvatarDataUri] = useState<string>("");
  const [customAvatarFile, setCustomAvatarFile] = useState<File | null>(null);
  const [usernameError, setUsernameError] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [birthDateError, setBirthDateError] = useState<string>("");
  const [countryError, setCountryError] = useState<string>("");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [originalUsername, setOriginalUsername] = useState<string>("");
  const [originalFirstName, setOriginalFirstName] = useState<string>("");
  const [originalLastName, setOriginalLastName] = useState<string>("");
  const [originalBirthDate, setOriginalBirthDate] = useState<string>("");
  const [originalCountry, setOriginalCountry] = useState<string>("");
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState<string>("");
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUserProfile = useQuery(api.userProfiles.getUserProfile);
  const upsertUserProfile = useMutation(api.userProfiles.upsertUserProfile);
  const updateAvatar = useMutation(api.userProfiles.updateAvatar);
  const generateUploadUrl = useMutation(api.userProfiles.generateUploadUrl);
  const getAvatarUrl = useMutation(api.userProfiles.getAvatarUrl);

  // Extract stable values from getUserProfile for useEffect dependencies
  const userProfileUsername = getUserProfile?.username;
  const userProfileFirstName = getUserProfile?.firstName;
  const userProfileLastName = getUserProfile?.lastName;
  const userProfileBirthDate = getUserProfile?.birthDate;
  const userProfileCountry = getUserProfile?.country;

  // Create stable computed values for profile state
  const profileIsLoading = getUserProfile === undefined;
  const profileExists = getUserProfile !== null && getUserProfile !== undefined;
  const changeUsername = useReverification((username: string) =>
    user?.update({ username }),
  );

  // Set initial values only once when component mounts
  useEffect(() => {
    if (!hasUserInteracted && user) {
      // Set username
      if (user.username) {
        const lowerUsername = user.username.toLowerCase();
        setUsername(lowerUsername);
        setOriginalUsername(lowerUsername);
      } else if (userProfileUsername) {
        const lowerUsername = userProfileUsername.toLowerCase();
        setUsername(lowerUsername);
        setOriginalUsername(lowerUsername);
      } else {
        // Generate a default username from first and last name
        const firstName = user.firstName || "";
        const lastName = user.lastName || "";
        const defaultUsername = `${firstName}${lastName}`
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9_-]/g, ""); // Remove invalid characters

        if (defaultUsername && defaultUsername.length >= 4) {
          setUsername(defaultUsername);
          setOriginalUsername(defaultUsername);
        }
      }

      // Set other profile fields
      if (getUserProfile) {
        setFirstName(userProfileFirstName || user.firstName || "");
        setLastName(userProfileLastName || user.lastName || "");
        setBirthDate(userProfileBirthDate || "");
        setCountry(userProfileCountry || "");

        setOriginalFirstName(userProfileFirstName || user.firstName || "");
        setOriginalLastName(userProfileLastName || user.lastName || "");
        setOriginalBirthDate(userProfileBirthDate || "");
        setOriginalCountry(userProfileCountry || "");
      } else {
        // Initialize from Clerk user data
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setOriginalFirstName(user.firstName || "");
        setOriginalLastName(user.lastName || "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user?.id,
    user?.username,
    user?.firstName,
    user?.lastName,
    userProfileUsername,
    userProfileFirstName,
    userProfileLastName,
    userProfileBirthDate,
    userProfileCountry,
    hasUserInteracted,
  ]);

  // Update original values only on initial load (before user interaction)
  // Don't update when getUserProfile changes after saves - let explicit save handle it
  useEffect(() => {
    if (getUserProfile && !hasUserInteracted) {
      const lowerUsername = (
        userProfileUsername ||
        user?.username ||
        ""
      ).toLowerCase();
      setOriginalUsername(lowerUsername);
      setOriginalFirstName(userProfileFirstName || user?.firstName || "");
      setOriginalLastName(userProfileLastName || user?.lastName || "");
      setOriginalBirthDate(userProfileBirthDate || "");
      setOriginalCountry(userProfileCountry || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userProfileUsername,
    userProfileFirstName,
    userProfileLastName,
    userProfileBirthDate,
    userProfileCountry,
    user?.id,
    user?.username,
    user?.firstName,
    user?.lastName,
    hasUserInteracted,
  ]);

  // Set initial avatar from Clerk
  useEffect(() => {
    if (user?.imageUrl && !originalAvatarUrl) {
      setOriginalAvatarUrl(user.imageUrl);
    }
  }, [user?.imageUrl, originalAvatarUrl]);

  // Set initial avatar from Clerk
  useEffect(() => {
    if (user?.imageUrl && !avatarUrl) {
      setAvatarUrl(user.imageUrl);
    }
  }, [user?.imageUrl, avatarUrl]);

  // Initialize selected country when country value changes
  useEffect(() => {
    if (country && !selectedCountry) {
      // Find the country object by alpha3 code
      const countryData = countries.all.find(
        (c: Country) => c.alpha3 === country,
      );
      if (countryData) {
        setSelectedCountry(countryData);
      }
    }
  }, [country, selectedCountry]);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setCountry(country.alpha3);
    setHasUserInteracted(true);
    setCountryError("");

    const validation = countrySchema.safeParse(country.alpha3);
    if (!validation.success) {
      setCountryError(validation.error.issues[0].message);
    }
  };

  const handleBirthDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format date in local time to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      setBirthDate(formattedDate);
      setHasUserInteracted(true);
      setBirthDateError("");

      const validation = birthDateSchema.safeParse(formattedDate);
      if (!validation.success) {
        setBirthDateError(validation.error.issues[0].message);
      }
    }
    setCalendarOpen(false);
  };

  const handleDiscardChanges = () => {
    setShowDiscardDialog(true);
  };

  const confirmDiscard = () => {
    // Restore username
    setUsername(originalUsername);
    setUsernameError("");

    // Restore firstName
    setFirstName(originalFirstName);
    setFirstNameError("");

    // Restore lastName
    setLastName(originalLastName);
    setLastNameError("");

    // Restore birthDate
    setBirthDate(originalBirthDate);
    setBirthDateError("");

    // Restore country
    setCountry(originalCountry);
    setCountryError("");
    // Find and set the selected country object if country exists
    if (originalCountry) {
      const countryData = countries.all.find(
        (c: Country) => c.alpha3 === originalCountry,
      );
      setSelectedCountry(countryData);
    } else {
      setSelectedCountry(undefined);
    }

    // Restore avatar
    // Revoke any blob URL before setting new one to prevent memory leaks
    if (avatarUrl.startsWith("blob:")) {
      URL.revokeObjectURL(avatarUrl);
    }
    setAvatarUrl(originalAvatarUrl);
    setAvatarDataUri("");
    setCustomAvatarFile(null);

    setHasUserInteracted(true);
    setShowDiscardDialog(false);
  };

  const cancelDiscard = () => {
    setShowDiscardDialog(false);
  };

  // Check if there are any changes to discard
  const hasChanges =
    username !== originalUsername ||
    firstName !== originalFirstName ||
    lastName !== originalLastName ||
    birthDate !== originalBirthDate ||
    country !== originalCountry ||
    avatarUrl !== originalAvatarUrl;

  const handleAvatarSelect = (dataUri: string) => {
    // Store the data URI for display and upload later when user clicks Continue
    setAvatarDataUri(dataUri);
    setAvatarUrl(dataUri);
  };

  // Helper function to upload avatar to Convex storage
  const uploadAvatarToStorage = async (dataUri: string): Promise<string> => {
    const blob = dataUriToBlob(dataUri);
    const mimeType = blob.type;

    // Generate upload URL
    const uploadUrl = await generateUploadUrl();

    // Upload file to Convex storage
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": mimeType },
      body: blob,
    });

    if (!result.ok) {
      throw new Error("Upload failed");
    }

    const { storageId } = await result.json();

    // Get the file URL from storage
    const fileUrl = await getAvatarUrl({
      storageId: storageId as Id<"_storage">,
    });

    return fileUrl;
  };

  const handleCustomUpload = () => {
    fileInputRef.current?.click();
  };

  // Auto-save removed - username will only save when user clicks "Save Changes"

  // Initial database setup on mount - only if profile doesn't exist
  // Only run once and only if profile is confirmed to not exist (null, not just undefined)
  useEffect(() => {
    // Skip if:
    // - No user or username
    // - Query is still loading (undefined)
    // - Profile already exists (not null)
    // Only proceed when getUserProfile is exactly null (confirmed no profile exists)
    if (!user || !username || profileIsLoading || profileExists) return;

    const setupInitialProfile = async () => {
      try {
        // Only create/update database profile if it doesn't exist
        // Don't include firstName/lastName here - they'll be set when user saves
        await upsertUserProfile({
          username,
          avatarUrl: user.imageUrl || "",
          isProfileComplete: false,
        });
      } catch (error) {
        console.error("Failed to setup initial profile:", error);
      }
    };

    setupInitialProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, username, profileIsLoading, profileExists]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Define allowed image types (excluding SVG and other unsupported formats)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    // Get file extension as fallback for MIME type validation
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf("."));
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    // Validate file type
    const isValidMimeType =
      file.type && allowedTypes.includes(file.type.toLowerCase());
    const isValidExtension = allowedExtensions.includes(fileExtension);

    if (!isValidMimeType && !isValidExtension) {
      if (file.type === "image/svg+xml" || fileExtension === ".svg") {
        toast.error(
          "SVG files are not supported. Please use JPG, PNG, GIF, or WebP.",
        );
      } else {
        toast.error(
          "Unsupported file type. Please use JPG, PNG, GIF, or WebP format.",
        );
      }
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Store the file for later upload when user clicks Save Changes
    setCustomAvatarFile(file);
    // Clear any avatar data URI since we're using a custom upload
    setAvatarDataUri("");

    // Create a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    setHasUserInteracted(true);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContinue = async () => {
    if (!user) return;

    // Validate all fields before continuing
    if (!username) {
      toast.error("Please enter a username");
      return;
    }

    if (usernameError) {
      toast.error(usernameError);
      return;
    }

    // Validate other fields
    if (firstName) {
      const firstNameValidation = nameSchema.safeParse(firstName);
      if (!firstNameValidation.success) {
        setFirstNameError(firstNameValidation.error.issues[0].message);
        toast.error(firstNameValidation.error.issues[0].message);
        return;
      }
    }

    if (lastName) {
      const lastNameValidation = nameSchema.safeParse(lastName);
      if (!lastNameValidation.success) {
        setLastNameError(lastNameValidation.error.issues[0].message);
        toast.error(lastNameValidation.error.issues[0].message);
        return;
      }
    }

    if (birthDate) {
      const birthDateValidation = birthDateSchema.safeParse(birthDate);
      if (!birthDateValidation.success) {
        setBirthDateError(birthDateValidation.error.issues[0].message);
        toast.error(birthDateValidation.error.issues[0].message);
        return;
      }
    }

    if (country) {
      const countryValidation = countrySchema.safeParse(country);
      if (!countryValidation.success) {
        setCountryError(countryValidation.error.issues[0].message);
        toast.error(countryValidation.error.issues[0].message);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Update Clerk username if it differs from the current username
      if (username && username !== user.username) {
        try {
          await changeUsername(username);
        } catch (error) {
          if (
            isClerkRuntimeError(error) &&
            isReverificationCancelledError(error)
          ) {
            return;
          }

          console.error("Failed to update Clerk username:", error);
          toast.error("Failed to update username. Please try again.");
          return;
        }
      }

      // Update Clerk firstName and lastName if they differ from current values
      const firstNameChanged = firstName !== (user.firstName || "");
      const lastNameChanged = lastName !== (user.lastName || "");
      if (firstNameChanged || lastNameChanged) {
        try {
          await user.update({
            firstName: firstName || undefined,
            lastName: lastName || undefined,
          });
        } catch (error) {
          console.error("Failed to update Clerk name:", error);
          toast.error("Failed to update name. Please try again.");
          return;
        }
      }

      // Upload avatar to Convex storage if a new avatar was selected
      let finalAvatarUrl = avatarUrl;

      // Check if avatar is a data URI (from AvatarSelector)
      if (avatarDataUri && avatarDataUri.startsWith("data:")) {
        try {
          finalAvatarUrl = await uploadAvatarToStorage(avatarDataUri);

          // Convert avatar to PNG for Clerk (Clerk doesn't support SVG)
          const blob = dataUriToBlob(avatarDataUri);
          let clerkBlob = blob;

          // If it's SVG, convert to PNG
          if (blob.type === "image/svg+xml") {
            clerkBlob = await convertSvgToPng(avatarDataUri);
          }

          // Update Clerk profile image
          await user.setProfileImage({ file: clerkBlob });

          // Update Convex database
          await updateAvatar({ avatarUrl: finalAvatarUrl });
        } catch (error) {
          console.error("Error uploading avatar:", error);
          toast.error("Failed to upload profile picture. Please try again.");
          return;
        }
      } else if (customAvatarFile) {
        // Handle custom file upload
        try {
          // Generate upload URL
          const uploadUrl = await generateUploadUrl();

          // Upload file to Convex storage
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": customAvatarFile.type },
            body: customAvatarFile,
          });

          if (!result.ok) {
            throw new Error("Upload failed");
          }

          const { storageId } = await result.json();

          // Get the file URL from storage
          finalAvatarUrl = await getAvatarUrl({
            storageId: storageId as Id<"_storage">,
          });

          // Update Clerk profile image
          await user.setProfileImage({ file: customAvatarFile });

          // Update Convex database
          await updateAvatar({ avatarUrl: finalAvatarUrl });

          // Clear the custom file since it's been uploaded
          setCustomAvatarFile(null);
          // Revoke the preview URL to free memory
          if (avatarUrl.startsWith("blob:")) {
            URL.revokeObjectURL(avatarUrl);
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
          toast.error("Failed to upload profile picture. Please try again.");
          return;
        }
      }

      // Mark profile as complete
      await upsertUserProfile({
        isProfileComplete: true,
        avatarUrl: finalAvatarUrl,
        username,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        birthDate: birthDate || undefined,
        country: country || undefined,
      });

      // Update original values after successful save
      setOriginalUsername(username);
      setOriginalFirstName(firstName || "");
      setOriginalLastName(lastName || "");
      setOriginalBirthDate(birthDate || "");
      setOriginalCountry(country || "");
      setOriginalAvatarUrl(finalAvatarUrl);
      // Update avatarUrl to the final uploaded URL (not preview blob)
      setAvatarUrl(finalAvatarUrl);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user && isLoaded) {
    router.push("/sign-in");
    return null;
  }

  return (
    <>
      <AuthLoading>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AuthLoading>
      <Authenticated>
        <div className="bg-background flex items-center justify-center p-4 min-h-[calc(100vh-64px)]">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Complete Your Profile</h1>
              <p className="text-muted-foreground mt-2">
                Personalize your MediaFlix experience by setting up your profile
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Set up your username and basic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  {/* Profile Picture Section */}
                  <div className="space-y-2">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center gap-4">
                        <Label className="text-base font-medium">
                          Profile Picture
                        </Label>
                        <div className="relative">
                          <Avatar className="h-24 w-24 border border-border ring ring-muted">
                            <AvatarImage
                              src={avatarUrl}
                              alt={user?.fullName || "User"}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-muted">
                              <User className="h-10 w-10 text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCustomUpload}
                        className="w-full"
                      >
                        <Upload className="size-4" />
                        Upload Custom Avatar
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      JPG, PNG, GIF, or WebP • Max 5MB
                    </p>
                  </div>

                  {/* Username Section */}
                  <UsernameInput
                    value={username}
                    onChange={handleUsernameChange}
                    error={usernameError}
                    onErrorChange={setUsernameError}
                    onInteraction={() => setHasUserInteracted(true)}
                  />

                  {/* Name Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NameInput
                      id="firstName"
                      label="First Name"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      error={firstNameError}
                      onErrorChange={setFirstNameError}
                      onInteraction={() => setHasUserInteracted(true)}
                      placeholder="Enter your first name"
                    />
                    <NameInput
                      id="lastName"
                      label="Last Name"
                      value={lastName}
                      onChange={handleLastNameChange}
                      error={lastNameError}
                      onErrorChange={setLastNameError}
                      onInteraction={() => setHasUserInteracted(true)}
                      placeholder="Enter your last name"
                    />
                  </div>

                  {/* Birth Date Section */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="birthDate"
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !birthDate && "text-muted-foreground"
                          } ${birthDateError ? "border-red-500" : ""}`}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {birthDate ? (
                            (() => {
                              // Parse date string as local time to avoid timezone issues
                              const [year, month, day] = birthDate
                                .split("-")
                                .map(Number);
                              return new Date(
                                year,
                                month - 1,
                                day,
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              });
                            })()
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            birthDate
                              ? (() => {
                                  // Parse date string as local time to avoid timezone issues
                                  const [year, month, day] = birthDate
                                    .split("-")
                                    .map(Number);
                                  return new Date(year, month - 1, day);
                                })()
                              : undefined
                          }
                          onSelect={handleBirthDateSelect}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          autoFocus
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    {birthDateError && (
                      <p className="text-xs text-red-500">{birthDateError}</p>
                    )}
                  </div>

                  {/* Location Section */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <CountryDropdown
                      onChange={handleCountryChange}
                      defaultValue={country}
                      placeholder="Select your country"
                    />
                    {countryError && (
                      <p className="text-xs text-red-500">{countryError}</p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 mt-auto">
                    {hasChanges && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDiscardChanges}
                          className="w-full"
                        >
                          <Undo2 className="size-4!" />
                          Discard Changes
                        </Button>
                      </div>
                    )}
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleContinue}
                      disabled={
                        !username ||
                        !!usernameError ||
                        !!firstNameError ||
                        !!lastNameError ||
                        !!birthDateError ||
                        !!countryError ||
                        isSubmitting
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4! animate-spin" />
                          Saving changes...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column - Avatar Selection */}
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Choose Your Avatar</CardTitle>
                  <CardDescription>
                    Select from our collection of pre-made avatars
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <AvatarSelector
                    selectedAvatar={avatarUrl}
                    onAvatarSelectAction={handleAvatarSelect}
                    firstName={firstName}
                    lastName={lastName}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Discard Changes Confirmation Dialog */}
            <Dialog
              open={showDiscardDialog}
              onOpenChange={setShowDiscardDialog}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Discard Changes?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to discard all your changes? This will
                    restore all fields to their last saved versions.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelDiscard}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={confirmDiscard}
                    variant="destructive"
                  >
                    Discard Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Authenticated>
    </>
  );
}
