# A Banca Store — Home

Nova home da [A Banca Store](https://www.abancastore.com.br): site estático (HTML, CSS e JS puros, sem build).

## A animação de topo

1. A página abre num cofre fechado ("ENTRE NA BANCA").
2. Rolando, a senha **1425** (número da loja no Maxi Shopping) é digitada no visor.
3. "LIBERADO": a roda gira, as travas recuam e a porta abre com luz.
4. A camiseta 3D sai girando de dentro do cofre e segue o scroll:
   - **01 · Culture Basic**: de frente, logo pequeno no peito;
   - **02 · Linha Cristã**: vai pra esquerda, vira de lado, a estampa troca pra "AMÉM";
   - **03 · Costas**: atravessa pra direita e termina de costas com "A BANCA".

Quem tem "reduzir movimento" ativado no sistema pula a animação do cofre.

## Rodar localmente

Abra `index.html` no navegador, ou:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Publicar no GitHub Pages

Settings → Pages → *Deploy from a branch* → `main` / `(root)`.

## Onde mexer

| O quê | Onde |
|---|---|
| Produtos, preços e cores | `main.js` → `PRODUCTS` |
| Foto de um produto | 9º item da linha em `PRODUCTS` (ex.: `'img/culture-basic-azul.jpg'`) |
| Cor da camiseta 3D | `main.js` → `SHIRT` (`'preto'`, `'offwhite'`, `'marrom'`) |
| Senha do cofre | `main.js` → `CODE` |
| Tempos da animação | `main.js` → `render()` (valores de 0 a 1 = início/fim do trecho) |
| Cores e fontes | `style.css` → `:root` |

## Pendências

- Fotos reais dos produtos (hoje são silhuetas com "[ FOTO ]").
- E-mail de contato (`[SEU E-MAIL DE CONTATO]`) e preço da peça das costas (`[PREÇO]`).
- Links dos produtos e do carrinho apontam pra `#`; ligar na loja (Nuvemshop) ou no checkout.
- A camiseta 3D é feita em camadas CSS. Com um modelo `.glb` da peça real dá pra trocar por Three.js mantendo o mesmo movimento.
