<script>
    export let data;
    const { clientInfo } = data;
    
    async function getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org');
            const ip = await response.text();
            return ip;
        } catch (error) {
            console.error('Error fetching client IP:', error);
            return 'Not available';
        }
    }

    let clientIPPromise = getClientIP();
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

    h1, h2 {
        text-align: center;
        color: #ffcc00;
        margin-bottom: 2rem;
    }

    h2 {
        font-size: 1.5rem;
        margin-top: 2rem;
    }

    .section {
        margin-bottom: 2rem;
        padding: 1rem;
        border: 1px solid #ffcc00;
        border-radius: 4px;
    }
</style>

<div class="whoami-container">
    <h1>Request Information</h1>
    <div class="info-grid">
        <div class="section">
            <h2>Client Details (Your Browser)</h2>
            <div class="label">IP Address:</div>
            <div class="value">
                {#await clientIPPromise}
                    Loading...
                {:then ip}
                    {ip}
                {:catch error}
                    Error loading IP
                {/await}
            </div>
            {#each Object.entries(clientInfo).filter(([key]) => !['ip', 'workerIP', 'workerLocation'].includes(key)) as [key, value]}
                <div class="label">{key}:</div>
                <div class="value">{value || 'N/A'}</div>
            {/each}
            
            <h2>Worker Details (Cloudflare)</h2>
            <div class="label">IP Address:</div>
            <div class="value">{clientInfo.workerIP}</div>
            {#if clientInfo.workerLocation && typeof clientInfo.workerLocation === 'object'}
                {#each Object.entries(clientInfo.workerLocation) as [key, value]}
                    <div class="label">{key}:</div>
                    <div class="value">{value || 'N/A'}</div>
                {/each}
            {/if}
        </div>
    </div>
</div>
