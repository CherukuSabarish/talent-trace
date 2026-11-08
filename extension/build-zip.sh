#!/bin/sh
# Rebuilds downloads/talentrace-2.0-extension.zip from this folder.
# Run from the repo root after changing anything in extension/.
set -e
cd "$(dirname "$0")/.."
rm -rf /tmp/tt-ext-build && mkdir -p /tmp/tt-ext-build/talentrace-2.0-extension downloads
cp -r extension/manifest.json extension/*.js extension/popup.html extension/icons /tmp/tt-ext-build/talentrace-2.0-extension/
rm -f downloads/talentrace-2.0-extension.zip
(cd /tmp/tt-ext-build && zip -qr - talentrace-2.0-extension) > downloads/talentrace-2.0-extension.zip
echo "Built downloads/talentrace-2.0-extension.zip"
