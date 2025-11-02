const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const COUNTERS_FILE = path.join(__dirname, 'counters.json');

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Validate and sanitize counter name to ensure it's safe for JSON keys.
 * Only allows alphanumeric characters, hyphens, and underscores.
 * @param {string} counterName - The counter name to validate
 * @returns {string|null} - Sanitized counter name or null if invalid
 */
function validateCounterName(counterName) {
  // Only allow alphanumeric, hyphens, and underscores
  // Must be at least 1 character and max 100 characters
  if (!counterName || typeof counterName !== 'string') {
    return null;
  }
  
  const sanitized = counterName.trim();
  
  // Check length
  if (sanitized.length === 0 || sanitized.length > 100) {
    return null;
  }
  
  // Only allow: letters, numbers, hyphens, underscores
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  
  if (!validPattern.test(sanitized)) {
    return null;
  }
  
  return sanitized;
}

/**
 * Load counters from JSON file, return empty object if file doesn't exist.
 */
async function loadCounters() {
  try {
    const data = await fs.readFile(COUNTERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    console.error('Error loading counters:', error);
    return {};
  }
}

/**
 * Save counters to JSON file.
 */
async function saveCounters(counters) {
  try {
    await fs.writeFile(COUNTERS_FILE, JSON.stringify(counters, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving counters:', error);
    throw error;
  }
}

/**
 * Increment a counter and return the new value.
 */
async function incrementCounter(counterName) {
  const counters = await loadCounters();
  counters[counterName] = (counters[counterName] || 0) + 1;
  await saveCounters(counters);
  return counters[counterName];
}

/**
 * GET /{counter_name}/
 * Increment the counter and return the updated value.
 */
app.get('/:counterName/', async (req, res) => {
  try {
    const { counterName } = req.params;
    
    // Validate counter name
    const sanitizedCounterName = validateCounterName(counterName);
    if (!sanitizedCounterName) {
      return res.status(400).json({
        error: 'Invalid counter name',
        message: 'Counter name must contain only alphanumeric characters, hyphens, and underscores (max 100 characters)'
      });
    }
    
    const value = await incrementCounter(sanitizedCounterName);
    res.json({ counter: sanitizedCounterName, value });
  } catch (error) {
    console.error('Error incrementing counter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /
 * Root endpoint with API information.
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Counter API',
    usage: 'GET /{counter_name}/ to increment and get counter value'
  });
});

app.listen(PORT, () => {
  console.log(`Counter API running on port ${PORT}`);
});

