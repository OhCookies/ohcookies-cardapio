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
3. Preços e estoques na lista `PRODUCTS`;
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

Nesta versão, o estoque é alterado manualmente no arquivo `public/script.js`. O site impede que o cliente coloque no carrinho uma quantidade maior do que a disponível.

O pedido é finalizado pelo WhatsApp, portanto o estoque não é descontado automaticamente. Reduza a quantidade depois que o pedido estiver confirmado.
