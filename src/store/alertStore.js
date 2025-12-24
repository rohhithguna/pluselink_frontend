import { create } from 'zustand';
import api from '../services/api';
import wsService from '../services/websocket';

const useAlertStore = create((set, get) => ({
    alerts: [],
    loading: false,
    queuedAlerts: [],

    fetchAlerts: async (params = {}) => {
        set({ loading: true });
        try {
            const response = await api.get('/alerts', { params });
            set({ alerts: response.data, loading: false });
        } catch (error) {
            console.error('Error fetching alerts:', error);
            set({ loading: false });
        }
    },

    createAlert: async (alertData) => {
        try {
            const response = await api.post('/alerts', alertData);
            
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to create alert'
            };
        }
    },

    addAlert: (alert) => {
        const { alerts, queuedAlerts } = get();

        
        set({ queuedAlerts: [...queuedAlerts, alert] });

        
        set({ alerts: [alert, ...alerts] });
    },

    removeFromQueue: (alertId) => {
        const { queuedAlerts } = get();
        set({ queuedAlerts: queuedAlerts.filter(a => a.id !== alertId) });
    },

    updateReactionCounts: (alertId, reactionCounts) => {
        const { alerts } = get();
        set({
            alerts: alerts.map(alert =>
                alert.id === alertId
                    ? { ...alert, reaction_counts: reactionCounts }
                    : alert
            ),
        });
    },

    addReaction: async (alertId, emoji) => {
        try {
            await api.post('/reactions', { alert_id: alertId, emoji });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to add reaction'
            };
        }
    },

    markAsViewed: async (alertId) => {
        try {
            await api.post(`/alerts/${alertId}/view`);
        } catch (error) {
            console.error('Error marking alert as viewed:', error);
        }
    },

    updateAcknowledgmentCount: (alertId, count) => {
        const { alerts } = get();
        set({
            alerts: alerts.map(alert =>
                alert.id === alertId
                    ? { ...alert, acknowledgment_count: count }
                    : alert
            ),
        });
    },

    initWebSocket: () => {
        
        if (!window.__pulseConnectWsListener) {
            window.__pulseConnectWsListener = (data) => {
                const store = get();
                if (data.type === 'new_alert') {
                    store.addAlert(data.alert || data.data);
                } else if (data.type === 'reaction_update') {
                    const reactionData = data.reaction || data.data;
                    store.updateReactionCounts(reactionData.alert_id, reactionData.reaction_counts);
                } else if (data.type === 'acknowledgment_update') {
                    const ackData = data.acknowledgment || data.data;
                    store.updateAcknowledgmentCount(ackData.alert_id, ackData.count);
                } else if (data.type === 'alert_deleted') {
                    store.removeAlert(data.alert_id);
                }
            };
            wsService.addListener(window.__pulseConnectWsListener);
        }
    },

    cleanupWebSocket: () => {
        if (window.__pulseConnectWsListener) {
            wsService.removeListener(window.__pulseConnectWsListener);
            window.__pulseConnectWsListener = null;
        }
    },

    removeAlert: (alertId) => {
        const { alerts, queuedAlerts } = get();
        set({
            alerts: alerts.filter(a => a.id !== alertId),
            queuedAlerts: queuedAlerts.filter(a => a.id !== alertId)
        });
    },

    
    bulkDeleteAlerts: async (alertIds) => {
        try {
            const response = await api.post('/alerts/bulk-delete', { alert_ids: alertIds });
            const { deleted_ids } = response.data;

            
            const { alerts, queuedAlerts } = get();
            set({
                alerts: alerts.filter(a => !deleted_ids.includes(a.id)),
                queuedAlerts: queuedAlerts.filter(a => !deleted_ids.includes(a.id))
            });

            return { success: true, deletedIds: deleted_ids };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to delete alerts'
            };
        }
    },

    
    bulkRestoreAlerts: async (alertIds) => {
        try {
            const response = await api.post('/alerts/bulk-restore', { alert_ids: alertIds });
            
            const { fetchAlerts } = get();
            await fetchAlerts();
            return { success: true, restoredIds: response.data.deleted_ids };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to restore alerts'
            };
        }
    },
}));

export default useAlertStore;
