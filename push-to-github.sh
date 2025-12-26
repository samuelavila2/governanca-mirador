#!/bin/bash

# Governança Mirador - Push para GitHub
# Execute após criar o repositório em: https://github.com/new

echo "🚀 Governança Mirador - Push para GitHub"
echo ""
echo "📋 Por favor, informe a URL do seu repositório GitHub:"
echo "   Exemplo: https://github.com/seu-usuario/governanca-mirador.git"
echo ""
read -p "URL do repositório: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ URL não pode estar vazia!"
    exit 1
fi

echo ""
echo "📡 Adicionando remote origin..."
git remote add origin "$REPO_URL"

echo "� Verificando configuração..."
git remote -v

echo ""
echo "📤 Enviando para GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Projeto enviado com sucesso!"
    echo "🌐 Acesse: ${REPO_URL%.git}"
else
    echo ""
    echo "❌ Erro ao enviar. Verifique suas credenciais do GitHub."
    echo "💡 Pode ser necessário configurar um Personal Access Token"
fi
