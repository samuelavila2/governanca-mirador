/**
 * MiraBoard - Breadcrumbs Component
 * Navegação por breadcrumbs automática
 */

const Breadcrumbs = {
    // Mapeamento de páginas
    pages: {
        'dashboard.html': { title: 'Dashboard', icon: 'bi-speedometer2' },
        'calendario-consolidado.html': { title: 'Calendário', icon: 'bi-calendar3' },
        'reunioes.html': { title: 'Reuniões', icon: 'bi-people' },
        'reuniao-detalhe.html': { title: 'Detalhes da Reunião', icon: 'bi-file-earmark-text', parent: 'reunioes.html' },
        'atas.html': { title: 'Atas', icon: 'bi-file-text' },
        'ata-detalhe.html': { title: 'Detalhes da Ata', icon: 'bi-file-text-fill', parent: 'atas.html' },
        'acoes.html': { title: 'Ações', icon: 'bi-check2-square' },
        'documentos.html': { title: 'Repositório', icon: 'bi-folder2-open' },
        'obrigacoes.html': { title: 'Central de Conformidade', icon: 'bi-shield-check' },
        'biblioteca.html': { title: 'Gestão Documental', icon: 'bi-archive' },
        'membros.html': { title: 'Certificações', icon: 'bi-person-badge' },
        'mensagens.html': { title: 'Mensagens', icon: 'bi-chat-dots' },
        'relatorios.html': { title: 'Relatórios', icon: 'bi-graph-up' },
        'configuracoes.html': { title: 'Configurações', icon: 'bi-gear' }
    },

    init: function() {
        this.render();
    },

    getCurrentPage: function() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'dashboard.html';
        return fileName;
    },

    buildBreadcrumbTrail: function() {
        const currentPage = this.getCurrentPage();
        const trail = [];

        // Always start with Dashboard
        if (currentPage !== 'dashboard.html') {
            trail.push({
                href: 'dashboard.html',
                title: 'Dashboard',
                icon: 'bi-house',
                isHome: true
            });
        }

        // Add parent if exists
        const pageConfig = this.pages[currentPage];
        if (pageConfig && pageConfig.parent) {
            const parentConfig = this.pages[pageConfig.parent];
            if (parentConfig) {
                trail.push({
                    href: pageConfig.parent,
                    title: parentConfig.title,
                    icon: parentConfig.icon,
                    isHome: false
                });
            }
        }

        // Add current page
        if (pageConfig) {
            trail.push({
                href: null, // Current page, no link
                title: pageConfig.title,
                icon: pageConfig.icon,
                isHome: false,
                isCurrent: true
            });
        }

        return trail;
    },

    render: function() {
        const currentPage = this.getCurrentPage();
        
        // Don't render on dashboard
        if (currentPage === 'dashboard.html') {
            return;
        }

        const trail = this.buildBreadcrumbTrail();
        
        if (trail.length < 2) {
            return; // No need for breadcrumb with just one item
        }

        const breadcrumbHtml = `
            <nav class="breadcrumb-nav" aria-label="Navegação">
                ${trail.map((item, index) => {
                    const isLast = index === trail.length - 1;
                    
                    if (item.isHome) {
                        return `
                            <a href="${item.href}" class="breadcrumb-item" aria-label="Início">
                                <span class="breadcrumb-home">
                                    <i class="bi ${item.icon}"></i>
                                </span>
                            </a>
                            <span class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></span>
                        `;
                    }
                    
                    if (isLast) {
                        return `
                            <span class="breadcrumb-item active" aria-current="page">
                                ${item.title}
                            </span>
                        `;
                    }
                    
                    return `
                        <a href="${item.href}" class="breadcrumb-item">
                            ${item.title}
                        </a>
                        <span class="breadcrumb-separator"><i class="bi bi-chevron-right"></i></span>
                    `;
                }).join('')}
            </nav>
        `;

        // Find insertion point (before page header or content wrapper)
        const insertionPoints = [
            '.content-wrapper',
            '.main-content',
            'main'
        ];

        for (const selector of insertionPoints) {
            const container = document.querySelector(selector);
            if (container) {
                // Check if breadcrumb already exists
                if (!container.querySelector('.breadcrumb-nav')) {
                    container.insertAdjacentHTML('afterbegin', breadcrumbHtml);
                }
                break;
            }
        }
    }
};

// Auto-initialize after DOM is ready and sidebar is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for sidebar to load
    setTimeout(() => Breadcrumbs.init(), 100);
});

window.Breadcrumbs = Breadcrumbs;
