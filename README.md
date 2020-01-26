# Install app (debug)

1. `git clone https://github.com/hwadii/sight-study.git && cd sight-study`
2. `npm install`
3. `cd android && ./gradlew installDebug` (si un module natif a été ajouté)

# Install app (deploy)

1. `expo publish`
2. `cd android && ./gradlew assembleRelease`
3. `adb install -r app/build/outputs/apk/release/app-release.apk`

# Offline speech recognition

1. install `Google`, `Assistant` and `Voice search` from Play Store.
2. go to `Settings -> Assistant & voice input -> Assist app -> Offline speech recognition`
3. install desired languages
