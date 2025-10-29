# Profile Personalization System

This document describes the user profile personalization system implemented in MediaFlix.

## Overview

The system allows users to personalize their profiles by:

- Setting a custom username
- Using their Clerk-managed profile picture
- Tracking profile completion status

## Components

### 1. Profile Setup Page (`/profile-setup`)

- **Route**: `/app/(auth)/profile-setup/page.tsx`
- **Purpose**: First-time profile setup for new users
- **Features**:
  - Username selection with availability checking
  - Profile picture display (managed by Clerk)
  - Skip option for users who want to complete setup later

### 2. Profile Manager Component

- **File**: `/components/ProfileManager.tsx`
- **Purpose**: Edit profile from the header
- **Features**:
  - Username editing
  - Real-time username availability checking
  - Profile picture display

### 3. Profile Completion Wrapper

- **File**: `/components/ProfileCompletionWrapper.tsx`
- **Purpose**: Automatically redirects users to profile setup if not completed
- **Usage**: Wraps the main site layout

## Database Schema

### User Profiles Table

```typescript
userProfiles: {
  userId: string,           // Clerk user ID
  username?: string,        // Custom username
  avatarUrl?: string,       // Profile picture URL
  isProfileComplete: boolean,
  profileSetupCompletedAt?: number,
  createdAt: number,
  updatedAt: number,
}
```

## Convex Functions

### Queries

- `getUserProfile()` - Get current user's profile
- `isUsernameAvailable(username)` - Check if username is available

### Mutations

- `upsertUserProfile(data)` - Create or update user profile
- `markProfileComplete()` - Mark profile as complete

## Integration with Clerk

The system integrates with Clerk for:

- User authentication
- Profile picture management
- Username updates
- User metadata

## Usage

### For New Users

1. User signs up through Clerk
2. System automatically redirects to `/profile-setup`
3. User can set username and complete profile
4. User is redirected to main app

### For Existing Users

1. Users can edit their profile via the "Edit Profile" button in the header
2. Changes are synced with both Clerk and Convex database
3. Username availability is checked in real-time

## Customization

The profile system can be extended by:

- Adding more profile fields to the schema
- Creating additional profile management pages
- Implementing profile preferences
- Adding profile completion badges or indicators

## Security

- All profile operations require authentication
- Username availability is checked server-side
- Profile data is stored securely in Convex
- Clerk handles profile picture security
