# Além das Manchetes — versão HTML, CSS e JavaScript

Esta é uma migração simplificada do projeto original. A versão usa HTML, CSS e JavaScript nativos, sem React, TypeScript, Vite, Tailwind, Framer Motion ou fontes remotas obrigatórias.

## Estrutura

- `index.html`: página inicial e verificador.
- `quiz.html`: simulador e quiz completo.
- `ebook.html`: leitor de capítulos.
- `css/style.css`: estilos e responsividade.
- `js/app.js`: interações.
- `js/data.js`: perguntas e dados do simulador.
- `js/ebook-data.js`: capítulos do e-book.
- `ebook.pdf`: PDF original.
- `service-worker.js`: cache para funcionamento offline.
- `manifest.json`: metadados para instalação como aplicativo.

## Executar no computador

O Service Worker não funciona ao abrir o HTML diretamente pelo `file://`. Inicie um servidor local na pasta do projeto:

### Python
```bash
python -m http.server 8000
```
Depois acesse `http://localhost:8000`.

Também pode usar a extensão Live Server do VS Code, se já estiver instalada.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub.
2. Envie o conteúdo desta pasta para a raiz do repositório (não envie a pasta externa que contém o ZIP).
3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione `main` e a pasta `/ (root)`, depois salve.
6. Aguarde a publicação. O endereço será exibido na própria página de configurações.

Os links internos usam caminhos relativos, compatíveis com um repositório de projeto do GitHub Pages.

## Funcionamento offline

Abra o site uma vez usando `localhost` ou o endereço HTTPS do GitHub Pages e navegue pelas páginas para que os recursos sejam armazenados. Depois disso, os arquivos principais ficam disponíveis no cache do navegador. A primeira visita precisa de conexão.

## Observações importantes

- O verificador é uma ferramenta educativa baseada em padrões de texto. Ele não consulta a internet nem confirma a veracidade de uma notícia.
- A tipografia usa fontes locais do sistema, sem baixar fontes do Google.
- A versão original do ZIP não foi alterada; esta pasta é uma cópia de trabalho separada.
- Antes da publicação final, compare visualmente todas as páginas com a versão original e teste os recursos no navegador e em modo offline.
