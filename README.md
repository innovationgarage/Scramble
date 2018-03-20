# Scramble
Firefox scramble plugin for scrambing web pages. Nice to use for scrambling dashboards, monitoring data etc. where you don't want to accidentally leak customer or other private data.

A Firefox plugin for scrambing web pages. All characters on text nodes within the page will be replaced with random data. Numbers or other special characters will not be scrambled.

  - **Scramble**: Selecting Scramble will scramble the all focused tabs for all windows where the plugin is enabled. Scrambled pages will be rescrambed every second to handle dynamically updated content.
  - **Reset**: Selecting Reset will unscramble all scrambled pages and start a 60 second timeout
until the pages will be rescrambed if no mouse movement have been detected since the timer started.

# Install

Open `about:debugging` in Firefox. Select "Load Temporary Add-on". Navigate to the directory containing the plugin and select any file, e.g. `manifest.json`. The plugin will now be added to the toolbar.