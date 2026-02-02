import { LETTER_VALUES } from '$lib/utils/constants.js';

export function calculateScore(word) {
  if (!word || typeof word !== 'string') {
    throw new Error('Invalid input: word must be a string');
  }
  
  const cleanWord = word.trim().toUpperCase();
  
  if (cleanWord.length === 0) {
    throw new Error('Invalid input: word cannot be empty');
  }
  
  if (!/^[A-Z]+$/.test(cleanWord)) {
    throw new Error('Invalid input: word must contain only letters');
  }
  
  const breakdown = cleanWord.split('').map(letter => ({
    letter,
    value: LETTER_VALUES[letter] || 0
  }));
  
  const score = breakdown.reduce((sum, item) => sum + item.value, 0);
  
  return { word: cleanWord, score, breakdown };
}
