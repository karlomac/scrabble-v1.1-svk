import { calculateScore } from '$lib/server/scrabble.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const { word } = await request.json();
    
    if (!word) {
      return json({ error: 'Word is required' }, { status: 400 });
    }
    
    const result = calculateScore(word);
    return json(result);
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}
