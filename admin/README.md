# 🛠️ Admin Panel - Food Delivery

Paneli i administrimit për menaxhimin e katalogut të ushqimeve dhe porosive.

---

## 📦 Paketat e Përdorura

| Paketa | Përshkrimi i shkurtër |
| :--- | :--- |
| **`react`** | Ndërtimi i ndërfaqes së përdoruesit (UI). |
| **`react-dom`** | Renderimi i komponentëve React në shfletues. |
| **`react-router`** | Navigimi midis faqeve pa ringarkuar faqen. |
| **`axios`** | Dërgimi i kërkesave HTTP drejt backend API (shtim, listim, fshirje). |
| **`react-toastify`** | Njoftime pop-up në ekran për veprimet e suksesshme apo gabimet. |
| **`vite`** | Zhvillim dhe kompilim i shpejtë i projektit. |
| **`@vitejs/plugin-react`** | Integrimi i React me Vite dhe Fast Refresh. |
| **`eslint`** | Kontrolli i pastërtisë dhe rregullave të kodit. |

---

## ⚙️ Çfarë është bërë deri tani

- **Struktura e Panelit**:
  - `Navbar`: Shiriti kryesor i navigimit me logon dhe foton e profilit.
  - `Sidebar`: Shiriti anësor me linqet për shtim, listë dhe porosi.
- **Faqet kryesore**:
  - `Add (/add)`: Formulari për ngarkimin e imazhit dhe shtimin e produktit me emër, përshkrim, kategori dhe çmim.
  - `List (/list)`: Shfaqja e të gjitha artikujve me mundësi fshirjeje nga baza e të dhënave.
  - `Orders (/orders)`: Faqja për menaxhimin dhe statusin e porosive të klientëve.

---

## 🚀 Nisja lokale

```bash
npm install
npm run dev
```
