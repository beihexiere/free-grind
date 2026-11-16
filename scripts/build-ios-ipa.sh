#!/usr/bin/env sh
set -eu

sh scripts/tauri.sh ios init --ci
bun run build

# === Fix AppIcon: gen/apple/Assets.xcassets may contain committed Grindr icons.
# Wipe and regenerate from src-tauri/icons/app-icon-source.png (Free Grind orange mask).
# Uses sips (macOS built-in) so no extra deps needed on CI.
APPICON_SET="src-tauri/gen/apple/Assets.xcassets/AppIcon.appiconset"
SRC_ICON="src-tauri/icons/app-icon-source.png"
rm -f "$APPICON_SET"/*.png
for pair in \
  "AppIcon-20x20@1x:20" "AppIcon-20x20@2x:40" "AppIcon-20x20@2x-1:40" "AppIcon-20x20@3x:60" \
  "AppIcon-29x29@1x:29" "AppIcon-29x29@2x:58" "AppIcon-29x29@2x-1:58" "AppIcon-29x29@3x:87" \
  "AppIcon-40x40@1x:40" "AppIcon-40x40@2x:80" "AppIcon-40x40@2x-1:80" "AppIcon-40x40@3x:120" \
  "AppIcon-512@2x:1024" \
  "AppIcon-60x60@2x:120" "AppIcon-60x60@3x:180" \
  "AppIcon-76x76@1x:76" "AppIcon-76x76@2x:152" \
  "AppIcon-83.5x83.5@2x:167"
do
  name="${pair%:*}"
  size="${pair#*:}"
  sips -z "$size" "$size" "$SRC_ICON" --out "$APPICON_SET/$name.png" >/dev/null
done
echo "AppIcon regenerated from $SRC_ICON"

PROJECT_SPEC="src-tauri/gen/apple/project.yml"
TEMP_SPEC="src-tauri/gen/apple/project.unsigned.yml"
DERIVED_DATA_PATH="src-tauri/gen/apple/.deriveddata_unsigned"
APP_PATH="$DERIVED_DATA_PATH/Build/Products/release-iphoneos/Free Grind.app"

# this shi strips phases that enforce the signing or trigger tauri xcode script
awk '
	/^[[:space:]]*DEVELOPMENT_TEAM:[[:space:]]*/ { next }
	/^[[:space:]]*-[[:space:]]*path:[[:space:]]*Externals[[:space:]]*$/ { next }
	/^[[:space:]]*preBuildScripts:[[:space:]]*$/ { skip = 1; next }
	skip {
		if (/^[[:space:]]{4}[A-Za-z_][A-Za-z0-9_]*:[[:space:]]*$/) {
			skip = 0
			print
			next
		}
		next
	}
	{ print }
' "$PROJECT_SPEC" > "$TEMP_SPEC"

xcodegen generate --spec "$TEMP_SPEC"

# tauri ios init/xcodegen doesnt merge src-taur/info.plist for ios, and xcodegen
# overwrites free-grind_iOS/Info.plist as part of generate, so we merge ours in after,
/usr/libexec/PlistBuddy -c "Merge src-tauri/Info.plist" src-tauri/gen/apple/free-grind_iOS/Info.plist

# i downgraded the mium version of xcode cuz i wanted
sed -i '' 's/objectVersion = 77;/objectVersion = 60;/' src-tauri/gen/apple/free-grind.xcodeproj/project.pbxproj

# built the rust core for device with custom protocol enabled, since the
# prebuildscripts phase that normally does this was stripped above lol fuck me. Without
# custom protocol, basicaly the binary o0r whatever is compiled in dev mode and tries to load the
# frontend from the vite dev server instead of the bundled assets. yea
(cd src-tauri && cargo build --target aarch64-apple-ios --release --features custom-protocol)
mkdir -p src-tauri/gen/apple/Externals/arm64/release
cp src-tauri/target/aarch64-apple-ios/release/libopen_grind_lib.a src-tauri/gen/apple/Externals/arm64/release/libapp.a

xcodebuild \
	-scheme free-grind_iOS \
	-workspace src-tauri/gen/apple/free-grind.xcodeproj/project.xcworkspace \
	-sdk iphoneos \
	-configuration release \
	-derivedDataPath "$DERIVED_DATA_PATH" \
	CODE_SIGNING_ALLOWED=NO \
	CODE_SIGNING_REQUIRED=NO \
	CODE_SIGN_IDENTITY="" \
	build

rm -rf dist/ios/Payload
mkdir -p dist/ios/Payload
cp -R "$APP_PATH" dist/ios/Payload/

cd dist/ios
zip -qry free-grind-unsigned.ipa Payload
cd - >/dev/null

echo "unsigned IPA created at dist/ios/free-grind-unsigned.ipa enjoy i guess"
