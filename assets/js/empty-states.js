/**
 * MiraBoard - Empty States Component
 * Ilustrações SVG e componentes para estados vazios
 */

const EmptyStates = {
    // Ilustrações SVG inline
    illustrations: {
        noData: `
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
                <rect x="60" y="60" width="80" height="100" rx="8" fill="#E5E7EB"/>
                <rect x="70" y="75" width="40" height="6" rx="3" fill="#D1D5DB"/>
                <rect x="70" y="87" width="60" height="6" rx="3" fill="#D1D5DB"/>
                <rect x="70" y="99" width="50" height="6" rx="3" fill="#D1D5DB"/>
                <rect x="70" y="111" width="55" height="6" rx="3" fill="#D1D5DB"/>
                <circle cx="145" cy="140" r="25" fill="#E8681A" opacity="0.2"/>
                <path d="M145 125v30M130 140h30" stroke="#E8681A" stroke-width="4" stroke-linecap="round"/>
            </svg>
        `,
        noReunions: `
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
                <rect x="50" y="70" width="100" height="70" rx="10" fill="#E5E7EB"/>
                <circle cx="75" cy="95" r="12" fill="#D1D5DB"/>
                <circle cx="100" cy="95" r="12" fill="#D1D5DB"/>
                <circle cx="125" cy="95" r="12" fill="#D1D5DB"/>
                <rect x="65" y="115" width="70" height="6" rx="3" fill="#D1D5DB"/>
                <circle cx="155" cy="55" r="20" fill="#E8681A" opacity="0.2"/>
                <path d="M155 45v20M145 55h20" stroke="#E8681A" stroke-width="3" stroke-linecap="round"/>
            </svg>
        `,
        noDocuments: `
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
                <path d="M65 55h50l25 25v75a10 10 0 01-10 10H65a10 10 0 01-10-10V65a10 10 0 0110-10z" fill="#E5E7EB"/>
                <path d="M115 55v25h25" fill="#D1D5DB"/>
                <rect x="70" y="95" width="50" height="6" rx="3" fill="#D1D5DB"/>
                <rect x="70" y="107" width="60" height="6" rx="3" fill="#D1D5DB"/>
                <rect x="70" y="119" width="40" height="6" rx="3" fill="#D1D5DB"/>
                <circle cx="150" cy="145" r="22" fill="#E8681A" opacity="0.2"/>
                <path d="M150 133v24M138 145h24" stroke="#E8681A" stroke-width="3" stroke-linecap="round"/>
            </svg>
        `,
        noActions: `
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
                <rect x="55" y="60" width="90" height="25" rx="6" fill="#E5E7EB"/>
                <rect x="60" y="68" width="12" height="12" rx="3" fill="#D1D5DB"/>
                <rect x="78" y="71" width="50" height="6" rx="3" fill="#D1D5DB"/>
                <rect x="55" y="95" width="90" height="25" rx="6" fill="#E5E7EB"/>
                <rect x="60" y="103" width="12" height="12" rx="3" fill="#10B981"/>
                <path d="M63 109l3 3 6-6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <rect x="78" y="106" width="50" height="6" rx="3" fill="#D1D5DB"/>
                <rect x="55" y="130" width="90" height="25" rx="6" fill="#E5E7EB"/>
                <rect x="60" y="138" width="12" height="12" rx="3" fill="#D1D5DB"/>
                <rect x="78" y="141" width="50" height="6" rx="3" fill="#D1D5DB"/>
            </svg>
        `,
        noMessages: `
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
                <path d="M50 70a10 10 0 0110-10h80a10 10 0 0110 10v60a10 10 0 01-10 10H85l-20 20v-20H60a10 10 0 01-10-10V70z" fill="#E5E7EB"/>
                <circle cx="80" cy="100" r="6" fill="#D1D5DB"/>
                <circle cx="100" cy="100" r="6" fill="#D1D5DB"/>
                <circle cx="120" cy="100" r="6" fill="#D1D5DB"/>
            </svg>
        `,
        noSearch: `
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
                <circle cx="90" cy="90" r="35" stroke="#E5E7EB" stroke-width="8"/>
                <line x1="115" y1="115" x2="145" y2="145" stroke="#E5E7EB" stroke-width="8" stroke-linecap="round"/>
                <circle cx="90" cy="90" r="20" fill="#E5E7EB"/>
                <path d="M82 85l8 8m0-8l-8 8" stroke="#D1D5DB" stroke-width="3" stroke-linecap="round"/>
            </svg>
        `,
        noNotifications: `
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
                <path d="M100 55c-20 0-35 15-35 35v30l-10 15h90l-10-15V90c0-20-15-35-35-35z" fill="#E5E7EB"/>
                <circle cx="100" cy="145" r="12" fill="#E5E7EB"/>
                <circle cx="100" cy="145" r="8" fill="#D1D5DB"/>
            </svg>
        `,
        noCalendar: `
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#F3F4F6"/>
                <rect x="50" y="55" width="100" height="95" rx="10" fill="#E5E7EB"/>
                <rect x="50" y="55" width="100" height="25" rx="10" fill="#D1D5DB"/>
                <rect x="65" y="50" width="8" height="15" rx="4" fill="#9CA3AF"/>
                <rect x="127" y="50" width="8" height="15" rx="4" fill="#9CA3AF"/>
                <g fill="#D1D5DB">
                    <rect x="62" y="92" width="18" height="18" rx="4"/>
                    <rect x="91" y="92" width="18" height="18" rx="4"/>
                    <rect x="120" y="92" width="18" height="18" rx="4"/>
                    <rect x="62" y="120" width="18" height="18" rx="4"/>
                    <rect x="91" y="120" width="18" height="18" rx="4"/>
                </g>
                <rect x="120" y="120" width="18" height="18" rx="4" fill="#E8681A" opacity="0.3"/>
            </svg>
        `
    },

    /**
     * Renderiza um empty state
     * @param {string} type - Tipo do empty state
     * @param {object} options - Opções de customização
     */
    render: function(type, options = {}) {
        const defaults = {
            noData: {
                title: 'Nenhum dado encontrado',
                description: 'Não há informações para exibir no momento. Tente adicionar novos itens.',
                actionText: 'Adicionar Novo',
                actionIcon: 'bi-plus-lg'
            },
            noReunions: {
                title: 'Nenhuma reunião agendada',
                description: 'Você não tem reuniões programadas. Agende uma nova reunião para começar.',
                actionText: 'Agendar Reunião',
                actionIcon: 'bi-calendar-plus'
            },
            noDocuments: {
                title: 'Nenhum documento',
                description: 'Esta pasta está vazia. Faça upload de documentos para organizar seus arquivos.',
                actionText: 'Upload de Documento',
                actionIcon: 'bi-upload'
            },
            noActions: {
                title: 'Nenhuma ação pendente',
                description: 'Parabéns! Você não tem ações pendentes no momento.',
                actionText: null,
                actionIcon: null
            },
            noMessages: {
                title: 'Nenhuma mensagem',
                description: 'Sua caixa de entrada está vazia. Novas mensagens aparecerão aqui.',
                actionText: 'Nova Mensagem',
                actionIcon: 'bi-envelope-plus'
            },
            noSearch: {
                title: 'Nenhum resultado encontrado',
                description: 'Não encontramos resultados para sua busca. Tente usar outros termos.',
                actionText: null,
                actionIcon: null
            },
            noNotifications: {
                title: 'Nenhuma notificação',
                description: 'Você está em dia! Não há notificações novas.',
                actionText: null,
                actionIcon: null
            },
            noCalendar: {
                title: 'Nenhum evento hoje',
                description: 'Não há eventos agendados para esta data. Aproveite o dia!',
                actionText: 'Novo Evento',
                actionIcon: 'bi-calendar-plus'
            }
        };

        const config = { ...defaults[type], ...options };
        const illustration = this.illustrations[type] || this.illustrations.noData;

        let actionHtml = '';
        if (config.actionText) {
            actionHtml = `
                <div class="empty-state-action">
                    <button class="btn btn-primary btn-ripple" ${config.actionHandler ? `onclick="${config.actionHandler}"` : ''}>
                        <i class="bi ${config.actionIcon} me-2"></i>${config.actionText}
                    </button>
                </div>
            `;
        }

        return `
            <div class="empty-state fade-in">
                <div class="empty-state-illustration">
                    ${illustration}
                </div>
                <h3 class="empty-state-title">${config.title}</h3>
                <p class="empty-state-description">${config.description}</p>
                ${actionHtml}
            </div>
        `;
    },

    /**
     * Injeta um empty state em um container
     * @param {string|HTMLElement} container - Seletor ou elemento
     * @param {string} type - Tipo do empty state
     * @param {object} options - Opções de customização
     */
    inject: function(container, type, options = {}) {
        const el = typeof container === 'string' ? document.querySelector(container) : container;
        if (el) {
            el.innerHTML = this.render(type, options);
        }
    }
};

// Expor globalmente
window.EmptyStates = EmptyStates;
