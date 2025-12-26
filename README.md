# 🏛️ MiraBoard - Sistema de Governança para EFPC

Interface moderna para gestão e governança de Entidades Fechadas de Previdência Complementar (EFPC).

> **Desenvolvido por Samuel Ávila com a ajuda do Claude (Anthropic)**

---

## 📋 Índice

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Como Rodar Localmente](#-como-rodar-localmente)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [🔌 Integração com Backend PHP](#-integração-com-backend-php)
5. [Sistema de Perfis](#-sistema-de-perfis)
6. [Mapa de Páginas](#-mapa-de-páginas)
7. [Design System](#-design-system)
8. [Atalhos de Teclado](#-atalhos-de-teclado)

---

## 📋 Sobre o Projeto

O MiraBoard é um **protótipo de interface frontend** para o sistema de governança corporativa de EFPCs. Foi desenvolvido como HTML/CSS/JS estático para validação de UX antes da integração com o backend PHP existente.

### ✨ Destaques

- 🎨 **Design System Completo** - Variáveis CSS, componentes reutilizáveis
- 📱 **Totalmente Responsivo** - Desktop, tablet e mobile
- 👤 **3 Perfis de Usuário** - Admin, Secretária, Conselheiro
- ⌨️ **Atalhos de Teclado** - Navegação rápida (Cmd+K, ?, etc.)
- 🔍 **Busca Global** - Estilo Spotlight com Cmd+K
- ♿ **Acessibilidade** - WCAG 2.1 AA

---

## 🚀 Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/samuelavila2/governanca-mirador.git
cd governanca-mirador

# Opção 1: Python
python -m http.server 8000

# Opção 2: PHP
php -S localhost:8000

# Opção 3: Node.js
npx serve

# Acesse
open http://localhost:8000/pages/dashboard.html
```

---

## 📁 Estrutura do Projeto

```
governanca_mirador/
├── index.html                      # Login (entrada)
│
├── pages/                          # Todas as páginas do sistema
│   ├── dashboard.html              # Dashboard (por perfil)
│   ├── calendario-consolidado.html # Calendário unificado
│   ├── reunioes.html               # Lista de reuniões
│   ├── reuniao-detalhe.html        # Wizard de reunião (9 tabs)
│   ├── atas.html                   # Lista de atas
│   ├── ata-detalhe.html            # Detalhe/assinatura de ata
│   ├── acoes.html                  # Gestão de ações
│   ├── biblioteca.html             # Gestão Documental (única página de docs)
│   ├── obrigacoes.html             # Central de Conformidade (PREVIC)
│   ├── membros.html                # Mandatos e Certificações
│   ├── mensagens.html              # Chat interno
│   ├── comunicados.html            # Broadcast de comunicados
│   ├── relatorios.html             # Relatórios gerenciais
│   ├── configuracoes.html          # Configurações do sistema
│   └── administracao.html          # Gestão de usuários/perfis (admin only)
│
├── assets/
│   ├── css/
│   │   ├── variables.css           # 🎨 Variáveis (cores, tipografia)
│   │   ├── components.css          # Componentes reutilizáveis
│   │   ├── layout.css              # Estrutura base (sidebar, header)
│   │   ├── dashboard.css           # Estilos do dashboard
│   │   ├── reuniao.css             # Estilos de reuniões
│   │   ├── biblioteca.css          # Estilos de documentos
│   │   ├── ata-workflow.css        # Workflow de atas
│   │   ├── calendario.css          # Estilos do calendário
│   │   ├── conformidade.css        # Estilos de obrigações
│   │   └── ux-enhancements.css     # Melhorias de UX
│   │
│   ├── js/
│   │   ├── sidebar.js              # ⭐ Componente do menu lateral
│   │   ├── main.js                 # Inicialização geral
│   │   ├── fake-actions.js         # Simulações (substituir por AJAX)
│   │   ├── global-search.js        # Busca global (Cmd+K)
│   │   ├── shortcuts-tour.js       # Atalhos + onboarding
│   │   ├── breadcrumbs.js          # Navegação
│   │   └── empty-states.js         # Estados vazios
│   │
│   └── img/                        # Imagens e ícones
│
└── README.md
```

---

## 🔌 Integração com Backend PHP

### Conceito Geral

Este frontend é **100% estático**. Para integrar com o sistema PHP:

1. **Substituir os HTMLs por templates PHP/Blade**
2. **Trocar dados fake por consultas ao banco**
3. **Substituir `fake-actions.js` por chamadas AJAX reais**

### Arquivos Principais para Integração

| Arquivo | O que fazer |
|---------|-------------|
| `sidebar.js` | Receber menu dinâmico do PHP (já tem estrutura de permissões) |
| `fake-actions.js` | Substituir por chamadas `fetch()` reais |
| `dashboard.html` | Puxar dados reais das métricas |
| Todos os `.html` | Converter para `.blade.php` ou `.php` |

### Exemplo: Substituindo Ação Fake

**Antes (fake-actions.js):**
```javascript
FakeActions.showToast('Reunião criada com sucesso!', 'success');
```

**Depois (integração real):**
```javascript
fetch('/api/reunioes', {
    method: 'POST',
    body: JSON.stringify(dadosReuniao)
})
.then(response => response.json())
.then(data => {
    showToast('Reunião criada com sucesso!', 'success');
    window.location.href = `/reuniao/${data.id}`;
});
```

### Dados que o Backend Precisa Fornecer

#### Dashboard
```json
{
  "stats": {
    "reunioes_mes": 12,
    "atas_aprovadas": 8,
    "acoes_pendentes": 5,
    "taxa_presenca": 94
  },
  "proximas_reunioes": [...],
  "acoes_urgentes": [...],
  "notificacoes": [...]
}
```

#### Sidebar (Menu)
```json
{
  "usuario": {
    "nome": "Maria Silva",
    "perfil": "secretaria",
    "avatar": "url"
  },
  "menu_permitido": ["dashboard", "reunioes", "atas", ...]
}
```

---

## 👤 Sistema de Perfis

O frontend já implementa **3 perfis** com controle de visibilidade:

### Perfis Disponíveis

| Perfil | Descrição | Acesso |
|--------|-----------|--------|
| `admin` | Administrador do sistema | Tudo + Administração |
| `secretaria` | Secretária executiva | Operacional (sem Admin) |
| `conselheiro` | Membro de conselho | Visualização + assinaturas |

### Como Funciona no HTML

```html
<!-- Só aparece para admin -->
<div data-permission="admin">
    Conteúdo exclusivo admin
</div>

<!-- Aparece para admin E secretaria -->
<div data-permission="admin secretaria">
    Conteúdo admin + secretaria
</div>

<!-- Esconde para conselheiro -->
<button data-hide-for="conselheiro">
    Botão que conselheiro não vê
</button>
```

### Onde Está Definido

O sistema de perfis está em `assets/js/sidebar.js`:

```javascript
permissions: {
    admin: {
        menu: ['dashboard', 'reunioes', ..., 'administracao'],
        userName: 'Admin Master',
        userRole: 'Administrador'
    },
    secretaria: {
        menu: ['dashboard', 'reunioes', ...],  // sem 'administracao'
        userName: 'Maria Silva',
        userRole: 'Secretária Executiva'
    },
    conselheiro: {
        menu: ['dashboard', 'reunioes', ...],  // menos opções
        userName: 'João Conselheiro',
        userRole: 'Conselheiro Deliberativo'
    }
}
```

### Testando Perfis

No browser, abra o Console (F12) e execute:
```javascript
// Trocar para perfil admin
localStorage.setItem('miraboard_user_profile', 'admin');
location.reload();

// Trocar para perfil secretaria
localStorage.setItem('miraboard_user_profile', 'secretaria');
location.reload();

// Trocar para perfil conselheiro
localStorage.setItem('miraboard_user_profile', 'conselheiro');
location.reload();
```

---

## 🗺️ Mapa de Páginas

### Menu Principal

| Página | Arquivo | Descrição |
|--------|---------|-----------|
| Dashboard | `dashboard.html` | Visão geral personalizada por perfil |
| Calendário | `calendario-consolidado.html` | Calendário unificado (reuniões + ações + obrigações) |
| Reuniões | `reunioes.html` | Lista de reuniões com filtros |
| Atas | `atas.html` | Lista de atas com status de assinatura |
| Ações | `acoes.html` | Gestão de ações/deliberações |

### Compliance EFPC

| Página | Arquivo | Descrição |
|--------|---------|-----------|
| Central de Conformidade | `obrigacoes.html` | Obrigações PREVIC com prazos |
| Gestão Documental | `biblioteca.html` | Documentos com versionamento e alertas |
| Mandatos e Certificações | `membros.html` | Membros, mandatos, certificações ICSS |

### Comunicação

| Página | Arquivo | Descrição |
|--------|---------|-----------|
| Mensagens | `mensagens.html` | Chat interno |
| Comunicados | `comunicados.html` | Broadcast para grupos |
| Relatórios | `relatorios.html` | Relatórios gerenciais |

### Configuração

| Página | Arquivo | Descrição |
|--------|---------|-----------|
| Configurações | `configuracoes.html` | Preferências do sistema |
| Administração | `administracao.html` | Usuários, perfis, cargos, grupos (admin only) |

### Páginas de Detalhe

| Página | Arquivo | Descrição |
|--------|---------|-----------|
| Detalhe Reunião | `reuniao-detalhe.html` | Wizard com 9 tabs (pauta, membros, votações, ata) |
| Detalhe Ata | `ata-detalhe.html` | Visualização e assinatura de ata |

---

## 🎨 Design System

### Cores Principais

```css
/* Em assets/css/variables.css */
--color-primary: #E8681A;      /* Laranja Mirador (brand) */
--color-success: #10b981;      /* Verde */
--color-warning: #f59e0b;      /* Amarelo */
--color-danger: #dc3545;       /* Vermelho */
--color-info: #3b82f6;         /* Azul */
```

### Tipografia

| Uso | Fonte | Peso |
|-----|-------|------|
| Títulos | Plus Jakarta Sans | 600-700 |
| Corpo | Inter | 400-500 |

### Componentes CSS

Todos os componentes estão em `assets/css/components.css`:
- `.card` - Cards com sombra
- `.btn-primary` - Botão laranja
- `.badge` - Tags de status
- `.avatar` - Fotos de perfil
- `.stat-card` - Cards de métricas
- `.timeline` - Linha do tempo

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `⌘K` / `Ctrl+K` | Busca global |
| `?` | Mostrar atalhos |
| `G` → `D` | Ir para Dashboard |
| `G` → `R` | Ir para Reuniões |
| `G` → `C` | Ir para Calendário |
| `G` → `A` | Ir para Ações |
| `N` | Novo item |
| `Esc` | Fechar modal |

---

## 📊 Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Bootstrap | 5.3.2 | Framework CSS |
| Bootstrap Icons | 1.11.3 | Ícones |
| FullCalendar | 6.x | Calendário |
| Chart.js | 4.4.1 | Gráficos |

---

## 📊 Compatibilidade

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

---

## 👤 Autor

**Samuel Ávila**  
Desenvolvido com a assistência do **Claude** (Anthropic)

---

## 📄 Licença

Projeto desenvolvido para uso interno da Mirador.

---

**Versão**: 2.1.0  
**Data**: Dezembro 2025  
**Status**: Protótipo Frontend Completo - Pronto para Integração
