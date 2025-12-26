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
            menu: ['dashboard', 'calendario-consolidado', 'reunioes', 'atas', 'acoes', 
                   'obrigacoes', 'biblioteca', 'membros', 'mensagens', 'comunicados', 'relatorios', 'configuracoes', 'administracao'],
            userName: 'Admin Master',
            userRole: 'Administrador',
            avatarBg: '7C3AED'
        },
        secretaria: {
            menu: ['dashboard', 'calendario-consolidado', 'reunioes', 'atas', 'acoes', 
                   'obrigacoes', 'biblioteca', 'membros', 'mensagens', 'comunicados', 'configuracoes'],
            userName: 'Maria Silva',
            userRole: 'Secretária Executiva',
            avatarBg: '059669'
        },
        conselheiro: {
            menu: ['dashboard', 'calendario-consolidado', 'reunioes', 'atas', 'acoes', 
                   'obrigacoes', 'biblioteca', 'membros', 'mensagens'],
            userName: 'João Conselheiro',
            userRole: 'Conselheiro Deliberativo',
            avatarBg: '2563EB'
        }
    },

    getCurrentProfile: function() {
        return localStorage.getItem('miraboard_user_profile') || 'admin';
    },

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
    
    render: function(activePage) {
        const profile = this.getCurrentProfile();
        const permissions = this.permissions[profile] || this.permissions.admin;
        const menuItems = this.getMenuItems(profile);
        
        return '<div class="sidebar-header">' +
            '<a href="dashboard.html" class="sidebar-brand">' +
                '<img src="../assets/img/logo-miraboard.png" alt="MiraBoard" class="sidebar-logo-img">' +
            '</a>' +
            '<button class="sidebar-collapse-btn" id="sidebarCollapseBtn" title="Recolher menu">' +
                '<i class="bi bi-chevron-left"></i>' +
            '</button>' +
            '<button class="sidebar-toggle d-lg-none" id="sidebarClose">' +
                '<i class="bi bi-x-lg"></i>' +
            '</button>' +
        '</div>' +
        '<nav class="sidebar-menu">' +
            this.renderMenuSection(menuItems.main, activePage) +
            '<div class="sidebar-divider"></div>' +
            '<div class="sidebar-section-title" style="color: #9ca3af; font-size: 0.7rem; text-transform: uppercase; padding: 0 16px; margin-bottom: 8px;">Compliance EFPC</div>' +
            this.renderMenuSection(menuItems.compliance, activePage) +
            '<div class="sidebar-divider"></div>' +
            this.renderMenuSection(menuItems.settings, activePage) +
            (profile === 'admin' ? '<div class="sidebar-divider"></div>' + this.renderMenuSection(menuItems.admin, activePage) : '') +
        '</nav>' +
        '<div class="sidebar-footer">' +
            '<div class="sidebar-user">' +
                '<div class="avatar avatar-md">' +
                    '<img src="https://ui-avatars.com/api/?name=' + encodeURIComponent(permissions.userName) + '&background=' + permissions.avatarBg + '&color=fff" alt="' + permissions.userName + '">' +
                '</div>' +
                '<div class="sidebar-user-info">' +
                    '<span class="sidebar-user-name">' + permissions.userName + '</span>' +
                    '<span class="sidebar-user-role">' + permissions.userRole + '</span>' +
                '</div>' +
            '</div>' +
        '</div>';
    },
    
    getMenuItems: function(profile) {
        var allowedMenus = this.permissions[profile] ? this.permissions[profile].menu : this.permissions.admin.menu;
        
        var allItems = {
            main: [
                { id: 'dashboard', href: 'dashboard.html', icon: 'bi-speedometer2', label: 'Dashboard' },
                { id: 'calendario-consolidado', href: 'calendario-consolidado.html', icon: 'bi-calendar3', label: 'Calendário' },
                { id: 'reunioes', href: 'reunioes.html', icon: 'bi-people', label: 'Reuniões', badge: '3' },
                { id: 'atas', href: 'atas.html', icon: 'bi-file-text', label: 'Atas' },
                { id: 'acoes', href: 'acoes.html', icon: 'bi-check2-square', label: 'Ações', badge: '5', badgeType: 'warning' }
            ],
            compliance: [
                { id: 'obrigacoes', href: 'obrigacoes.html', icon: 'bi-shield-check', label: 'Central de Conformidade', badge: '2', badgeType: 'danger' },
                { id: 'biblioteca', href: 'biblioteca.html', icon: 'bi-archive', label: 'Gestão Documental' },
                { id: 'membros', href: 'membros.html', icon: 'bi-person-badge', label: 'Mandatos e Certificações' }
            ],
            settings: [
                { id: 'mensagens', href: 'mensagens.html', icon: 'bi-chat-dots', label: 'Mensagens', badge: '12' },
                { id: 'comunicados', href: 'comunicados.html', icon: 'bi-megaphone', label: 'Comunicados', badge: '2', badgeType: 'warning' },
                { id: 'relatorios', href: 'relatorios.html', icon: 'bi-graph-up', label: 'Relatórios' },
                { id: 'configuracoes', href: 'configuracoes.html', icon: 'bi-gear', label: 'Configurações' }
            ],
            admin: [
                { id: 'administracao', href: 'administracao.html', icon: 'bi-sliders', label: 'Administração' }
            ]
        };
        
        return {
            main: allItems.main.filter(function(item) { return allowedMenus.indexOf(item.id) !== -1; }),
            compliance: allItems.compliance.filter(function(item) { return allowedMenus.indexOf(item.id) !== -1; }),
            settings: allItems.settings.filter(function(item) { return allowedMenus.indexOf(item.id) !== -1; }),
            admin: allItems.admin.filter(function(item) { return allowedMenus.indexOf(item.id) !== -1; })
        };
    },
    
    renderMenuSection: function(items, activePage) {
        if (items.length === 0) return '';
        
        var html = '<ul class="sidebar-nav">';
        
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isActive = item.id === activePage;
            var activeClass = isActive ? ' active' : '';
            
            var badgeHtml = '';
            if (item.badge) {
                var badgeStyle = '';
                if (item.badgeType === 'danger') {
                    badgeStyle = ' style="background: #dc3545;"';
                } else if (item.badgeType === 'warning') {
                    badgeStyle = ' style="background: #f59e0b;"';
                }
                badgeHtml = '<span class="sidebar-badge"' + badgeStyle + '>' + item.badge + '</span>';
            }
            
            html += '<li class="sidebar-nav-item">' +
                '<a href="' + item.href + '" class="sidebar-nav-link' + activeClass + '" data-tooltip="' + item.label + '">' +
                    '<i class="bi ' + item.icon + '"></i>' +
                    '<span>' + item.label + '</span>' +
                    badgeHtml +
                '</a>' +
            '</li>';
        }
        
        html += '</ul>';
        return html;
    },
    
    applyPermissions: function() {
        var profile = this.getCurrentProfile();
        
        document.querySelectorAll('[data-permission]').forEach(function(el) {
            var allowedProfiles = el.dataset.permission.split(' ');
            if (allowedProfiles.indexOf(profile) === -1) {
                el.style.display = 'none';
            }
        });
        
        document.querySelectorAll('[data-hide-for]').forEach(function(el) {
            var hiddenProfiles = el.dataset.hideFor.split(' ');
            if (hiddenProfiles.indexOf(profile) !== -1) {
                el.style.display = 'none';
            }
        });
        
        document.querySelectorAll('[data-readonly-for]').forEach(function(el) {
            var readonlyProfiles = el.dataset.readonlyFor.split(' ');
            if (readonlyProfiles.indexOf(profile) !== -1) {
                el.disabled = true;
                el.classList.add('disabled');
                el.style.pointerEvents = 'none';
                el.style.opacity = '0.6';
            }
        });
    },
    
    bindEvents: function() {
        var self = this;
        
        var sidebarClose = document.getElementById('sidebarClose');
        if (sidebarClose) {
            sidebarClose.addEventListener('click', function() {
                document.querySelector('.sidebar').classList.remove('active');
                document.body.classList.remove('sidebar-open');
            });
        }
        
        var sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                document.querySelector('.sidebar').classList.toggle('active');
                document.body.classList.toggle('sidebar-open');
            });
        }
        
        // Botão de colapsar sidebar
        var collapseBtn = document.getElementById('sidebarCollapseBtn');
        if (collapseBtn) {
            // Verifica estado salvo
            var isCollapsed = localStorage.getItem('miraboard_sidebar_collapsed') === 'true';
            if (isCollapsed) {
                document.body.classList.add('sidebar-collapsed');
            }
            
            collapseBtn.addEventListener('click', function() {
                document.body.classList.toggle('sidebar-collapsed');
                var collapsed = document.body.classList.contains('sidebar-collapsed');
                localStorage.setItem('miraboard_sidebar_collapsed', collapsed);
                
                // Rotaciona o ícone
                var icon = this.querySelector('i');
                if (collapsed) {
                    icon.className = 'bi bi-chevron-right';
                    this.title = 'Expandir menu';
                } else {
                    icon.className = 'bi bi-chevron-left';
                    this.title = 'Recolher menu';
                }
            });
            
            // Define ícone inicial baseado no estado
            if (isCollapsed) {
                collapseBtn.querySelector('i').className = 'bi bi-chevron-right';
                collapseBtn.title = 'Expandir menu';
            }
        }
    }
};

function getActivePageFromURL() {
    var path = window.location.pathname;
    var filename = path.substring(path.lastIndexOf('/') + 1);
    
    var pageMap = {
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
        'comunicados.html': 'comunicados',
        'relatorios.html': 'relatorios',
        'configuracoes.html': 'configuracoes',
        'administracao.html': 'administracao'
    };
    
    return pageMap[filename] || 'dashboard';
}

document.addEventListener('DOMContentLoaded', function() {
    var activePage = getActivePageFromURL();
    SidebarComponent.init(activePage);
});
