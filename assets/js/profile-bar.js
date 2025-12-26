/**
 * MiraBoard - Profile Bar Component
 * Barra de identificação do perfil do usuário
 * Exibe qual cenário/perfil está sendo navegado
 */

const ProfileBarComponent = {
    /**
     * Configurações dos perfis
     */
    profiles: {
        admin: {
            name: 'Admin Master',
            description: 'Acesso completo ao sistema',
            color: '#7C3AED',
            bgColor: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            icon: 'bi-shield-lock'
        },
        secretaria: {
            name: 'Secretária',
            description: 'Perfil operacional',
            color: '#059669',
            bgColor: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            icon: 'bi-person-workspace'
        },
        conselheiro: {
            name: 'Conselheiro',
            description: 'Perfil consultivo',
            color: '#2563EB',
            bgColor: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            icon: 'bi-person-badge'
        }
    },

    /**
     * Inicializa a barra de perfil
     */
    init: function() {
        const profile = localStorage.getItem('miraboard_user_profile') || 'admin';
        this.injectStyles();
        this.render(profile);
    },

    /**
     * Injeta os estilos CSS
     */
    injectStyles: function() {
        if (document.getElementById('profile-bar-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'profile-bar-styles';
        styles.textContent = `
            .profile-bar {
                position: fixed;
                top: 0;
                left: var(--sidebar-width, 260px);
                right: 0;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-size: 0.8rem;
                font-weight: 500;
                color: white;
                z-index: 1050;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .profile-bar i {
                font-size: 0.9rem;
            }
            
            .profile-bar .profile-bar-text {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .profile-bar .profile-bar-desc {
                opacity: 0.85;
                font-weight: 400;
                display: none;
            }
            
            @media (min-width: 768px) {
                .profile-bar .profile-bar-desc {
                    display: inline;
                }
            }
            
            .profile-bar .btn-change-profile {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 0.7rem;
                padding: 2px 10px;
                border-radius: 12px;
                cursor: pointer;
                margin-left: 8px;
                transition: all 0.2s;
            }
            
            .profile-bar .btn-change-profile:hover {
                background: rgba(255,255,255,0.3);
            }
            
            /* Ajusta o header para ficar abaixo da barra */
            .app-header {
                top: 36px !important;
            }
            
            /* Ajusta o conteúdo principal */
            .main-content {
                padding-top: calc(80px + 36px) !important;
            }
            
            /* Mobile: barra ocupa toda largura */
            @media (max-width: 991.98px) {
                .profile-bar {
                    left: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    },

    /**
     * Renderiza a barra de perfil
     */
    render: function(profileKey) {
        const profile = this.profiles[profileKey] || this.profiles.admin;
        
        // Remove barra existente se houver
        const existing = document.querySelector('.profile-bar');
        if (existing) existing.remove();
        
        // Cria a barra
        const bar = document.createElement('div');
        bar.className = 'profile-bar';
        bar.style.background = profile.bgColor;
        
        bar.innerHTML = `
            <div class="profile-bar-text">
                <i class="bi ${profile.icon}"></i>
                <span>Navegando como <strong>${profile.name}</strong></span>
                <span class="profile-bar-desc">• ${profile.description}</span>
            </div>
            <button class="btn-change-profile" onclick="window.location.href='selecao-perfil.html'">
                <i class="bi bi-arrow-repeat"></i> Trocar perfil
            </button>
        `;
        
        // Insere no início do body
        document.body.insertBefore(bar, document.body.firstChild);
    },

    /**
     * Retorna o perfil atual
     */
    getCurrentProfile: function() {
        return localStorage.getItem('miraboard_user_profile') || 'admin';
    },

    /**
     * Verifica se o usuário tem um perfil específico
     */
    isProfile: function(profile) {
        return this.getCurrentProfile() === profile;
    },

    /**
     * Verifica se é admin
     */
    isAdmin: function() {
        return this.isProfile('admin');
    },

    /**
     * Verifica se é secretária
     */
    isSecretaria: function() {
        return this.isProfile('secretaria');
    },

    /**
     * Verifica se é conselheiro
     */
    isConselheiro: function() {
        return this.isProfile('conselheiro');
    },

    /**
     * Personaliza as notificações baseado no perfil
     * Admin/Secretária veem notificações operacionais
     * Conselheiro vê notificações de participação
     */
    customizeNotifications: function() {
        const profile = this.getCurrentProfile();
        const notificationBadge = document.getElementById('notificationCount');
        
        // Aplica visibilidade das notificações baseado no perfil
        document.querySelectorAll('.notification-item[data-permission]').forEach(item => {
            const allowedProfiles = item.getAttribute('data-permission').split(' ');
            if (!allowedProfiles.includes(profile)) {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
            }
        });
        
        // Conta notificações visíveis não lidas
        const visibleUnread = document.querySelectorAll('.notification-item.unread:not([style*="display: none"])').length;
        
        if (notificationBadge) {
            notificationBadge.textContent = visibleUnread;
            // Esconde badge se não há notificações
            notificationBadge.style.display = visibleUnread > 0 ? 'flex' : 'none';
        }
    }
};

// Inicializa automaticamente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    ProfileBarComponent.init();
    // Aguarda um pouco para garantir que o sidebar processou as permissões
    setTimeout(() => {
        ProfileBarComponent.customizeNotifications();
    }, 100);
});
