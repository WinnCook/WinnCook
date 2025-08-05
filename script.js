// Bitcoin Matrix Visualization
class BitcoinMatrix {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ws = null;
        this.isConnected = false;
        this.messageCount = 0;
        this.currentPrice = null;
        this.previousPrice = null;
        this.priceHistory = [];
        this.matrixEnabled = true;
        
        // Matrix rain properties
        this.columns = [];
        this.drops = [];
        this.characters = '0123456789ABCDEF$₿';
        this.fontSize = 14;
        this.columnCount = 0;
        
        // Animation enhancement properties
        this.priceChangeAnimation = 0;
        this.lastPriceChangeTime = 0;
        this.pulseIntensity = 0;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.setupMatrix();
        this.startAnimation();
        
        // Auto-connect on load
        setTimeout(() => this.connect(), 1000);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.setupMatrix();
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columnCount = Math.floor(this.canvas.width / this.fontSize);
    }
    
    setupMatrix() {
        this.drops = [];
        for (let i = 0; i < this.columnCount; i++) {
            this.drops[i] = Math.random() * this.canvas.height / this.fontSize;
        }
    }
    
    connect() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('Already connected');
            return;
        }
        
        try {
            console.log('Connecting to Coinbase WebSocket...');
            this.updateStatus('Connecting...');
            
            // Using the legacy Exchange feed as specified
            this.ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
            
            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.isConnected = true;
                this.updateStatus('Connected');
                
                // Send subscribe message within 5 seconds as required
                const subscribeMessage = {
                    "type": "subscribe",
                    "product_ids": ["BTC-USD"],
                    "channels": ["ticker", "heartbeat"]
                };
                
                this.ws.send(JSON.stringify(subscribeMessage));
                console.log('Subscription message sent:', subscribeMessage);
            };
            
            this.ws.onmessage = (event) => {
                this.handleMessage(event.data);
            };
            
            this.ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                this.isConnected = false;
                this.updateStatus('Disconnected');
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateStatus('Error');
            };
            
        } catch (error) {
            console.error('Connection error:', error);
            this.updateStatus('Error: ' + error.message);
        }
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
        this.updateStatus('Disconnected');
    }
    
    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            this.messageCount++;
            
            // Update message count
            document.getElementById('message-count').textContent = this.messageCount;
            document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
            
            // Handle ticker messages for price data
            if (message.type === 'ticker' && message.product_id === 'BTC-USD') {
                this.handlePriceUpdate(message);
            }
            
            // Log heartbeat messages for debugging
            if (message.type === 'heartbeat') {
                console.log('Heartbeat received, sequence:', message.sequence);
            }
            
            // Log other message types for debugging
            console.log('Message received:', message.type, message);
            
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }
    
    handlePriceUpdate(tickerData) {
        this.previousPrice = this.currentPrice;
        this.currentPrice = parseFloat(tickerData.price);
        
        // Add to price history
        this.priceHistory.push({
            price: this.currentPrice,
            time: new Date(tickerData.time),
            timestamp: Date.now()
        });
        
        // Keep only last 100 price points
        if (this.priceHistory.length > 100) {
            this.priceHistory.shift();
        }
        
        // Update display
        this.updatePriceDisplay();
        
        // Create matrix effect based on price movement
        this.triggerPriceEffect();
        
        console.log('Price update:', this.currentPrice, 'Previous:', this.previousPrice);
    }
    
    updatePriceDisplay() {
        const priceElement = document.getElementById('current-price');
        const changeElement = document.getElementById('price-change');
        const priceDisplay = document.getElementById('price-display');
        
        priceElement.textContent = this.currentPrice.toFixed(2);
        
        if (this.previousPrice !== null) {
            const change = this.currentPrice - this.previousPrice;
            const changePercent = (change / this.previousPrice * 100).toFixed(4);
            
            changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent}%)`;
            
            // Apply color based on price movement
            priceDisplay.className = change >= 0 ? 'price-up' : 'price-down';
        }
    }
    
    triggerPriceEffect() {
        if (!this.matrixEnabled || this.previousPrice === null) return;
        
        const isUp = this.currentPrice > this.previousPrice;
        const intensity = Math.abs(this.currentPrice - this.previousPrice) / this.previousPrice;
        
        // Set animation properties for price change effect
        this.priceChangeAnimation = 1.0;
        this.lastPriceChangeTime = Date.now();
        this.pulseIntensity = Math.min(intensity * 1000, 1.0);
        
        // Trigger more intense matrix rain based on price volatility
        const effectColumns = Math.floor(this.columnCount * Math.min(intensity * 100, 0.4));
        
        for (let i = 0; i < effectColumns; i++) {
            const randomColumn = Math.floor(Math.random() * this.columnCount);
            this.drops[randomColumn] = -Math.random() * 15; // Reset drop to create new rain
        }
        
        // Add screen flash effect for significant price changes
        if (intensity > 0.001) { // More than 0.1% change
            this.flashScreen(isUp);
        }
    }
    
    flashScreen(isUp) {
        const flashColor = isUp ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';
        this.ctx.fillStyle = flashColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawMatrix() {
        if (!this.matrixEnabled) return;
        
        // Create smooth trailing effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Determine base color based on recent price movement with smoother transitions
        let baseColor = '#0f0'; // Default green
        let secondaryColor = '#080'; // Darker green
        
        if (this.currentPrice && this.previousPrice) {
            if (this.currentPrice >= this.previousPrice) {
                baseColor = '#0f0'; // Bright green
                secondaryColor = '#080'; // Dark green
            } else {
                baseColor = '#f00'; // Bright red  
                secondaryColor = '#800'; // Dark red
            }
        }
        
        this.ctx.font = `${this.fontSize}px monospace`;
        
        // Draw the matrix rain with enhanced effects
        for (let i = 0; i < this.drops.length; i++) {
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // Create gradient effect for each column
            const gradient = this.ctx.createLinearGradient(x, y - this.fontSize * 10, x, y);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(0.7, secondaryColor + '80');
            gradient.addColorStop(1, baseColor);
            
            // Random character from our set
            let char = this.characters[Math.floor(Math.random() * this.characters.length)];
            
            // Add Bitcoin symbols and price digits more frequently
            if (this.currentPrice && Math.random() < 0.15) {
                const priceStr = this.currentPrice.toString().replace('.', '');
                char = priceStr[Math.floor(Math.random() * priceStr.length)];
            } else if (Math.random() < 0.05) {
                char = ['₿', '$', '♦', '◆'][Math.floor(Math.random() * 4)];
            }
            
            // Vary the brightness and add glow effect for leading characters
            const distanceFromTop = this.drops[i];
            const isLeading = distanceFromTop < 3;
            
            if (isLeading) {
                // Bright leading character with glow
                this.ctx.fillStyle = baseColor;
                this.ctx.shadowColor = baseColor;
                this.ctx.shadowBlur = 10;
            } else {
                // Trailing characters with gradient
                const alpha = Math.max(0.1, 1 - (distanceFromTop / 15));
                this.ctx.fillStyle = baseColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.fillText(char, x, y);
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
            
            // Reset drop with variable speed based on price volatility
            let resetChance = 0.975;
            if (this.previousPrice && this.currentPrice) {
                const volatility = Math.abs(this.currentPrice - this.previousPrice) / this.previousPrice;
                resetChance = Math.max(0.95, 0.975 - volatility * 10);
            }
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > resetChance) {
                this.drops[i] = -Math.random() * 5;
            }
            
            // Variable drop speed
            const baseSpeed = 0.5;
            const speedVariation = Math.random() * 0.3;
            this.drops[i] += baseSpeed + speedVariation;
        }
    }
    
    animate() {
        // Update animation timers
        const now = Date.now();
        if (this.priceChangeAnimation > 0) {
            const elapsed = now - this.lastPriceChangeTime;
            this.priceChangeAnimation = Math.max(0, 1 - elapsed / 2000); // 2 second fade
        }
        
        this.drawMatrix();
        requestAnimationFrame(() => this.animate());
    }
    
    startAnimation() {
        this.animate();
    }
    
    updateStatus(status) {
        document.getElementById('connection-status').textContent = status;
    }
}

// Global functions for button controls
function toggleConnection() {
    if (bitcoinMatrix.isConnected) {
        bitcoinMatrix.disconnect();
    } else {
        bitcoinMatrix.connect();
    }
}

function toggleMatrix() {
    bitcoinMatrix.matrixEnabled = !bitcoinMatrix.matrixEnabled;
    if (!bitcoinMatrix.matrixEnabled) {
        // Clear canvas when matrix is disabled
        bitcoinMatrix.ctx.fillStyle = '#000';
        bitcoinMatrix.ctx.fillRect(0, 0, bitcoinMatrix.canvas.width, bitcoinMatrix.canvas.height);
    }
}

// Initialize the application
let bitcoinMatrix;
document.addEventListener('DOMContentLoaded', () => {
    bitcoinMatrix = new BitcoinMatrix();
});

// Debug function to test price changes manually
function simulatePriceChange() {
    if (bitcoinMatrix.currentPrice) {
        const change = (Math.random() - 0.5) * 1000; // Random change up to $500
        bitcoinMatrix.handlePriceUpdate({
            price: (bitcoinMatrix.currentPrice + change).toString(),
            time: new Date().toISOString()
        });
    }
}

// Add to window for debugging
window.simulatePriceChange = simulatePriceChange;
window.bitcoinMatrix = bitcoinMatrix;