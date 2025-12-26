/**
 * MiraBoard - Ações Fake para Navegação Realista
 * Este arquivo contém todas as interações simuladas do sistema
 */

const FakeActions = {
    // Configurações de Toast
    toastConfig: {
        duration: 3000,
        position: 'top-right'
    },

    // Inicializar todas as ações fake
    init: function() {
        this.bindGlobalActions();
        this.bindNotificationActions();
        this.bindTableActions();
        this.bindFormActions();
        this.bindCardActions();
        this.bindQuickActions();
        this.bindDocumentActions();
        this.bindExportActions();
        this.bindIconButtons();
        this.bindDropdownActions();
        this.bindSpecificButtons();
        console.log('FakeActions initialized');
    },

    // ========== TOAST NOTIFICATIONS ==========
    showToast: function(message, type = 'success', duration = 3000) {
        // Remove toast existente
        const existingToast = document.querySelector('.fake-toast');
        if (existingToast) existingToast.remove();

        // Criar toast
        const toast = document.createElement('div');
        toast.className = `fake-toast fake-toast-${type}`;
        
        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-x-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };

        toast.innerHTML = `
            <i class="bi ${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button class="toast-close"><i class="bi bi-x"></i></button>
        `;

        // Estilos inline para o toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: 500;
            max-width: 400px;
        `;

        // Cores por tipo
        const colors = {
            success: { bg: '#10b981', color: '#fff' },
            error: { bg: '#ef4444', color: '#fff' },
            warning: { bg: '#f59e0b', color: '#fff' },
            info: { bg: '#3b82f6', color: '#fff' }
        };

        const colorSet = colors[type] || colors.info;
        toast.style.backgroundColor = colorSet.bg;
        toast.style.color = colorSet.color;

        document.body.appendChild(toast);

        // Botão fechar
        toast.querySelector('.toast-close').onclick = () => toast.remove();
        toast.querySelector('.toast-close').style.cssText = 'background:none;border:none;color:inherit;cursor:pointer;opacity:0.8;';

        // Auto-remover
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // ========== LOADING SPINNER ==========
    showLoading: function(message = 'Carregando...') {
        const loader = document.createElement('div');
        loader.id = 'fake-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner-border text-primary" role="status"></div>
                <p>${message}</p>
            </div>
        `;
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9998;
        `;
        loader.querySelector('.loader-content').style.cssText = 'text-align:center;';
        loader.querySelector('p').style.cssText = 'margin-top:16px;color:#374151;font-weight:500;';
        document.body.appendChild(loader);
    },

    hideLoading: function() {
        const loader = document.getElementById('fake-loader');
        if (loader) loader.remove();
    },

    // ========== MODAL DE CONFIRMAÇÃO ==========
    showConfirm: function(title, message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'fake-confirm-modal';
        modal.innerHTML = `
            <div class="confirm-backdrop"></div>
            <div class="confirm-dialog">
                <h5>${title}</h5>
                <p>${message}</p>
                <div class="confirm-actions">
                    <button class="btn btn-outline-secondary btn-cancel">Cancelar</button>
                    <button class="btn btn-primary btn-confirm">Confirmar</button>
                </div>
            </div>
        `;
        
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;display:flex;align-items:center;justify-content:center;';
        modal.querySelector('.confirm-backdrop').style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);';
        modal.querySelector('.confirm-dialog').style.cssText = 'background:#fff;padding:24px;border-radius:12px;max-width:400px;position:relative;z-index:1;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);';
        modal.querySelector('h5').style.cssText = 'margin:0 0 12px 0;color:#111827;';
        modal.querySelector('p').style.cssText = 'margin:0 0 20px 0;color:#6b7280;';
        modal.querySelector('.confirm-actions').style.cssText = 'display:flex;gap:12px;justify-content:flex-end;';

        document.body.appendChild(modal);

        modal.querySelector('.btn-cancel').onclick = () => modal.remove();
        modal.querySelector('.confirm-backdrop').onclick = () => modal.remove();
        modal.querySelector('.btn-confirm').onclick = () => {
            modal.remove();
            if (onConfirm) onConfirm();
        };
    },

    // ========== AÇÕES GLOBAIS ==========
    bindGlobalActions: function() {
        const self = this;

        // Links href="#" - prevenir navegação
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href="#"]');
            if (link && !link.hasAttribute('data-bs-toggle')) {
                e.preventDefault();
                
                // Detectar ação pelo texto ou ícone
                const text = link.textContent.trim().toLowerCase();
                const icon = link.querySelector('i');
                const iconClass = icon ? icon.className : '';

                // Ações baseadas no contexto
                if (text.includes('marcar todas como lidas') || text.includes('marcar como lida')) {
                    self.markAllAsRead();
                } else if (text.includes('ver todas') || text.includes('ver todos') || text.includes('ver mais')) {
                    self.showToast('Carregando lista completa...', 'info');
                } else if (text.includes('meu perfil') || iconClass.includes('bi-person')) {
                    window.location.href = 'configuracoes.html#perfil';
                } else if (text.includes('configurações') || iconClass.includes('bi-gear')) {
                    window.location.href = 'configuracoes.html';
                } else if (text.includes('visualizar') || iconClass.includes('bi-eye')) {
                    self.showToast('Abrindo visualização...', 'info');
                } else if (text.includes('editar') || iconClass.includes('bi-pencil')) {
                    self.showToast('Modo de edição ativado', 'info');
                } else if (text.includes('excluir') || text.includes('remover') || iconClass.includes('bi-trash')) {
                    self.showConfirm('Confirmar Exclusão', 'Tem certeza que deseja excluir este item?', () => {
                        self.showToast('Item excluído com sucesso!', 'success');
                    });
                } else if (text.includes('duplicar') || iconClass.includes('bi-copy')) {
                    self.showToast('Item duplicado com sucesso!', 'success');
                } else if (text.includes('baixar') || text.includes('download') || iconClass.includes('bi-download')) {
                    self.simulateDownload(text);
                } else if (text.includes('compartilhar') || iconClass.includes('bi-share')) {
                    self.showToast('Link copiado para a área de transferência!', 'success');
                } else if (text.includes('imprimir') || iconClass.includes('bi-printer')) {
                    window.print();
                } else if (text.includes('arquivar') || iconClass.includes('bi-archive')) {
                    self.showToast('Item arquivado com sucesso!', 'success');
                } else if (text.includes('favorito') || iconClass.includes('bi-star')) {
                    self.toggleFavorite(link);
                } else {
                    // Ação genérica para links sem contexto específico
                    console.log('Link clicado:', text || 'sem texto');
                }
            }
        });

        // Botões de ação são tratados em bindIconButtons para evitar duplicação
    },

    // ========== NOTIFICAÇÕES ==========
    bindNotificationActions: function() {
        const self = this;

        // Notificações individuais
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (this.classList.contains('unread')) {
                    this.classList.remove('unread');
                    self.updateNotificationBadge(-1);
                }
            });
        });
    },

    markAllAsRead: function() {
        document.querySelectorAll('.notification-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
        this.updateNotificationBadge(0, true);
        this.showToast('Todas as notificações foram marcadas como lidas', 'success');
    },

    updateNotificationBadge: function(change, setZero = false) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            if (setZero) {
                badge.textContent = '0';
                badge.style.display = 'none';
            } else {
                const current = parseInt(badge.textContent) || 0;
                const newVal = Math.max(0, current + change);
                badge.textContent = newVal;
                badge.style.display = newVal > 0 ? 'flex' : 'none';
            }
        }
    },

    // ========== AÇÕES DE TABELA ==========
    bindTableActions: function() {
        const self = this;

        // Checkboxes de seleção em tabelas
        document.querySelectorAll('table input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const row = this.closest('tr');
                if (row) {
                    row.classList.toggle('selected', this.checked);
                }
                self.updateBulkActions();
            });
        });

        // Checkbox "selecionar todos"
        document.querySelectorAll('thead input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const table = this.closest('table');
                const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    cb.checked = this.checked;
                    cb.dispatchEvent(new Event('change'));
                });
            });
        });

        // Ordenação de colunas
        document.querySelectorAll('th[data-sort], th.sortable').forEach(th => {
            th.style.cursor = 'pointer';
            th.addEventListener('click', function() {
                self.showToast('Ordenando tabela...', 'info');
                // Simular toggle de ordem
                this.classList.toggle('sort-asc');
                this.classList.toggle('sort-desc');
            });
        });
    },

    updateBulkActions: function() {
        const selected = document.querySelectorAll('table tbody input[type="checkbox"]:checked').length;
        const bulkBar = document.querySelector('.bulk-actions-bar');
        
        if (selected > 0) {
            if (!bulkBar) {
                this.showBulkActionsBar(selected);
            } else {
                bulkBar.querySelector('.selected-count').textContent = selected;
            }
        } else if (bulkBar) {
            bulkBar.remove();
        }
    },

    showBulkActionsBar: function(count) {
        const bar = document.createElement('div');
        bar.className = 'bulk-actions-bar';
        bar.innerHTML = `
            <span><strong class="selected-count">${count}</strong> itens selecionados</span>
            <div class="bulk-buttons">
                <button class="btn btn-sm btn-outline-primary" onclick="FakeActions.bulkAction('exportar')">
                    <i class="bi bi-download me-1"></i>Exportar
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="FakeActions.bulkAction('arquivar')">
                    <i class="bi bi-archive me-1"></i>Arquivar
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="FakeActions.bulkAction('excluir')">
                    <i class="bi bi-trash me-1"></i>Excluir
                </button>
            </div>
        `;
        bar.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #1e293b;
            color: #fff;
            padding: 12px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 20px;
            z-index: 1000;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(bar);
    },

    bulkAction: function(action) {
        const count = document.querySelectorAll('table tbody input[type="checkbox"]:checked').length;
        
        if (action === 'excluir') {
            this.showConfirm('Confirmar Exclusão em Massa', `Deseja excluir ${count} itens selecionados?`, () => {
                this.showToast(`${count} itens excluídos com sucesso!`, 'success');
                document.querySelectorAll('table tbody input[type="checkbox"]:checked').forEach(cb => {
                    cb.closest('tr').remove();
                });
                document.querySelector('.bulk-actions-bar')?.remove();
            });
        } else if (action === 'arquivar') {
            this.showToast(`${count} itens arquivados com sucesso!`, 'success');
        } else if (action === 'exportar') {
            this.showToast(`Exportando ${count} itens...`, 'info');
            setTimeout(() => this.showToast('Exportação concluída!', 'success'), 1500);
        }
    },

    // ========== FORMULÁRIOS ==========
    bindFormActions: function() {
        const self = this;

        // Formulários de busca
        document.querySelectorAll('input[type="search"], .search-input').forEach(input => {
            input.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    self.showToast(`Buscando por "${this.value}"...`, 'info');
                }
            });
        });

        // Botões de filtro
        document.querySelectorAll('.btn-filter, [data-filter]').forEach(btn => {
            btn.addEventListener('click', function() {
                self.showToast('Filtros aplicados', 'success');
            });
        });

        // Selects de filtro
        document.querySelectorAll('select.filter-select, .form-select[data-filter]').forEach(select => {
            select.addEventListener('change', function() {
                self.showToast('Filtro atualizado', 'info');
            });
        });
    },

    // ========== CARDS CLICÁVEIS ==========
    bindCardActions: function() {
        const self = this;

        // Cards de estatísticas
        document.querySelectorAll('.stat-card, .metric-card, .kpi-card').forEach(card => {
            if (!card.querySelector('a')) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function() {
                    const title = this.querySelector('.stat-label, .metric-label, h6, .card-title');
                    if (title) {
                        self.showToast(`Carregando detalhes de "${title.textContent.trim()}"...`, 'info');
                    }
                });
            }
        });

        // Cards de reunião
        document.querySelectorAll('.reuniao-card, .meeting-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                if (!e.target.closest('button') && !e.target.closest('.dropdown')) {
                    window.location.href = 'reuniao-detalhe.html';
                }
            });
        });
    },

    // ========== AÇÕES RÁPIDAS ==========
    bindQuickActions: function() {
        const self = this;

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const icon = this.querySelector('i');
                const text = this.textContent.trim();
                
                if (icon?.classList.contains('bi-calendar-plus') || text.includes('Agendar')) {
                    self.showToast('Abrindo agendamento...', 'info');
                } else if (icon?.classList.contains('bi-file-plus') || text.includes('Nova')) {
                    self.showToast('Criando novo item...', 'info');
                } else if (icon?.classList.contains('bi-people') || text.includes('Membros')) {
                    self.showToast('Carregando lista de membros...', 'info');
                } else if (icon?.classList.contains('bi-graph-up') || text.includes('Relatório')) {
                    window.location.href = 'relatorios.html';
                } else {
                    self.showToast('Ação executada!', 'success');
                }
            });
        });
    },

    // ========== DOCUMENTOS ==========
    bindDocumentActions: function() {
        const self = this;

        // Links de documentos
        document.querySelectorAll('.documento-item, .document-link, [data-document]').forEach(doc => {
            doc.addEventListener('click', function(e) {
                e.preventDefault();
                const name = this.querySelector('.documento-nome, .doc-name')?.textContent || 'Documento';
                self.showToast(`Abrindo "${name}"...`, 'info');
                setTimeout(() => {
                    self.showToast('Documento carregado!', 'success');
                }, 1000);
            });
        });

        // Anexos
        document.querySelectorAll('.documento-anexo-item, .attachment-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                self.simulateDownload('documento');
            });
        });
    },

    // ========== EXPORTAÇÃO ==========
    bindExportActions: function() {
        const self = this;

        // Botões de exportar PDF/Excel
        document.querySelectorAll('[data-export], .btn-export').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const format = this.dataset.export || 'PDF';
                self.simulateExport(format);
            });
        });

        // Botões com ícones de exportação
        document.querySelectorAll('.bi-file-earmark-pdf, .bi-file-earmark-excel').forEach(icon => {
            const btn = icon.closest('button, a');
            if (btn && !btn.onclick) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const format = icon.classList.contains('bi-file-earmark-pdf') ? 'PDF' : 'Excel';
                    self.simulateExport(format);
                });
            }
        });
    },

    simulateExport: function(format) {
        this.showLoading(`Gerando ${format}...`);
        setTimeout(() => {
            this.hideLoading();
            this.showToast(`${format} gerado com sucesso! Download iniciado.`, 'success');
        }, 2000);
    },

    simulateDownload: function(filename) {
        this.showToast('Iniciando download...', 'info');
        setTimeout(() => {
            this.showToast('Download concluído!', 'success');
        }, 1500);
    },

    // ========== FAVORITOS ==========
    toggleFavorite: function(element) {
        const icon = element.querySelector('i');
        if (icon) {
            if (icon.classList.contains('bi-star')) {
                icon.classList.remove('bi-star');
                icon.classList.add('bi-star-fill');
                icon.style.color = '#f59e0b';
                this.showToast('Adicionado aos favoritos!', 'success');
            } else {
                icon.classList.remove('bi-star-fill');
                icon.classList.add('bi-star');
                icon.style.color = '';
                this.showToast('Removido dos favoritos', 'info');
            }
        }
    },

    // ========== BOTÕES COM ÍCONES (LÁPIS, LIXEIRA, ETC) ==========
    bindIconButtons: function() {
        const self = this;

        // Botões com ícone de lápis (editar)
        document.querySelectorAll('button').forEach(btn => {
            const icon = btn.querySelector('i');
            if (!icon) return;
            if (btn.onclick || btn.hasAttribute('data-bs-toggle')) return;
            // Evitar duplicação de eventos
            if (btn.hasAttribute('data-action-bound')) return;
            btn.setAttribute('data-action-bound', 'true');

            // Botões de EDITAR (lápis)
            if (icon.classList.contains('bi-pencil') || icon.classList.contains('bi-pencil-fill') || icon.classList.contains('bi-pencil-square')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.showEditModal();
                });
            }

            // Botões de EXCLUIR (lixeira)
            if (icon.classList.contains('bi-trash') || icon.classList.contains('bi-trash3') || icon.classList.contains('bi-trash-fill')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const row = this.closest('tr');
                    const card = this.closest('.card, .item, .list-group-item');
                    self.showConfirm('Confirmar Exclusão', 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.', () => {
                        if (row) {
                            row.style.transition = 'opacity 0.3s, transform 0.3s';
                            row.style.opacity = '0';
                            row.style.transform = 'translateX(-20px)';
                            setTimeout(() => row.remove(), 300);
                        } else if (card) {
                            card.style.transition = 'opacity 0.3s, transform 0.3s';
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.95)';
                            setTimeout(() => card.remove(), 300);
                        }
                        self.showToast('Item excluído com sucesso!', 'success');
                    });
                });
            }

            // Botões de VISUALIZAR (olho)
            if (icon.classList.contains('bi-eye') || icon.classList.contains('bi-eye-fill')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.showToast('Abrindo visualização...', 'info');
                });
            }

            // Botões de DOWNLOAD
            if (icon.classList.contains('bi-download') || icon.classList.contains('bi-cloud-download')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.simulateDownload('arquivo');
                });
            }

            // Botões de ENVIAR/EMAIL
            if (icon.classList.contains('bi-envelope') || icon.classList.contains('bi-send')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.showToast('Mensagem enviada com sucesso!', 'success');
                });
            }

            // Botões de REFRESH/ATUALIZAR
            if (icon.classList.contains('bi-arrow-clockwise') || icon.classList.contains('bi-arrow-repeat')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.showLoading('Atualizando...');
                    setTimeout(() => {
                        self.hideLoading();
                        self.showToast('Dados atualizados!', 'success');
                    }, 1500);
                });
            }

            // Botões de ADICIONAR
            if (icon.classList.contains('bi-plus') || icon.classList.contains('bi-plus-lg') || icon.classList.contains('bi-plus-circle')) {
                if (!btn.hasAttribute('data-bs-toggle')) {
                    btn.addEventListener('click', function(e) {
                        if (!this.hasAttribute('data-bs-target')) {
                            e.preventDefault();
                            self.showToast('Abrindo formulário de criação...', 'info');
                        }
                    });
                }
            }

            // Botões de COMPARTILHAR
            if (icon.classList.contains('bi-share') || icon.classList.contains('bi-share-fill')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.showToast('Link copiado para a área de transferência!', 'success');
                });
            }

            // Botões de IMPRIMIR
            if (icon.classList.contains('bi-printer') || icon.classList.contains('bi-printer-fill')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.showToast('Preparando impressão...', 'info');
                    setTimeout(() => window.print(), 500);
                });
            }

            // Botões de COPIAR
            if (icon.classList.contains('bi-clipboard') || icon.classList.contains('bi-copy') || icon.classList.contains('bi-files')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.showToast('Copiado para a área de transferência!', 'success');
                });
            }
        });
    },

    // ========== AÇÕES EM DROPDOWNS ==========
    bindDropdownActions: function() {
        const self = this;

        // Links dentro de dropdowns
        document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
            if (item.getAttribute('href') === '#' && !item.onclick) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const icon = this.querySelector('i');
                    const text = this.textContent.trim().toLowerCase();

                    // Editar
                    if (text.includes('editar') || (icon && icon.classList.contains('bi-pencil'))) {
                        self.showEditModal();
                    }
                    // Excluir
                    else if (text.includes('excluir') || text.includes('remover') || (icon && (icon.classList.contains('bi-trash') || icon.classList.contains('bi-trash3')))) {
                        const dropdown = this.closest('.dropdown');
                        const row = dropdown ? dropdown.closest('tr') : null;
                        const card = dropdown ? dropdown.closest('.card, .item') : null;
                        
                        self.showConfirm('Confirmar Exclusão', 'Tem certeza que deseja excluir?', () => {
                            if (row) {
                                row.style.transition = 'opacity 0.3s';
                                row.style.opacity = '0';
                                setTimeout(() => row.remove(), 300);
                            } else if (card) {
                                card.style.transition = 'opacity 0.3s';
                                card.style.opacity = '0';
                                setTimeout(() => card.remove(), 300);
                            }
                            self.showToast('Excluído com sucesso!', 'success');
                        });
                    }
                    // Duplicar
                    else if (text.includes('duplicar') || text.includes('copiar')) {
                        self.showToast('Item duplicado com sucesso!', 'success');
                    }
                    // Arquivar
                    else if (text.includes('arquivar')) {
                        self.showToast('Item arquivado com sucesso!', 'success');
                    }
                    // Baixar/Download
                    else if (text.includes('baixar') || text.includes('download') || text.includes('exportar')) {
                        self.simulateDownload('arquivo');
                    }
                    // Compartilhar
                    else if (text.includes('compartilhar')) {
                        self.showToast('Link copiado!', 'success');
                    }
                    // Enviar
                    else if (text.includes('enviar') || text.includes('reenviar')) {
                        self.showToast('Enviado com sucesso!', 'success');
                    }
                    // Marcar como lido
                    else if (text.includes('marcar como lid')) {
                        self.showToast('Marcado como lido!', 'success');
                    }
                    // Favoritar
                    else if (text.includes('favorit')) {
                        self.showToast('Adicionado aos favoritos!', 'success');
                    }
                    // Imprimir
                    else if (text.includes('imprimir')) {
                        window.print();
                    }
                    // Ação genérica
                    else {
                        self.showToast('Ação executada!', 'success');
                    }
                });
            }
        });
    },

    // ========== BOTÕES ESPECÍFICOS POR CLASSE/CONTEXTO ==========
    bindSpecificButtons: function() {
        const self = this;

        // Botões btn-warning (geralmente ações secundárias)
        document.querySelectorAll('.btn-warning, .btn-outline-warning').forEach(btn => {
            if (!btn.onclick && !btn.hasAttribute('data-bs-toggle') && !btn.hasAttribute('data-action-bound')) {
                btn.setAttribute('data-action-bound', 'true');
                const text = btn.textContent.trim().toLowerCase();
                
                btn.addEventListener('click', function(e) {
                    if (text.includes('renovar') || text.includes('renovação')) {
                        e.preventDefault();
                        self.showToast('Processo de renovação iniciado!', 'info');
                    } else if (text.includes('backup')) {
                        e.preventDefault();
                        self.showLoading('Criando backup...');
                        setTimeout(() => {
                            self.hideLoading();
                            self.showToast('Backup criado com sucesso!', 'success');
                        }, 2000);
                    } else if (text.includes('ver detalhe') || text.includes('detalhes')) {
                        e.preventDefault();
                        self.showToast('Carregando detalhes...', 'info');
                    } else if (text.includes('planejar')) {
                        e.preventDefault();
                        self.showToast('Abrindo planejamento...', 'info');
                    } else if (text.includes('edição') || text.includes('editar')) {
                        e.preventDefault();
                        self.showToast('Modo de edição ativado!', 'info');
                    }
                });
            }
        });

        // Botões btn-danger (ações críticas)
        document.querySelectorAll('.btn-danger, .btn-outline-danger').forEach(btn => {
            if (!btn.onclick && !btn.hasAttribute('data-bs-toggle') && !btn.hasAttribute('data-action-bound')) {
                btn.setAttribute('data-action-bound', 'true');
                const text = btn.textContent.trim().toLowerCase();
                const icon = btn.querySelector('i');
                
                btn.addEventListener('click', function(e) {
                    if (text.includes('excluir') || text.includes('remover') || text.includes('deletar') || (icon && icon.classList.contains('bi-trash'))) {
                        e.preventDefault();
                        self.showConfirm('Confirmar Exclusão', 'Esta ação é irreversível. Deseja continuar?', () => {
                            self.showToast('Excluído com sucesso!', 'success');
                        });
                    } else if (text.includes('renovar')) {
                        e.preventDefault();
                        self.showToast('Solicitação de renovação enviada!', 'success');
                    } else if (text.includes('cancelar')) {
                        e.preventDefault();
                        self.showConfirm('Confirmar Cancelamento', 'Deseja realmente cancelar?', () => {
                            self.showToast('Cancelado com sucesso!', 'success');
                        });
                    } else if (text.includes('limpar cache')) {
                        e.preventDefault();
                        self.showLoading('Limpando cache...');
                        setTimeout(() => {
                            self.hideLoading();
                            self.showToast('Cache limpo com sucesso!', 'success');
                        }, 1500);
                    } else if (text.includes('registrar')) {
                        // Não prevenir - pode ter modal
                    }
                });
            }
        });

        // Botões btn-info
        document.querySelectorAll('.btn-info, .btn-outline-info').forEach(btn => {
            if (!btn.onclick && !btn.hasAttribute('data-bs-toggle') && !btn.hasAttribute('data-action-bound')) {
                btn.setAttribute('data-action-bound', 'true');
                const text = btn.textContent.trim().toLowerCase();
                
                btn.addEventListener('click', function(e) {
                    if (text.includes('verificar') || text.includes('atualiza')) {
                        e.preventDefault();
                        self.showLoading('Verificando...');
                        setTimeout(() => {
                            self.hideLoading();
                            self.showToast('Sistema está atualizado!', 'success');
                        }, 2000);
                    } else if (text.includes('ver') || text.includes('visualizar')) {
                        e.preventDefault();
                        self.showToast('Carregando...', 'info');
                    }
                });
            }
        });

        // Botões btn-success
        document.querySelectorAll('.btn-success, .btn-outline-success').forEach(btn => {
            if (!btn.onclick && !btn.hasAttribute('data-bs-toggle') && !btn.hasAttribute('data-action-bound')) {
                btn.setAttribute('data-action-bound', 'true');
                const text = btn.textContent.trim().toLowerCase();
                const icon = btn.querySelector('i');
                
                btn.addEventListener('click', function(e) {
                    if (text.includes('salvar') || text.includes('confirmar') || text.includes('aprovar')) {
                        e.preventDefault();
                        self.showToast('Salvo com sucesso!', 'success');
                    } else if (text.includes('enviar')) {
                        e.preventDefault();
                        self.showToast('Enviado com sucesso!', 'success');
                    } else if (icon && icon.classList.contains('bi-check')) {
                        e.preventDefault();
                        self.showToast('Confirmado!', 'success');
                    }
                });
            }
        });

        // Botões com classe específica para ações
        document.querySelectorAll('.btn-ghost').forEach(btn => {
            if (!btn.onclick && !btn.hasAttribute('data-action-bound')) {
                btn.setAttribute('data-action-bound', 'true');
                const icon = btn.querySelector('i');
                if (icon) {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (icon.classList.contains('bi-pencil') || icon.classList.contains('bi-pencil-fill')) {
                            self.showEditModal();
                        } else if (icon.classList.contains('bi-trash') || icon.classList.contains('bi-trash3')) {
                            const row = this.closest('tr, .item, .list-item');
                            self.showConfirm('Confirmar Exclusão', 'Deseja excluir este item?', () => {
                                if (row) {
                                    row.style.opacity = '0';
                                    setTimeout(() => row.remove(), 300);
                                }
                                self.showToast('Excluído!', 'success');
                            });
                        } else if (icon.classList.contains('bi-eye')) {
                            self.showToast('Abrindo...', 'info');
                        } else if (icon.classList.contains('bi-three-dots') || icon.classList.contains('bi-three-dots-vertical')) {
                            // Menu dropdown - não fazer nada
                        } else {
                            self.showToast('Ação executada!', 'success');
                        }
                    });
                }
            }
        });
    },

    // ========== MODAL DE EDIÇÃO SIMULADO ==========
    showEditModal: function() {
        const self = this;
        
        const modal = document.createElement('div');
        modal.className = 'fake-edit-modal';
        modal.innerHTML = `
            <div class="edit-backdrop"></div>
            <div class="edit-dialog">
                <div class="edit-header">
                    <h5><i class="bi bi-pencil-square me-2"></i>Editar Item</h5>
                    <button class="btn-close-modal"><i class="bi bi-x-lg"></i></button>
                </div>
                <div class="edit-body">
                    <div class="form-group mb-3">
                        <label class="form-label">Nome</label>
                        <input type="text" class="form-control" value="Item de exemplo" />
                    </div>
                    <div class="form-group mb-3">
                        <label class="form-label">Descrição</label>
                        <textarea class="form-control" rows="3">Descrição do item...</textarea>
                    </div>
                    <div class="form-group mb-3">
                        <label class="form-label">Status</label>
                        <select class="form-select">
                            <option>Ativo</option>
                            <option>Pendente</option>
                            <option>Concluído</option>
                        </select>
                    </div>
                </div>
                <div class="edit-footer">
                    <button class="btn btn-outline-secondary btn-cancel">Cancelar</button>
                    <button class="btn btn-primary btn-save"><i class="bi bi-check-lg me-2"></i>Salvar</button>
                </div>
            </div>
        `;
        
        // Estilos
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;display:flex;align-items:center;justify-content:center;';
        modal.querySelector('.edit-backdrop').style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);';
        modal.querySelector('.edit-dialog').style.cssText = 'background:#fff;border-radius:12px;max-width:500px;width:90%;position:relative;z-index:1;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);overflow:hidden;';
        modal.querySelector('.edit-header').style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #e5e7eb;';
        modal.querySelector('.edit-header h5').style.cssText = 'margin:0;color:#111827;font-size:1.1rem;';
        modal.querySelector('.btn-close-modal').style.cssText = 'background:none;border:none;font-size:1.2rem;cursor:pointer;color:#6b7280;';
        modal.querySelector('.edit-body').style.cssText = 'padding:20px;';
        modal.querySelector('.form-label').style.cssText = 'color:#374151;font-weight:500;margin-bottom:6px;display:block;';
        modal.querySelector('.edit-footer').style.cssText = 'display:flex;gap:12px;justify-content:flex-end;padding:16px 20px;border-top:1px solid #e5e7eb;background:#f9fafb;';

        document.body.appendChild(modal);

        // Event listeners
        const closeModal = () => modal.remove();
        modal.querySelector('.edit-backdrop').onclick = closeModal;
        modal.querySelector('.btn-close-modal').onclick = closeModal;
        modal.querySelector('.btn-cancel').onclick = closeModal;
        modal.querySelector('.btn-save').onclick = () => {
            closeModal();
            self.showToast('Alterações salvas com sucesso!', 'success');
        };
    }
};

// CSS para animações
const fakeActionsStyle = document.createElement('style');
fakeActionsStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    table tr.selected {
        background-color: rgba(232, 104, 26, 0.1) !important;
    }
    .notification-item.unread {
        background-color: rgba(232, 104, 26, 0.05);
    }
    .btn-ghost {
        transition: all 0.2s ease;
    }
    .btn-ghost:hover {
        background: rgba(0,0,0,0.05);
    }
`;
document.head.appendChild(fakeActionsStyle);

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    FakeActions.init();
});
