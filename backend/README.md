# Food Studio API

API-ja përdor Express, MySQL (paketa `mysql2`), JWT dhe Stripe. Konfigurimi bëhet përmes `backend/.env`; shih [README-n kryesor](../README.md) për nisjen e projektit, krijimin e administratorit dhe rrjedhën e aplikacioneve.

## Variablat e mjedisit

Kopjo `.env.example` në `.env` pa mbishkruar konfigurimin ekzistues dhe plotëso:

```env
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=food_del
JWT_SECRET=vendos-nje-sekret-te-gjate-dhe-unik
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

`JWT_SECRET` dhe të dhënat e MySQL janë të domosdoshme. Në nisje, API-ja krijon databazën `DB_NAME` (nëse mungon) dhe tabelat nga `database/schema.sql`. Pa `STRIPE_SECRET_KEY`, API-ja nis, por checkout-i kthen gabim të qartë `503` derisa të konfigurohet Stripe.

## Struktura

```text
config/database.js   Lidhja me MySQL (pool) dhe krijimi i tabelave
database/schema.sql  Skema e databazës (tabelat)
database/seed.js     Menuja fillestare dhe llogaria admin (npm run seed)
models/              Query-t SQL për çdo tabelë
controllers/         Logjika e çdo endpoint-i
routes/              Rrugët e API-së
middleware/auth.js   Kontrolli i token-it dhe i rolit admin
```

## Menuja fillestare

```bash
npm run seed
```

Shton 32 pjata me foto (vetëm kur menuja është bosh) dhe krijon administratorin nga `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Testet

```bash
npm test
```

Testet e checkout-it janë të izoluara dhe nuk kërkojnë MySQL apo kredenciale Stripe. Testimi real i pagesave bëhet me Stripe test mode dhe një databazë testuese.

## Siguria dhe pagesat

- Përdoruesi caktohet si klient gjatë regjistrimit; roli admin caktohet me `npm run seed` ose drejtpërdrejt në MySQL.
- JWT-të kanë skadim, dhe middleware-i kontrollon rolin aktual nga databaza.
- API-ja merr çmimet nga menuja në databazë, verifikon kuponin dhe tarifën e dërgesës, pastaj krahason shumën EUR të Stripe para se të shënojë porosinë si të paguar.
- Në deploy, përdor HTTPS, sekrete unike, `CORS_ORIGINS` të kufizuara dhe webhook-e Stripe për konfirmim të qëndrueshëm të pagesave.
