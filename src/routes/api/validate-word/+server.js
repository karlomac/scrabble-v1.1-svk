import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const { word } = await request.json();
    
    if (!word) {
      return json({ error: 'Word is required', isValid: false, definition: null }, { status: 400 });
    }
    
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );
    
    if (!response.ok) {
      return json({ 
        error: `Word validation failed: ${response.statusText}`, 
        isValid: false, 
        definition: null 
      }, { status: response.status });
    }
    
    const data = await response.json();
    
    if (data?.[0]?.meanings?.[0]) {
      const firstMeaning = data[0].meanings[0];
      const definition = firstMeaning.definitions?.[0]?.definition || null;
      const partOfSpeech = firstMeaning.partOfSpeech || '';
      
      return json({ isValid: true, definition, partOfSpeech });
    }
    
    return json({ 
      error: 'No definitions found for word', 
      isValid: false, 
      definition: null 
    });
  } catch (error) {
    return json({ 
      error: `Dictionary API error: ${error.message}`, 
      isValid: false, 
      definition: null 
    }, { status: 500 });
  }
}
