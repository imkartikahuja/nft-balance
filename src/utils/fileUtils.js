const fs = require('fs').promises;
const path = require('path');

const WATCHLIST_FILE = path.join(__dirname, '../../data/watchlist.json');
const TEMP_WATCHLIST_FILE = path.join(__dirname, '../../data/watchlist.tmp.json');

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(WATCHLIST_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Save watch list to file using atomic write
async function saveWatchList(watchList) {
  await ensureDataDirectory();
  const data = Array.from(watchList.entries());
  
  // Write to temporary file first
  await fs.writeFile(TEMP_WATCHLIST_FILE, JSON.stringify(data, null, 2));
  
  // Then rename the temporary file to the actual file
  // This is an atomic operation and less likely to trigger file watchers
  await fs.rename(TEMP_WATCHLIST_FILE, WATCHLIST_FILE);
}

// Load watch list from file
async function loadWatchList() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(WATCHLIST_FILE, 'utf8');
    return new Map(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty map
      return new Map();
    }
    throw error;
  }
}

module.exports = {
  saveWatchList,
  loadWatchList
}; 