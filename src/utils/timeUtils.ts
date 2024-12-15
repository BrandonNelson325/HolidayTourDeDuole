// Convert HH:MM:SS.mmm to milliseconds
export function timeToMilliseconds(timeString: string): number {
  const [time, milliseconds = '0'] = timeString.split('.');
  const [hours = '0', minutes = '0', seconds = '0'] = time.split(':');
  
  return (
    parseInt(hours) * 3600000 +
    parseInt(minutes) * 60000 +
    parseInt(seconds) * 1000 +
    parseInt(milliseconds.padEnd(3, '0'))
  );
}

// Convert milliseconds to HH:MM:SS.mmm
export function millisecondsToTime(totalMilliseconds: number): string {
  const hours = Math.floor(totalMilliseconds / 3600000);
  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const milliseconds = totalMilliseconds % 1000;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':') + '.' + milliseconds.toString().padStart(3, '0');
}