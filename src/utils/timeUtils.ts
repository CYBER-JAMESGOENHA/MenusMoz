/**
 * Checks if a restaurant is currently open based on its hours string.
 * Uses Africa/Maputo (CAT / UTC+2) instead of browser local time for consistency.
 * @param {string} hoursString - Format: "HH:MM - HH:MM"
 * @returns {boolean}
 */
export const checkIsOpen = (hoursString: string | undefined): boolean => {
  if (!hoursString) return false;

  try {
    // Force Africa/Maputo (CAT / UTC+2) for all users regardless of location
    const maputoTimeStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Maputo',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).format(new Date());

    const [currentHour, currentMinute] = maputoTimeStr.split(':').map(Number);
    const currentTime = currentHour * 60 + currentMinute;

    const parts = hoursString.split(" - ");
    if (parts.length !== 2) return false;
    
    const [start, end] = parts;

    const parseTime = (timeStr: string) => {
      const parts = timeStr.split(":").map(Number);
      if (parts.length !== 2) return 0;
      const [h, m] = parts;
      return h * 60 + m;
    };

    const startTime = parseTime(start);
    let endTime = parseTime(end);

    // Handle hours that cross midnight (e.g., "17:00 - 02:00")
    if (endTime < startTime) {
      if (currentTime >= startTime || currentTime < endTime) {
        return true;
      }
    } else {
      if (currentTime >= startTime && currentTime < endTime) {
        return true;
      }
    }
  } catch (e) {
    return false;
  }

  return false;
};
