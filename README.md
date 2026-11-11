# KeyHunt Word Puzzle — portfolio edition

A static word puzzle game. No Render service, Express server, API, or build step is required.

## Play locally

Run `python3 -m http.server 3000` in this folder (or `npm start`), then open http://localhost:3000. Use a web server rather than opening index.html directly, because the game loads JSON files.

## Hosting

Upload this folder to any static host. For GitHub Pages, publish the repository root. Relative asset and JSON paths support project URLs and portfolio subfolders.

## Puzzles

- `puzzles.json` retains the original puzzle collection. Puzzle #6 (BEER → MYTH) is always used for the Daily Demo. Change `DAILY_PUZZLE_NUMBER` in `puzzle-data.js` to pick another fixed puzzle.
- `puzzles2.json` contains the five playable samples, numbered 1–5. The existing menu and previous/next arrows select these puzzles. Keep puzzle numbers consecutive starting at 1 and keep dates unique. Dates are stable identifiers, not availability restrictions.
- `tutorial.json`, `instructions.json`, and `words2.json` load directly from this folder.
- Answers are intentionally public in JSON. The demo never rotates at midnight.

The original keyboard, modes, scoring, tutorial, and browser save format are retained. Daily streak/statistics labels are legacy features; this edition does not add a new daily puzzle. Existing external fonts, Tailwind, confetti, Google Analytics, and the feedback form are retained.

## Changes from the original

Removed `server.js` and the Express dependency, replaced API requests and answer decoding with JSON loading, added five sample puzzles, moved the contents of `public/` to the root for static hosting, and removed the midnight countdown. No live repository or hosting settings were changed.
