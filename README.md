# Cardápio digital — Ohcookies

Modelo inicial gratuito para publicação no **Cloudflare Pages**.

## Organização

- `public/index.html`: estrutura do site
- `public/styles.css`: aparência
- `public/script.js`: produtos, preços, estoque, horários, carrinho e WhatsApp

## Antes de divulgar

Abra `public/script.js` e confirme:

1. Número de WhatsApp em `STORE.whatsapp`;
2. Dias e horários em `STORE.openingHours`;
3. Preços e estoques na lista `PRODUCTS` — use `stock: null` para exibir “Disponível”, um número para controlar unidades ou `0` para marcar “Esgotado”;
4. Nomes e descrições dos produtos.

Os preços e estoques incluídos são apenas um modelo inicial e precisam ser confirmados.

## Como adicionar fotos

1. Dentro da pasta `public`, crie uma pasta chamada `imagens`;
2. Coloque as fotos nela;
3. No produto desejado, altere:

```js
image: ""
```

para:

```js
image: "imagens/nome-da-foto.jpg"
```

Evite espaços e acentos nos nomes dos arquivos.

## Configuração no Cloudflare Pages

- Production branch: `main`
- Framework preset: `None`
- Build command: deixe vazio
- Build output directory: `public`
- Root directory: deixe vazio

## Estoque

Nesta versão, o estoque é alterado manualmente no arquivo `public/script.js`. Quando um estoque numérico é informado, o site impede que o cliente coloque no carrinho uma quantidade maior do que a disponível.

O pedido é finalizado pelo WhatsApp, portanto o estoque não é descontado automaticamente. Reduza a quantidade depois que o pedido estiver confirmado.


## Taxa do cartão

Quando o cliente seleciona **Cartão de crédito (taxa de 4,2%)**, o cardápio calcula automaticamente:

- total dos produtos;
- taxa de 4,2%;
- total final no cartão.

Esses valores também são enviados na mensagem do WhatsApp.


## Logo da Ohcookies

A logo já foi incluída no projeto em:

`public/imagens/logo-ohcookies.jpg`

Ela foi aplicada:
- no topo do site;
- no rodapé;
- como ícone da aba do navegador (favicon).

Se depois quiser trocar a logo, basta substituir esse arquivo pelo novo, mantendo o mesmo nome.


## Imagens dos produtos

A foto do **Cookie Nutella** já foi adicionada em `public/imagens/cookie-nutella.jpg` e vinculada no cardápio.

A foto do **Cookie Red Velvet** já foi adicionada em `public/imagens/cookie-red-velvet.jpg` e vinculada no cardápio.

A foto do **Cookie Ninho c/ Nutella** já foi adicionada em `public/imagens/cookie-ninho-nutella.jpg` e vinculada no cardápio.

A foto do **Cookie Black & White** já foi adicionada em `public/imagens/cookie-black-white.jpg` e vinculada no cardápio.

A foto do **Cookie Kinder** já foi adicionada em `public/imagens/cookie-kinder.jpg` e vinculada no cardápio.

A foto do **Cookie Oreo** já foi adicionada em `public/imagens/cookie-oreo.jpg` e vinculada no cardápio.

A foto do **Cookie Ovomaltine** já foi adicionada em `public/imagens/cookie-ovomaltine.jpg` e vinculada no cardápio.

A foto do **Cookie Pistachela** já foi adicionada em `public/imagens/cookie-pistachela.jpg` e vinculada no cardápio.

A foto do **Brookie Nutella** já foi adicionada em `public/imagens/cookie-brookie-nutella.jpg` e vinculada no cardápio.

O **Cookie Tradicional** foi adicionado ao cardápio por **R$ 8,00**, com a descrição: "Massa tradicional com gotas de chocolate ao blend."
A foto dele já foi adicionada em `public/imagens/cookie-tradicional.jpg` e vinculada no cardápio.


## Categorias do cardápio

Os produtos foram reorganizados assim:

- **Tradicionais:** sabores de R$ 8,00 e R$ 10,00;
- **Premium:** sabores com valor a partir de R$ 11,00.


## Logo transparente

A logo foi atualizada para uma versão com fundo transparente em `public/imagens/logo-ohcookies.png`, aplicada no topo, rodapé e favicon.


## Descrições atualizadas

As descrições dos sabores foram revisadas e padronizadas conforme as informações fornecidas pela Ohcookies.


## Cálculo corrigido da taxa do cartão

Para receber o valor integral dos produtos após o desconto de 4,2%, o total no cartão é calculado por dentro:

`valor no cartão = valor dos produtos / (1 - 0,042)`

Exemplo: para receber R$ 20,00, o cliente paga R$ 20,88.
