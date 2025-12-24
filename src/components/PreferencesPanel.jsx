import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PreferencesPanel = () => {
    const [preferences, setPreferences] = useState({
        mute_emergency: false,
        mute_important: false,
        mute_info: false,
        mute_reminder: false,
        quiet_hours_enabled: false,
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/preferences`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPreferences(response.data);
        } catch (error) {
            console.error('Error fetching preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/preferences`, preferences, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('✅ Preferences saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Error saving preferences');
            console.error('Error saving preferences:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading preferences...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Notification Preferences</h3>

            { }
            <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-700">Mute Alerts by Priority</h4>

                {[
                    { key: 'mute_emergency', label: '🚨 Emergency', color: 'red' },
                    { key: 'mute_important', label: '⚠️ Important', color: 'orange' },
                    { key: 'mute_info', label: 'ℹ️ Info', color: 'blue' },
                    { key: 'mute_reminder', label: '🔔 Reminder', color: 'green' }
                ].map(({ key, label, color }) => (
                    <label key={key} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <span className="text-sm">{label}</span>
                        <input
                            type="checkbox"
                            checked={preferences[key]}
                            onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                    </label>
                ))}
            </div>

            { }
            <div className="border-t pt-4">
                <label className="flex items-center justify-between mb-3 cursor-pointer">
                    <span className="font-medium text-gray-700">🌙 Quiet Hours</span>
                    <input
                        type="checkbox"
                        checked={preferences.quiet_hours_enabled}
                        onChange={(e) => setPreferences({ ...preferences, quiet_hours_enabled: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                </label>

                {preferences.quiet_hours_enabled && (
                    <div className="grid grid-cols-2 gap-3 ml-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                            <input
                                type="time"
                                value={preferences.quiet_hours_start}
                                onChange={(e) => setPreferences({ ...preferences, quiet_hours_start: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">End Time</label>
                            <input
                                type="time"
                                value={preferences.quiet_hours_end}
                                onChange={(e) => setPreferences({ ...preferences, quiet_hours_end: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                )}
            </div>

            { }
            <div className="mt-6">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Saving...' : 'Save Preferences'}
                </button>
                {message && (
                    <p className="text-center mt-2 text-sm">{message}</p>
                )}
            </div>
        </div>
    );
};

export default PreferencesPanel;
