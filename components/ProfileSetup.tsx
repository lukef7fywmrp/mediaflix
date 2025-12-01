import { useReverification, useUser } from "@clerk/nextjs";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/nextjs/errors";
import { useMutation, useQuery } from "convex/react";
import { countries } from "country-data-list";
import {
  Calendar as CalendarIcon,
  Film,
  Info,
  Loader2,
  Tv,
  Upload,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import AvatarSelector from "@/components/AvatarSelector";
import { GenreCheckboxItem } from "@/components/GenreCheckboxItem";
import { LanguageMultiSelect } from "@/components/LanguageMultiSelect";
import { NameInput } from "@/components/NameInput";
import { UsernameInput } from "@/components/UsernameInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  type Country,
  CountryDropdown,
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
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import useGetGenres from "@/hooks/useGetGenres";
import useGetLanguages from "@/hooks/useGetLanguages";
import { convertSvgToPng, dataUriToBlob } from "@/lib/utils";
import { birthDateSchema, countrySchema, nameSchema } from "@/lib/validation";

export default function ProfileSetup() {
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

  // Preferences state
  const [favoriteMovieGenres, setFavoriteMovieGenres] = useState<string[]>([]);
  const [favoriteTVGenres, setFavoriteTVGenres] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<boolean>(true);

  // Fade effects for scrollable genre lists
  const [showMovieGenresFade, setShowMovieGenresFade] = useState(false);
  const [showTVGenresFade, setShowTVGenresFade] = useState(false);
  const movieGenresScrollRef = useRef<HTMLDivElement>(null);
  const tvGenresScrollRef = useRef<HTMLDivElement>(null);

  const [originalUsername, setOriginalUsername] = useState<string>("");
  const [originalFirstName, setOriginalFirstName] = useState<string>("");
  const [originalLastName, setOriginalLastName] = useState<string>("");
  const [originalBirthDate, setOriginalBirthDate] = useState<string>("");
  const [originalCountry, setOriginalCountry] = useState<string>("");
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState<string>("");
  const [originalFavoriteMovieGenres, setOriginalFavoriteMovieGenres] =
    useState<string[]>([]);
  const [originalFavoriteTVGenres, setOriginalFavoriteTVGenres] = useState<
    string[]
  >([]);
  const [originalLanguages, setOriginalLanguages] = useState<string[]>([]);
  const [originalNotifications, setOriginalNotifications] =
    useState<boolean>(true);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUserProfile = useQuery(api.userProfiles.getUserProfile);
  const upsertUserProfile = useMutation(api.userProfiles.upsertUserProfile);
  const updateAvatar = useMutation(api.userProfiles.updateAvatar);
  const generateUploadUrl = useMutation(api.userProfiles.generateUploadUrl);
  const getAvatarUrl = useMutation(api.userProfiles.getAvatarUrl);

  // Fetch genres and languages from TMDB
  const { data: genresData, isLoading: isLoadingGenres } = useGetGenres();
  const { data: languagesData, isLoading: isLoadingLanguages } =
    useGetLanguages();

  // Extract stable values from getUserProfile for useEffect dependencies
  const userProfileUsername = getUserProfile?.username;
  const userProfileFirstName = getUserProfile?.firstName;
  const userProfileLastName = getUserProfile?.lastName;
  const userProfileBirthDate = getUserProfile?.birthDate;
  const userProfileCountry = getUserProfile?.country;
  const userProfilePreferences = getUserProfile?.preferences;
  const userProfileFavoriteGenres = userProfilePreferences?.favoriteGenres;
  const userProfileFavoriteMovieGenres = userProfileFavoriteGenres?.movies;
  const userProfileFavoriteTVGenres = userProfileFavoriteGenres?.tv;
  const userProfileLanguage = userProfilePreferences?.language;
  const userProfileLanguages = useMemo(() => {
    if (Array.isArray(userProfileLanguage)) {
      return userProfileLanguage;
    }
    if (userProfileLanguage) {
      return [userProfileLanguage];
    }
    return [];
  }, [userProfileLanguage]);
  const userProfileNotifications = userProfilePreferences?.notifications;

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

        // Set preferences
        setFavoriteMovieGenres(userProfileFavoriteMovieGenres || []);
        setFavoriteTVGenres(userProfileFavoriteTVGenres || []);
        setLanguages(userProfileLanguages || []);
        setNotifications(userProfileNotifications ?? true);

        setOriginalFavoriteMovieGenres(userProfileFavoriteMovieGenres || []);
        setOriginalFavoriteTVGenres(userProfileFavoriteTVGenres || []);
        setOriginalLanguages(userProfileLanguages || []);
        setOriginalNotifications(userProfileNotifications ?? true);
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
    userProfileFavoriteMovieGenres,
    userProfileFavoriteTVGenres,
    userProfileLanguages,
    userProfileNotifications,
    hasUserInteracted,
    getUserProfile,
    user,
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
      setOriginalFavoriteMovieGenres(userProfileFavoriteMovieGenres || []);
      setOriginalFavoriteTVGenres(userProfileFavoriteTVGenres || []);
      setOriginalLanguages(userProfileLanguages || []);
      setOriginalNotifications(userProfileNotifications ?? true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userProfileUsername,
    userProfileFirstName,
    userProfileLastName,
    userProfileBirthDate,
    userProfileCountry,
    userProfileFavoriteMovieGenres,
    userProfileFavoriteTVGenres,
    userProfileLanguages,
    userProfileNotifications,
    user?.username,
    user?.firstName,
    user?.lastName,
    hasUserInteracted,
    getUserProfile,
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

  const handleUsernameChange = useCallback(
    (value: string) => {
      setUsername(value);
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }
    },
    [hasUserInteracted],
  );

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

  const handleLanguagesChange = (newLanguages: string[]) => {
    setLanguages(newLanguages);
    setHasUserInteracted(true);
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

    // Restore preferences
    setFavoriteMovieGenres(originalFavoriteMovieGenres);
    setFavoriteTVGenres(originalFavoriteTVGenres);
    setLanguages(originalLanguages);
    setNotifications(originalNotifications);

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
    avatarUrl !== originalAvatarUrl ||
    JSON.stringify([...favoriteMovieGenres].sort()) !==
      JSON.stringify([...originalFavoriteMovieGenres].sort()) ||
    JSON.stringify([...favoriteTVGenres].sort()) !==
      JSON.stringify([...originalFavoriteTVGenres].sort()) ||
    JSON.stringify([...languages].sort()) !==
      JSON.stringify([...originalLanguages].sort()) ||
    notifications !== originalNotifications;

  const handleAvatarSelect = useCallback((dataUri: string) => {
    // Store the data URI for display and upload later when user clicks Continue
    setAvatarDataUri(dataUri);
    setAvatarUrl(dataUri);
  }, []);

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
  }, [
    user?.id,
    username,
    profileIsLoading,
    profileExists,
    upsertUserProfile,
    user,
  ]);

  // Handle scroll for movie genres fade
  const handleMovieGenresScroll = () => {
    if (movieGenresScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        movieGenresScrollRef.current;
      if (scrollHeight > clientHeight) {
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        setShowMovieGenresFade(isAtTop && !isAtBottom);
      } else {
        setShowMovieGenresFade(false);
      }
    }
  };

  // Handle scroll for TV genres fade
  const handleTVGenresScroll = () => {
    if (tvGenresScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        tvGenresScrollRef.current;
      if (scrollHeight > clientHeight) {
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        setShowTVGenresFade(isAtTop && !isAtBottom);
      } else {
        setShowTVGenresFade(false);
      }
    }
  };

  // Initial check for scrollability and fade visibility
  useEffect(() => {
    if (movieGenresScrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } =
        movieGenresScrollRef.current;
      if (scrollHeight > clientHeight) {
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        setShowMovieGenresFade(isAtTop && !isAtBottom);
      } else {
        setShowMovieGenresFade(false);
      }
    }
    if (tvGenresScrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } =
        tvGenresScrollRef.current;
      if (scrollHeight > clientHeight) {
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        setShowTVGenresFade(isAtTop && !isAtBottom);
      } else {
        setShowTVGenresFade(false);
      }
    }
  }, []);

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
      if (avatarDataUri?.startsWith("data:")) {
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
        preferences: {
          favoriteGenres:
            favoriteMovieGenres.length > 0 || favoriteTVGenres.length > 0
              ? {
                  movies:
                    favoriteMovieGenres.length > 0
                      ? favoriteMovieGenres
                      : undefined,
                  tv:
                    favoriteTVGenres.length > 0 ? favoriteTVGenres : undefined,
                }
              : undefined,
          language: languages.length > 0 ? languages : undefined,
          notifications: notifications,
        },
      });

      // Update original values after successful save
      setOriginalUsername(username);
      setOriginalFirstName(firstName || "");
      setOriginalLastName(lastName || "");
      setOriginalBirthDate(birthDate || "");
      setOriginalCountry(country || "");
      setOriginalAvatarUrl(finalAvatarUrl);
      setOriginalFavoriteMovieGenres(favoriteMovieGenres);
      setOriginalFavoriteTVGenres(favoriteTVGenres);
      setOriginalLanguages(languages);
      setOriginalNotifications(notifications);
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
    <div
      className={`bg-background flex items-center justify-center p-4 min-h-[calc(100vh-64px)] py-14 pb-22`}
    >
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Personalize your MediaFlix experience by setting up your profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Set up your username and basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your viewing preferences and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive updates about new content and recommendations
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={(checked) => {
                      setNotifications(checked);
                      setHasUserInteracted(true);
                    }}
                  />
                </div>

                {/* Language Preference */}
                <LanguageMultiSelect
                  id="language"
                  label="Preferred Languages"
                  description="Select languages for movies and TV shows you'd like to see recommended"
                  languages={languages}
                  onLanguagesChange={handleLanguagesChange}
                  languagesData={languagesData}
                  isLoading={isLoadingLanguages}
                  onInteraction={() => setHasUserInteracted(true)}
                />

                {/* Favorite Genres */}
                <div className="space-y-4 mt-6">
                  <div className="space-y-0.5">
                    <Label>Favorite Genres</Label>
                    <p className="text-xs text-muted-foreground">
                      Select your favorite genres for personalized
                      recommendations
                    </p>
                  </div>

                  {isLoadingGenres ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      {/* Movie Genres */}
                      <div className="space-y-2">
                        <div className="relative border rounded-md overflow-hidden">
                          <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-muted/50">
                            <Film className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-[13px] font-medium">
                              Movies
                            </Label>
                          </div>
                          <div
                            ref={movieGenresScrollRef}
                            onScroll={handleMovieGenresScroll}
                            className="max-h-32 overflow-y-auto p-3 space-y-2"
                          >
                            {genresData?.movieGenres.map((genre) => (
                              <GenreCheckboxItem
                                key={genre.id}
                                id={genre.id.toString()}
                                name={genre.name}
                                checked={favoriteMovieGenres.includes(
                                  genre.name,
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFavoriteMovieGenres([
                                      ...favoriteMovieGenres,
                                      genre.name,
                                    ]);
                                  } else {
                                    setFavoriteMovieGenres(
                                      favoriteMovieGenres.filter(
                                        (g) => g !== genre.name,
                                      ),
                                    );
                                  }
                                  setHasUserInteracted(true);
                                }}
                                prefix="genre-movie-"
                              />
                            ))}
                          </div>
                          {/* Fade element */}
                          <div
                            className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/60 via-background/30 to-transparent pointer-events-none transition-opacity duration-300 rounded-b-md ${
                              showMovieGenresFade ? "opacity-100" : "opacity-0"
                            }`}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2 min-h-[24px] items-center">
                          {favoriteMovieGenres.length > 0 ? (
                            favoriteMovieGenres.map((genreName) => (
                              <Badge
                                key={`movie-${genreName}`}
                                variant="secondary"
                                className="text-xs py-0.5 flex items-center gap-1"
                              >
                                {genreName}
                                <button
                                  type="button"
                                  className="ml-px cursor-pointer hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-ring rounded-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFavoriteMovieGenres(
                                      favoriteMovieGenres.filter(
                                        (g) => g !== genreName,
                                      ),
                                    );
                                    setHasUserInteracted(true);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              No movie genres selected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* TV Genres */}
                      <div className="space-y-2">
                        <div className="relative border rounded-md overflow-hidden">
                          <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-muted/50">
                            <Tv className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-[13px] font-medium">
                              TV Shows
                            </Label>
                          </div>
                          <div
                            ref={tvGenresScrollRef}
                            onScroll={handleTVGenresScroll}
                            className="max-h-32 overflow-y-auto p-3 space-y-2"
                          >
                            {genresData?.tvGenres.map((genre) => (
                              <GenreCheckboxItem
                                key={genre.id}
                                id={genre.id.toString()}
                                name={genre.name}
                                checked={favoriteTVGenres.includes(genre.name)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFavoriteTVGenres([
                                      ...favoriteTVGenres,
                                      genre.name,
                                    ]);
                                  } else {
                                    setFavoriteTVGenres(
                                      favoriteTVGenres.filter(
                                        (g) => g !== genre.name,
                                      ),
                                    );
                                  }
                                  setHasUserInteracted(true);
                                }}
                                prefix="genre-tv-"
                              />
                            ))}
                          </div>
                          {/* Fade element */}
                          <div
                            className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/60 via-background/30 to-transparent pointer-events-none transition-opacity duration-300 rounded-b-md ${
                              showTVGenresFade ? "opacity-100" : "opacity-0"
                            }`}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2 min-h-[24px] items-center">
                          {favoriteTVGenres.length > 0 ? (
                            favoriteTVGenres.map((genreName) => (
                              <Badge
                                key={`tv-${genreName}`}
                                variant="secondary"
                                className="text-xs py-0.5 flex items-center gap-1"
                              >
                                {genreName}
                                <button
                                  type="button"
                                  className="ml-px cursor-pointer hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-ring rounded-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFavoriteTVGenres(
                                      favoriteTVGenres.filter(
                                        (g) => g !== genreName,
                                      ),
                                    );
                                    setHasUserInteracted(true);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              No tv genres selected
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Avatar Selection */}
          <Card className="flex flex-col h-fit">
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

        {/* Fixed Bottom Action Bar */}
        {hasChanges && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-51 animate-in slide-in-from-bottom duration-300">
            <div className="max-w-6xl mx-auto p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span className="text-sm font-medium">Unsaved changes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDiscardChanges}
                    size="sm"
                  >
                    Discard
                  </Button>
                  <Button
                    type="button"
                    onClick={handleContinue}
                    size="sm"
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
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Discard Changes Confirmation Dialog */}
        <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Discard Changes?</DialogTitle>
              <DialogDescription>
                Are you sure you want to discard all your changes? This will
                restore all fields to their last saved versions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={cancelDiscard}>
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
  );
}
