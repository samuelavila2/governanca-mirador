/**
 * MiraBoard - Accessibility Enhancements
 * Melhorias de acessibilidade e UX
 */

const Accessibility = {
    /**
     * Inicializa todas as melhorias de acessibilidade
     */
    init: function() {
        this.injectSkipLink();
        this.enhanceAriaLabels();
        this.initTooltips();
        this.enhanceFormValidation();
        this.improveContrast();
    },

    /**
     * Injeta o skip link para navegação via teclado
     */
    injectSkipLink: function() {
        if (document.querySelector('.skip-link')) return;
        
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Pular para o conteúdo principal';
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Garantir que o main-content existe
        const mainContent = document.querySelector('.main-content');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    },

    /**
     * Adiciona ARIA labels em elementos que precisam
     */
    enhanceAriaLabels: function() {
        // Botões com apenas ícones no header
        const iconButtonsMap = {
            '.bi-bell': 'Notificações',
            '.bi-envelope': 'Mensagens', 
            '.bi-gear': 'Configurações',
            '.bi-search': 'Buscar',
            '.bi-moon': 'Alternar tema escuro',
            '.bi-sun': 'Alternar tema claro',
            '.bi-three-dots-vertical': 'Mais opções',
            '.bi-three-dots': 'Mais opções',
            '.bi-x': 'Fechar',
            '.bi-x-lg': 'Fechar',
            '.bi-chevron-left': 'Anterior',
            '.bi-chevron-right': 'Próximo',
            '.bi-plus': 'Adicionar',
            '.bi-plus-lg': 'Adicionar',
            '.bi-pencil': 'Editar',
            '.bi-trash': 'Excluir',
            '.bi-download': 'Baixar',
            '.bi-upload': 'Enviar',
            '.bi-printer': 'Imprimir',
            '.bi-share': 'Compartilhar',
            '.bi-filter': 'Filtrar',
            '.bi-funnel': 'Filtrar',
            '.bi-list': 'Lista',
            '.bi-grid': 'Grade'
        };

        // Aplicar em botões que só têm ícone
        document.querySelectorAll('button, .btn').forEach(btn => {
            if (btn.getAttribute('aria-label')) return;
            
            const icon = btn.querySelector('i[class*="bi-"]');
            if (!icon) return;
            
            // Verificar se o botão tem texto visível
            const hasVisibleText = Array.from(btn.childNodes).some(node => 
                node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
            ) || btn.querySelector('span:not(.visually-hidden):not(.sr-only)');
            
            if (hasVisibleText) return;
            
            // Buscar label apropriado
            for (const [iconClass, label] of Object.entries(iconButtonsMap)) {
                if (icon.classList.contains(iconClass.replace('.', ''))) {
                    btn.setAttribute('aria-label', label);
                    icon.setAttribute('aria-hidden', 'true');
                    break;
                }
            }
        });

        // Badges de notificação
        document.querySelectorAll('.notification-badge, .badge-notification').forEach(badge => {
            const count = badge.textContent.trim();
            if (count && !badge.getAttribute('aria-label')) {
                badge.setAttribute('aria-label', `${count} ${parseInt(count) === 1 ? 'nova notificação' : 'novas notificações'}`);
            }
        });

        // Avatares - melhorar alt text
        document.querySelectorAll('img[src*="ui-avatars.com"]').forEach(img => {
            const urlParams = new URLSearchParams(img.src.split('?')[1]);
            const name = urlParams.get('name');
            if (name) {
                const fullName = name.replace(/\+/g, ' ');
                img.setAttribute('alt', `Foto de ${fullName}`);
            }
        });

        // Tabelas - adicionar captions e roles
        document.querySelectorAll('table').forEach(table => {
            if (!table.querySelector('caption')) {
                const cardTitle = table.closest('.card')?.querySelector('.card-title');
                if (cardTitle) {
                    const caption = document.createElement('caption');
                    caption.className = 'sr-only';
                    caption.textContent = cardTitle.textContent.trim();
                    table.insertBefore(caption, table.firstChild);
                }
            }
        });

        // Links sem texto descritivo
        document.querySelectorAll('a').forEach(link => {
            if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
                const icon = link.querySelector('i[class*="bi-"]');
                const title = link.getAttribute('title');
                if (title) {
                    link.setAttribute('aria-label', title);
                } else if (icon) {
                    // Tentar inferir do ícone
                    for (const [iconClass, label] of Object.entries(iconButtonsMap)) {
                        if (icon.classList.contains(iconClass.replace('.', ''))) {
                            link.setAttribute('aria-label', label);
                            break;
                        }
                    }
                }
            }
        });
    },

    /**
     * Inicializa tooltips do Bootstrap de forma unificada
     */
    initTooltips: function() {
        // Converter title para data-bs-toggle="tooltip" 
        document.querySelectorAll('[title]:not([data-bs-toggle])').forEach(el => {
            const title = el.getAttribute('title');
            if (title && title.length < 100) { // Só tooltips curtos
                el.setAttribute('data-bs-toggle', 'tooltip');
                el.setAttribute('data-bs-placement', 'top');
                el.setAttribute('data-bs-title', title);
                el.removeAttribute('title'); // Evitar tooltip nativo
            }
        });

        // Inicializar tooltips do Bootstrap
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach(el => {
                new bootstrap.Tooltip(el);
            });
        }
    },

    /**
     * Melhora validação visual de formulários
     */
    enhanceFormValidation: function() {
        // Adicionar validação em tempo real
        document.querySelectorAll('form').forEach(form => {
            form.setAttribute('novalidate', '');
            
            form.querySelectorAll('input, select, textarea').forEach(field => {
                // Validar ao perder foco
                field.addEventListener('blur', () => this.validateField(field));
                
                // Remover erro ao digitar
                field.addEventListener('input', () => {
                    if (field.classList.contains('is-invalid')) {
                        this.validateField(field);
                    }
                });
            });

            // Validar ao submeter
            form.addEventListener('submit', (e) => {
                let isValid = true;
                form.querySelectorAll('input, select, textarea').forEach(field => {
                    if (!this.validateField(field)) {
                        isValid = false;
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Focar no primeiro campo inválido
                    const firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                }
            });
        });
    },

    /**
     * Valida um campo individual
     */
    validateField: function(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        let isValid = true;
        let errorMessage = '';

        // Verificar required
        if (required && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }
        
        // Validar email
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um email válido';
            }
        }
        
        // Validar telefone
        else if (type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\(\)]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Por favor, insira um telefone válido';
            }
        }
        
        // Validar min length
        else if (field.minLength > 0 && value.length < field.minLength) {
            isValid = false;
            errorMessage = `Mínimo de ${field.minLength} caracteres`;
        }

        // Aplicar classes e mensagens
        this.setFieldValidity(field, isValid, errorMessage);
        
        return isValid;
    },

    /**
     * Define o estado de validação de um campo
     */
    setFieldValidity: function(field, isValid, message = '') {
        field.classList.remove('is-valid', 'is-invalid');
        
        // Remover feedback anterior
        const existingFeedback = field.parentElement.querySelector('.invalid-feedback, .valid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        if (field.value.trim()) {
            field.classList.add(isValid ? 'is-valid' : 'is-invalid');
            field.setAttribute('aria-invalid', !isValid);
            
            if (!isValid && message) {
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = message;
                feedback.id = `${field.id || field.name}-error`;
                field.setAttribute('aria-describedby', feedback.id);
                field.parentElement.appendChild(feedback);
            }
        }
    },

    /**
     * Melhora contraste de textos
     */
    improveContrast: function() {
        // Adicionar classe para melhor contraste quando necessário
        document.querySelectorAll('.text-muted').forEach(el => {
            const style = window.getComputedStyle(el);
            const bgColor = this.getBackgroundColor(el);
            
            // Se o fundo for claro, garantir texto mais escuro
            if (bgColor && this.isLightColor(bgColor)) {
                el.style.color = '#6B7280'; // Cor mais escura que #9CA3AF
            }
        });
    },

    /**
     * Obtém a cor de fundo efetiva de um elemento
     */
    getBackgroundColor: function(el) {
        let current = el;
        while (current) {
            const style = window.getComputedStyle(current);
            const bg = style.backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                return bg;
            }
            current = current.parentElement;
        }
        return 'rgb(255, 255, 255)';
    },

    /**
     * Verifica se uma cor é clara
     */
    isLightColor: function(color) {
        const rgb = color.match(/\d+/g);
        if (!rgb) return true;
        const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
        return brightness > 128;
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    Accessibility.init();
});

// Expor globalmente
window.Accessibility = Accessibility;
