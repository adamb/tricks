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
        <div class="label">Headers:</div>
        <div class="value">
            {#each Object.entries(clientInfo.headers) as [key, value]}
                <div><strong>{key}:</strong> {value || 'N/A'}</div>
            {/each}
        </div>
        
        <div class="label">CF Data:</div>
        <div class="value">
            <pre>{JSON.stringify(clientInfo.rawCf, null, 2)}</pre>
        </div>
    </div>
</div>
