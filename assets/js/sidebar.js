/**
 * MiraBoard - Sidebar Component
 * Componente reutilizável do menu lateral
 * Injeta o mesmo sidebar em todas as páginas
 */

const SidebarComponent = {
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
    },
    
    /**
     * Renderiza o HTML do sidebar
     * @param {string} activePage - Página ativa
     * @returns {string} HTML do sidebar
     */
    render: function(activePage) {
        const menuItems = this.getMenuItems();
        
        return `
            <div class="sidebar-header">
                <a href="dashboard.html" class="sidebar-brand">
                    <div class="sidebar-logo">
                        <i class="bi bi-grid-3x3-gap-fill"></i>
                    </div>
                    <span class="sidebar-brand-text">MiraBoard</span>
                </a>
                <button class="sidebar-toggle d-lg-none" id="sidebarClose">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            
            <nav class="sidebar-menu">
                ${this.renderMenuSection(menuItems.main, activePage)}
                
                <div class="sidebar-divider"></div>
                
                <div class="sidebar-section-title">Compliance EFPC</div>
                
                ${this.renderMenuSection(menuItems.compliance, activePage)}
                
                <div class="sidebar-divider"></div>
                
                ${this.renderMenuSection(menuItems.settings, activePage)}
            </nav>
            
            <div class="sidebar-footer">
                <div class="sidebar-user">
                    <div class="avatar avatar-md">
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=E8681A&color=fff" alt="Admin">
                    </div>
                    <div class="sidebar-user-info">
                        <span class="sidebar-user-name">Admin User</span>
                        <span class="sidebar-user-role">Administrador</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Retorna a estrutura do menu
     */
    getMenuItems: function() {
        return {
            main: [
                { id: 'dashboard', href: 'dashboard.html', icon: 'bi-speedometer2', label: 'Dashboard' },
                { id: 'calendario', href: 'calendario.html', icon: 'bi-calendar3', label: 'Calendário' },
                { id: 'reunioes', href: 'reunioes.html', icon: 'bi-people', label: 'Reuniões', badge: '3' },
                { id: 'atas', href: 'atas.html', icon: 'bi-file-text', label: 'Atas' },
                { id: 'acoes', href: 'acoes.html', icon: 'bi-check2-square', label: 'Ações', badge: '5', badgeType: 'warning' },
                { id: 'documentos', href: 'documentos.html', icon: 'bi-folder2-open', label: 'Documentos' }
            ],
            compliance: [
                { id: 'obrigacoes', href: 'obrigacoes.html', icon: 'bi-shield-check', label: 'Central de Conformidade', badge: '2', badgeType: 'danger' },
                { id: 'biblioteca', href: 'biblioteca.html', icon: 'bi-archive', label: 'Biblioteca Estruturada' },
                { id: 'calendario-consolidado', href: 'calendario-consolidado.html', icon: 'bi-calendar-range', label: 'Calendário Consolidado' },
                { id: 'membros', href: 'membros.html', icon: 'bi-person-badge', label: 'Certificações' }
            ],
            settings: [
                { id: 'mensagens', href: 'mensagens.html', icon: 'bi-chat-dots', label: 'Mensagens', badge: '12' },
                { id: 'relatorios', href: 'relatorios.html', icon: 'bi-graph-up', label: 'Relatórios' },
                { id: 'configuracoes', href: 'configuracoes.html', icon: 'bi-gear', label: 'Configurações' }
            ]
        };
    },
    
    /**
     * Renderiza uma seção do menu
     */
    renderMenuSection: function(items, activePage) {
        let html = '<ul class="sidebar-nav">';
        
        items.forEach(item => {
            const isActive = item.id === activePage;
            const activeClass = isActive ? ' active' : '';
            
            let badgeHtml = '';
            if (item.badge) {
                const badgeStyle = item.badgeType === 'danger' ? 'style="background: #dc3545;"' : 
                                   item.badgeType === 'warning' ? 'class="sidebar-badge warning"' : 
                                   'class="sidebar-badge"';
                badgeHtml = `<span ${badgeStyle}>${item.badge}</span>`;
                
                // Corrigir para badges com style
                if (item.badgeType === 'danger') {
                    badgeHtml = `<span class="sidebar-badge" style="background: #dc3545;">${item.badge}</span>`;
                }
            }
            
            html += `
                <li class="sidebar-nav-item">
                    <a href="${item.href}" class="sidebar-nav-link${activeClass}">
                        <i class="bi ${item.icon}"></i>
                        <span>${item.label}</span>
                        ${badgeHtml}
                    </a>
                </li>
            `;
        });
        
        html += '</ul>';
        return html;
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
