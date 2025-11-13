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

    if (data.type === 'pong') {
        // This is just a ping back from the server; ignore it
        return;
    }

    if (data.displayName && data.product) {
        // Show purchase
        const user = data.displayName;
        const product = data.product.displayName || data.product.sku;
        container.textContent = `${user} bought ${product}`;
        setTimeout(() => container.textContent = '', 3000);

        // Notify server that overlay received this purchase/test alert
        socket.send(JSON.stringify({ type: 'pong', channelID }));
    }
};
