# Sizzlematch Architecture

## Overview

Sizzlematch is a React Native application built with Expo that connects solo travelers in Mallorca based on overlapping travel dates. The application uses a modular architecture to ensure scalability and maintainability.

## Directory Structure

The application follows a feature-based directory structure that organizes code by functionality:

```
src/
├── components/     # Reusable UI components
├── config/         # Configuration files (e.g., Firebase)
├── navigation/     # Navigation-related files
├── screens/        # Screen components
├── services/       # Service layer for API interactions
└── utils/          # Utility functions and helpers
```

## Key Files

### App.js

**Purpose**: The entry point of the application that sets up the root component.

**Responsibilities**:
- Initializes the app container
- Wraps the application with necessary providers (SafeAreaProvider)
- Sets up the status bar configuration
- Loads the main navigation structure

### src/navigation/AppNavigator.js

**Purpose**: Configures and manages the application's navigation flow.

**Responsibilities**:
- Defines the navigation container and stack navigator
- Sets up screen transitions and navigation options
- Configures common header styling across the app
- Registers screens within the navigation stack

### src/screens/HomeScreen.js

**Purpose**: Implements the initial welcome screen of the application.

**Responsibilities**:
- Renders the welcome message and introduction
- Provides the first visual touchpoint for users
- Demonstrates the app's branding through styling

### src/utils/toast.js

**Purpose**: Provides a standardized way to display toast notifications throughout the app.

**Responsibilities**:
- Encapsulates toast notification logic
- Provides consistent styling based on notification type (success, error, warning)
- Standardizes duration and appearance of notifications

## Design Patterns

1. **Component-Based Architecture**: UI elements are broken down into reusable components to maximize code reuse and maintainability.

2. **Container/Presenter Pattern**: Screen components focus on presentation while logic will be extracted to custom hooks or service files.

3. **Centralized Navigation**: All navigation logic is centralized in the AppNavigator to provide a single source of truth for the app's flow.

4. **Utility Abstraction**: Common functionality like toast notifications is abstracted into utility files to ensure consistent implementation across the app.

## Future Considerations

As the application grows, this architecture will support:
- Integration with Firebase for authentication and data storage
- Addition of new screens for user profiles, swiping, and chat
- Implementation of state management for user data
- Real-time features for matching and messaging
