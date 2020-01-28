# Prérequis
1. installer [sdk tools](https://developer.android.com/studio) pour Android
2. suivre la partie “Android Development Environement” à ce [lien](https://facebook.github.io/react-native/docs/getting-started)

# Install app (debug)

1. `git clone https://github.com/hwadii/sight-study.git && cd sight-study`
2. `npm install`
3. `cd android && ./gradlew installDebug` (si un module natif a été ajouté ou si l'application est installée pour la première fois)

# Install app (deploy)

1. `expo publish`
2. `cd android && ./gradlew assembleRelease`
3. supprimer l'application en mode debug si elle est installée sur la tablette
4. `adb install -r app/build/outputs/apk/release/app-release.apk`

# Offline speech recognition

1. install `Google`, `Assistant` and `Voice search` from Play Store.
2. go to `Settings -> Assistant & voice input -> Assist app -> Offline speech recognition`
3. install desired languages
