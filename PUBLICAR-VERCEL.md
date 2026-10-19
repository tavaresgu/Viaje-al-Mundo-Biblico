# Publicar na Vercel

O projeto está configurado para hospedagem estática. Não precisa de banco de dados, chave de API nem instalação de dependências.

## Pelo painel da Vercel

1. Envie esta pasta como um repositório no GitHub, GitLab ou Bitbucket.
2. Na Vercel, escolha **Add New → Project** e importe esse repositório.
3. Se o repositório contiver outras pastas, selecione `biblic-world-3d` como **Root Directory**; se contiver apenas este projeto, deixe a raiz.
4. As opções estão definidas em `vercel.json`: **Framework Preset: Other**, **Build Command: node scripts/build.cjs**, **Output Directory: dist**. Não configure `adapt.cjs` como comando de build: ele depende do download original fora do projeto.
5. Clique em **Deploy**. A Vercel fornecerá o endereço `.vercel.app`.

## Pelo terminal

Com Node.js instalado, abra o PowerShell nesta pasta e execute:

```powershell
npx vercel
```

Entre na sua conta quando solicitado. Para publicar em produção:

```powershell
npx vercel --prod
```

## Conferência local

```powershell
npm test
npm run build
```

O build cria `dist` somente com os arquivos necessários. A pasta de saída pode ser recriada pelo próprio build. As 19 novas imagens de `imagens/`, a capa repetida, os retratos fictícios, o vídeo e as fontes são incluídos. Os arquivos de adaptação e os testes ficam fora da pasta publicada.

## Para habilitar vendas

Edite `config.js` antes do deploy ou de uma nova publicação:

- `checkoutUrl`: link HTTPS do seu provedor de pagamentos; precisa cobrar o valor e a moeda exibidos.
- `supportEmail`, `sellerName`, `termsUrl`, `privacyUrl`: dados comerciais e páginas de atendimento e políticas.
- `promotion`: disponibilidade e dados dos avisos. O modo atual é demonstração, com avisos identificados e pessoas fictícias. O contador inicia em 14:13 a cada acesso e repete o ciclo.

Sem `checkoutUrl`, a página pode ser publicada, mas o pagamento permanece desabilitado. A Vercel hospeda o site: o processamento de pagamento e a entrega dos PDFs/aplicação devem ser configurados no seu provedor.

Não coloque senhas ou chaves privadas em `config.js`: esse arquivo é público.

Nenhum deploy foi executado nesta preparação. O domínio só estará disponível depois que você publicar pela sua conta.
