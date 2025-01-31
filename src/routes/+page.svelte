<script>
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        min-height: 100vh;
        background-color: #000032;
        padding-top: 4rem;
    }
    .banner {
        font-family: Impact, sans-serif;
        font-size: 60px;
        font-weight: bold;
        text-transform: uppercase;
        color: #ffcc00;
        background: linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
        padding: 20px 40px;
        border: 5px solid #ffcc00;
        box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
        margin-bottom: 2rem;
    }
    .tricks-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .trick-link {
        color: #ffcc00;
        text-decoration: none;
        font-size: 24px;
        padding: 10px 20px;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }
    .trick-link:hover {
        border-color: #ffcc00;
        background: rgba(255, 204, 0, 0.1);
    }

    .trick-description {
        color: #ffcc00;
        font-size: 16px;
        margin: 0.5rem 0 1.5rem 1.5rem;
        max-width: 600px;
        opacity: 0.8;
    }
</style>

<div class="container">
    <div class="banner">Stupid Cloud Tricks</div>
    <ul class="tricks-list">
        <li>
            <a href="/whoami" class="trick-link">Who Am I?</a>
            <p class="trick-description">Shows your location, the Cloudflare worker's location, and the distance between them. See how Cloudflare's edge network serves your request from the nearest datacenter.</p>
        </li>
    </ul>
</div>
