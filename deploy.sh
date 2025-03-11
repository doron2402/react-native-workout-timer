#!/bin/bash

# Set variables
PROJECT_NAME="sport-timer"

echo "🚀 Starting build and deployment for $PROJECT_NAME..."

# Step 1: Log in to Expo (Ensure you are logged in)
eas whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "🔑 Logging into EAS..."
  eas login
else
  echo "✅ Already logged into EAS"
fi

# Step 2: Ensure EAS is configured
echo "⚙️ Configuring EAS..."
eas build:configure

# Step 3: Build for iOS
echo "📦 Building iOS app..."
eas build --platform ios --non-interactive
if [ $? -ne 0 ]; then
  echo "❌ iOS build failed!"
  exit 1
fi

# Step 4: Build for Android
echo "📦 Building Android app..."
eas build --platform android --non-interactive
if [ $? -ne 0 ]; then
  echo "❌ Android build failed!"
  exit 1
fi

# Step 5: Submit iOS app to App Store
echo "🚀 Submitting iOS app to the App Store..."
eas submit --platform ios --non-interactive
if [ $? -ne 0 ]; then
  echo "❌ iOS submission failed!"
  exit 1
fi

# Step 6: Submit Android app to Google Play
echo "🚀 Submitting Android app to Google Play..."
eas submit --platform android --non-interactive
if [ $? -ne 0 ]; then
  echo "❌ Android submission failed!"
  exit 1
fi

echo "🎉 Deployment complete! Your app is now submitted to the App Store and Google Play."