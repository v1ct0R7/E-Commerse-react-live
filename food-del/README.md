# 🍔 Food Delivery - Client Frontend

Aplikacioni kryesor i klientit për të shfletuar menynë, zgjedhur artikujt dhe kryer porositë e ushqimit.

---

## 📦 Paketat e Përdorura

| Paketa | Përshkrimi i shkurtër |
| :--- | :--- |
| **`react`** | Biblioteka bazë për ndërtimin e ndërfaqes së përdoruesit (UI). |
| **`react-dom`** | Renderimi i komponentëve në DOM të shfletuesit. |
| **`react-router-dom`** | Rrugëtimi dhe navigimi midis faqeve pa rifreskuar të gjithë faqen. |
| **`lucide-react`** | Ikona minimale dhe moderne për butonat dhe menytë. |
| **`vite`** | Zhvillim me performancë të lartë dhe rifreskim të shpejtë në mjedisin lokal. |
| **`@vitejs/plugin-react`** | Integrimi i React brenda Vite me mbështetje Fast Refresh. |
| **`eslint`** | Mjet për ruajtjen e rregullave dhe pastërtisë së kodit. |

---

## ⚙️ Çfarë është bërë deri tani

- **Ndërfaqja & Komponentët**:
  - `Navbar` & `Footer`: Navigimi kryesor dhe informacioni i faqes.
  - `ExploreMenu`: Shfaqja e kategorive të ndryshme të ushqimit me mundësi filtrimi me një klik.
  - `FoodDisplay` & `FoodItem`: Kartat e ushqimeve me foto, përshkrim, çmim dhe butonat për shtim/heqje sasie.
- **Faqet kryesore**:
  - `Home`: Faqja kryesore me header tërheqës dhe listën e plotë të ushqimeve.
  - `Cart`: Shporta e blerjeve me llogaritjen e nëntotalit, tarifës së dërgesës dhe shumës totale.
  - `PlaceOrder`: Formulari për vendosjen e adresës së dërgesës dhe procedimin e porosisë.
- **Menaxhimi i Gjendjes (State)**:
  - `StoreContext`: Ruajtja dhe sinkronizimi global i artikujve të shportës nëpër të gjithë komponentët.

---

## 🚀 Nisja lokale

```bash
npm install
npm run dev
```
