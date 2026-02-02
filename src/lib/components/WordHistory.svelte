<script>
  export let history = [];
  
  $: totalScore = history.reduce((total, item) => {
    return item.isValid === true ? total + item.score : total;
  }, 0);
</script>

{#if history.length > 0}
  <section class="history-section">
    <div class="history-header">
      <div class="history-header-left">
        <h3>History</h3>
        <span class="count">{history.length} {history.length === 1 ? 'word' : 'words'}</span>
      </div>
      <div class="total-score">
        <span class="total-label">Total</span>
        <span class="total-value">{totalScore} pts</span>
      </div>
    </div>
    
    <div class="history-list">
      {#each history as item (item.id)}
        <div class="history-item {item.isValid ? 'valid-word' : 'invalid-word'}">
          <div class="history-content">
            <div class="history-row">
              <div class="word-with-status">
                <span class="word">{item.word}</span>
                {#if item.isValid !== undefined}
                  <span class="validation-icon {item.isValid ? 'valid' : 'invalid'}">
                    {item.isValid ? '✓' : '✗'}
                  </span>
                {/if}
              </div>
              <span class="score">{item.score} pts</span>
            </div>
            {#if item.definition}
              <div class="definition">
                <span class="part-of-speech">{item.partOfSpeech}</span>
                <span class="definition-text">{item.definition}</span>
              </div>
            {/if}
            {#if !item.isValid && item.isValid !== undefined}
              <div class="invalid-message">Not a valid dictionary word</div>
            {/if}
            <span class="timestamp">{item.timestamp}</span>
          </div>
        </div>
      {/each}
    </div>
  </section>
{/if}

<style>
  .history-section {
    background: #fcfaf8;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: white;
  }

  .history-header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .history-header h3 {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9a734c;
  }

  .count {
    font-size: 0.625rem;
    color: #9a734c;
    background: #f3ede7;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .total-score {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.125rem;
  }

  .total-label {
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9a734c;
  }

  .total-value {
    font-size: 1.25rem;
    font-weight: 900;
    color: #ec7f13;
    line-height: 1;
  }

  .history-list {
    max-height: 400px;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .history-item {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: background 0.2s;
    animation: historyItemAppear 0.3s ease-out;
  }

  @keyframes historyItemAppear {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .history-item:hover {
    background: white;
  }

  .history-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .word {
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #1b140d;
    letter-spacing: 0.05em;
  }

  .score {
    font-size: 0.875rem;
    font-weight: 700;
    color: #ec7f13;
  }

  .timestamp {
    font-size: 0.625rem;
    color: #9a734c;
  }

  .word-with-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .validation-icon {
    font-size: 1rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    animation: iconPop 0.3s ease-out;
  }

  @keyframes iconPop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .validation-icon.valid {
    background: #10b981;
    color: white;
  }

  .validation-icon.invalid {
    background: #ef4444;
    color: white;
  }

  .history-item.valid-word {
    border-left: 3px solid #10b981;
  }

  .history-item.invalid-word {
    border-left: 3px solid #ef4444;
  }

  .definition {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #f3ede7;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    line-height: 1.4;
  }

  .part-of-speech {
    display: inline-block;
    font-style: italic;
    color: #ec7f13;
    font-weight: 600;
    margin-right: 0.5rem;
  }

  .definition-text {
    color: #1b140d;
  }

  .invalid-message {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #ef4444;
    font-style: italic;
  }
</style>
