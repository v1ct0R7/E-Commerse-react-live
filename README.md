# Food Studio — porosi ushqimi

Projekt për porosi ushqimi me React, Express dhe MySQL: storefront për klientët, panel administrimi me role dhe REST API me Express/MySQL. Përfshin dizajn të ri responsive, kërkim e filtrim të menusë, shportë, kupona, pagesë Stripe dhe ndjekje porosie.

Storefront-i dhe paneli admin ofrojnë pamje të çelët/errët dhe gjuhët shqip (parazgjedhje) dhe anglisht. Preferencat ruhen lokalisht në shfletues. Emrat dhe përshkrimet e pjatave shfaqen siç janë ruajtur në menu.

## Struktura

```text
food-del/   Aplikacioni i klientëve (React + Vite) — http://localhost:5173
admin/      Paneli i stafit (React + Vite) — http://localhost:5174
backend/    API (Express + MySQL + Stripe) — http://localhost:4000
```

## Kërkesat

- Node.js 20.19+ (ose 22.12+) dhe npm
- MySQL 8 (ose MariaDB 10.6+) lokal
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

Nëse `.env` ekziston, `cp -n` e lë të paprekur. Shto vetëm çelësat që mungojnë, pa zëvendësuar sekretet që ke ruajtur. Në `backend/.env` vendos të dhënat e MySQL (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) dhe një `JWT_SECRET` të gjatë e unik. Databaza dhe tabelat krijohen automatikisht kur niset API-ja (skema është te `backend/database/schema.sql`). Vendos `STRIPE_SECRET_KEY` testues për të aktivizuar pagesat; checkout-i çaktivizohet qëllimisht kur ky çelës mungon. URL-ja e parazgjedhur për API-n është `http://localhost:4000`.

Mbush menunë fillestare (32 pjata me foto) dhe krijo administratorin nga `ADMIN_EMAIL` / `ADMIN_PASSWORD` te `backend/.env`:

```bash
cd backend && npm run seed
```

Menuja shtohet vetëm nëse tabela `foods` është bosh, prandaj komanda mund të ekzekutohet sa herë të duash.

Nise secilin shërbim në terminal më vete:

```bash
cd backend && npm run dev
cd food-del && npm run dev
cd admin && npm run dev
```

API-ja fillon të pranojë kërkesa vetëm pasi lidhet me MySQL. Storefront-i është në portën `5173`, ndërsa paneli në `5174`.

## Nisja me Docker

Nga dosja kryesore e projektit, nise gjithë projektin me Docker Compose:

```bash
docker compose up --build
```

Hap storefront-in te `http://localhost:5173`, panelin admin te
`http://localhost:5174` dhe API-n te `http://localhost:4000`. Në nisje, backend-i krijon tabelat
dhe menunë fillestare. Të dhënat e MySQL dhe fotot e ngarkuara ruhen në volume Docker. Për ta ndalur, shtyp `Ctrl+C`; për t'i
nisur përsëri në sfond, përdor `docker compose up --build -d`, dhe ndali me
`docker compose down`.

Për konfigurim me Docker, vendos `JWT_SECRET`, `STRIPE_SECRET_KEY`, `DB_PASSWORD`,
`ADMIN_EMAIL` dhe `ADMIN_PASSWORD` në `.env` pranë `docker-compose.yml`. Fjalëkalimi
i konfiguruar aplikohet te administratori gjatë seeding-ut, edhe nëse llogaria ekziston.
Pa konfigurim, kontejneri përdor një JWT secret vetëm për zhvillim dhe pagesat Stripe
mbeten të çaktivizuara. Mos përdor secret-in e parazgjedhur në deploy. Për të fshirë edhe të dhënat e MySQL
dhe fotot, përdor `docker compose down -v`.

### Krijimi i një administratori

Në nisje me Docker, seed-i lexon `ADMIN_EMAIL` dhe `ADMIN_PASSWORD` nga `.env` pranë `docker-compose.yml`.
Për nisje pa Docker, vendosi në `backend/.env` dhe ekzekuto `npm run seed`.
Nëse emaili ekziston, seed-i e cakton si administrator dhe përditëson hash-in e fjalëkalimit sipas konfigurimit.

Ose regjistro një llogari normale nga storefront-i dhe caktoji rolin direkt në MySQL. Regjistrimi publik nuk lejon zgjedhjen e rolit:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

Hyr me atë llogari te paneli admin. Ndryshimet e menusë, menaxhimi i porosive dhe klientëve mbrohen nga API-ja, jo vetëm nga ndërfaqja.

## Databaza (MySQL)

| Tabela | Përmbajtja |
|---|---|
| `users` | Përdoruesit (emri, email, fjalëkalimi i enkriptuar, roli `customer`/`admin`) |
| `foods` | Pjatat e menusë (emri, përshkrimi, çmimi, foto, kategoria) |
| `cart_items` | Shporta e çdo përdoruesi (`user_id`, `food_id`, sasia) |
| `orders` | Porositë (totali, tarifa, zbritja, adresa, statusi, pagesa) |
| `order_items` | Artikujt e çdo porosie me emrin dhe çmimin në momentin e blerjes |
| `coupons` | Kuponët me përqindje zbritjeje dhe datë skadence |
| `settings` | Tarifa e dërgesës dhe monedha |

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

Çmimet dhe totalet e porosive llogariten në server nga artikujt aktualë të MySQL. Shporta zbrazet vetëm pasi pagesa konfirmohet, kështu që nëse klienti e anulon pagesën, artikujt mbeten në shportë. Para se porosia të shënohet e paguar, API-ja verifikon sesionin, shumën dhe monedhën te Stripe. Administratorët mund të krijojnë kupona me 1–90% zbritje dhe datë opsionale skadence, si dhe të ndryshojnë tarifën e dërgesës në EUR. Kuponi rillogaritet nga API-ja përpara checkout-it.

## Kontrolli i cilësisë

```bash
cd food-del && npm run lint && npm run build
cd admin && npm run lint && npm run build
cd backend && npm test
```

Testet e backend-it kontrollojnë validimin e checkout-it, çmimet autoritative dhe llogaritjen e zbritjes pa shërbime të jashtme. Testimi fund-më-fund me MySQL/Stripe kërkon databazë dhe kredenciale testuese të vlefshme; ato nuk përfshihen në repository.

## Shënime për deploy

- Ruaji sekretet dhe konfigurimin e databazës/pagesave në variablat e mjedisit të host-it; mos i bëj commit `.env`.
- Vendos `FRONTEND_URL` te domeni publik i storefront-it dhe `CORS_ORIGINS` vetëm te domenet reale të klientit dhe panelit.
- Në prodhim përdor HTTPS, `JWT_SECRET` unik e të fortë, ruajtje të qëndrueshme për fotot dhe webhook-e Stripe për besueshmëri më të mirë të pagesave.
