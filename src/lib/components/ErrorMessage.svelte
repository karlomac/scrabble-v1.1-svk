<script>
  export let message = '';
  export let onDismiss = () => {};
</script>

{#if message}
  <div class="error-message">
    <span class="error-icon">⚠</span>
    <div class="error-content">
      <div class="error-text">{message}</div>
      <button 
        class="error-retry"
        onclick={onDismiss}
      >
        Dismiss
      </button>
    </div>
  </div>
{/if}

<style>
  .error-message {
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #991b1b;
    padding: 1rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    animation: errorSlideIn 0.3s ease-out;
  }

  @keyframes errorSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .error-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .error-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .error-text {
    font-weight: 500;
  }

  .error-retry {
    align-self: flex-start;
    background: transparent;
    border: 1px solid #991b1b;
    color: #991b1b;
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Spline Sans', sans-serif;
  }

  .error-retry:hover {
    background: #991b1b;
    color: white;
  }
</style>
