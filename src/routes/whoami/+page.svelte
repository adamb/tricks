<script>
    export let data;
    const { clientInfo } = data;
</script>

<style>
    .whoami-container {
        padding: 2rem;
        background-color: #000032;
        min-height: 100vh;
        color: #ffcc00;
    }
    
    .info-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1rem;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .label {
        font-weight: bold;
        text-align: right;
    }
    
    .value {
        text-align: left;
    }

    h1 {
        text-align: center;
        color: #ffcc00;
        margin-bottom: 2rem;
    }
</style>

<div class="whoami-container">
    <h1>Client Information</h1>
    <div class="info-grid">
        {#each Object.entries(clientInfo) as [key, value]}
            <div class="label">{key}:</div>
            <div class="value">{value || 'N/A'}</div>
        {/each}
    </div>
</div>
