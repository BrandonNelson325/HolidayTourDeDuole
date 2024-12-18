import { parseCSV } from './utils/csvParser';
import { fetchRacers, insertDailyResult } from './services/supabaseService';
import type { RacerResult, DailyResult } from './types';

async function importResults(csvPath: string, day: number) {
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
        day,
        time: result.time, // Use milliseconds directly
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

// Check command line arguments
const csvPath = process.argv[2];
const day = parseInt(process.argv[3]);

if (!csvPath || !day || day < 1 || day > 4) {
  console.log('Usage: tsx scripts/importResults.ts <csv-file> <day-number>');
  console.log('Example: tsx scripts/importResults.ts results.csv 2');
  process.exit(1);
}

importResults(csvPath, day).catch(console.error);