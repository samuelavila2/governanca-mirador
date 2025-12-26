/**
 * MiraBoard - Sidebar Component
 * Componente reutilizável do menu lateral
 * Injeta o mesmo sidebar em todas as páginas
 * Suporta diferentes perfis: admin, secretaria, conselheiro
 */

const SidebarComponent = {
    /**
     * Configuração de permissões por perfil
     */
    permissions: {
        admin: {
            // Admin tem acesso a tudo
            menu: ['dashboard', 'calendario-consolidado', 'reunioes', 'atas', 'acoes', 'documentos', 
                   'obrigacoes', 'biblioteca', 'membros', 'mensagens', 'relatorios', 'configuracoes'],
            userName: 'Admin Master',
            userRole: 'Administrador',
            avatarBg: '7C3AED' // Roxo
        },
        secretaria: {
            // Secretária: sem Relatórios avançados, Configurações limitadas
            menu: ['dashboard', 'calendario-consolidado', 'reunioes', 'atas', 'acoes', 'documentos', 
                   'obrigacoes', 'biblioteca', 'membros', 'mensagens', 'configuracoes'],
            userName: 'Maria Silva',
            userRole: 'Secretária Executiva',
            avatarBg: '059669' // Verde
        },
        conselheiro: {
            // Conselheiro: acesso consultivo, sem Relatórios e Configurações
            menu: ['dashboard', 'calendario-consolidado', 'reunioes', 'atas', 'acoes', 'documentos', 
                   'obrigacoes', 'biblioteca', 'membros', 'mensagens'],
            userName: 'João Conselheiro',
            userRole: 'Conselheiro Deliberativo',
            avatarBg: '2563EB' // Azul
        }
    },

    /**
     * Retorna o perfil atual
     */
    getCurrentProfile: function() {
        return localStorage.getItem('miraboard_user_profile') || 'admin';
    },

    /**
     * Inicializa o sidebar na página
     * @param {string} activePage - Nome da página ativa (ex: 'dashboard', 'reunioes')
     */
    init: function(activePage) {
        const sidebarContainer = document.getElementById('sidebar');
        if (!sidebarContainer) {
            console.error('Sidebar container não encontrado');
            return;
        }
        
        sidebarContainer.innerHTML = this.render(activePage);
        this.bindEvents();
        this.applyPermissions();
    },
    
    /**
     * Renderiza o HTML do sidebar
     * @param {string} activePage - Página ativa
     * @returns {string} HTML do sidebar
     */
    render: function(activePage) {
        const profile = this.getCurrentProfile();
        const permissions = this.permissions[profile] || this.permissions.admin;
        const menuItems = this.getMenuItems(profile);
        
        return \`
            <div class="sidebar-header">
                <a href="dashboard.html" class="sidebar-brand">
                    <img src="../assets/img/logo-miraboard.png" alt="MiraBoard" class="sidebar-logo-img">
                </a>
                <button class="sidebar-toggle d-lg-none" id="sidebarClose">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            
            <nav class="sidebar-menu">
                \${this.renderMenuSection(menuItems.main, activePage)}
                
                <div class="sidebar-divider"></div>
                
                <div class="sidebar-section-title" style="color: #9ca3af; font-size: 0.7rem; text-transform: uppercase; padding: 0 16px; margin-bottom: 8px;">Compliance EFPC</div>
                
                \${this.renderMenuSection(menuItems.compliance, activePage)}
                
                <div class="sidebar-divider"></div>
                
                \${this.renderMenuSection(menuItems.settings, activePage)}
            </nav>
            
            <div class="sidebar-footer">
                <div class="sidebar-user">
                    <div class="avatar avatar-md">
                        <img src="https://ui-avatars.com/api/?name=\${encodeURIComponent(permissions.userName)}&background=\${permissions.avatarBg}&color=fff" alt="\${permissions.userName}">
                    </div>
                    <div class="sidebar-user-info">
                        <span class="sidebar-user-name">\${permissions.userName}</span>
                        <span class="sidebar-user-role">\${permissions.userRole}</span>
                    </div>
                </div>
            </div>
        \`;
    },
    
    /**
     * Retorna a estrutura do menu baseado no perfil
     */
    getMenuItems: function(profile) {
        const allowedMenus = this.permissions[profile]?.menu || this.permissions.admin.menu;
        
        const allItems = {
            main: [
                { id: 'dashboard', href: 'dashboard.html', icon: 'bi-speedometer2', label: 'Dashboard' },
                { id: 'calendario-consolidado', href: 'calendario-consolidado.html', icon: 'bi-calendar3', label: 'Calendário' },
                { id: 'reunioes', href: 'reunioes.html', icon: 'bi-people', label: 'Reuniões', badge: '3' },
                { id: 'atas', href: 'atas.html', icon: 'bi-file-text', label: 'Atas' },
                { id: 'acoes', href: 'acoes.html', icon: 'bi-check2-square', label: 'Ações', badge: '5', badgeType: 'warning' },
                { id: 'documentos', href: 'documentos.html', icon: 'bi-folder2-open', label: 'Repositório' }
            ],
            compliance: [
                { id: 'obrigacoes', href: 'obrigacoes.html', icon: 'bi-shield-check', label: 'Central de Conformidade', badge: '2', badgeType: 'danger' },
                { id: 'biblioteca', href: 'biblioteca.html', icon: 'bi-archive', label: 'Gestão Documental' },
                { id: 'membros', href: 'membros.html', icon: 'bi-person-badge', label: 'Certificações' }
            ],
            settings: [
                { id: 'mensagens', href: 'mensagens.html', icon: 'bi-chat-dots', label: 'Mensagens', badge: '12' },
                { id: 'relatorios', href: 'relatorios.html', icon: 'bi-graph-up', label: 'Relatórios' },
                { id: 'configuracoes', href: 'configuracoes.html', icon: 'bi-gear', label: 'Configurações' }
            ]
        };
        
        // Filtrar itens baseado nas permissões
        return {
            main: allItems.main.filter(item => allowedMenus.includes(item.id)),
            compliance: allItems.compliance.filter(item => allowedMenus.includes(item.id)),
            settings: allItems.settings.filter(item => allowedMenus.includes(item.id))
        };
    },
    
    /**
     * Renderiza uma seção do menu
     */
    renderMenuSection: function(items, activePage) {
        if (items.length === 0) return '';
        
        let html = '<ul class="sidebar-nav">';
        
        items.forEach(item => {
            const isActive = item.id === activePage;
            const activeClass = isActive ? ' active' : '';
            
            let badgeHtml = '';
            if (item.badge) {
                const badgeStyle = item.badgeType === 'danger' ? 'style="background: #dc3545;"' : 
                                   item.badgeType === 'warning' ? 'class="sidebar-badge warning"' : 
                                   'class="sidebar-badge"';
                badgeHtml = \`<span \${badgeStyle}>\${item.badge}</span>\`;
                
                // Corrigir para badges com style
                if (item.badgeType === 'danger') {
                    badgeHtml = \`<span class="sidebar-badge" style="background: #dc3545;">\${item.badge}</span>\`;
                }
            }
            
            html += \`
                <li class="sidebar-nav-item">
                    <a href="\${item.href}" class="sidebar-nav-link\${activeClass}">
                        <i class="bi \${item.icon}"></i>
                        <span>\${item.label}</span>
                        \${badgeHtml}
                    </a>
                </li>
            \`;
        });
        
        html += '</ul>';
        return html;
    },
    
    /**
     * Aplica permissões de visibilidade de elementos na página
     */
    applyPermissions: function() {
        const profile = this.getCurrentProfile();
        
        // Elementos que devem ser ocultados por perfil
        // Usa atributos data-permission="admin" ou data-permission="admin,secretaria"
        document.querySelectorAll('[data-permission]').forEach(el => {
            const allowedProfiles = el.dataset.permission.split(',').map(p => p.trim());
            if (!allowedProfiles.includes(profile)) {
                el.style.display = 'none';
            }
        });
        
        // Elementos que devem ser ocultados para perfil específico
        // Usa atributo data-hide-for="conselheiro" ou data-hide-for="conselheiro,secretaria"
        document.querySelectorAll('[data-hide-for]').forEach(el => {
            const hiddenProfiles = el.dataset.hideFor.split(',').map(p => p.trim());
            if (hiddenProfiles.includes(profile)) {
                el.style.display = 'none';
            }
        });

        // Elementos read-only para conselheiro
        if (profile === 'conselheiro') {
            document.querySelectorAll('[data-readonly-for="conselheiro"]').forEach(el => {
                if (el.tagName === 'BUTTON' || el.tagName === 'A') {
                    el.classList.add('disabled');
                    el.style.pointerEvents = 'none';
                    el.style.opacity = '0.5';
                }
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                    el.disabled = true;
                }
            });
        }
    },
    
    /**
     * Vincula eventos do sidebar
     */
    bindEvents: function() {
        // Toggle sidebar em mobile
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebar = document.getElementById('sidebar');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('show');
            });
        }
        
        if (sidebarClose) {
            sidebarClose.addEventListener('click', function() {
                sidebar.classList.remove('show');
            });
        }
        
        // Fechar sidebar ao clicar fora (mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 1024) {
                if (!sidebar.contains(e.target) && !sidebarToggle?.contains(e.target)) {
                    sidebar.classList.remove('show');
                }
            }
        });
    },

    /**
     * Helpers de verificação de perfil
     */
    isAdmin: function() {
        return this.getCurrentProfile() === 'admin';
    },
    
    isSecretaria: function() {
        return this.getCurrentProfile() === 'secretaria';
    },
    
    isConselheiro: function() {
        return this.getCurrentProfile() === 'conselheiro';
    }
};

// Auto-detectar página ativa baseado na URL
function getActivePageFromURL() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    
    // Mapear filename para ID da página
    const pageMap = {
        'dashboard.html': 'dashboard',
        'calendario.html': 'calendario',
        'reunioes.html': 'reunioes',
        'reuniao-detalhe.html': 'reunioes',
        'atas.html': 'atas',
        'ata-detalhe.html': 'atas',
        'acoes.html': 'acoes',
        'documentos.html': 'documentos',
        'obrigacoes.html': 'obrigacoes',
        'biblioteca.html': 'biblioteca',
        'calendario-consolidado.html': 'calendario-consolidado',
        'membros.html': 'membros',
        'mensagens.html': 'mensagens',
        'relatorios.html': 'relatorios',
        'configuracoes.html': 'configuracoes'
    };
    
    return pageMap[filename] || 'dashboard';
}

// Inicializar automaticamente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    const activePage = getActivePageFromURL();
    SidebarComponent.init(activePage);
});
