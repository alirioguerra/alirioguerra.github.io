# Alírio Guerra - Portfolio

Portfolio pessoal desenvolvido com HTML, JavaScript e Tailwind CSS.

## 🚀 Tecnologias

- HTML5
- JavaScript
- Tailwind CSS
- PostCSS

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

## 🎨 Estrutura do Projeto

```
├── index.html          # Página principal
├── resume.html         # Página do currículo
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
- O projeto foi migrado do Gulp para Tailwind CSS para melhor performance
