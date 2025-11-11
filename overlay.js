const container = document.getElementById('purchase-container');

// Replace with your Railway WebSocket URL
const socket = new WebSocket('wss://twitch-coffee-server-production.up.railway.app');

socket.onopen = () => {
    console.log('Connected to WebSocket server');

    // Send channel ID to subscribe
    socket.send(JSON.stringify({
        type: 'subscribe',
        channelID: '61792542' // Replace with Twitch channel ID
    }));
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Purchase received:', data);

    // Display user name and product
    container.textContent = `${data.userID} bought ${data.sku}`;
    
    // Clear text after 3 seconds
    setTimeout(() => container.textContent = '', 3000);
};
