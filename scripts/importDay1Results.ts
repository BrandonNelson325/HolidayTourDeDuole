import { parseCSV } from './utils/csvParser';
import { parseTimeToMilliseconds } from './utils/timeUtils';
import { fetchRacers, insertDailyResult } from './services/supabaseService';
import type { RacerResult, DatabaseRacer, DailyResult } from './types';

async function importDay1Results(csvPath: string) {
  try {
    // Parse CSV file
    console.log('Parsing CSV file...');
    const csvResults = parseCSV(csvPath);

    // Fetch existing racers from database
    console.log('Fetching racers from database...');
    const dbRacers = await fetchRacers();

    // Create a map of names to racer IDs for quick lookup
    const racerMap = new Map<string, string>();
    dbRacers.forEach(racer => racerMap.set(racer.name.toLowerCase(), racer.id));

    // Process each result
    console.log('Processing results...');
    const results: DailyResult[] = [];
    const skipped: string[] = [];

    for (const result of csvResults) {
      const racerId = racerMap.get(result.name.toLowerCase());
      
      if (!racerId) {
        skipped.push(result.name);
        continue;
      }

      results.push({
        racer_id: racerId,
        day: 1,
        time: parseTimeToMilliseconds(result.time),
        sprint_points: result.sprintPoints || 0,
        kom_points: result.komPoints || 0
      });
    }

    // Insert results
    console.log('Inserting results...');
    for (const result of results) {
      await insertDailyResult(result);
      console.log(`Inserted result for racer ID: ${result.racer_id}`);
    }

    // Summary
    console.log('\nImport Summary:');
    console.log(`Successfully imported: ${results.length} results`);
    if (skipped.length > 0) {
      console.log('\nSkipped racers (not found in database):');
      skipped.forEach(name => console.log(`- ${name}`));
    }

  } catch (error) {
    console.error('Error importing results:', error);
    process.exit(1);
  }
}

// Check if CSV path is provided
const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Please provide the path to the CSV file');
  console.log('Usage: node importDay1Results.js <path-to-csv>');
  process.exit(1);
}

importDay1Results(csvPath);