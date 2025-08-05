# Bitcoin Matrix Visualization

A real-time Bitcoin price visualization that creates a Matrix-style display using live data from Coinbase's WebSocket feed.

## Files

- `test-connection.html` - Simple test to verify WebSocket connection to Coinbase
- `index.html` - Full Matrix-style visualization with real-time Bitcoin price data

## How to Use

### 1. Test Connection First

Open `test-connection.html` in your browser to verify the WebSocket connection works:

1. Click "Test Connection" to connect to Coinbase's WebSocket feed
2. Watch the log for connection status and incoming price data
3. Verify you see real-time Bitcoin price updates

### 2. Run the Matrix Visualization

Once the connection test works, open `index.html` in your browser to see the full Matrix-style visualization:

- **Green numbers moving down**: Price is going up
- **Red numbers moving up**: Price is going down
- **Current price**: Displayed in the top-right corner
- **Connection status**: Shown in the top-left corner

## Features

- Real-time Bitcoin price data from Coinbase WebSocket feed
- Matrix-style falling numbers with Japanese characters
- Color-coded visualization (green for up, red for down)
- Automatic reconnection on connection loss
- Price history tracking
- Responsive design

## Technical Details

- Uses WebSocket connection to `wss://ws-feed.exchange.coinbase.com`
- Subscribes to BTC-USD ticker channel
- Implements proper error handling and reconnection logic
- CSS animations for Matrix-style falling effect
- JavaScript class-based architecture for maintainability

## Browser Compatibility

Works in all modern browsers that support WebSocket connections.

## Rate Limits

The application respects Coinbase's rate limits:
- 8 client messages per second (burst 20)
- Automatic reconnection with 5-second delays
