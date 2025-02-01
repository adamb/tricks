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

    .current-colo {
        background-color: rgba(255, 204, 0, 0.1);
    }

    .colo-stats {
        margin: 1rem 0;
        padding: 0.5rem;
        border-bottom: 1px solid rgba(255, 204, 0, 0.3);
    }

    .colo-stats:last-child {
        border-bottom: none;
    }

    .all-colos h3 {
        color: #ffcc00;
        font-size: 1.1rem;
        margin: 0.5rem 0;
    }
</style>

<div class="whoami-container">
    <h1>Edge Network Statistics</h1>
    <div class="info-grid">
        {#if data.stats}
            <div class="section current-colo">
                <h2>You're visiting from {clientInfo.coloName} ({clientInfo.datacenter})</h2>
                <div class="data-row">
                    <div class="label">Visitors in last 24h:</div>
                    <div class="value">{data.stats[clientInfo.datacenter]?.totalVisitorsToThisColo || 0}</div>
                </div>
                <div class="data-row">
                    <div class="label">Your distance:</div>
                    <div class="value">{clientInfo.distanceKm} kilometers</div>
                </div>
                {#if clientInfo.visitKey}
                    <div class="data-row">
                        <div class="label">Visit Key:</div>
                        <div class="value">{clientInfo.visitKey}</div>
                    </div>
                {/if}
            </div>

            <div class="section all-colos">
                <h2>All Datacenter Activity (Last 24h)</h2>
                {#each Object.entries(data.stats).sort(([,a], [,b]) => b.totalVisitorsToThisColo - a.totalVisitorsToThisColo) as [coloCd, stats]}
                    {#if coloCd !== clientInfo.datacenter}
                        <div class="colo-stats">
                            <h3>{stats.name} ({coloCd})</h3>
                            <div class="data-row">
                                <div class="label">Visitors:</div>
                                <div class="value">{stats.totalVisitorsToThisColo}</div>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}

        <div class="section">
            <h2>Distance to Colo</h2>
            <div class="data-row">
                <div class="label">Distance:</div>
                <div class="value">{clientInfo.distanceKm} kilometers</div>
            </div>
            <div class="data-row">
                <div class="label">Latitude:</div>
                <div class="value">{clientInfo.latitude}</div>
            </div>
            <div class="data-row">
                <div class="label">Longitude:</div>
                <div class="value">{clientInfo.longitude}</div>
            </div>

            <h2>Worker Location</h2>
            <div class="data-row">
                <div class="label">Datacenter (colo):</div>
                <div class="value">{clientInfo.datacenter}</div>
            </div>
            <div class="data-row">
                <div class="label">Colo Name:</div>
                <div class="value">{clientInfo.coloName}</div>
            </div>
            <div class="data-row">
                <div class="label">Colo Latitude:</div>
                <div class="value">{clientInfo.coloLatitude}</div>
            </div>
            <div class="data-row">
                <div class="label">Colo Longitude:</div>
                <div class="value">{clientInfo.coloLongitude}</div>
            </div>
            </div>

            {#if data.stats}
                <div class="section">
                    <h2>Visitor Statistics</h2>
                    <div class="data-row">
                        <div class="label">Total Visitors to this Colo:</div>
                        <div class="value">{data.stats.totalVisitorsToThisColo}</div>
                    </div>
                    <div class="data-row">
                        <div class="label">Average Distance:</div>
                        <div class="value">{data.stats.averageDistance} kilometers</div>
                    </div>
                    <div class="data-row">
                        <div class="label">Recent Visits Analyzed:</div>
                        <div class="value">{data.stats.recentVisits}</div>
                    </div>
                </div>
            {/if}
        </div>
</div>
