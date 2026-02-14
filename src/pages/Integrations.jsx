import { useCareOps } from '../context/CareOpsContext';
import '../styles/Integrations.css';

export default function Integrations() {
    const { integrations } = useCareOps();

    return (
        <div className="integrations-container">
            <div className="integrations-page">
                <div className="page-header">
                    <h1>Integrations</h1>
                    <p>Monitor the health and status of your external integrations</p>
                </div>

                <div className="integrations-grid">
                    <IntegrationCard
                        name="Email"
                        integration={integrations.email}
                        icon="📧"
                    />

                    <IntegrationCard
                        name="SMS"
                        integration={integrations.sms}
                        icon="📱"
                    />
                </div>
            </div>
        </div>
    );
}

function IntegrationCard({ name, integration, icon }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'connected':
                return '#10b981';
            case 'error':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'connected':
                return 'Connected';
            case 'error':
                return 'Error';
            default:
                return 'Disconnected';
        }
    };

    return (
        <div className="integration-card">
            <div className="integration-header">
                <div className="integration-icon">{icon}</div>
                <h3>{name}</h3>
            </div>

            <div
                className="integration-status"
                style={{ color: getStatusColor(integration.status) }}
            >
                <span className="status-dot" style={{ backgroundColor: getStatusColor(integration.status) }}></span>
                {getStatusText(integration.status)}
            </div>

            <div className="integration-details">
                {integration.lastActivity && (
                    <div className="detail-row">
                        <span className="detail-label">Last Activity:</span>
                        <span className="detail-value">
                            {new Date(integration.lastActivity).toLocaleString()}
                        </span>
                    </div>
                )}

                {integration.lastSuccess && (
                    <div className="detail-row">
                        <span className="detail-label">Last Success:</span>
                        <span className="detail-value">
                            {new Date(integration.lastSuccess).toLocaleString()}
                        </span>
                    </div>
                )}

                {integration.lastError && (
                    <div className="error-message">
                        <strong>Last Error:</strong>
                        <p>{integration.lastError}</p>
                    </div>
                )}
            </div>

            <div className="integration-stats">
                <div className="stat">
                    <div className="stat-value">{integration.totalSent || 0}</div>
                    <div className="stat-label">Sent</div>
                </div>
                <div className="stat">
                    <div className="stat-value">{integration.totalFailed || 0}</div>
                    <div className="stat-label">Failed</div>
                </div>
                <div className="stat">
                    <div className="stat-value">
                        {integration.totalSent > 0
                            ? ((integration.totalSent / (integration.totalSent + (integration.totalFailed || 0))) * 100).toFixed(1)
                            : 0}%
                    </div>
                    <div className="stat-label">Success Rate</div>
                </div>
            </div>
        </div>
    );
}
