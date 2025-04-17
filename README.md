# 🚀 MonProjet - Application Web Next.js

MonProjet est une application web moderne développée avec **Next.js 14**, **TypeScript**, **App Router**, et des intégrations côté serveur avec **Symfony**, **Firebase** et d'autres services.

---

## 🧱 Stack technique

- ✅ **Next.js 14 (App Router)**
- ✅ **TypeScript**
- ✅ **Tailwind CSS**
- ✅ **Radix UI / ShadCN UI**
- ✅ **Server Actions (use server)**
- ✅ **API Routes**
- ✅ **Middleware / Auth**
- ✅ **Firebase Storage**
- ✅ **Symfony API Backend**
- ✅ **Socket.IO**

---

## 📁 Arborescence principale

<pre>
<code>
src/
├── app/                     # Dossier routable (routes/pages/layouts)
│   ├── (main)/              # Layout segmenté (groupes de routes)
│   ├── api/                 # Routes API Next.js (app/api/[route]/route.ts)
│   └── ...                  # Autres routes publiques (ex: login, register, home, etc.)
├── components/              # Composants UI globaux (Navbar, Modals, Buttons, etc.)
├── _components/             # Composants privés, liés à une route spécifique (non exportés globalement)
├── context/                 # Contexts React (auth, profil, socket, etc.)
├── server-actions/          # Fonctions côté serveur ('use server') appelées par les Server Components
├── lib/                     # Bibliothèque d’utilitaires partagés (ex: session, config, constants)
├── hooks/                   # Hooks personnalisés (useDebounce, useSocket, etc.)
├── services/                # Services pour appels externes (ex: Firebase, API tierces, etc.)
├── utils/                   # Fonctions utilitaires (formatage, parseurs, helpers globaux)
├── models/                  # Types, interfaces et modèles métier
├── middleware.ts            # Middleware global (auth, redirections, etc.)
└── firebaseConfig.ts        # Fichier de configuration Firebase
</code>
</pre>

---

## 🔐 Authentification

- Auth personnalisée via **JWT encrypté en cookie** (`lib/session.ts`)
- Middleware pour protéger les routes privées (`middleware.ts`)
- Gestion de session dans les Server Actions (`getSession`, `verifySession`, etc.)

---

## 🧠 Server Actions

- Les actions côté serveur sont déclarées dans `src/server-actions/`
- Toutes utilisent `'use server'` et suivent la convention Next.js

---

## 📦 API Next.js

Les routes API sont dans `src/app/api/` avec la structure recommandée :

`src/app/api/image-upload/route.ts`

- Accès contrôlé
- Upload vers Firebase avec quota de fichiers
- `NextRequest` / `NextResponse` bien utilisés

---

## ⚙️ Scripts utiles

```bash
npm run dev         # Démarrer le serveur de dev
npm run build       # Compiler le projet
npm run lint        # Vérifier le linting
npm run format      # Formater automatiquement