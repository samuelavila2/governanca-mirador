#!/bin/bash

echo "🔧 Configuração do GitHub para Governança Mirador"
echo ""
echo "Escolha uma opção:"
echo ""
echo "1️⃣  Instalar GitHub CLI (Recomendado)"
echo "2️⃣  Usar Personal Access Token"
echo "3️⃣  Criar repositório manualmente"
echo ""
read -p "Opção (1, 2 ou 3): " opcao

case $opcao in
    1)
        echo ""
        echo "📦 Instalando GitHub CLI..."
        echo ""
        echo "Execute os seguintes comandos:"
        echo ""
        echo "# 1. Instalar Homebrew (se ainda não tiver)"
        echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
        echo ""
        echo "# 2. Instalar GitHub CLI"
        echo "brew install gh"
        echo ""
        echo "# 3. Fazer login"
        echo "gh auth login"
        echo ""
        echo "# 4. Criar repositório e enviar"
        echo "gh repo create governanca-mirador --public --source=. --remote=origin --push"
        ;;
    
    2)
        echo ""
        echo "🔑 Usando Personal Access Token"
        echo ""
        echo "1. Acesse: https://github.com/settings/tokens/new"
        echo "2. Marque as permissões: repo (todas)"
        echo "3. Gere o token e copie"
        echo ""
        read -p "Cole seu token aqui: " TOKEN
        
        if [ -z "$TOKEN" ]; then
            echo "❌ Token vazio!"
            exit 1
        fi
        
        read -p "Seu usuário do GitHub: " USERNAME
        
        echo ""
        echo "Criando repositório..."
        
        curl -H "Authorization: token $TOKEN" \
             -H "Accept: application/vnd.github.v3+json" \
             https://api.github.com/user/repos \
             -d '{"name":"governanca-mirador","description":"Sistema de gestão e governança corporativa com Bootstrap 5.3.2","private":false}'
        
        echo ""
        echo "Adicionando remote e fazendo push..."
        git remote add origin "https://$TOKEN@github.com/$USERNAME/governanca-mirador.git"
        git branch -M main
        git push -u origin main
        
        echo ""
        echo "✅ Concluído! Acesse: https://github.com/$USERNAME/governanca-mirador"
        ;;
    
    3)
        echo ""
        echo "📝 Criação Manual"
        echo ""
        echo "1. Acesse: https://github.com/new"
        echo "2. Nome: governanca-mirador"
        echo "3. NÃO marque 'Initialize with README'"
        echo "4. Clique em 'Create repository'"
        echo ""
        echo "Depois de criar, execute:"
        echo ""
        read -p "Cole a URL do repositório (https://github.com/...): " REPO_URL
        
        if [ -z "$REPO_URL" ]; then
            echo "❌ URL vazia!"
            exit 1
        fi
        
        git remote add origin "$REPO_URL"
        git branch -M main
        git push -u origin main
        
        echo ""
        echo "✅ Enviado com sucesso!"
        ;;
    
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac
