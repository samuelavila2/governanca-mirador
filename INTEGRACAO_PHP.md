# DOCUMENTAÇÃO PARA O TIME PHP

## 📝 Guia de Integração

Este documento orienta o time PHP sobre como integrar o backend com a interface HTML/Bootstrap já criada.

## 🏗️ Arquitetura Recomendada

### Estrutura de Pastas Sugerida (após integração PHP)

```
governanca_mirador/
├── index.php
├── config/
│   ├── database.php       # Configuração do banco de dados
│   ├── config.php         # Configurações gerais
│   └── session.php        # Configuração de sessões
├── includes/
│   ├── header.php         # Header comum
│   ├── footer.php         # Footer comum
│   └── navbar.php         # Navbar comum
├── pages/
│   ├── dashboard.php
│   ├── relatorios.php
│   └── configuracoes.php
├── classes/
│   ├── Database.php       # Classe de conexão
│   ├── Usuario.php        # Classe de usuário
│   └── Projeto.php        # Classe de projeto
├── api/                   # APIs REST (opcional)
│   └── projetos.php
├── assets/                # Recursos estáticos (já criado)
│   ├── css/
│   ├── js/
│   └── uploads/          # Para arquivos enviados
└── sql/
    └── schema.sql        # Schema do banco de dados
```

## 🗄️ Banco de Dados

### Tabelas Sugeridas

```sql
-- Usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('admin', 'usuario') DEFAULT 'usuario',
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projetos
CREATE TABLE projetos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    responsavel_id INT,
    status ENUM('ativo', 'pendente', 'concluido', 'cancelado') DEFAULT 'ativo',
    data_inicio DATE,
    data_fim DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
);

-- Relatórios
CREATE TABLE relatorios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    tipo ENUM('mensal', 'trimestral', 'anual', 'personalizado'),
    periodo_inicio DATE,
    periodo_fim DATE,
    status ENUM('concluido', 'processando', 'erro') DEFAULT 'processando',
    arquivo_path VARCHAR(255),
    criado_por INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);
```

## 🔌 Conexão com Banco de Dados

### Exemplo: config/database.php

```php
<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'governanca_mirador';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Erro de conexão: " . $e->getMessage();
        }
        return $this->conn;
    }
}
?>
```

## 📄 Convertendo HTML para PHP

### Exemplo: Dashboard com dados dinâmicos

**Antes (HTML estático):**
```html
<h3 class="mb-0">42</h3>
```

**Depois (PHP dinâmico):**
```php
<?php
$db = new Database();
$conn = $db->getConnection();
$query = "SELECT COUNT(*) as total FROM projetos";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);
?>
<h3 class="mb-0"><?php echo $result['total']; ?></h3>
```

### Exemplo: Tabela de Projetos

```php
<?php
// Buscar projetos
$query = "SELECT p.*, u.nome as responsavel_nome 
          FROM projetos p 
          LEFT JOIN usuarios u ON p.responsavel_id = u.id 
          ORDER BY p.created_at DESC 
          LIMIT 10";
$stmt = $conn->prepare($query);
$stmt->execute();
$projetos = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<tbody>
    <?php foreach($projetos as $projeto): ?>
        <tr>
            <td>#<?php echo str_pad($projeto['id'], 3, '0', STR_PAD_LEFT); ?></td>
            <td><?php echo htmlspecialchars($projeto['nome']); ?></td>
            <td><?php echo htmlspecialchars($projeto['responsavel_nome']); ?></td>
            <td>
                <?php 
                $badgeClass = [
                    'ativo' => 'success',
                    'pendente' => 'warning',
                    'concluido' => 'info',
                    'cancelado' => 'danger'
                ];
                ?>
                <span class="badge bg-<?php echo $badgeClass[$projeto['status']]; ?>">
                    <?php echo ucfirst($projeto['status']); ?>
                </span>
            </td>
            <td><?php echo date('d/m/Y', strtotime($projeto['created_at'])); ?></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="visualizar(<?php echo $projeto['id']; ?>)">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editar(<?php echo $projeto['id']; ?>)">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        </tr>
    <?php endforeach; ?>
</tbody>
```

## 🔒 Autenticação e Sessões

### Exemplo: login.php

```php
<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $senha = $_POST['senha'];
    
    $db = new Database();
    $conn = $db->getConnection();
    
    $query = "SELECT * FROM usuarios WHERE email = :email AND status = 'ativo'";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($usuario && password_verify($senha, $usuario['senha'])) {
        $_SESSION['user_id'] = $usuario['id'];
        $_SESSION['user_name'] = $usuario['nome'];
        $_SESSION['user_perfil'] = $usuario['perfil'];
        header('Location: pages/dashboard.php');
        exit;
    } else {
        $erro = "Credenciais inválidas";
    }
}
?>
```

### Exemplo: Proteção de páginas

```php
<?php
// includes/auth.php
session_start();

function verificarLogin() {
    if (!isset($_SESSION['user_id'])) {
        header('Location: ../login.php');
        exit;
    }
}

function verificarAdmin() {
    if (!isset($_SESSION['user_perfil']) || $_SESSION['user_perfil'] !== 'admin') {
        header('Location: ../index.php');
        exit;
    }
}
?>
```

## 📝 Formulários e Validação

### Exemplo: Processamento de formulário

```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validação
    $nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    
    $erros = [];
    
    if (empty($nome)) {
        $erros[] = "Nome é obrigatório";
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erros[] = "E-mail inválido";
    }
    
    if (empty($erros)) {
        // Inserir no banco
        $query = "INSERT INTO usuarios (nome, email, senha) VALUES (:nome, :email, :senha)";
        $stmt = $conn->prepare($query);
        $senha_hash = password_hash($_POST['senha'], PASSWORD_DEFAULT);
        
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':senha', $senha_hash);
        
        if ($stmt->execute()) {
            // Usar a função JavaScript showToast do main.js
            echo "<script>
                window.GovernancaMirador.showToast('Usuário criado com sucesso!', 'success');
            </script>";
        }
    } else {
        foreach($erros as $erro) {
            echo "<script>
                window.GovernancaMirador.showToast('$erro', 'danger');
            </script>";
        }
    }
}
?>
```

## 📊 AJAX e APIs

### Exemplo: API REST para projetos

```php
<?php
// api/projetos.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$db = new Database();
$conn = $db->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Listar projetos
        $query = "SELECT * FROM projetos";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $projetos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($projetos);
        break;
        
    case 'POST':
        // Criar projeto
        $data = json_decode(file_get_contents('php://input'), true);
        $query = "INSERT INTO projetos (nome, descricao, responsavel_id) VALUES (:nome, :descricao, :responsavel_id)";
        $stmt = $conn->prepare($query);
        // ... bind params e execute
        break;
        
    case 'PUT':
        // Atualizar projeto
        break;
        
    case 'DELETE':
        // Deletar projeto
        break;
}
?>
```

### Exemplo: Chamada AJAX no JavaScript

```javascript
// Adicionar em assets/js/main.js

async function carregarProjetos() {
    try {
        const response = await fetch('/api/projetos.php');
        const projetos = await response.json();
        
        // Popular tabela
        const tbody = document.querySelector('#tabelaProjetos tbody');
        tbody.innerHTML = '';
        
        projetos.forEach(projeto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${projeto.id}</td>
                <td>${projeto.nome}</td>
                <td>${projeto.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="visualizar(${projeto.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        window.GovernancaMirador.showToast('Erro ao carregar projetos', 'danger');
    }
}
```

## 📤 Upload de Arquivos

### Exemplo: Upload de relatórios

```php
<?php
if ($_FILES['arquivo']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../assets/uploads/relatorios/';
    $fileName = time() . '_' . basename($_FILES['arquivo']['name']);
    $uploadFile = $uploadDir . $fileName;
    
    // Validar tipo de arquivo
    $allowedTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if (in_array($_FILES['arquivo']['type'], $allowedTypes)) {
        if (move_uploaded_file($_FILES['arquivo']['tmp_name'], $uploadFile)) {
            // Salvar referência no banco
            $query = "UPDATE relatorios SET arquivo_path = :path WHERE id = :id";
            // ... execute query
            
            echo json_encode(['success' => true, 'file' => $fileName]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Tipo de arquivo não permitido']);
    }
}
?>
```

## 🔐 Segurança - Checklist

- [ ] Usar prepared statements (PDO) para todas as queries
- [ ] Validar e sanitizar todos os inputs
- [ ] Implementar CSRF tokens nos formulários
- [ ] Usar password_hash() e password_verify()
- [ ] Escapar outputs com htmlspecialchars()
- [ ] Validar tipos de arquivo em uploads
- [ ] Limitar tamanho de uploads
- [ ] Usar HTTPS em produção
- [ ] Implementar rate limiting
- [ ] Logs de atividades importantes
- [ ] Backup automático do banco de dados

## 📦 Funções Utilitárias JavaScript Disponíveis

O arquivo `assets/js/main.js` já possui funções prontas:

```javascript
// Mostrar notificação
window.GovernancaMirador.showToast('Mensagem', 'success');

// Modal de confirmação
window.GovernancaMirador.showConfirmModal('Título', 'Mensagem', function() {
    // Ação ao confirmar
});

// Formatar moeda
window.GovernancaMirador.formatCurrency(1500); // R$ 1.500,00

// Formatar data
window.GovernancaMirador.formatDate('2025-12-26'); // 26/12/2025

// Mostrar loading
window.GovernancaMirador.showLoading(element);
```

## 🚀 Deploy

### Requisitos do Servidor

- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Apache ou Nginx
- mod_rewrite habilitado (para URLs amigáveis)

### Configuração Apache (.htaccess)

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
```

## 📞 Suporte

Para dúvidas sobre a integração, consulte:
- Documentação do Bootstrap: https://getbootstrap.com/
- Documentação PHP: https://www.php.net/
- Stack Overflow: https://stackoverflow.com/

---

**Boa integração! 🚀**
