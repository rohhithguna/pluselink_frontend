import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TemplateSelector = ({ onSelectTemplate }) => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://pluselink-backend.onrender.com/api'}/templates`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (e) => {
        const templateId = e.target.value;
        setSelectedTemplate(templateId);

        if (templateId) {
            const template = templates.find(t => t.id === parseInt(templateId));
            if (template) {
                onSelectTemplate(template);
            }
        } else {
            onSelectTemplate(null);
        }
    };

    if (loading) {
        return <div className="text-sm text-gray-500">Loading templates...</div>;
    }

    if (templates.length === 0) {
        return (
            <div className="text-sm text-gray-500 italic">
                No templates available. Create one to save time!
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Use Template (Optional)
            </label>
            <select
                value={selectedTemplate}
                onChange={handleSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
                <option value="">-- Select a template --</option>
                {templates.map(template => (
                    <option key={template.id} value={template.id}>
                        {template.name} ({template.category})
                    </option>
                ))}
            </select>
            {selectedTemplate && (
                <p className="text-xs text-gray-500 mt-1">
                    Template will auto-fill the form below
                </p>
            )}
        </div>
    );
};

export default TemplateSelector;
