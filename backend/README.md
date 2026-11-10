# Food Studio API

API-ja përdor Express, MongoDB/Mongoose, JWT dhe Stripe. Konfigurimi bëhet përmes `backend/.env`; shih [README-n kryesor](../README.md) për nisjen e projektit, krijimin e administratorit dhe rrjedhën e aplikacioneve.

## Variablat e mjedisit

Kopjo `.env.example` në `.env` pa mbishkruar konfigurimin ekzistues dhe plotëso:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/food-del
JWT_SECRET=vendos-nje-sekret-te-gjate-dhe-unik
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

`MONGODB_URI` dhe `JWT_SECRET` janë të domosdoshëm. Pa `STRIPE_SECRET_KEY`, API-ja nis, por checkout-i kthen gabim të qartë `503` derisa të konfigurohet Stripe.

## Testet

```bash
npm test
```

Testet e checkout-it janë të izoluara dhe nuk kërkojnë MongoDB apo kredenciale Stripe. Testimi real i pagesave bëhet me Stripe test mode dhe një databazë testuese.

## Siguria dhe pagesat

- Përdoruesi caktohet si klient gjatë regjistrimit; roli admin caktohet vetëm drejtpërdrejt në MongoDB.
- JWT-të kanë skadim, dhe middleware-i kontrollon rolin aktual nga databaza.
- API-ja merr çmimet nga menuja në databazë, verifikon kuponin dhe tarifën e dërgesës, pastaj krahason shumën EUR të Stripe para se të shënojë porosinë si të paguar.
- Në deploy, përdor HTTPS, sekrete unike, `CORS_ORIGINS` të kufizuara dhe webhook-e Stripe për konfirmim të qëndrueshëm të pagesave.
