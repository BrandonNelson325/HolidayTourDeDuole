import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import type { RacerResult } from '../types';

export function parseCSV(filePath: string): RacerResult[] {
  const fileContent = readFileSync(filePath, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  return records.map((record: any) => ({
    name: record.name,
    time: parseInt(record.time, 10), // Parse time directly as milliseconds
    sprintPoints: parseInt(record.sprint_points || '0'),
    komPoints: parseInt(record.kom_points || '0')
  }));
}