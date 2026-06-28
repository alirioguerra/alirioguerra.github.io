# Alírio Guerra - Portfolio

Portfolio pessoal desenvolvido com HTML, JavaScript e Tailwind CSS.

Ao vivo em https://alirioguerra.github.io

## 🚀 Tecnologias

- HTML5
- JavaScript
- Tailwind CSS
- PostCSS
- Vite

## 📦 Instalação

```bash
npm install
```

## 🛠️ Scripts Disponíveis

- `npm start` - **Inicia o live preview** (recomendado para desenvolvimento)
- `npm run preview` - Apenas o servidor de preview na porta 3000
- `npm run dev` - Apenas o watch do CSS do Tailwind
- `npm run build` - Gera o CSS do Tailwind em modo watch
- `npm run build:prod` - Gera o CSS otimizado para produção
- `npm run build:js` - Gera o JavaScript otimizado
- `npm run build:js:watch` - Gera o JavaScript em modo watch

## 🎨 Estrutura do Projeto

```
├── index.html          # Página principal
├── input.css           # Arquivo CSS com diretivas do Tailwind
├── style.css           # CSS gerado pelo Tailwind (não editar)
├── tailwind.config.js  # Configuração do Tailwind
├── postcss.config.js   # Configuração do PostCSS
└── js/                 # Arquivos JavaScript
```

## 🔧 Desenvolvimento

Para começar a desenvolver:

1. Execute `npm run dev` para iniciar o modo de desenvolvimento
2. Edite o arquivo `input.css` para adicionar estilos customizados
3. Use classes do Tailwind diretamente no HTML

## 📝 Notas

- O arquivo `style.css` é gerado automaticamente, não edite manualmente
- Para adicionar estilos customizados, use `@layer` no `input.css`
- O arquivo `index.min.js` é gerado automaticamente pelo Vite
- O projeto foi migrado do Gulp para Tailwind CSS para melhor performance
