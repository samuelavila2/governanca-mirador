/**
 * Governança Mirador - Main JavaScript
 * 
 * Este arquivo contém funcionalidades JavaScript reutilizáveis
 * O time PHP poderá adicionar chamadas AJAX e outras integrações aqui
 */

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('Governança Mirador - Sistema carregado');
    
    // Inicializar tooltips do Bootstrap
    initializeTooltips();
    
    // Inicializar popovers do Bootstrap
    initializePopovers();
    
    // Marcar link ativo no menu
    setActiveNavLink();
});

/**
 * Inicializa todos os tooltips da página
 */
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

/**
 * Inicializa todos os popovers da página
 */
function initializePopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
}

/**
 * Marca o link ativo no menu de navegação
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage || link.getAttribute('href').includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

/**
 * Exibe um toast de notificação
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de alerta (success, danger, warning, info)
 */
function showToast(message, type = 'info') {
    // Criar container de toasts se não existir
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Criar toast
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">Notificação</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remover toast após ser fechado
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

/**
 * Exibe um modal de confirmação
 * @param {string} title - Título do modal
 * @param {string} message - Mensagem do modal
 * @param {function} onConfirm - Callback ao confirmar
 */
function showConfirmModal(title, message, onConfirm) {
    // Criar modal se não existir
    let modal = document.getElementById('confirmModal');
    if (!modal) {
        const modalHtml = `
            <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmModalLabel"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="confirmButton">Confirmar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        modal = document.getElementById('confirmModal');
    }
    
    // Atualizar conteúdo
    document.getElementById('confirmModalLabel').textContent = title;
    modal.querySelector('.modal-body').textContent = message;
    
    // Configurar callback
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.onclick = function() {
        onConfirm();
        bootstrap.Modal.getInstance(modal).hide();
    };
    
    // Exibir modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

/**
 * Formata número como moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Formata data no padrão brasileiro
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada
 */
function formatDate(date) {
    const d = new Date(date);
    return new Intl.DateTimeFormat('pt-BR').format(d);
}

/**
 * Exibe loading spinner
 * @param {HTMLElement} element - Elemento onde o spinner será exibido
 */
function showLoading(element) {
    const spinner = `
        <div class="spinner-wrapper">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>
    `;
    element.innerHTML = spinner;
}

// Exportar funções globalmente para uso do time PHP
window.GovernancaMirador = {
    showToast,
    showConfirmModal,
    formatCurrency,
    formatDate,
    showLoading
};
