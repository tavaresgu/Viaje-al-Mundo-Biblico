# Mundo Bíblico 3D — versão em espanhol para a Europa

Adaptação local da página baixada de `mundo-biblico-3d.impultienda.ar`. O original permanece intacto.

Abra `index.html` no navegador. A estrutura, as seções, os mapas, as imagens e o vídeo disponíveis no download foram preservados. A página foi reescrita em espanhol, com novas chamadas, descrições, benefícios e respostas da FAQ. Mantém euros, azul profundo e dourado suave. `clean.css` simplifica brilhos, fundos e bordas e melhora os espaçamentos sem remover conteúdo. Os carrosséis, a FAQ e os contadores de conteúdo usam JavaScript local.

## Configuração para vender

Edite `config.js`:

- `price`: preço de exibição, inicialmente **16.99 EUR**. É uma escolha inicial; não é conversão cambial.
- `checkoutUrl`: URL HTTPS do **seu** checkout hospedado. O preço e a moeda no provedor precisam coincidir com o site. O checkout local só habilita o botão quando essa URL existe.
- `supportEmail` e `sellerName`: seus dados comerciais.
- `termsUrl` e `privacyUrl`: links para suas páginas reais.

O download não contém o backend, os arquivos de integração nem o sistema de entrega da loja original. Por isso o checkout original foi substituído por uma página local de resumo que encaminha ao provedor configurado. Ela não coleta cartão, não processa pagamentos e não entrega o produto por conta própria. Configure pagamento e entrega no seu provedor antes de anunciar.

## Material preservado

As imagens e o vídeo são os do download e conservam seus textos originais em espanhol. A reformulação abrange os textos editáveis do site; não redesenha as artes nem altera os PDFs ou a aplicação vendida. Os novos títulos dos complementos aparecem apenas no site: confira sua correspondência com os arquivos entregues antes da publicação.

Os depoimentos aparecem como resumos adaptados das opiniões da coleção original, em terceira pessoa. Confirme que pode usar esse material. A garantia comercial de 15 dias foi mantida da oferta original; configure atendimento e termos compatíveis com a oferta que você realmente vai cumprir. Reescrever os textos não muda a origem das imagens, vídeos e estrutura reutilizados.

Pixels, scripts de rastreamento, credenciais e integrações da loja antiga foram retirados. Os números aleatórios de visitantes e os avisos simulados da loja original foram removidos.

## Contador, disponibilidade e notificações

`promotion.js` adiciona os elementos promocionais em espanhol. Em `config.js`, a seção `promotion` controla:

- `demo: true`: prévia explicitamente identificada como **DEMO**, com barra preenchida em 73% (27 de 100 vagas restantes) e nomes fictícios de países europeus.
- `demo: false`: usa os dados reais configurados abaixo. Sem um prazo, quantidade ou lista de compras, o elemento correspondente não aparece.
- `countdownMinutes`: duração do contador, inicialmente 14 minutos e 13 segundos. Cada carregamento inicia um novo ciclo; ao chegar a zero, recomeça. Não há mensagem de encerramento, persistência de prazo ou alteração automática de preço.
- `remaining`: número real de vagas promocionais disponíveis; não diminui aleatoriamente. Para produto digital, este número representa a alocação da promoção, não estoque físico.
- `total`: quantidade total de vagas promocionais. A barra calcula a porcentagem utilizada com `total` e `remaining`. O bloco exibe “Launch offer active”, “Only a few left”, “Limited availability” e a porcentagem. Sem um total válido, mostra a quantidade restante sem inventar uma porcentagem.
- `regularPrice`: valor de referência mostrado no texto da oferta, inicialmente €34. O contador não modifica o preço da página nem o valor cobrado pelo provedor.
- `purchases`: compras reais autorizadas para exibição, como `{name: 'First name L.', country: 'Country', purchasedAt: '2026-10-14T20:30:00+02:00'}`. A idade da compra é calculada pelo horário informado, sem apresentar registros antigos como compras recentes.

O primeiro pop-up aparece após 6–10 segundos. Cada aviso dura 6,5 segundos; entre avisos há uma pausa de 18–35 segundos. O botão × encerra as notificações naquela visita. Elas ficam pausadas quando a aba não está visível. Não há conexão automática com pedidos ou estoque: atualize os dados ou integre seu provedor antes de usar em produção.

## Arquivos

`index.html`: landing page; `europe.css`: refinamentos visuais; `interactions.js`: carrosséis e FAQ; `store.js`: preço e links; `checkout.html` e `checkout.js`: resumo e redirecionamento; `assets/`: mídia local extraída e deduplicada.

`adapt.cjs`, `translations-es.txt`, `localize-es.cjs` e `source-texts.json` registram a adaptação atual. `translations.txt` guarda a versão anterior em inglês. Não é necessário executar o script para usar ou publicar o site.

Para hospedar, envie os arquivos HTML, CSS e JS usados pela página e a pasta `assets/` ao serviço de sua escolha. Nenhuma publicação foi feita nesta tarefa.
