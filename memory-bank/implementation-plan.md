Sizzlematch Implementation Plan 

This plan outlines the step-by-step process to build the core features of the Sizzlematch app: authentication, user profiles in Firestore, and basic UI screens for swiping and chatting. The app targets solo travelers in Mallorca, matching them based on overlapping travel dates and heterosexual preferences. Each step should be completed and thoroughly tested before moving to the next step.

Step 1: Set Up the React Native Project with Expo 
Task: Initialize the project environment. 
Instructions: 
- Install React Navigation for screen management: npm install @react-navigation/native @react-navigation/stack. 
- Install Expo-specific dependencies: expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context. 
- Install expo-toast for notifications: expo install expo-toast.
Test: 
- Start the app with expo start. 
- Open it on an iOS/Android simulator or scan the QR code with the Expo Go app on a physical device. 
- Confirm the app launches and displays the default Expo welcome screen without errors. 

Step 2: Configure Firebase 
Task: Integrate Firebase into the app. 
Instructions: 
- Visit the Firebase Console and click "Add project." 
- Name it "Sizzlematch" and complete the setup process. 
- Enable Authentication, Firestore Database, and Cloud Storage in the Firebase console. 
- In the Firebase project settings, locate the Firebase config object (e.g., apiKey, authDomain). 
- Install expo-dotenv for environment variables: npm install expo-dotenv. 
- Create a .env file in the project root and add the Firebase config (e.g., FIREBASE_API_KEY=your_key). 
- Create src/config/firebase.js, import dotenv, and define the config using environment variables. 
Test: 
- In src/config/firebase.js, add a console.log to output the Firebase config values. 
- Run the app and check the console to ensure the config loads correctly (values appear, no undefined errors). 
- Ensure sensitive keys are not hardcoded in the source code. 

Step 3: Implement Email/Password Authentication 
Task: Set up email/password authentication.
Instructions: 
- In the Firebase console, under Authentication, enable Email/Password sign-in method.
- Install Firebase SDK: npm install firebase. 
- Create src/services/auth.js to manage authentication logic. 
- In auth.js, implement functions for: 
  - Email/password sign-up.
  - Email/password login.
  - Logout.
- Create src/screens/Login.js with email/password input fields.
- Create src/screens/SignUp.js with similar fields for new users. 
- Create custom UI components for inputs, buttons, and forms rather than using external UI libraries.
Test: 
- From SignUp.js, sign up with a test email (e.g., test@example.com) and password. 
- Log in with the same credentials from Login.js. 
- Verify redirection to a blank screen (to be replaced later) after login/signup. 
- Test error cases (wrong password, invalid email) and confirm toast notifications appear.

Step 4: Set Up Firestore for User Profiles 
Task: Define and manage user profile data. 
Instructions: 
- In the Firebase console, navigate to Firestore and create a collection named users. 
- Define the user profile schema with these fields: 
  - uid (string): User's Firebase UID. 
  - name (string): User's name or nickname. 
  - age (number): User's age (18-30). 
  - gender (string): "male" or "female". 
  - travelDates (object): { arrival: timestamp, departure: timestamp } using Firebase Timestamp. 
  - bio (string): Optional short description. 
  - profilePicture (string): URL to the user's image. 
- In src/services/user.js, create functions to: 
  - Save a new profile to Firestore. 
  - Retrieve a profile by UID. 
  - Update an existing profile. 
- Create utility functions to handle error cases with toast notifications.
Test: 
- After signing up a test user, manually call the save function with sample data (e.g., name: "Alex", age: 25). 
- Retrieve the profile using the UID and log it to the console. 
- Confirm all fields (including timestamps) are stored and retrieved correctly in Firestore. 
- Test error handling by temporarily disabling network connectivity.

Step 5: Implement Cloud Storage for Profile Pictures
Task: Set up Firebase Cloud Storage for image uploads.
Instructions:
- Configure Firebase Cloud Storage security rules to allow authenticated users to upload images.
- Create src/services/storage.js with functions to:
  - Upload images to Firebase Cloud Storage.
  - Get download URLs for uploaded images.
  - Delete images when profiles are updated or deleted.
- Implement error handling with toast notifications for upload failures.
Test:
- Upload a test image to a profilePictures/{uid} path.
- Retrieve the download URL and verify the image loads correctly.
- Test error cases such as large file uploads or network interruptions.

