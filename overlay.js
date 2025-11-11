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
    console.log('Connected to WebSocket server!');

    // Subscribe to this channel
    socket.send(JSON.stringify({
        type: 'subscribe',
        channelID: channelID
    }));
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Purchase received:', data);

    const user = data.displayName || data.userId;
    const product = data.product?.displayName || data.product?.sku;
    container.textContent = `${user} bought ${product}`;

    // Clear text after 3 seconds
    setTimeout(() => container.textContent = '', 3000);
};
