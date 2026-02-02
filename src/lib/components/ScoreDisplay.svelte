<script>
  export let score = 0;
</script>

<div class="score-display">
  <span class="score-label">Score</span>
  <span class="score-value">{score} pts</span>
</div>

<style>
  .score-display {
    text-align: center;
    padding: 1rem;
  }

  .score-label {
    display: block;
    font-size: 0.875rem;
    color: #9a734c;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .score-value {
    display: block;
    font-size: 3rem;
    font-weight: 900;
    color: #ec7f13;
    transition: all 0.3s;
  }

  @media (max-width: 640px) {
    .score-value {
      font-size: 2rem;
    }
  }
</style>
