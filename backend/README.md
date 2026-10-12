# ⚙️ Backend API - Food Delivery

Serveri dhe REST API për përpunimin e të dhënave, menaxhimin e skedarëve dhe komunikimin me bazën e të dhënave MongoDB.

---

## 📦 Paketat e Përdorura

| Paketa | Përshkrimi i shkurtër |
| :--- | :--- |
| **`express`** | Korniza (framework) për ndërtimin e rrugëve (routes) dhe serverit HTTP. |
| **`mongoose`** | Bibliotekë për lidhjen dhe modelimin e skemave në MongoDB. |
| **`cors`** | Lejon shkëmbimin e të dhënave midis frontend/admin dhe backend-it (CORS). |
| **`dotenv`** | Ngarkimi i variablave të fshehtë nga skedari `.env`. |
| **`multer`** | Menaxhimi i ngarkimit të fotove dhe ruajtja e tyre në folderin `uploads/`. |
| **`bcrypt`** | Enkriptimi i fjalëkalimeve të përdoruesve me hash për siguri. |
| **`jsonwebtoken` (JWT)** | Gjenerimi dhe verifikimi i token-ave për hyrje të sigurt (autentikim). |
| **`validator`** | Validimi i të dhënave të futura nga përdoruesi (p.sh. formati i email-it). |
| **`stripe`** | Përpunimi dhe pranimi i pagesave online me kartë bankare. |
| **`body-parser`** | Leximi dhe trajtimi i të dhënave të trupit (body) të kërkesave HTTP. |
| **`nodemon`** | Rinisja automatike e serverit sa herë që ruhen ndryshime në kod gjatë zhvillimit. |

---

## ⚙️ Çfarë është bërë deri tani

- **Konfigurimi & Lidhja**:
  - `server.js`: Inicializimi i aplikacionit Express, middleware-eve dhe portës `4000`.
  - `config/db.js`: Lidhja e automatizuar me MongoDB.
- **API Endpoints**:
  - `POST /api/food/add`: Shtimi i një ushqimi të ri bashkë me ngarkimin e fotos në `uploads/`.
  - `GET /api/food/list`: Kthimi i listës së të gjitha artikujve ushqimorë.
  - `POST /api/food/remove`: Fshirja e një ushqimi dhe fotos përkatëse.
  - `GET /images/:filename`: Shërbimi statik i imazheve për tu shfaqur në frontend dhe admin.
- **Përgatitjet në vijim**:
  - Modelet dhe logjika për llogaritë e përdoruesve dhe pagesat me Stripe.

---

## 🚀 Nisja lokale

```bash
npm install
npm run server
```
Serveri do të jetë i gatshëm në: `http://localhost:4000`
