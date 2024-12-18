export function parseTimeToMilliseconds(timeStr: string): number {
  // Expected format: "HH:MM:SS" or "HH:MM:SS.mmm"
  const [time, milliseconds = '000'] = timeStr.split('.');
  const [hours = '0', minutes = '0', seconds = '0'] = time.split(':');
  
  return (
    parseInt(hours) * 3600000 +
    parseInt(minutes) * 60000 +
    parseInt(seconds) * 1000 +
    parseInt(milliseconds.padEnd(3, '0'))
  );
}