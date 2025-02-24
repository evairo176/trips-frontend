# 🚀 Next.js 15 Project with TypeScript, SWR, JWT Auth, and shadcn/ui

## 📌 Features

- **Next.js 15** – Framework React terbaru untuk aplikasi web.
- **TypeScript** – Tipe data yang kuat untuk pengembangan lebih aman.
- **SWR** – Fetching data yang efisien dan otomatis.
- **JWT Authentication** – Implementasi refresh token setiap 1 jam.
- **shadcn/ui** – Komponen UI yang modern dan fleksibel.

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies

```sh
pnpm install  # atau npm install / yarn install
```

### 2️⃣ Setup Environment Variables

Buat file `.env.local` dan tambahkan:

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
NEXT_PUBLIC_JWT_SECRET=your-secret-key
```

### 3️⃣ Run Development Server

```sh
pnpm dev  # atau npm run dev / yarn dev
```

Akses proyek di `http://localhost:3000`

---

## 🔐 Authentication (JWT)

- Menggunakan **access token** untuk autentikasi.
- **Refresh token** otomatis setiap 1 jam.
- Implementasi ada di `services/auth.ts`:

```ts
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useUser() {
  const { data, error } = useSWR('/api/user', fetcher, {
    refreshInterval: 3600000
  });
  return { user: data, isLoading: !error && !data, isError: error };
}
```

---

## 🎨 UI Components (shadcn/ui)

- Menggunakan **shadcn/ui** untuk styling modern dengan Tailwind CSS.
- Contoh penggunaan **Button**:

```tsx
import { Button } from '@/components/ui/button';

export default function Example() {
  return <Button>Click me</Button>;
}
```

---

## 🛠 Deployment

### **Vercel (Recommended)**

```sh
vercel deploy
```

### **Self-hosted (Docker)**

```sh
docker build -t nextjs-app .
docker run -p 3000:3000 nextjs-app
```

---

## 🎯 Roadmap

✅ Implementasi autentikasi JWT dengan refresh token.<br>
✅ Fetching data dengan SWR.<br>
✅ Integrasi shadcn/ui untuk komponen UI.<br>
🔜 Tambahkan fitur multi-role authentication.

---

## 📄 License

MIT License. Free to use & modify! 🚀
