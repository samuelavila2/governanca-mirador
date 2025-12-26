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
            /* Linha colorida fina no topo */
            .profile-bar-line {
                position: fixed;
                top: 0;
                left: var(--sidebar-width, 260px);
                right: 0;
                height: 4px;
                z-index: 1040;
            }
            
            /* Badge centralizado */
            .profile-bar-content {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.75rem;
                font-weight: 500;
                color: white;
                z-index: 1060;
                padding: 5px 14px;
                border-radius: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            
            .profile-bar-content i {
                font-size: 0.8rem;
            }
            
            .profile-bar-content .btn-change-profile {
                background: rgba(255,255,255,0.25);
                border: none;
                color: white;
                font-size: 0.65rem;
                padding: 2px 8px;
                border-radius: 10px;
                cursor: pointer;
                margin-left: 4px;
                transition: all 0.2s;
            }
            
            .profile-bar-content .btn-change-profile:hover {
                background: rgba(255,255,255,0.4);
            }
            
            /* Mobile: ajustes */
            @media (max-width: 991.98px) {
                .profile-bar-line {
                    left: 0;
                }
                .profile-bar-content {
                    font-size: 0.7rem;
                    padding: 4px 12px;
                }
            }
            
            @media (max-width: 576px) {
                .profile-bar-content span:not(.btn-change-profile) {
                    display: none;
                }
                .profile-bar-content {
                    padding: 4px 10px;
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
        
        // Remove elementos existentes se houver
        const existingLine = document.querySelector('.profile-bar-line');
        const existingContent = document.querySelector('.profile-bar-content');
        if (existingLine) existingLine.remove();
        if (existingContent) existingContent.remove();
        
        // Cria a linha colorida fina no topo
        const line = document.createElement('div');
        line.className = 'profile-bar-line';
        line.style.background = profile.bgColor;
        
        // Cria o badge flutuante centralizado
        const content = document.createElement('div');
        content.className = 'profile-bar-content';
        content.style.background = profile.bgColor;
        
        content.innerHTML = `
            <i class="bi ${profile.icon}"></i>
            <span>${profile.name}</span>
            <button class="btn-change-profile" onclick="window.location.href='selecao-perfil.html'">
                <i class="bi bi-arrow-repeat"></i> Trocar
            </button>
        `;
        
        // Adiciona a linha no topo e o badge
        document.body.insertBefore(line, document.body.firstChild);
        document.body.appendChild(content);
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
