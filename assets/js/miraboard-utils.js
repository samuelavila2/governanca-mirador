/**
 * ============================================
 * MIRABOARD - UTILIDADES
 * Export PDF/Excel + Filtros Avançados
 * ============================================
 */

// ============================================
// EXPORT PDF
// ============================================
const ExportPDF = {
    /**
     * Exporta tabela para PDF
     * @param {string} tableId - ID da tabela
     * @param {string} filename - Nome do arquivo
     * @param {object} options - Opções de configuração
     */
    exportTable: function(tableId, filename = 'export', options = {}) {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error('Tabela não encontrada:', tableId);
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: options.orientation || 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Header
        doc.setFillColor(232, 104, 26); // #E8681A
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(options.title || 'Relatório MiraBoard', 14, 13);
        
        // Subtítulo com data
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text('Gerado em: ' + new Date().toLocaleString('pt-BR'), doc.internal.pageSize.getWidth() - 14, 13, { align: 'right' });

        // Extrair dados da tabela
        const headers = [];
        const data = [];
        
        // Pegar cabeçalhos
        const ths = table.querySelectorAll('thead th');
        ths.forEach(th => {
            const text = th.innerText.trim();
            // Ignorar coluna de ações
            if (!text.toLowerCase().includes('ações') && !text.toLowerCase().includes('acoes')) {
                headers.push(text);
            }
        });

        // Pegar dados
        const trs = table.querySelectorAll('tbody tr');
        trs.forEach(tr => {
            const rowData = [];
            const tds = tr.querySelectorAll('td');
            tds.forEach((td, index) => {
                // Ignorar última coluna (ações)
                if (index < headers.length) {
                    // Tentar pegar texto limpo
                    let text = td.innerText.trim();
                    // Limpar badges
                    text = text.replace(/\s+/g, ' ');
                    rowData.push(text);
                }
            });
            if (rowData.length > 0) {
                data.push(rowData);
            }
        });

        // Gerar tabela com autoTable
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 28,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [75, 85, 99],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            margin: { left: 10, right: 10 }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128);
            doc.text(
                'Página ' + i + ' de ' + pageCount,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
            doc.text(
                'MiraBoard - Governança Corporativa',
                14,
                doc.internal.pageSize.getHeight() - 10
            );
        }

        // Baixar
        doc.save(filename + '.pdf');
        
        // Toast de sucesso
        showToast('PDF exportado com sucesso!', 'success');
    }
};

// ============================================
// EXPORT EXCEL
// ============================================
const ExportExcel = {
    /**
     * Exporta tabela para Excel
     * @param {string} tableId - ID da tabela
     * @param {string} filename - Nome do arquivo
     * @param {object} options - Opções de configuração
     */
    exportTable: function(tableId, filename = 'export', options = {}) {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error('Tabela não encontrada:', tableId);
            return;
        }

        // Criar workbook
        const wb = XLSX.utils.book_new();
        
        // Extrair dados da tabela
        const data = [];
        const headers = [];
        
        // Cabeçalhos
        const ths = table.querySelectorAll('thead th');
        ths.forEach(th => {
            const text = th.innerText.trim();
            if (!text.toLowerCase().includes('ações') && !text.toLowerCase().includes('acoes')) {
                headers.push(text);
            }
        });
        data.push(headers);

        // Dados
        const trs = table.querySelectorAll('tbody tr');
        trs.forEach(tr => {
            const rowData = [];
            const tds = tr.querySelectorAll('td');
            tds.forEach((td, index) => {
                if (index < headers.length) {
                    let text = td.innerText.trim().replace(/\s+/g, ' ');
                    rowData.push(text);
                }
            });
            if (rowData.length > 0) {
                data.push(rowData);
            }
        });

        // Criar worksheet
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // Estilizar cabeçalhos (largura das colunas)
        const colWidths = headers.map(h => ({ wch: Math.max(h.length, 15) }));
        ws['!cols'] = colWidths;

        // Adicionar ao workbook
        XLSX.utils.book_append_sheet(wb, ws, options.sheetName || 'Dados');

        // Baixar
        XLSX.writeFile(wb, filename + '.xlsx');
        
        // Toast de sucesso
        showToast('Excel exportado com sucesso!', 'success');
    }
};

