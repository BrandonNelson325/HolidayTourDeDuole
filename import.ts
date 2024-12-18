import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

// Supabase setup
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Convert time (HH:MM:SS) to milliseconds
function timeToMs(time: string) {
  const [hours = '0', minutes = '0', seconds = '0'] = time.split(':');
  return (
    parseInt(hours) * 3600000 +
    parseInt(minutes) * 60000 +
    parseInt(seconds) * 1000
  );
}

async function importResults(csvPath: string, day: number) {
  // Read and parse CSV
  const csv = readFileSync(csvPath, 'utf-8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  // Get all racers for name matching
  const { data: racers } = await supabase
    .from('racers')
    .select('id, name')
    .eq('is_active', true);

  // Process each record
  for (const record of records) {
    // Find matching racer
    const racer = racers?.find(r => 
      r.name.toLowerCase() === record.name.toLowerCase()
    );

    if (racer) {
      // Insert result
      await supabase
        .from('daily_results')
        .insert({
          racer_id: racer.id,
          day,
          time: timeToMs(record.time),
          sprint_points: parseInt(record.sprint_points || '0'),
          kom_points: parseInt(record.kom_points || '0')
        });

      // Update racer totals
      await supabase
        .rpc('update_racer_totals', { racer_uuid: racer.id });

      console.log(`Imported result for ${record.name}`);
    } else {
      console.log(`Skipped ${record.name} - not found in database`);
    }
  }
}

// Get command line arguments
const csvPath = process.argv[2];
const day = parseInt(process.argv[3]);

if (!csvPath || !day || day < 1 || day > 4) {
  console.log('Usage: tsx import.ts <csv-file> <day-number>');
  console.log('Example: tsx import.ts results.csv 2');
  process.exit(1);
}

importResults(csvPath, day).catch(console.error);