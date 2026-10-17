# A Banca Store — Home

Nova home da [A Banca Store](https://www.abancastore.com.br): site estático (HTML, CSS e JS puros, sem build).

## A animação de topo

1. A página abre no cofre na parede grafitada ("ENTRE NA BANCA").
2. A abertura é um **filme** (`assets/vault-film/`) que anda junto com a rolagem: 99 quadros
   tirados do vídeo, em versão computador (`d/`) e celular (`m/`), carregados do mais grosso
   pro mais fino, então o scroll funciona antes de tudo baixar.
3. Nos primeiros quadros (porta parada), a senha **1425** é digitada por cima do visor da porta
   e ele vira "LIBERADO". Depois a roda gira, a porta abre e a câmera entra na sala do cofre.
4. Dentro do cofre (último quadro, `room.webp`), a camiseta — fotos reais das peças em
   `assets/tees/` — chega flutuando e, a cada rolada, vira 180° e troca de peça:
   - **01 · A Banca Club®** — frente, branca;
   - **02 · Rosas do Club** — costas, preta;
   - **03 · We Love (1 João 4:19)** — frente, off white;
   - **04 · Michael** — costas, preta.

Tudo isso acontece em ~1,7 tela de rolagem; o movimento é suavizado entre um clique e outro.

### Trocar o vídeo

Gere os quadros de novo com o ffmpeg e mantenha os nomes `000.webp`…`098.webp`. Se o visor da
porta mudar de lugar no vídeo novo, ajuste `CELLS`, `CELL_Y` e `LABEL` em `main.js` (posições em
pixels do vídeo 1928×1076) e `FLOOR` (centro da luz no chão do último quadro).

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
| Foto de um produto | campo `img` do produto em `PRODUCTS` |
| Fotos das 4 peças do cofre | `main.js` → `LOOKS` (arquivos em `assets/tees/look-*.webp`, PNG/WebP com fundo transparente) |
| Fotos das camisetas lisas da loja | `assets/tees/tee-*.webp` |
| Senha do cofre | `main.js` → `CODE` |
| Tempos da animação | `main.js` → `T` (valores de 0 a 1 = início/fim de cada trecho; `T.film` liga rolagem ↔ quadro do vídeo) |
| Cores e fontes | `style.css` → `:root` |

## Pendências

- **Fotos provisórias**: as camisetas em `assets/tees/` foram recortadas de prints da loja. Trocar por fotos de produto com fundo transparente (1800 px+), mantendo os mesmos nomes.
- Preços das 4 peças do scroll (`[PREÇO]`).
- Fotos das calças, conjuntos e regatas (hoje são blocos de cor com "Foto em breve").
- E-mail de contato (`[SEU E-MAIL DE CONTATO]`) e preço da peça das costas (`[PREÇO]`).
- Links dos produtos e do carrinho apontam pra `#`; ligar na loja (Nuvemshop) ou no checkout.
