# Drink Water: Hydroflow 🌊

Természet ihlette, mobilbarát vízivás-követő webapp. HTML, CSS és JavaScript — nincs szükség buildre vagy telepítésre.

## Funkciók
- Vízmennyiség hozzáadása (+150, +250, +500 ml)
- Napi cél és egyéni hozzáadási mennyiség
- Animált vízszint és hullámok
- Mai napló és összesítés
- Böngészőben tárolt adatok (`localStorage`)
- JSON-adatexport, napi napló törlése, teljes adattörlés
- Reszponzív elrendezés telefonra és PC-re
- GitHub Pages-kompatibilis, statikus webapp

## Indítás a számítógépen
1. Csomagold ki a ZIP-et.
2. Nyisd meg az `index.html` fájlt Chrome-ban vagy Edge-ben.

## Feltöltés GitHubra
1. Nyisd meg: https://github.com/new
2. Repository name: `drink-water-hydroflow`
3. Válaszd a **Public** lehetőséget (GitHub Pageshez egyszerűbb), majd kattints a **Create repository** gombra.
4. A repository oldalán válaszd az **Add file → Upload files** lehetőséget.
5. Húzd be az `index.html`, `style.css`, `app.js` és `README.md` fájlokat (a ZIP-et előbb csomagold ki).
6. Kattints a **Commit changes** gombra.
7. Nyisd meg a repository **Settings → Pages** részét.
8. A **Build and deployment** résznél válaszd a **Deploy from a branch** módot.
9. Branch: `main`, folder: `/(root)`, majd **Save**.
10. Néhány perc után a Pages rész megmutatja a weboldal URL-jét, általában:
   `https://FELHASZNALONEV.github.io/drink-water-hydroflow/`

## Frissítés
Módosítsd a fájlokat, majd a repositoryban töltsd fel őket újra, vagy szerkeszd a GitHub webes fájlszerkesztőjével. A Pages automatikusan újra közzéteszi a frissítést.

## Adatvédelem
A napló a böngésző `localStorage` tárhelyén marad. Másik böngészőn vagy eszközön nem szinkronizálódik automatikusan. A böngészőadatok törlése a naplót is törölheti. A webapp nem kér be fiókot vagy személyes adatot.

## Megjegyzés
A napi cél személyre szabható emlékeztető, nem orvosi ajánlás. A folyadékigény egyénenként és naponta eltérhet.
