// All paths are relative so the game also works in a portfolio subfolder.
const DAILY_PUZZLE_NUMBER = 6;
const cache = new Map();

async function loadJson(filename) {
    if (!cache.has(filename)) {
        const request = fetch(new URL(filename, import.meta.url)).then(response => {
            if (!response.ok) throw new Error(`Could not load ${filename}.`);
            return response.json();
        }).catch(error => {
            cache.delete(filename);
            throw error;
        });
        cache.set(filename, request);
    }
    return cache.get(filename);
}

export async function loadSamplePuzzles() {
    const puzzles = await loadJson('puzzles2.json');
    return puzzles.map(puzzle => ({ ...puzzle }));
}

export async function loadPuzzle(date) {
    const dailyPuzzles = await loadJson('puzzles.json');
    const daily = dailyPuzzles.find(p => p.puzzleNumber === DAILY_PUZZLE_NUMBER);
    if (!daily) throw new Error('The daily demo puzzle could not be found.');
    if (!date || date === daily.date) return { ...daily };
    const samples = await loadSamplePuzzles();
    const puzzle = samples.find(p => p.date === date);
    if (!puzzle) throw new Error('This sample puzzle could not be found.');
    return { ...puzzle };
}
