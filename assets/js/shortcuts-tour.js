/**
 * MiraBoard - Keyboard Shortcuts & Tour Component
 * Sistema de atalhos de teclado e tour de onboarding
 */

const KeyboardShortcuts = {
    shortcuts: [
        { category: 'Navegação', items: [
            { keys: ['⌘', 'K'], label: 'Busca global' },
            { keys: ['G', 'D'], label: 'Ir para Dashboard' },
            { keys: ['G', 'R'], label: 'Ir para Reuniões' },
            { keys: ['G', 'C'], label: 'Ir para Calendário' },
            { keys: ['G', 'A'], label: 'Ir para Ações' }
        ]},
        { category: 'Ações', items: [
            { keys: ['N'], label: 'Novo item' },
            { keys: ['E'], label: 'Editar selecionado' },
            { keys: ['Delete'], label: 'Excluir selecionado' },
            { keys: ['⌘', 'S'], label: 'Salvar' },
            { keys: ['Esc'], label: 'Fechar modal / Cancelar' }
        ]},
        { category: 'Visualização', items: [
            { keys: ['?'], label: 'Mostrar atalhos' },
            { keys: ['F'], label: 'Tela cheia' },
            { keys: ['/'], label: 'Focar na busca' }
        ]}
    ],
    
    isOpen: false,
    goPrefix: false,
    goTimeout: null,

    init: function() {
        this.createModal();
        this.bindShortcuts();
        console.log('KeyboardShortcuts initialized - Press ? for help');
    },

    createModal: function() {
        const modal = document.createElement('div');
        modal.id = 'shortcutsModal';
        modal.className = 'shortcuts-modal';
        modal.innerHTML = `
            <div class="shortcuts-backdrop"></div>
            <div class="shortcuts-dialog">
                <div class="shortcuts-header">
                    <h3 class="shortcuts-title">
                        <i class="bi bi-keyboard"></i>
                        Atalhos de Teclado
                    </h3>
                    <button class="shortcuts-close" aria-label="Fechar">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="shortcuts-body">
                    ${this.renderShortcuts()}
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Bind events
        modal.querySelector('.shortcuts-backdrop').addEventListener('click', () => this.close());
        modal.querySelector('.shortcuts-close').addEventListener('click', () => this.close());
    },

    renderShortcuts: function() {
        return this.shortcuts.map(section => `
            <div class="shortcuts-section">
                <h4 class="shortcuts-section-title">${section.category}</h4>
                ${section.items.map(item => `
                    <div class="shortcut-item">
                        <span class="shortcut-label">${item.label}</span>
                        <div class="shortcut-keys">
                            ${item.keys.map(key => `<kbd>${key}</kbd>`).join('<span>+</span>')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    },

    bindShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input
            if (e.target.matches('input, textarea, select, [contenteditable]')) return;
            
            // ? for shortcuts help
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.toggle();
                return;
            }

            // Escape to close
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
                return;
            }

            // G prefix for navigation
            if (e.key.toLowerCase() === 'g' && !this.goPrefix) {
                this.goPrefix = true;
                clearTimeout(this.goTimeout);
                this.goTimeout = setTimeout(() => { this.goPrefix = false; }, 1000);
                return;
            }

            // Navigation shortcuts (G + key)
            if (this.goPrefix) {
                this.goPrefix = false;
                clearTimeout(this.goTimeout);
                
                const routes = {
                    'd': 'dashboard.html',
                    'r': 'reunioes.html',
                    'c': 'calendario-consolidado.html',
                    'a': 'acoes.html',
                    't': 'atas.html',
                    'o': 'obrigacoes.html',
                    'm': 'mensagens.html'
                };

                if (routes[e.key.toLowerCase()]) {
                    e.preventDefault();
                    window.location.href = routes[e.key.toLowerCase()];
                }
                return;
            }

            // / to focus search
            if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                if (typeof GlobalSearch !== 'undefined') {
                    GlobalSearch.open();
                }
            }

            // N for new item
            if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
                const newBtn = document.querySelector('[data-shortcut="new"], .btn-primary:has(.bi-plus-lg)');
                if (newBtn) {
                    e.preventDefault();
                    newBtn.click();
                }
            }

            // F for fullscreen
            if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    document.documentElement.requestFullscreen();
                }
            }
        });
    },

    toggle: function() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open: function() {
        const modal = document.getElementById('shortcutsModal');
        if (modal) {
            modal.classList.add('open');
            this.isOpen = true;
        }
    },

    close: function() {
        const modal = document.getElementById('shortcutsModal');
        if (modal) {
            modal.classList.remove('open');
            this.isOpen = false;
        }
    }
};

/**
 * Onboarding Tour
 */
const OnboardingTour = {
    steps: [
        {
            target: '.sidebar',
            title: 'Menu de Navegação',
            text: 'Use o menu lateral para acessar todas as funcionalidades do sistema. Você pode recolhê-lo clicando no botão do menu.',
            position: 'right'
        },
        {
            target: '.header-search',
            title: 'Busca Global',
            text: 'Encontre rapidamente reuniões, documentos e ações. Use o atalho ⌘K (ou Ctrl+K) para abrir a busca de qualquer lugar.',
            position: 'bottom'
        },
        {
            target: '.notification-bell',
            title: 'Notificações',
            text: 'Fique por dentro de atualizações importantes, novos documentos e lembretes de reuniões.',
            position: 'bottom'
        },
        {
            target: '.stat-card:first-child',
            title: 'Métricas do Dashboard',
            text: 'Acompanhe os principais indicadores de governança da sua entidade em tempo real.',
            position: 'bottom'
        },
        {
            target: '.sidebar-nav a[href*="reunioes"]',
            title: 'Reuniões',
            text: 'Gerencie todas as reuniões dos órgãos estatutários, convocações e pautas.',
            position: 'right'
        }
    ],

    currentStep: 0,
    isActive: false,

    init: function() {
        // Check if tour was completed
        if (localStorage.getItem('miraboard_tour_completed') === 'true') {
            return;
        }

        // Check if it's dashboard (only show on dashboard)
        if (!window.location.pathname.includes('dashboard')) {
            return;
        }

        // Show tour prompt after 2 seconds
        setTimeout(() => this.showPrompt(), 2000);
    },

    showPrompt: function() {
        const prompt = document.createElement('div');
        prompt.id = 'tourPrompt';
        prompt.className = 'tour-prompt';
        prompt.innerHTML = `
            <div class="tour-prompt-content">
                <div class="tour-prompt-icon">
                    <i class="bi bi-lightbulb"></i>
                </div>
                <div class="tour-prompt-text">
                    <h4>Bem-vindo ao MiraBoard!</h4>
                    <p>Deseja fazer um tour rápido pelo sistema?</p>
                </div>
                <div class="tour-prompt-actions">
                    <button class="tour-btn tour-btn-skip" id="tourSkip">Pular</button>
                    <button class="tour-btn tour-btn-next" id="tourStart">Iniciar Tour</button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .tour-prompt {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9000;
                animation: slideInUp 0.3s ease;
            }
            .tour-prompt-content {
                display: flex;
                align-items: center;
                gap: 16px;
                background: #ffffff;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                border-left: 4px solid #E8681A;
            }
            .tour-prompt-icon {
                width: 48px;
                height: 48px;
                background: #FEF3C7;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #F59E0B;
                font-size: 24px;
            }
            .tour-prompt-text h4 {
                font-size: 16px;
                font-weight: 600;
                color: #1F2937;
                margin: 0 0 4px 0;
            }
            .tour-prompt-text p {
                font-size: 14px;
                color: #6B7280;
                margin: 0;
            }
            .tour-prompt-actions {
                display: flex;
                gap: 8px;
                margin-left: 16px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(prompt);

        // Bind events
        document.getElementById('tourSkip').addEventListener('click', () => {
            prompt.remove();
            localStorage.setItem('miraboard_tour_completed', 'true');
        });

        document.getElementById('tourStart').addEventListener('click', () => {
            prompt.remove();
            this.start();
        });
    },

    start: function() {
        this.isActive = true;
        this.currentStep = 0;
        this.createOverlay();
        this.showStep(0);
    },

    createOverlay: function() {
        const overlay = document.createElement('div');
        overlay.id = 'tourOverlay';
        overlay.className = 'tour-overlay';
        overlay.innerHTML = `
            <div class="tour-spotlight" id="tourSpotlight"></div>
        `;
        document.body.appendChild(overlay);
    },

    showStep: function(index) {
        if (index >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[index];
        const target = document.querySelector(step.target);

        if (!target) {
            // Skip to next step if target not found
            this.showStep(index + 1);
            return;
        }

        // Position spotlight
        const rect = target.getBoundingClientRect();
        const spotlight = document.getElementById('tourSpotlight');
        spotlight.style.top = (rect.top - 8) + 'px';
        spotlight.style.left = (rect.left - 8) + 'px';
        spotlight.style.width = (rect.width + 16) + 'px';
        spotlight.style.height = (rect.height + 16) + 'px';

        // Remove existing tooltip
        const existingTooltip = document.querySelector('.tour-tooltip');
        if (existingTooltip) existingTooltip.remove();

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tour-tooltip';
        tooltip.innerHTML = `
            <div class="tour-tooltip-arrow ${step.position}"></div>
            <div class="tour-tooltip-content">
                <h4 class="tour-tooltip-title">${step.title}</h4>
                <p class="tour-tooltip-text">${step.text}</p>
                <div class="tour-tooltip-footer">
                    <div class="tour-progress">
                        ${this.steps.map((_, i) => `
                            <div class="tour-progress-dot ${i < index ? 'completed' : ''} ${i === index ? 'active' : ''}"></div>
                        `).join('')}
                    </div>
                    <div class="tour-buttons">
                        <button class="tour-btn tour-btn-skip" id="tourSkipStep">Pular</button>
                        <button class="tour-btn tour-btn-next" id="tourNextStep">
                            ${index === this.steps.length - 1 ? 'Concluir' : 'Próximo'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(tooltip);

        // Position tooltip
        this.positionTooltip(tooltip, rect, step.position);

        // Bind events
        document.getElementById('tourSkipStep').addEventListener('click', () => this.complete());
        document.getElementById('tourNextStep').addEventListener('click', () => {
            this.currentStep++;
            this.showStep(this.currentStep);
        });
    },

    positionTooltip: function(tooltip, targetRect, position) {
        const tooltipRect = tooltip.getBoundingClientRect();
        let top, left;

        switch(position) {
            case 'bottom':
                top = targetRect.bottom + 16;
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'top':
                top = targetRect.top - tooltipRect.height - 16;
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                left = targetRect.left - tooltipRect.width - 16;
                break;
            case 'right':
            default:
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                left = targetRect.right + 16;
                break;
        }

        // Keep within viewport
        left = Math.max(16, Math.min(left, window.innerWidth - tooltipRect.width - 16));
        top = Math.max(16, Math.min(top, window.innerHeight - tooltipRect.height - 16));

        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
    },

    complete: function() {
        this.isActive = false;
        localStorage.setItem('miraboard_tour_completed', 'true');

        // Remove tour elements
        const overlay = document.getElementById('tourOverlay');
        const tooltip = document.querySelector('.tour-tooltip');
        
        if (overlay) overlay.remove();
        if (tooltip) tooltip.remove();

        // Show completion toast
        if (typeof FakeActions !== 'undefined' && FakeActions.showToast) {
            FakeActions.showToast('Tour concluído! Pressione ? para ver os atalhos de teclado.', 'success', 5000);
        }
    },

    reset: function() {
        localStorage.removeItem('miraboard_tour_completed');
        console.log('Tour reset. Reload the dashboard to see it again.');
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    KeyboardShortcuts.init();
    OnboardingTour.init();
});

// Expose globally
window.KeyboardShortcuts = KeyboardShortcuts;
window.OnboardingTour = OnboardingTour;