// ============================================
// FILTROS AVANÇADOS
// ============================================
const FiltrosAvancados = {
    config: {},
    
    /**
     * Inicializa filtros para uma tabela
     * @param {string} tableId - ID da tabela
     * @param {object} options - Configuração dos filtros
     */
    init: function(tableId, options = {}) {
        this.config[tableId] = {
            table: document.getElementById(tableId),
            filters: options.filters || [],
            searchInput: options.searchInput || null
        };
        
        this.renderFilters(tableId);
        this.bindEvents(tableId);
    },
    
    /**
     * Renderiza os dropdowns de filtro
     */
    renderFilters: function(tableId) {
        const config = this.config[tableId];
        const container = document.getElementById(tableId + '-filters');
        
        if (!container || !config.filters.length) return;
        
        let html = `
            <div class="filtros-avancados d-flex flex-wrap align-items-center gap-2 mb-3">
                <span class="filtros-label me-2">
                    <i class="bi bi-funnel me-1"></i>Filtros:
                </span>
        `;
        
        config.filters.forEach(filter => {
            html += `
                <div class="filtro-item">
                    <select class="form-select form-select-sm filtro-select" 
                            data-column="${filter.column}"
                            id="${tableId}-filter-${filter.column}">
                        <option value="">${filter.label}</option>
            `;
            
            // Extrair valores únicos da coluna
            const values = this.getUniqueValues(tableId, filter.column);
            values.forEach(val => {
                html += `<option value="${val}">${val}</option>`;
            });
            
            html += `
                    </select>
                </div>
            `;
        });
        
        html += `
                <button type="button" class="btn btn-sm btn-outline-secondary" 
                        onclick="FiltrosAvancados.clearAll('${tableId}')">
                    <i class="bi bi-x-circle me-1"></i>Limpar
                </button>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    /**
     * Extrai valores únicos de uma coluna
     */
    getUniqueValues: function(tableId, columnIndex) {
        const config = this.config[tableId];
        const values = new Set();
        
        const rows = config.table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cell = row.cells[columnIndex];
            if (cell) {
                let text = cell.innerText.trim().replace(/\s+/g, ' ');
                if (text) {
                    values.add(text);
                }
            }
        });
        
        return Array.from(values).sort();
    },
    
    /**
     * Vincula eventos aos filtros
     */
    bindEvents: function(tableId) {
        const config = this.config[tableId];
        const container = document.getElementById(tableId + '-filters');
        
        if (!container) return;
        
        // Eventos de select
        container.querySelectorAll('.filtro-select').forEach(select => {
            select.addEventListener('change', () => this.apply(tableId));
        });
        
        // Evento de busca textual
        if (config.searchInput) {
            const searchEl = document.getElementById(config.searchInput);
            if (searchEl) {
                searchEl.addEventListener('input', () => this.apply(tableId));
            }
        }
    },
    
    /**
     * Aplica todos os filtros ativos
     */
    apply: function(tableId) {
        const config = this.config[tableId];
        const rows = config.table.querySelectorAll('tbody tr');
        
        // Coletar valores dos filtros
        const activeFilters = {};
        config.filters.forEach(filter => {
            const select = document.getElementById(`${tableId}-filter-${filter.column}`);
            if (select && select.value) {
                activeFilters[filter.column] = select.value.toLowerCase();
            }
        });
        
        // Busca textual
        let searchText = '';
        if (config.searchInput) {
            const searchEl = document.getElementById(config.searchInput);
            if (searchEl) {
                searchText = searchEl.value.toLowerCase().trim();
            }
        }
        
        // Filtrar linhas
        let visibleCount = 0;
        rows.forEach(row => {
            let visible = true;
            
            // Verificar filtros de coluna
            for (const [colIndex, filterValue] of Object.entries(activeFilters)) {
                const cell = row.cells[colIndex];
                if (cell) {
                    const cellText = cell.innerText.toLowerCase();
                    if (!cellText.includes(filterValue)) {
                        visible = false;
                        break;
                    }
                }
            }
            
            // Verificar busca textual
            if (visible && searchText) {
                const rowText = row.innerText.toLowerCase();
                if (!rowText.includes(searchText)) {
                    visible = false;
                }
            }
            
            row.style.display = visible ? '' : 'none';
            if (visible) visibleCount++;
        });
        
        // Atualizar contador
        this.updateCounter(tableId, visibleCount, rows.length);
    },
    
    /**
     * Atualiza contador de resultados
     */
    updateCounter: function(tableId, visible, total) {
        let counter = document.getElementById(tableId + '-counter');
        if (!counter) {
            const container = document.getElementById(tableId + '-filters');
            if (container) {
                const span = document.createElement('span');
                span.id = tableId + '-counter';
                span.className = 'filtro-counter ms-3 text-muted small';
                container.querySelector('.filtros-avancados').appendChild(span);
                counter = span;
            }
        }
        
        if (counter) {
            if (visible === total) {
                counter.textContent = '';
            } else {
                counter.textContent = `Exibindo ${visible} de ${total}`;
            }
        }
    },
    
    /**
     * Limpa todos os filtros
     */
    clearAll: function(tableId) {
        const config = this.config[tableId];
        
        // Limpar selects
        config.filters.forEach(filter => {
            const select = document.getElementById(`${tableId}-filter-${filter.column}`);
            if (select) select.value = '';
        });
        
        // Limpar busca
        if (config.searchInput) {
            const searchEl = document.getElementById(config.searchInput);
            if (searchEl) searchEl.value = '';
        }
        
        // Mostrar todas as linhas
        const rows = config.table.querySelectorAll('tbody tr');
        rows.forEach(row => row.style.display = '');
        
        // Limpar contador
        const counter = document.getElementById(tableId + '-counter');
        if (counter) counter.textContent = '';
    }
};

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    // Criar container se não existir
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1080';
        document.body.appendChild(container);
    }
    
    const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center border-0 mb-2" 
             style="background: white; box-shadow: 0 10px 40px rgba(0,0,0,0.15);"
             role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class="bi ${icons[type]}" style="color: ${colors[type]}; font-size: 1.2rem;"></i>
                    <span>${message}</span>
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    
    // Remover após esconder
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

// ============================================
// INICIALIZAÇÃO GLOBAL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Carregar bibliotecas de export se não existirem
    if (typeof jspdf === 'undefined') {
        console.log('MiraBoard Utils: Carregue jsPDF para funcionalidade de export PDF');
    }
    if (typeof XLSX === 'undefined') {
        console.log('MiraBoard Utils: Carregue SheetJS para funcionalidade de export Excel');
    }
});
