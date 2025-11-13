const container = document.getElementById('purchase-container');

// Parse channel ID from URL query string
const urlParams = new URLSearchParams(window.location.search);
const channelID = urlParams.get('channel');

if (!channelID) {
    container.textContent = 'No channel specified!';
    throw new Error('Channel ID missing in overlay URL');
}

// Connect to your WebSocket server
const socket = new WebSocket('wss://twitch-coffee-server-production.up.railway.app');

socket.onopen = () => {
    console.log('Connected to WebSocket servers!');

    // Subscribe to this channel
    socket.send(JSON.stringify({
        type: 'subscribe',
        channelID: channelID
    }));

};
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // Always send pong so config panel knows overlay is alive
    if (channelID) socket.send(JSON.stringify({ type: 'pong', channelID }));

    // Only show purchase alerts
    if (data.displayName && data.product) {
        const user = data.displayName;
        const product = data.product.displayName || data.product.sku;
        container.textContent = `${user} bought ${product}`;

        // Clear text after 3 seconds
        setTimeout(() => container.textContent = '', 3000);
    }

    console.log('WS message received:', data);
};
