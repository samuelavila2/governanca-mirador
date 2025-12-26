# 🏛️ MiraBoard - Sistema de Governança para EFPC

Interface moderna para gestão e governança de Entidades Fechadas de Previdência Complementar (EFPC).

> **Desenvolvido por Samuel Ávila com a ajuda do Claude (Anthropic)**

---

## 📋 Sobre o Projeto

O MiraBoard é um protótipo de interface para sistemas de governança corporativa voltado para fundos de pensão. O projeto foi desenvolvido como um frontend estático completo, com todas as interações simuladas para demonstração.

### ✨ Destaques

- 🎨 **Design System Completo** - Variáveis CSS, componentes reutilizáveis
- 📱 **Totalmente Responsivo** - Desktop, tablet e mobile
- ⌨️ **Atalhos de Teclado** - Navegação rápida (Cmd+K, ?, G+D, etc.)
- 🔍 **Busca Global** - Estilo Spotlight com Cmd+K
- 🎯 **Tour de Onboarding** - Guia interativo para novos usuários
- ♿ **Acessibilidade** - Focus-visible, prefers-reduced-motion, ARIA

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Bootstrap | 5.3.2 | Framework CSS |
| Bootstrap Icons | 1.11.3 | Ícones |
| FullCalendar | 6.x | Calendário |
| Chart.js | 4.4.1 | Gráficos |
| jsPDF | 2.5.1 | Exportação PDF |
| SheetJS | 0.18.5 | Exportação Excel |

---

## 📁 Estrutura do Projeto

```
miraboard/
├── index.html                    # Página inicial (login)
├── pages/
│   ├── dashboard.html           # Dashboard principal
│   ├── calendario-consolidado.html  # Calendário unificado
│   ├── reunioes.html            # Gestão de reuniões
│   ├── reuniao-detalhe.html     # Detalhes da reunião
│   ├── atas.html                # Gestão de atas
│   ├── ata-detalhe.html         # Detalhes da ata
│   ├── acoes.html               # Gestão de ações
│   ├── documentos.html          # Repositório de documentos
│   ├── biblioteca.html          # Gestão documental
│   ├── obrigacoes.html          # Central de conformidade
│   ├── membros.html             # Certificações
│   ├── mensagens.html           # Sistema de mensagens
│   ├── relatorios.html          # Relatórios
│   └── configuracoes.html       # Configurações
├── assets/
│   ├── css/
│   │   ├── variables.css        # Variáveis CSS
│   │   ├── components.css       # Componentes
│   │   ├── layout.css           # Layout base
│   │   ├── dashboard.css        # Estilos dashboard
│   │   ├── reuniao.css          # Estilos reuniões
│   │   ├── biblioteca.css       # Estilos biblioteca
│   │   ├── calendario.css       # Estilos calendário
│   │   ├── conformidade.css     # Estilos conformidade
│   │   └── ux-enhancements.css  # Melhorias UX
│   └── js/
│       ├── sidebar.js           # Sidebar component
│       ├── fake-actions.js      # Ações simuladas
│       ├── global-search.js     # Busca global (Cmd+K)
│       ├── shortcuts-tour.js    # Atalhos + Tour
│       ├── breadcrumbs.js       # Navegação breadcrumb
│       └── empty-states.js      # Estados vazios
└── README.md
```

---

## 🎨 Design System

### Cores Principais

| Cor | Hex | Uso |
|-----|-----|-----|
| Laranja Mirador | `#E8681A` | Cor primária/brand |
| Cinza 900 | `#1f2937` | Textos principais |
| Cinza 500 | `#6b7280` | Textos secundários |
| Verde Sucesso | `#10b981` | Status positivo |
| Vermelho Perigo | `#dc3545` | Alertas/erros |

### Tipografia

- **Títulos**: Plus Jakarta Sans (600-700)
- **Corpo**: Inter (400-500)

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `⌘K` / `Ctrl+K` | Busca global |
| `?` | Mostrar todos os atalhos |
| `G` → `D` | Ir para Dashboard |
| `G` → `R` | Ir para Reuniões |
| `G` → `C` | Ir para Calendário |
| `G` → `A` | Ir para Ações |
| `N` | Novo item |
| `F` | Tela cheia |
| `/` | Focar na busca |
| `Esc` | Fechar modal |

---

## 📱 Páginas Principais

### 1. Dashboard
- Métricas em tempo real
- Mini calendário
- Próximas reuniões
- Ações pendentes
- Atividades recentes

### 2. Reuniões
- Lista de reuniões por órgão
- Filtros por status e tipo
- Wizard de criação de reunião
- Gestão de pauta e convocação

### 3. Calendário
- Visualização unificada
- Reuniões, ações, obrigações
- Filtros por tipo de evento
- Legenda por cores

### 4. Central de Conformidade
- Obrigações PREVIC
- Prazos legais
- Status de envio
- Alertas de vencimento

### 5. Gestão Documental
- Documentos com versionamento
- Alertas de revisão
- Controle de validade
- Categorização

### 6. Certificações
- Membros dos órgãos
- Certificações ICSS
- Alertas de vencimento
- Histórico de mandatos

---

## 🔧 Funcionalidades JavaScript

### Fake Actions
Todas as interações são simuladas com feedback visual:
- Toast notifications
- Modais de confirmação
- Loading spinners
- Animações de remoção

### Componentes Globais
```javascript
// Busca global
GlobalSearch.open();

// Empty states
EmptyStates.inject('#container', 'noData');

// Toast notification
FakeActions.showToast('Mensagem', 'success');

// Modal de confirmação
FakeActions.showConfirm('Título', 'Mensagem', callback);

// Reset do tour
OnboardingTour.reset();
```

---

## 🖥️ Como Visualizar

1. Clone o repositório
2. Abra `pages/dashboard.html` no navegador
3. Ou use um servidor local:

```bash
# Com Python
python -m http.server 8000

# Com Node.js
npx serve

# Com PHP
php -S localhost:8000
```

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

**Versão**: 2.0.0  
**Data**: Dezembro 2025  
**Status**: Protótipo Frontend Completo
