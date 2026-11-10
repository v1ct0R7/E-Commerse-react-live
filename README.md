# Food Studio — porosi ushqimi

Projekt MERN për porosi ushqimi, me storefront për klientët, panel administrimi me role dhe REST API me Express/MongoDB. Përfshin dizajn të ri responsive, kërkim e filtrim të menusë, shportë, kupona, pagesë Stripe dhe ndjekje porosie.

Storefront-i dhe paneli admin ofrojnë pamje të çelët/errët dhe gjuhët shqip (parazgjedhje) dhe anglisht. Preferencat ruhen lokalisht në shfletues. Emrat dhe përshkrimet e pjatave shfaqen siç janë ruajtur në menu.

## Struktura

```text
food-del/   Aplikacioni i klientëve (React + Vite) — http://localhost:5173
admin/      Paneli i stafit (React + Vite) — http://localhost:5174
backend/    API (Express + MongoDB + Stripe) — http://localhost:4000
```

## Kërkesat

- Node.js 20.19+ (ose 22.12+) dhe npm
- MongoDB lokal ose URI për MongoDB Atlas
- Çelës testues i Stripe për checkout

## Nisja lokale

Instalo paketat në secilin aplikacion:

```bash
cd backend && npm install
cd ../food-del && npm install
cd ../admin && npm install
```

Krijo skedarët e konfigurimit pa mbishkruar `.env` ekzistues:

```bash
cp -n backend/.env.example backend/.env
cp -n food-del/.env.example food-del/.env
cp -n admin/.env.example admin/.env
```

Nëse `.env` ekziston, `cp -n` e lë të paprekur. Shto vetëm çelësat që mungojnë, pa zëvendësuar sekretet që ke ruajtur. Në `backend/.env` vendos `MONGODB_URI` dhe një `JWT_SECRET` të gjatë e unik. Vendos `STRIPE_SECRET_KEY` testues për të aktivizuar pagesat; checkout-i çaktivizohet qëllimisht kur ky çelës mungon. URL-ja e parazgjedhur për API-n është `http://localhost:4000`.

Nise secilin shërbim në terminal më vete:

```bash
cd backend && npm run dev
cd food-del && npm run dev
cd admin && npm run dev
```

API-ja fillon të pranojë kërkesa vetëm pasi lidhet me MongoDB. Storefront-i është në portën `5173`, ndërsa paneli në `5174`.

### Krijimi i një administratori

Regjistro fillimisht një llogari normale nga storefront-i, pastaj caktoji rolin administrator direkt në MongoDB. Regjistrimi publik nuk lejon zgjedhjen e rolit:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Hyr me atë llogari te paneli admin. Ndryshimet e menusë, menaxhimi i porosive dhe klientëve mbrohen nga API-ja, jo vetëm nga ndërfaqja.

## Endpoint-et kryesore

| Metoda | Rruga | Qasja |
|---|---|---|
| `POST` | `/api/user/register`, `/api/user/login` | Publike |
| `GET` | `/api/food/list` | Publike |
| `POST` | `/api/food/add`, `/api/food/remove` | Administrator |
| `POST` | `/api/cart/add`, `/api/cart/remove`, `/api/cart/get`, `/api/cart/sync` | Përdorues i kyçur |
| `POST` | `/api/order/place`, `/api/order/userorders` | Përdorues i kyçur |
| `POST` | `/api/order/verify` | Verifikohet nga Stripe |
| `GET`, `POST` | `/api/order/list`, `/api/order/status` | Administrator |
| `GET` | `/api/user/list` | Administrator |
| `POST` | `/api/coupon/validate` | Publike |
| `GET`, `POST` | `/api/coupon/list`, `/api/coupon/add`, `/api/coupon/remove` | Administrator |
| `GET` | `/api/settings/public` | Publike |
| `GET`, `PATCH` | `/api/settings/` | Administrator |

Çmimet dhe totalet e porosive llogariten në server nga artikujt aktualë të MongoDB. Para se porosia të shënohet e paguar, API-ja verifikon sesionin, shumën dhe monedhën te Stripe. Administratorët mund të krijojnë kupona me 1–90% zbritje dhe datë opsionale skadence, si dhe të ndryshojnë tarifën e dërgesës në EUR. Kuponi rillogaritet nga API-ja përpara checkout-it.

## Kontrolli i cilësisë

```bash
cd food-del && npm run lint && npm run build
cd admin && npm run lint && npm run build
cd backend && npm test
```

Testet e backend-it kontrollojnë validimin e checkout-it, çmimet autoritative dhe llogaritjen e zbritjes pa shërbime të jashtme. Testimi fund-më-fund me MongoDB/Stripe kërkon URI dhe kredenciale testuese të vlefshme; ato nuk përfshihen në repository.

## Shënime për deploy

- Ruaji sekretet dhe konfigurimin e databazës/pagesave në variablat e mjedisit të host-it; mos i bëj commit `.env`.
- Vendos `FRONTEND_URL` te domeni publik i storefront-it dhe `CORS_ORIGINS` vetëm te domenet reale të klientit dhe panelit.
- Në prodhim përdor HTTPS, `JWT_SECRET` unik e të fortë, ruajtje të qëndrueshme për fotot dhe webhook-e Stripe për besueshmëri më të mirë të pagesave.
