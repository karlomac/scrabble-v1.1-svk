export function loadHistory() {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('scrabble-history');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    // Silently fail - localStorage errors are non-critical
    return [];
  }
}

export function saveHistory(history) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('scrabble-history', JSON.stringify(history));
  } catch (error) {
    // Silently fail - localStorage errors are non-critical
  }
}
