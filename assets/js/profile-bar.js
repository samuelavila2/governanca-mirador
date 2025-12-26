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
            
            /* ========== Quick Actions Bar - Secretária ========== */
            .quick-actions-bar {
                position: fixed;
                bottom: 24px;
                right: 24px;
                display: flex;
                gap: 8px;
                z-index: 1040;
            }
            
            .fab-action-btn {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                color: white;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                transition: all 0.2s;
            }
            
            .fab-action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.25);
            }
            
            .fab-action-btn.btn-reuniao {
                background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            }
            
            .fab-action-btn.btn-ata {
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            }
            
            .fab-action-btn.btn-documento {
                background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            }
            
            .fab-action-btn .btn-tooltip {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: #1F2937;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.75rem;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s;
                margin-bottom: 8px;
            }
            
            .fab-action-btn:hover .btn-tooltip {
                opacity: 1;
            }
            
            @media (max-width: 768px) {
                .quick-actions-bar {
                    bottom: 16px;
                    right: 16px;
                }
                .fab-action-btn {
                    width: 48px;
                    height: 48px;
                    font-size: 1.1rem;
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
        
        // Renderiza Quick Actions para secretária
        if (profileKey === 'secretaria') {
            this.renderQuickActions();
        }
    },
    
    /**
     * Renderiza barra de ações rápidas para secretária
     */
    renderQuickActions: function() {
        // Remove se já existir
        var existing = document.querySelector('.quick-actions-bar');
        if (existing) existing.remove();
        
        var bar = document.createElement('div');
        bar.className = 'quick-actions-bar';
        
        bar.innerHTML = 
            '<button class="fab-action-btn btn-reuniao" onclick="ProfileBar.abrirModalNovaReuniao()" title="Nova Reunião">' +
                '<span class="btn-tooltip">Nova Reunião</span>' +
                '<i class="bi bi-calendar-plus"></i>' +
            '</button>' +
            '<button class="fab-action-btn btn-ata" onclick="window.location.href=\'atas.html\'" title="Nova Ata">' +
                '<span class="btn-tooltip">Nova Ata</span>' +
                '<i class="bi bi-file-earmark-plus"></i>' +
            '</button>' +
            '<button class="fab-action-btn btn-documento" onclick="window.location.href=\'biblioteca.html\'" title="Novo Documento">' +
                '<span class="btn-tooltip">Upload Documento</span>' +
                '<i class="bi bi-upload"></i>' +
            '</button>';
        
        document.body.appendChild(bar);
        
        // Adiciona classe ao body para que outros elementos (como biblioteca) se ajustem
        document.body.classList.add('has-quick-actions');
    },
    
    /**
     * Abre a modal de nova reunião
     */
    abrirModalNovaReuniao: function() {
        var modal = document.getElementById('novaReuniaoModal');
        if (modal) {
            var bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        } else {
            // Se não há modal na página, redireciona para reuniões
            window.location.href = 'reunioes.html';
        }
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
        var profile = this.getCurrentProfile();
        var notificationBadge = document.getElementById('notificationCount');
        
        // Aplica visibilidade das notificações baseado no perfil
        document.querySelectorAll('.notification-item[data-permission]').forEach(function(item) {
            var allowedProfiles = item.getAttribute('data-permission').split(' ');
            if (allowedProfiles.indexOf(profile) === -1) {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
            }
        });
        
        // Conta notificações visíveis não lidas
        var visibleUnread = document.querySelectorAll('.notification-item.unread:not([style*="display: none"])').length;
        
        if (notificationBadge) {
            notificationBadge.textContent = visibleUnread;
            notificationBadge.style.display = visibleUnread > 0 ? 'flex' : 'none';
        }
    }
};

// Inicializa automaticamente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    ProfileBarComponent.init();
    setTimeout(function() {
        ProfileBarComponent.customizeNotifications();
    }, 100);
});
