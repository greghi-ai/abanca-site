# A Banca Store — Home

Nova home da [A Banca Store](https://www.abancastore.com.br): site estático (HTML, CSS e JS puros, sem build).

## A animação de topo

1. A página abre no cofre na parede grafitada ("ENTRE NA BANCA"). A foto é dividida em camadas
   (`assets/vault/`: parede, porta e roda), então cada parte se mexe de verdade.
2. Rolando, a senha **1425** (número da loja no Maxi Shopping) aparece no visor da porta.
3. "LIBERADO": a roda gira, a porta destrava, abre na dobradiça e a luz sai de dentro.
4. A câmera entra no cofre e o site aparece lá dentro.
5. A camiseta 3D (WebGL puro, `shirt3d.js`, sem bibliotecas — tronco, mangas caídas, gola canelada, barra e dobras modelados no código) chega girando e, a cada rolada, vira 180° e troca de peça
   (a cor e a estampa mudam no instante em que ela fica de perfil):
   - **01 · A Banca Club®** — frente, branca;
   - **02 · Rosas do Club** — costas, preta;
   - **03 · We Love (1 João 4:19)** — frente, off white;
   - **04 · Michael** — costas, preta.

Tudo isso acontece em ~1,7 tela de rolagem (uns 10 a 19 cliques de rodinha); o movimento é suavizado entre um clique e outro.

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
| Estampas, cores e posição na camiseta 3D | `main.js` → `LOOKS` (arquivos em `assets/prints/`) |
| Cores do tecido | `main.js` → `PALETTES` |
| Senha do cofre | `main.js` → `CODE` |
| Tempos da animação | `main.js` → `render()` (valores de 0 a 1 = início/fim do trecho) |
| Forma, volume e luz da camiseta | `shirt3d.js` (`SHAPE`, `buildHeights`, shader `FS`) |
| Cores e fontes | `style.css` → `:root` |

## Pendências

- **Estampas provisórias**: os PNGs em `assets/prints/` foram recortados de prints da loja. Trocar pelos arquivos originais de estampa (PNG com fundo transparente, 2000 px+), mantendo os mesmos nomes.
- Preços das 4 peças do scroll (`[PREÇO]`).
- Fotos reais dos produtos (hoje são silhuetas com "[ FOTO ]").
- E-mail de contato (`[SEU E-MAIL DE CONTATO]`) e preço da peça das costas (`[PREÇO]`).
- Links dos produtos e do carrinho apontam pra `#`; ligar na loja (Nuvemshop) ou no checkout.
