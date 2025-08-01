// A simple Express server for the KeyHunt game.
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// The port will be provided by Render's environment, or defaults to 3000 for local testing.
const PORT = process.env.PORT || 3000;

// Serve the main index.html file and other static assets.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/miniKeyboardLayout', express.static(path.join(__dirname, 'miniKeyboardLayout')));
app.use('/words2.json', express.static(path.join(__dirname, 'words2.json')));
app.use('/favicon', express.static(path.join(__dirname, 'favicon')));
app.get('/api/tutorial', (req, res) => {
    res.sendFile(path.join(__dirname, 'tutorial.json'));
});

/**
 * Calculates the current date string in the "America/New_York" (EST/EDT) timezone.
 * @returns {string} The date in YYYY-MM-DD format.
 */
function getCurrentEstDateString() {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/New_York' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(now);
    
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;

    return `${year}-${month}-${day}`;
}

function obfuscateAnswer(answer, puzzleNumber, startWord) {
    const key = `KeyHunter${puzzleNumber}${startWord}`;
    let result = '';
    
    for (let i = 0; i < answer.length; i++) {
        const char = answer.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        const scrambled = char ^ keyChar;
        result += String.fromCharCode(scrambled);
    }
    
    // DON'T include puzzle number - just encode the scrambled result
    const encoded = Buffer.from(result, 'utf8').toString('base64');
    
    return encoded;
}


// API endpoint to get puzzle data.
app.get('/api/puzzle', (req, res) => {
    fs.readFile(path.join(__dirname, 'puzzles.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not load puzzle data.' });
        }

        const puzzles = JSON.parse(data);
        const todayStr = getCurrentEstDateString();
        
        let puzzle;
        if (req.query.date) {
            // Fetch by specific date for archives
            puzzle = puzzles.find(p => p.date === req.query.date);
            if (puzzle && puzzle.date > todayStr) {
                 return res.status(403).json({ error: 'This puzzle is not yet available.' });
            }
        } else {
            // Fetch today's puzzle
            puzzle = puzzles.find(p => p.date === todayStr);
        }

        if (puzzle) {
            const obfuscatedPuzzle = {
                ...puzzle,
                endWord: obfuscateAnswer(puzzle.endWord, puzzle.puzzleNumber, puzzle.startWord)
            };
            res.json(obfuscatedPuzzle);
        } else {
            res.status(404).json({ error: 'Puzzle for the selected date not found.' });
        }
    });
});

// API endpoint to get the list of available archive dates.
app.get('/api/archives', (req, res) => {
     fs.readFile(path.join(__dirname, 'puzzles.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not load archive data.' });
        }

        const puzzles = JSON.parse(data);
        const todayStr = getCurrentEstDateString();

        // Filter out any puzzles from the future.
        const availablePuzzles = puzzles
            .filter(p => p.date < todayStr)
            .map(p => ({ date: p.date, puzzleNumber: p.puzzleNumber }));
            
        res.json(availablePuzzles.reverse()); // Show most recent first
    });
});

// API endpoint to get instructions data.
app.get('/api/instructions', (req, res) => {
    fs.readFile(path.join(__dirname, 'instructions.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not load instructions.' });
        }
        res.json(JSON.parse(data));
    });
});


// All other requests will serve the main game file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`KeyHunt server running on port ${PORT}`);
});
