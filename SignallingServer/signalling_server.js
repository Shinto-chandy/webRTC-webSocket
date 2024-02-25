const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 }, () => {
    console.log("Signalling server is now listening on port 8081");
});

wss.broadcast = (ws, data) => {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data)); // Stringify the data before sending
        }
    });
};


wss.on('connection', ws => {
    console.log(`Client connected. Total connected clients: ${wss.clients.size}`);

   ws.on('message', message => {
    console.log("Received message: " + message);

    // Parse the received message as JSON
    let parsedMessage;
    try {
        parsedMessage = JSON.parse(message);
    } catch (error) {
        console.error("Error parsing message:", error);
        return;
    }

    // Broadcast the parsed message to all clients
    wss.broadcast(ws, parsedMessage);
});

    ws.on('close', ws=> {
        console.log(`Client disconnected. Total connected clients: ${wss.clients.size}`);
    })

    ws.on('error', error => {
        console.log(`Client error. Total connected clients: ${wss.clients.size}`);
    });
});
