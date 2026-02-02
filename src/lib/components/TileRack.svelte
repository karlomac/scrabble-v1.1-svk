<script>
  export let word = '';
  export let breakdown = [];

  $: tiles = word.split('').map((letter, index) => ({
    letter,
    value: breakdown[index]?.value || 0
  }));
</script>

<div class="tile-rack">
  {#each tiles as tile, index (index)}
    <div class="tile">
      <span class="letter">{tile.letter}</span>
      <span class="points">{tile.value}</span>
    </div>
  {/each}
  {#if word.length === 0}
    <span class="placeholder-text">Type a word below...</span>
  {/if}
</div>

<style>
  .tile-rack {
    font-family: 'Spline Sans', sans-serif;
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    background: #c9b4a0;
    border-radius: 0.75rem;
    border-bottom: 4px solid #8b6b4c;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    min-height: 5rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .tile {
    width: 3rem;
    height: 3.5rem;
    background: #f7e8d0;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation: tileAppear 0.2s ease-out;
    cursor: default;
  }

  .tile:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    z-index: 1;
  }

  @keyframes tileAppear {
    from {
      opacity: 0;
      transform: scale(0.8) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .letter {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1b140d;
  }

  .points {
    position: absolute;
    bottom: 0.25rem;
    right: 0.25rem;
    font-size: 0.625rem;
    color: #1b140d;
    font-weight: 600;
  }

  .placeholder-text {
    color: #9a734c;
    font-size: 0.875rem;
    font-style: italic;
  }

  @media (max-width: 640px) {
    .tile {
      width: 2.5rem;
      height: 3rem;
    }
    
    .letter {
      font-size: 1.25rem;
    }
  }
</style>
