import useAuthStore from '../store/authStore';

const getWsUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://pluselink-backend.onrender.com/api';
    return apiUrl.replace(/^http/, 'ws').replace(/\/api$/, '');
};

class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = [];
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.isConnecting = false;
    }

    connect() {
        const { user, token } = useAuthStore.getState();

        if (!user || !token) {
            return;
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return;
        }

        if (this.isConnecting) {
            return;
        }

        this.isConnecting = true;
        const wsUrl = `${getWsUrl()}/ws/${user.id}?token=${token}`;

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                this.reconnectAttempts = 0;
                this.reconnectDelay = 1000;
                this.isConnecting = false;
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.listeners.forEach(listener => {
                        try {
                            listener(data);
                        } catch (error) {
                            console.error('[WebSocket] Listener error:', error);
                        }
                    });
                } catch (error) {
                    console.error('[WebSocket] Parse error:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('[WebSocket] Error:', error);
                this.isConnecting = false;
            };

            this.ws.onclose = (event) => {
                this.isConnecting = false;
                this.ws = null;


                if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

                    setTimeout(() => {
                        this.connect();
                    }, delay);
                } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    console.error('[WebSocket] Max reconnect attempts reached');
                }
            };
        } catch (error) {
            console.error('[WebSocket] Connection error:', error);
            this.isConnecting = false;
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close(1000, 'User disconnect');
            this.ws = null;
        }
        this.reconnectAttempts = this.maxReconnectAttempts;
    }

    addListener(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
        }
    }

    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('[WebSocket] Cannot send, not connected');
        }
    }
}

const wsService = new WebSocketService();

export default wsService;
