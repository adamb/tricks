<script>
    export let data;
    const { clientInfo } = data;
    
    import { onMount } from 'svelte';

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
    let distanceDisplay = clientInfo.distanceKm;

    onMount(async () => {
        const clientIP = await clientIPPromise;
        if (clientIP === clientInfo.workerIP) {
            distanceDisplay = 0;
        }
        
        // Update visit data with client IP if we have a visit key
        if (clientIP && clientInfo.visitKey) {
            try {
                const response = await fetch('/whoami/api/visit/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        visitKey: clientInfo.visitKey,
                        clientIP
                    })
                });
                
                if (!response.ok) {
                    console.error('Failed to update visit data:', await response.json());
                }
            } catch (error) {
                console.error('Error updating visit data:', error);
            }
        }
    });
</script>

<style>
    .whoami-container {
        padding: 2rem;
        background-color: #000032;
        min-height: 100vh;
        color: #ffcc00;
    }
    
    .info-grid {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .data-row {
        display: flex;
        align-items: baseline;
        gap: 1rem;
        padding: 0.5rem 0;
    }
    
    .label {
        font-weight: bold;
        min-width: 200px;
    }
    
    .value {
        flex: 1;
    }

    h2 {
        text-align: center;
        color: #ffcc00;
        margin-bottom: 2rem;
        font-size: 1.5rem;
        margin-top: 2rem;
    }

    .section {
        margin-bottom: 2rem;
        padding: 1rem;
        border: 6px solid #ffcc00;
        border-radius: 0;
    }

    .current-colo {
        background-color: rgba(255, 204, 0, 0.1);
    }

    .colo-stats {
        margin: 0.5rem 0;
        padding: 0.25rem 0.5rem;
        border-bottom: 1px solid rgba(255, 204, 0, 0.3);
    }

    .colo-stats:last-child {
        border-bottom: none;
    }

    .colo-stats .label {
        color: #ffcc00;
    }

    .new-record {
        color: #ffcc00;
        font-weight: bold;
        margin-left: 1rem;
    }
</style>

<div class="whoami-container">
    <div class="info-grid">
        {#if data.stats}
            <div class="section current-colo">
                <h2>You're {clientInfo.distanceKm} km from {clientInfo.coloName} ({clientInfo.datacenter})</h2>
            </div>

            <div class="section all-colos">
                <h2>All Datacenter Activity</h2>
                {#each Object.entries(data.stats).sort(([,a], [,b]) => b.totalVisitorsToThisColo - a.totalVisitorsToThisColo) as [coloCd, stats]}
                    <div class="colo-stats" class:current-colo={coloCd === clientInfo.datacenter}>
                        <div class="data-row">
                            <div class="label">{stats.name} ({coloCd})</div>
                            <div class="value">
                                {stats.totalVisitorsToThisColo} visitors, {stats.averageDistance}km avg, {stats.maxDistance}km max
                                {#if stats.isNewMax}
                                    <span class="new-record">🎉 New distance record!</span>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

        </div>
</div>
