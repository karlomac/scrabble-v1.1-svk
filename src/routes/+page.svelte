<script>
  import { onMount } from 'svelte';
  import { EXAMPLE_WORDS, MAX_WORD_LENGTH } from '$lib/utils/constants.js';
  import { loadHistory, saveHistory } from '$lib/utils/storage.js';
  import TileRack from '$lib/components/TileRack.svelte';
  import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
  import WordHistory from '$lib/components/WordHistory.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  let currentWord = $state('');
  let currentScore = $state(0);
  let breakdown = $state([]);
  let history = $state([]);
  let error = $state(null);
  let isLoading = $state(false);
  let inputElement;
  let debounceTimer;
  let requestSequence = 0;

  onMount(() => {
    history = loadHistory();
    inputElement?.focus();
  });


  async function validateWord(word) {
    try {
      const response = await fetch('/api/validate-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
      });
      
      if (!response.ok) {
        console.error('Word validation failed:', response.status, response.statusText);
        return { isValid: false, definition: null };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Word validation error:', error);
      return { isValid: false, definition: null };
    }
  }

  async function fetchScoreFromAPI(word) {
    const response = await fetch('/api/scrabble-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to calculate score');
    }
    
    return data;
  }

  function addToHistory(scoreData, validationResult) {
    const newEntry = {
      word: scoreData.word,
      score: scoreData.score,
      timestamp: new Date().toLocaleTimeString(),
      id: crypto.randomUUID(),
      isValid: validationResult.isValid,
      definition: validationResult.definition,
      partOfSpeech: validationResult.partOfSpeech
    };
    
    history = [newEntry, ...history];
    saveHistory(history);
  }

  function clearInput() {
    currentWord = '';
    currentScore = 0;
    breakdown = [];
  }

  function handleInputChange(e) {
    const word = e.target.value.toUpperCase();
    
    if (word && !/^[A-Z]*$/.test(word)) {
      return;
    }
    
    currentWord = word;
    error = null;
    
    clearTimeout(debounceTimer);
    
    if (!word) {
      currentScore = 0;
      breakdown = [];
      return;
    }
    
    const currentSequence = ++requestSequence;
    
    debounceTimer = setTimeout(async () => {
      try {
        const result = await fetchScoreFromAPI(word);
        
        if (currentSequence === requestSequence) {
          currentScore = result.score;
          breakdown = result.breakdown;
        }
      } catch (err) {
        if (currentSequence === requestSequence) {
          console.error('Real-time score calculation failed:', err);
          currentScore = 0;
          breakdown = [];
        }
      }
    }, 300);
  }

  async function handleSubmit() {
    if (!currentWord.trim()) {
      error = 'Please enter a word';
      return;
    }
    
    if (isLoading) {
      return;
    }
    
    isLoading = true;
    error = null;
    
    try {
      const [scoreData, validationResult] = await Promise.all([
        fetchScoreFromAPI(currentWord),
        validateWord(currentWord)
      ]);
      
      addToHistory(scoreData, validationResult);
      clearInput();
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      clearInput();
      error = null;
    }
  }

  async function handleExampleClick(word) {
    try {
      const result = await fetchScoreFromAPI(word);
      currentWord = word;
      currentScore = result.score;
      breakdown = result.breakdown;
      error = null;
    } catch (err) {
      console.error('Example word score calculation failed:', err);
      error = 'Failed to calculate score for example word';
    }
  }

  function dismissError() {
    error = null;
  }
</script>

<svelte:head>
  <title>Scrabble Score Calculator</title>
  <meta name="description" content="Calculate Scrabble word scores and validate words" />
</svelte:head>

<div class="app">
  <header class="app-header">
    <h1>Scrabble Score Calculator</h1>
  </header>
  
  <main class="app-main">
    <section class="input-section">
      <TileRack word={currentWord} breakdown={breakdown} />
      
      <input
        bind:this={inputElement}
        type="text"
        bind:value={currentWord}
        oninput={handleInputChange}
        onkeydown={handleKeyPress}
        placeholder="Type a word..."
        class="text-input"
        maxlength={MAX_WORD_LENGTH}
      />
      
      <ScoreDisplay score={currentScore} />
      
      <ErrorMessage message={error} onDismiss={dismissError} />
      
      <button
        class="submit-button"
        onclick={handleSubmit}
        disabled={isLoading || !currentWord}
      >
        {#if isLoading}
          <span class="spinner"></span>
          <span>Validating...</span>
        {:else}
          <span class="icon">✓</span>
          <span>Submit Word</span>
        {/if}
      </button>
    </section>
    
    {#if history.length === 0 && !isLoading}
      <section class="empty-state">
        <div class="empty-state-icon">🎲</div>
        <h3 class="empty-state-title">No words scored yet</h3>
        <p class="empty-state-description">
          Start by typing a word above to see its Scrabble score!
        </p>
        <div class="example-words">
          <p class="example-label">Try these high-scoring words:</p>
          <div class="example-chips">
            {#each EXAMPLE_WORDS as example}
              <button 
                class="example-chip"
                onclick={() => handleExampleClick(example.word)}
              >
                {example.word} <span class="example-score">{example.score} pts</span>
              </button>
            {/each}
          </div>
        </div>
      </section>
    {/if}
    
    <WordHistory {history} />
  </main>
</div>

<style>
  :global(body) {
    font-family: 'Spline Sans', sans-serif;
    background: #f8f7f6;
    color: #1b140d;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1.5rem 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .app-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1b140d;
  }

  .app-main {
    flex: 1;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .input-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .text-input {
    width: 100%;
    padding: 1rem 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.2s;
    font-family: 'Spline Sans', sans-serif;
  }

  .text-input:focus {
    outline: none;
    border-color: #ec7f13;
    box-shadow: 0 0 0 3px rgba(236, 127, 19, 0.1);
  }

  .text-input::placeholder {
    text-transform: none;
    color: #9a734c;
    font-weight: 400;
  }

  .submit-button {
    background: #ec7f13;
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 0.75rem;
    font-weight: 700;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 10px 15px -3px rgba(236, 127, 19, 0.3);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    cursor: pointer;
    font-family: 'Spline Sans', sans-serif;
  }

  .submit-button:hover:not(:disabled) {
    background: #d16e0f;
    transform: translateY(-2px);
    box-shadow: 0 12px 20px -3px rgba(236, 127, 19, 0.4);
  }

  .submit-button:active:not(:disabled) {
    transform: scale(0.95);
  }

  .submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .submit-button .icon {
    font-size: 1.25rem;
  }

  .spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .empty-state {
    background: white;
    border-radius: 1rem;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .empty-state-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .empty-state-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1b140d;
    margin-bottom: 0.5rem;
  }

  .empty-state-description {
    font-size: 1rem;
    color: #9a734c;
    margin-bottom: 2rem;
  }

  .example-words {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .example-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #9a734c;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .example-chips {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .example-chip {
    background: #f3ede7;
    border: 2px solid #e5e7eb;
    color: #1b140d;
    padding: 0.75rem 1.25rem;
    border-radius: 0.75rem;
    font-weight: 700;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Spline Sans', sans-serif;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .example-chip:hover {
    background: #ec7f13;
    border-color: #ec7f13;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(236, 127, 19, 0.3);
  }

  .example-chip:active {
    transform: translateY(0);
  }

  .example-score {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  @media (max-width: 640px) {
    .app-main {
      padding: 2rem 1rem;
    }
    
    .input-section {
      padding: 1.5rem;
    }
  }
</style>
