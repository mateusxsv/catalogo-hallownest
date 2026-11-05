# Catálogo de Hallownest — edição visual

Atualização do App.js da versão inicial. Mantém as 5 categorias, consulta à HallownestAPI, paginação, detalhes e pesquisa local.

## Instalar a fonte

No terminal, dentro do projeto Expo existente:

```bash
npx expo install expo-font @expo-google-fonts/cinzel
```

Substitua o **App.js** pelo arquivo incluído neste pacote. Depois execute:

```bash
npx expo start -c
```

As imagens dos registros são carregadas da API quando disponíveis. Quando um registro não tiver imagem, ou o serviço externo bloquear o carregamento, um ícone substituto aparecerá.

## GitHub — comandos

Crie primeiro um repositório VAZIO chamado `catalogo-de-hallownest` no GitHub e rode na raiz do seu projeto Expo:

```bash
git init
git add .
git commit -m "feat: catalogo de hallownest com tema e ilustracoes"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/catalogo-de-hallownest.git
git push -u origin main
```

Se o Git já estiver inicializado, não precisa repetir `git init`. Se `origin` já existir, use `git remote set-url origin URL`.

## Publicação

- **GitHub** hospeda o código, mas não publica automaticamente o app mobile.
- **Android:** use o EAS Build do Expo para gerar um APK instalável; o Expo Go é apenas ambiente de testes.
- **Web:** necessita suporte web no projeto; após instalar dependências para web e testar, exporte com `npx expo export --platform web` e publique em hospedagem de arquivos estáticos ou EAS Hosting. Não é necessário para a entrega mobile.

Projeto de fãs, não comercial. Os dados da HallownestAPI são licenciados sob CC BY-NC-SA 4.0; imagens externas têm suas próprias licenças e exigências de atribuição. Consulte o repositório da API.
