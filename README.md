# Governança Mirador

Sistema de gestão e governança corporativa desenvolvido com Bootstrap 5.3.2.

## 📋 Descrição

O Governança Mirador é um sistema web estático desenvolvido em HTML/CSS/JavaScript com Bootstrap 5.3.2, preparado para integração com PHP. O objetivo é fornecer uma interface limpa e organizada para que o time de desenvolvimento PHP possa adicionar as chamadas dinâmicas diretamente nos arquivos HTML.

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **Bootstrap 5.3.2**: Framework CSS mais recente
- **Bootstrap Icons 1.11.3**: Biblioteca de ícones
- **JavaScript ES6+**: Funcionalidades interativas
- **CSS3**: Estilos customizados

## 📁 Estrutura do Projeto

```
governanca_mirador/
├── index.html                 # Página inicial
├── pages/                     # Páginas do sistema
│   ├── dashboard.html        # Dashboard com métricas
│   ├── relatorios.html       # Gestão de relatórios
│   └── configuracoes.html    # Configurações do sistema
├── assets/                    # Recursos estáticos
│   ├── css/
│   │   └── style.css         # Estilos customizados
│   └── js/
│       └── main.js           # JavaScript customizado
└── README.md                  # Documentação
```

## 🎨 Páginas Disponíveis

### 1. Página Inicial (`index.html`)
- Apresentação do sistema
- Cards de acesso rápido
- Navegação principal

### 2. Dashboard (`pages/dashboard.html`)
- Métricas principais (cards informativos)
- Tabela de atividades recentes
- Visualização de status de projetos

### 3. Relatórios (`pages/relatorios.html`)
- Filtros de pesquisa
- Listagem de relatórios
- Opções de exportação (Excel/PDF)
- Paginação

### 4. Configurações (`pages/configuracoes.html`)
- Configurações gerais
- Gerenciamento de usuários
- Preferências de notificação
- Configurações de segurança
- Informações do sistema

## 🔧 Funcionalidades JavaScript

O arquivo `assets/js/main.js` inclui funções utilitárias prontas para uso:

- **showToast()**: Exibe notificações toast
- **showConfirmModal()**: Modal de confirmação
- **formatCurrency()**: Formata valores em R$
- **formatDate()**: Formata datas no padrão BR
- **showLoading()**: Exibe spinner de carregamento
- **initializeTooltips()**: Inicializa tooltips do Bootstrap
- **initializePopovers()**: Inicializa popovers do Bootstrap

## 💻 Como Usar

### Visualização Local

1. Clone o repositório ou abra a pasta do projeto
2. Abra o arquivo `index.html` em seu navegador
3. Navegue pelas páginas através do menu

### Integração com PHP

Para integrar com PHP, o time de desenvolvimento pode:

1. **Renomear arquivos** de `.html` para `.php`
2. **Adicionar includes** do PHP para header/footer
3. **Inserir consultas** ao banco de dados
4. **Adicionar loops PHP** nas tabelas para popular dados dinamicamente
5. **Implementar validações** de formulários server-side

#### Exemplo de Integração:

```php
<!-- Exemplo de como popular a tabela do dashboard -->
<?php
// Buscar dados do banco
$projetos = $db->query("SELECT * FROM projetos ORDER BY data DESC LIMIT 10");

// Dentro da tabela HTML
foreach($projetos as $projeto): ?>
    <tr>
        <td><?php echo $projeto['id']; ?></td>
        <td><?php echo $projeto['nome']; ?></td>
        <td><?php echo $projeto['responsavel']; ?></td>
        <td><span class="badge bg-<?php echo $projeto['status_cor']; ?>">
            <?php echo $projeto['status']; ?>
        </span></td>
        <td><?php echo date('d/m/Y', strtotime($projeto['data'])); ?></td>
        <td>
            <!-- Botões de ação -->
        </td>
    </tr>
<?php endforeach; ?>
```

## 🎯 Pontos de Integração PHP

Os principais pontos onde o time PHP precisará adicionar código:

1. **Tabelas**: Substituir dados estáticos por loops PHP
2. **Formulários**: Adicionar `action` e validações server-side
3. **Cards de Métricas**: Buscar valores do banco de dados
4. **Filtros**: Implementar lógica de busca e filtros
5. **Autenticação**: Sistema de login/logout
6. **Exportação**: Implementar geração de Excel/PDF

## 🔐 Segurança (Para implementação PHP)

Recomendações para o time PHP:

- Usar prepared statements para queries SQL
- Validar e sanitizar todos os inputs
- Implementar CSRF tokens nos formulários
- Usar sessões seguras para autenticação
- Escapar outputs com `htmlspecialchars()`
- Implementar controle de acesso baseado em roles

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🎨 Customização de Estilos

Para personalizar cores e estilos, edite as variáveis CSS em `assets/css/style.css`:

```css
:root {
    --primary-color: #0d6efd;
    --secondary-color: #6c757d;
    --success-color: #198754;
    /* ... outras variáveis */
}
```

## 📦 CDNs Utilizadas

- Bootstrap CSS: `cdn.jsdelivr.net/npm/bootstrap@5.3.2`
- Bootstrap JS: `cdn.jsdelivr.net/npm/bootstrap@5.3.2`
- Bootstrap Icons: `cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3`

## 🤝 Contribuindo

Este projeto serve como base para o sistema completo. O time PHP é responsável por:

1. Adicionar lógica de backend
2. Integração com banco de dados
3. Implementar autenticação e autorização
4. Criar APIs REST (se necessário)
5. Adicionar validações server-side

## 📄 Licença

Projeto desenvolvido para uso interno.

## 👥 Time

- **Frontend/UI**: Interface estática em Bootstrap
- **Backend**: Time PHP (integração posterior)

## 📞 Suporte

Para dúvidas sobre a estrutura HTML/CSS/Bootstrap, consulte a documentação oficial do Bootstrap 5.3:
https://getbootstrap.com/docs/5.3/

---

**Versão**: 1.0.0  
**Data**: Dezembro 2025  
**Status**: Interface estática pronta para integração PHP
