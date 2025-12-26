/**
 * MiraBoard - Global Search Component
 * Modal de busca estilo Spotlight/Raycast com Cmd+K
 */

const GlobalSearch = {
    isOpen: false,
    
    // Dados de busca (simulados)
    searchData: {
        reunioes: [
            { id: 1, title: 'Reunião Ordinária do Conselho Deliberativo', type: 'reuniao', date: '15/01/2025', href: 'reuniao-detalhe.html' },
            { id: 2, title: 'Reunião Extraordinária - Aprovação Orçamento', type: 'reuniao', date: '20/01/2025', href: 'reuniao-detalhe.html' },
            { id: 3, title: 'Reunião do Conselho Fiscal', type: 'reuniao', date: '25/01/2025', href: 'reuniao-detalhe.html' },
            { id: 4, title: 'Reunião da Diretoria Executiva', type: 'reuniao', date: '28/01/2025', href: 'reuniao-detalhe.html' }
        ],
        documentos: [
            { id: 1, title: 'Estatuto Social 2024', type: 'documento', category: 'Atos Societários', href: 'documentos.html' },
            { id: 2, title: 'Regimento Interno do CD', type: 'documento', category: 'Regimentos', href: 'documentos.html' },
            { id: 3, title: 'Política de Investimentos 2025', type: 'documento', category: 'Políticas', href: 'biblioteca.html' },
            { id: 4, title: 'Manual de Governança', type: 'documento', category: 'Manuais', href: 'biblioteca.html' }
        ],
        acoes: [
            { id: 1, title: 'Revisar Política de Investimentos', type: 'acao', responsavel: 'Carlos Lima', status: 'pendente', href: 'acoes.html' },
            { id: 2, title: 'Atualizar cadastro PREVIC', type: 'acao', responsavel: 'Ana Costa', status: 'em andamento', href: 'acoes.html' },
            { id: 3, title: 'Enviar DAIR', type: 'acao', responsavel: 'João Santos', status: 'concluída', href: 'acoes.html' }
        ],
        atas: [
            { id: 1, title: 'Ata CD 001/2025 - Janeiro', type: 'ata', data: '15/01/2025', href: 'ata-detalhe.html' },
            { id: 2, title: 'Ata CF 001/2025 - Janeiro', type: 'ata', data: '20/01/2025', href: 'ata-detalhe.html' },
            { id: 3, title: 'Ata DE 001/2025 - Janeiro', type: 'ata', data: '25/01/2025', href: 'ata-detalhe.html' }
        ],
        membros: [
            { id: 1, title: 'João Silva - Presidente CD', type: 'membro', orgao: 'Conselho Deliberativo', href: 'membros.html' },
            { id: 2, title: 'Maria Santos - Conselheira', type: 'membro', orgao: 'Conselho Fiscal', href: 'membros.html' },
            { id: 3, title: 'Carlos Lima - Diretor', type: 'membro', orgao: 'Diretoria Executiva', href: 'membros.html' }
        ],
        paginas: [
            { id: 1, title: 'Dashboard', type: 'pagina', icon: 'bi-speedometer2', href: 'dashboard.html' },
            { id: 2, title: 'Calendário', type: 'pagina', icon: 'bi-calendar3', href: 'calendario-consolidado.html' },
            { id: 3, title: 'Reuniões', type: 'pagina', icon: 'bi-people', href: 'reunioes.html' },
            { id: 4, title: 'Atas', type: 'pagina', icon: 'bi-file-text', href: 'atas.html' },
            { id: 5, title: 'Ações', type: 'pagina', icon: 'bi-check2-square', href: 'acoes.html' },
            { id: 6, title: 'Repositório', type: 'pagina', icon: 'bi-folder2-open', href: 'documentos.html' },
            { id: 7, title: 'Central de Conformidade', type: 'pagina', icon: 'bi-shield-check', href: 'obrigacoes.html' },
            { id: 8, title: 'Gestão Documental', type: 'pagina', icon: 'bi-archive', href: 'biblioteca.html' },
            { id: 9, title: 'Certificações', type: 'pagina', icon: 'bi-person-badge', href: 'membros.html' },
            { id: 10, title: 'Mensagens', type: 'pagina', icon: 'bi-chat-dots', href: 'mensagens.html' },
            { id: 11, title: 'Relatórios', type: 'pagina', icon: 'bi-graph-up', href: 'relatorios.html' },
            { id: 12, title: 'Configurações', type: 'pagina', icon: 'bi-gear', href: 'configuracoes.html' }
        ]
    },

    init: function() {
        this.createModal();
        this.bindKeyboardShortcuts();
        this.bindSearchInput();
        this.bindHeaderSearch();
        console.log('GlobalSearch initialized - Press Cmd+K or Ctrl+K to open');
    },

    createModal: function() {
        const modal = document.createElement('div');
        modal.id = 'globalSearchModal';
        modal.className = 'global-search-modal';
        modal.innerHTML = `
            <div class="search-backdrop"></div>
            <div class="search-dialog">
                <div class="search-header">
                    <div class="search-input-wrapper">
                        <i class="bi bi-search"></i>
                        <input type="text" id="globalSearchInput" placeholder="Buscar reuniões, documentos, ações..." autocomplete="off">
                        <kbd>ESC</kbd>
                    </div>
                </div>
                <div class="search-body">
                    <div class="search-results" id="searchResults">
                        <div class="search-section">
                            <div class="search-section-title">
                                <i class="bi bi-clock-history"></i> Acesso Rápido
                            </div>
                            <div class="search-items" id="quickAccessItems">
                                ${this.renderQuickAccess()}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="search-footer">
                    <div class="search-hints">
                        <span><kbd>↑</kbd><kbd>↓</kbd> para navegar</span>
                        <span><kbd>Enter</kbd> para selecionar</span>
                        <span><kbd>ESC</kbd> para fechar</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Bind close on backdrop click
        modal.querySelector('.search-backdrop').addEventListener('click', () => this.close());
    },

    renderQuickAccess: function() {
        const quickItems = this.searchData.paginas.slice(0, 6);
        return quickItems.map(item => `
            <a href="${item.href}" class="search-item" data-type="pagina">
                <div class="search-item-icon">
                    <i class="bi ${item.icon}"></i>
                </div>
                <div class="search-item-content">
                    <span class="search-item-title">${item.title}</span>
                    <span class="search-item-meta">Ir para página</span>
                </div>
                <i class="bi bi-arrow-return-left search-item-action"></i>
            </a>
        `).join('');
    },

    bindKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Cmd+K or Ctrl+K to open
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            
            // ESC to close
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }

            // Arrow navigation when open
            if (this.isOpen) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateResults(1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateResults(-1);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.selectCurrentResult();
                }
            }
        });
    },

    bindSearchInput: function() {
        const input = document.getElementById('globalSearchInput');
        if (!input) return;

        let debounceTimer;
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.search(e.target.value);
            }, 150);
        });
    },

    bindHeaderSearch: function() {
        // Bind click on header search to open modal
        const headerSearchInputs = document.querySelectorAll('.header-search input, .search-input-group input');
        headerSearchInputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.blur();
                this.open();
            });
        });
    },

    search: function(query) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        if (!query || query.length < 2) {
            resultsContainer.innerHTML = `
                <div class="search-section">
                    <div class="search-section-title">
                        <i class="bi bi-clock-history"></i> Acesso Rápido
                    </div>
                    <div class="search-items" id="quickAccessItems">
                        ${this.renderQuickAccess()}
                    </div>
                </div>
            `;
            return;
        }

        const results = this.performSearch(query);
        resultsContainer.innerHTML = this.renderResults(results, query);
    },

    performSearch: function(query) {
        const q = query.toLowerCase();
        const results = {
            paginas: [],
            reunioes: [],
            documentos: [],
            acoes: [],
            atas: [],
            membros: []
        };

        // Search in all categories
        Object.keys(this.searchData).forEach(category => {
            this.searchData[category].forEach(item => {
                if (item.title.toLowerCase().includes(q)) {
                    results[category].push(item);
                }
            });
        });

        return results;
    },

    renderResults: function(results, query) {
        let html = '';
        let totalResults = 0;

        const categoryConfig = {
            paginas: { title: 'Páginas', icon: 'bi-grid' },
            reunioes: { title: 'Reuniões', icon: 'bi-people' },
            documentos: { title: 'Documentos', icon: 'bi-file-earmark' },
            acoes: { title: 'Ações', icon: 'bi-check2-square' },
            atas: { title: 'Atas', icon: 'bi-file-text' },
            membros: { title: 'Membros', icon: 'bi-person' }
        };

        Object.keys(results).forEach(category => {
            if (results[category].length > 0) {
                totalResults += results[category].length;
                html += `
                    <div class="search-section">
                        <div class="search-section-title">
                            <i class="bi ${categoryConfig[category].icon}"></i> ${categoryConfig[category].title}
                        </div>
                        <div class="search-items">
                            ${results[category].map(item => this.renderSearchItem(item, query)).join('')}
                        </div>
                    </div>
                `;
            }
        });

        if (totalResults === 0) {
            html = `
                <div class="search-empty">
                    <i class="bi bi-search"></i>
                    <h4>Nenhum resultado encontrado</h4>
                    <p>Tente buscar por outro termo</p>
                </div>
            `;
        }

        return html;
    },

    renderSearchItem: function(item, query) {
        const typeIcons = {
            reuniao: 'bi-people-fill',
            documento: 'bi-file-earmark-text',
            acao: 'bi-check2-circle',
            ata: 'bi-file-text-fill',
            membro: 'bi-person-fill',
            pagina: item.icon || 'bi-grid'
        };

        const typeColors = {
            reuniao: '#E8681A',
            documento: '#3b82f6',
            acao: '#10b981',
            ata: '#8b5cf6',
            membro: '#f59e0b',
            pagina: '#6b7280'
        };

        let meta = '';
        switch(item.type) {
            case 'reuniao': meta = item.date; break;
            case 'documento': meta = item.category; break;
            case 'acao': meta = `${item.responsavel} • ${item.status}`; break;
            case 'ata': meta = item.data; break;
            case 'membro': meta = item.orgao; break;
            case 'pagina': meta = 'Ir para página'; break;
        }

        // Highlight matching text
        const highlightedTitle = item.title.replace(
            new RegExp(`(${query})`, 'gi'),
            '<mark>$1</mark>'
        );

        return `
            <a href="${item.href}" class="search-item" data-type="${item.type}">
                <div class="search-item-icon" style="background: ${typeColors[item.type]}15; color: ${typeColors[item.type]}">
                    <i class="bi ${typeIcons[item.type]}"></i>
                </div>
                <div class="search-item-content">
                    <span class="search-item-title">${highlightedTitle}</span>
                    <span class="search-item-meta">${meta}</span>
                </div>
                <i class="bi bi-arrow-return-left search-item-action"></i>
            </a>
        `;
    },

    navigateResults: function(direction) {
        const items = document.querySelectorAll('.search-item');
        if (items.length === 0) return;

        const currentIndex = Array.from(items).findIndex(item => item.classList.contains('focused'));
        let newIndex;

        if (currentIndex === -1) {
            newIndex = direction > 0 ? 0 : items.length - 1;
        } else {
            items[currentIndex].classList.remove('focused');
            newIndex = currentIndex + direction;
            if (newIndex >= items.length) newIndex = 0;
            if (newIndex < 0) newIndex = items.length - 1;
        }

        items[newIndex].classList.add('focused');
        items[newIndex].scrollIntoView({ block: 'nearest' });
    },

    selectCurrentResult: function() {
        const focused = document.querySelector('.search-item.focused');
        if (focused) {
            window.location.href = focused.href;
        }
    },

    toggle: function() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open: function() {
        const modal = document.getElementById('globalSearchModal');
        if (!modal) return;

        modal.classList.add('open');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';

        // Focus input
        setTimeout(() => {
            const input = document.getElementById('globalSearchInput');
            if (input) {
                input.value = '';
                input.focus();
            }
        }, 100);
    },

    close: function() {
        const modal = document.getElementById('globalSearchModal');
        if (!modal) return;

        modal.classList.remove('open');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => GlobalSearch.init());
