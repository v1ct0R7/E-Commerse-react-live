# 🍔 Food Delivery - E-Commerce Platform

Një platformë e plotë për porositjen e ushqimit online, e ndërtuar me **MERN stack** (MongoDB, Express, React, Node.js) dhe e ndarë në 3 pjesë kryesore:
1. **`food-del`** – Aplikacioni i klientit për shfletim dhe porositje.
2. **`admin`** – Paneli i administratorit për menaxhimin e ushqimeve dhe porosive.
3. **`backend`** – Serveri dhe REST API me bazën e të dhënave dhe pagesat.

---

## 📁 Struktura e Projektit

```text
FoodDelivery-react-live/
├── food-del/   # Frontend për klientët (React + Vite)
├── admin/      # Paneli i menaxhimit për stafin/adminin (React + Vite)
└── backend/    # Serveri API dhe logjika e biznesit (Node.js + Express + MongoDB)
```

---

## 1. 🌐 Frontend Klienti (`food-del`)

Ndërfaqja publike ku klientët shikojnë menynë, zgjedhin ushqimet, shtojnë artikuj në shportë dhe kryejnë porosinë.

### 📦 Paketat e Përdorura:
- **`react` & `react-dom`**: Baza për ndërtimin dhe shfaqjen e komponentëve UI.
- **`react-router-dom`**: Navigimi midis faqeve pa ringarkuar faqen (`/`, `/cart`, `/order`).
- **`lucide-react`**: Ikona moderne dhe të pastra për UI.
- **`vite` & `@vitejs/plugin-react`**: Mjedisi i shpejtë i zhvillimit dhe kompilimit.
- **`eslint`**: Standardizimi dhe kontrolli i cilësisë së kodit.

### ⚙️ Çfarë është bërë:
- Faqja kryesore me filtrim sipas kategorive dhe menynë e ushqimeve.
- Shporta e blerjeve me llogaritje automatike të çmimit.
- Menaxhimi i gjendjes globale me React Context API.
- Faqja e konfirmimit dhe vendosjes së porosisë (`PlaceOrder`).

---

## 2. 🛠️ Paneli i Administratorit (`admin`)

Ndërfaqja e dedikuar për stafin për të menaxhuar të gjithë katalogun e ushqimeve dhe porositë.

### 📦 Paketat e Përdorura:
- **`react` & `react-dom`**: Ndërtimi i ndërfaqes së panelit administrativ.
- **`react-router`**: Rrugëtimi i faqeve të panelit (`/add`, `/list`, `/orders`).
- **`axios`**: Dërgimi i kërkesave HTTP drejt backend-it (ngarkim imazhesh, marrje/fshirje produktesh).
- **`react-toastify`**: Njoftime vizuale në ekran për veprimet (sukses ose gabim).
- **`vite` & `@vitejs/plugin-react`**: Serveri lokal dhe mjetet e zhvillimit.

### ⚙️ Çfarë është bërë:
- **Navbar & Sidebar**: Navigim i shpejtë në panel.
- **Add Product (`/add`)**: Formular për shtimin e artikujve të rinj me ngarkim fotoje.
- **List Products (`/list`)**: Tabela me listën e ushqimeve ekzistuese dhe mundësi fshirjeje.
- **Orders (`/orders`)**: Menaxhimi dhe përcjellja e porosive të bëra nga klientët.

---

## 3. ⚙️ Serveri & API (`backend`)

Qendra e logjikës së aplikacionit që trajton ruajtjen e të dhënave, ngarkimin e skedarëve dhe komunikimin me bazën e të dhënave.

### 📦 Paketat e Përdorura:
- **`express`**: Korniza për krijimin e rrugëve (endpoints) të serverit.
- **`mongoose`**: Lidhja dhe modelimi i të dhënave me MongoDB.
- **`cors`**: Lejon komunikimin mes frontend-it, adminit dhe serverit nga porta të ndryshme.
- **`dotenv`**: Menaxhimi i variablave të fshehtë të mjedisit (`.env`).
- **`multer`**: Ngarkimi dhe ruajtja e skedarëve/imazheve të ushqimeve në folderin `uploads/`.
- **`bcrypt`**: Enkriptimi i fjalëkalimeve për ruajtje të sigurt.
- **`jsonwebtoken` (JWT)**: Autentikimi i përdoruesve me token të sigurt.
- **`validator`**: Verifikimi i të dhënave (p.sh. formati i email-it).
- **`stripe`**: Përpunimi i pagesave online me kartë.
- **`body-parser`**: Leximi dhe interpretimi i trupit të kërkesave HTTP.
- **`nodemon`**: Rinisja automatike e serverit gjatë ndryshimeve në kod.

### ⚙️ Çfarë është bërë:
- Konfigurimi i bazës së të dhënave në MongoDB (`config/db.js`).
- REST API për ushqimet: shtim me imazh, listim dhe fshirje (`/api/food`).
- Endpoint statik për aksesimin e fotove të ruajtura (`/images`).
- Struktura bazë e përgatitur për autentikim përdoruesish dhe pagesa me Stripe.

---

## 🚀 Si të Nisni Projektin

### 1. Nisni Backend-in
```bash
cd backend
npm install
npm run server
# Serveri nis në http://localhost:4000
```

### 2. Nisni Panelin Admin
```bash
cd admin
npm install
npm run dev
# Paneli hapet në http://localhost:5173
```

### 3. Nisni Klientin (food-del)
```bash
cd food-del
npm install
npm run dev
# Aplikacioni hapet në portën përkatëse të Vite
```