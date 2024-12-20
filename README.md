# Diff AutoClose for VS Code

Welcome to the "Diff Tab Auto Close" extension for Visual Studio Code! This extension enhances your workflow by automatically closing the diff editor tabs when they lose focus, keeping your workspace clean and organized.

## Features

Diff AutoClose cleanly and efficiently manages open diff tabs in your workspace by auto-closing them once they are no longer in focus. This helps in maintaining a clutter-free editor interface, especially useful when working with multiple changes and comparisons.

### Auto-Close Control
You can control auto-close behavior for individual tabs:
- Run command when tab is opened "Toggle Auto-Close on Focus Loss"
- When disabled, the tab will stay open even when losing focus
- When enabled (default), the tab will auto-close on focus loss
- The setting persists for the current VS Code session

## Extension Settings

Diff AutoClose offers simple configuration options to tailor its behavior according to your needs. In the settings menu of VS Code, you can find:

* `Diff Auto Close: Substrings`: Comma-separated substrings. If found in tab name, tab will be auto close on losing focus (unless auto-close is disabled for that specific tab).

**Enjoy your more efficient coding sessions with Diff AutoClose!**
