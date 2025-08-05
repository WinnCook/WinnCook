# Bitcoin Matrix Visualization

A real-time Bitcoin price visualization inspired by The Matrix, using live data from Coinbase's WebSocket feed.

## Features

- **Real-time Bitcoin Price Data**: Connects to Coinbase's WebSocket feed for live BTC-USD pricing
- **Matrix-Style Animation**: Digital rain effect with characters, numbers, and Bitcoin symbols
- **Price Movement Visualization**: 
  - Green rain when price goes up
  - Red rain when price goes down
  - Intensity increases with price volatility
- **Smooth Animations**: Gradient effects, glow, and screen flashes for price changes
- **Interactive Controls**: Connect/disconnect and toggle matrix effect

## Files

- `index.html` - Main visualization with full Matrix effect
- `test.html` - Simple connection test page to verify WebSocket functionality
- `script.js` - Main JavaScript code with BitcoinMatrix class

## How to Run

1. Start a local web server in the project directory:
   ```bash
   python3 -m http.server 8000
   ```

2. Open your browser and navigate to:
   - Main visualization: `http://localhost:8000/index.html`
   - Connection test: `http://localhost:8000/test.html`

## Technical Details

- **WebSocket Endpoint**: `wss://ws-feed.exchange.coinbase.com`
- **Data Channel**: `ticker` for BTC-USD price updates
- **Rate Limits**: Respects Coinbase's 8 messages/second limit
- **Heartbeat**: Includes heartbeat channel for connection monitoring

## Controls

- **Connect/Disconnect**: Toggle WebSocket connection
- **Toggle Matrix Effect**: Turn the visual effect on/off while keeping price data
- **Browser Console**: Use `simulatePriceChange()` to test price change effects

## Price Movement Effects

- **Color Changes**: Green for up, red for down movements
- **Rain Intensity**: More volatile price changes create more intense rain
- **Screen Flash**: Significant price movements (>0.1%) trigger screen flashes
- **Glow Effects**: Leading characters have glow effects for better visual impact

## Browser Compatibility

Works in all modern browsers that support:
- WebSocket API
- HTML5 Canvas
- ES6 Classes

Tested on Chrome, Firefox, Safari, and Edge.