Step 6: Implement Profile Creation Screen 
Task: Build a screen for users to set up their profiles. 
Instructions: 
- Create src/screens/ProfileCreation.js with custom UI components.
- Add form inputs for: name, age, gender (dropdown: male/female), travel dates (arrival/departure pickers), and bio (textarea). 
- Install expo-image-picker: expo install expo-image-picker. 
- Add a button to select a profile picture using expo-image-picker. 
- Upload the selected image to Firebase Cloud Storage under profilePictures/{uid} using the storage service created in Step 5.
- On form submission, save the profile data (including the image URL) to Firestore using the function from Step 4. 
- Redirect to a placeholder swiping screen after submission. 
- Display toast notifications for success/failure states.
Test: 
- Sign in, navigate to ProfileCreation.js, and fill out the form (e.g., arrival: tomorrow, departure: 3 days later). 
- Upload a test image from your device/simulator. 
- Submit the form and check Firestore to confirm the profile data and image URL are saved. 
- Verify the image appears in Cloud Storage under the correct path. 
- Test form validation and ensure appropriate toast error messages appear for invalid inputs.

Step 7: Implement the Swiping Screen 
Task: Display profiles for swiping based on matching criteria. 
Instructions: 
- Create src/screens/Swipe.js with custom UI components.
- In src/services/matching.js, write a query to fetch users where: 
  - gender is opposite to the current user's. 
  - travelDates.arrival is before the current user's travelDates.departure. 
  - travelDates.departure is after the current user's travelDates.arrival. 
- Display one profile at a time with name, age, bio, picture, and travel dates. 
- Add "Like" and "Pass" buttons (rather than swipe gestures for now).
- Create a likes collection in Firestore; on "Like" button press, add an entry { fromUid, toUid, timestamp }. 
- Add loading states and error handling with toast notifications.
Test: 
- Create 3 test users in Firestore: 2 with overlapping dates (1 male, 1 female), 1 non-overlapping. 
- Log in as the male user and navigate to Swipe.js. 
- Confirm only the female user with overlapping dates appears. 
- Click "Like" and verify the like is recorded in the likes collection. 
- Test error handling by temporarily disabling network connectivity.

Step 8: Implement Matching Logic 
Task: Detect mutual likes and create matches. 
Instructions: 
- In src/services/matching.js, add a function to check if a mutual like exists: 
  - Query likes for an entry where fromUid matches the liked user and toUid matches the current user. 
  - If mutual, create an entry in a matches collection: { user1Uid, user2Uid, createdAt: timestamp }. 
- Display a toast notification when a match is created.
- Create a basic match notification UI component to show on successful matches.
Test: 
- Create 2 users (e.g., User A and User B) and simulate User A liking User B. 
- From User B's session, like User A back. 
- Check the matches collection for a new entry with both UIDs. 
- Confirm both users see a toast notification about the new match.
- Test error cases and ensure appropriate error messages appear.

Step 9: Implement the Chat Screen 
Task: Enable real-time messaging between matches. 
Instructions: 
- Create src/screens/Matches.js with custom UI components to list all matches from the matches collection. 
- Create src/screens/Chat.js for individual conversations with custom UI components.
- For each match, create a messages subcollection under /matches/{matchId}/messages. 
- In Chat.js, use a Firestore real-time listener to fetch and display messages. 
- Add a text input and send button to post new messages to the subcollection with { text, senderUid, timestamp }. 
- Implement proper loading states and error handling with toast notifications.
Test: 
- Match 2 test users and navigate to Matches.js. 
- Select the match and enter Chat.js. 
- Send a message from one user; confirm it appears instantly for both (use two simulator instances if needed). 
- Verify messages are stored in Firestore under the correct match ID. 
- Test error handling by temporarily disabling network connectivity.

Step 10: Handle Unmatching 
Task: Allow users to end matches. 
Instructions: 
- In Chat.js, add an "Unmatch" button. 
- On click, delete the match entry from the matches collection. 
- Prevent further access to the chat by checking match existence before loading Chat.js. 
- Display a toast notification when unmatching is complete.
Test: 
- Match 2 users and start a chat. 
- Click "Unmatch" from one user's session. 
- Confirm the match is removed from Firestore and the chat becomes inaccessible for both users. 
- Verify the toast notification appears confirming the unmatch.

Step 11: Optimize and Handle Errors 
Task: Ensure stability and cleanup. 
Instructions: 
- In Chat.js, unsubscribe from the Firestore listener in a cleanup function (e.g., useEffect return statement). 
- Add comprehensive error handling throughout the app using toast notifications for:
  - Network connectivity issues
  - Authentication errors
  - Database read/write failures
  - Image upload problems
- Implement proper loading states for all asynchronous operations.
- Create a utility function to handle and display toast notifications consistently.
Test: 
- In Chat.js, send messages, then navigate away; confirm no errors or duplicate messages on return. 
- Disable Wi-Fi and attempt to log in; verify a toast error message appears without crashing. 
- Re-enable Wi-Fi and confirm normal operation resumes.
- Test all major app functions with network disabled to verify graceful error handling.

Step 12: Future Enhancements (For later phases)
- Implement swipe gestures to replace Like/Pass buttons.
- Add social login options (Google, Apple, Facebook).
- Create user settings and profile editing screens.
- Implement push notifications for matches and messages.
- Add advanced matching filters (e.g., age preferences).
