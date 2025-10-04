# 🌐 Prem Shaw - Developer Portfolio

Welcome to my **personal developer portfolio**, meticulously crafted to showcase my technical skills, projects, achievements, and professional journey. This site features an integrated admin dashboard for seamless content management and dynamic updates.

🔗 [Live Site →](https://portfolio-one-omega-53.vercel.app/)

---

## 🚀 Features

* 👤 **About Me** – Quick overview of who I am.
* 💼 **Projects Section** – Highlights selected personal and open-source projects.
* ⚒️ **Skills Section** – Technologies and tools I work with.
* 🏆 **Achievements** – Includes GSSoC badges and scores.
* 📬 **Contact Form** – Integrated with EmailJS for instant messages.
* 🌗 **Blog System** – Markdown-powered blog posts managed via Firebase.
* 🌑 **Dark Mode** – Toggle between light and dark themes.
* 📱 **Responsive Design** – Optimized for all screen sizes.
* 🔐 **Admin Panel** – Secure Firebase-authenticated access for managing content.
* 🛠️ **Firebase Auth** – Email/Password, Google, and GitHub sign-in with "Remember Me" support.

---

## 🛠️ Tech Stack

### Frontend

* **Next.js** – React-based framework for SSR and performance.
* **Tailwind CSS** – Utility-first CSS framework for fast styling.
* **JavaScript** – Type-safe and dynamic code.
* **Framer Motion** – For smooth animations and visual polish.
* **ShadCN UI** – Clean and consistent UI components.
* **Lucide Icons** – Lightweight and stylish icon pack.

### Backend / Services

* **Firebase** – Handles authentication and Firestore for storing blog content.
* **EmailJS** – Sends emails from the contact form without a backend.
* **JWT / Cookies** – Secure admin route protection.

---

## 🔐 Admin Login

**Authentication**  
- Firebase Auth with Email/Password, Google, and GitHub sign-in options.  
- "Remember Me" support and email verification enabled.

**Admin Panel Features**
- Create, edit, and delete blog posts with Markdown + live preview.
- Manage portfolio content: projects, skills, and about section.
- View and manage messages submitted via contact form.

---

## 📆 Folder Structure

```
├── app/                             # Application routes and pages (Next.js App Router)
│   ├── admin/                       # Admin dashboard pages (secured area)
│   │   ├── blog/                    # Admin: Manage blog posts (CRUD)
│   │   ├── project/                 # Admin: Manage projects (CRUD)
│   │   └── skill/                   # Admin: Manage skills (CRUD)
│   ├── blog/                        # Public blog listing and post viewing pages
│   ├── project/                     # Public projects showcase page
│   ├── skill/                       # Public skills showcase page
│   ├── about/                       # Public About Me page
│   ├── contact/                     # Public contact form page
│   ├── login/                       # Login page for admin access
│   └── page.js                     # Home page (root route `/`)
├── components/                      # Reusable UI components (Navbar, Footer, Cards, etc.)
├── context/                         # React contexts (AuthContext, LoaderContext, etc.)
├── hooks/                           # Custom React hooks
├── lib/                             # Utility libraries (Firebase config, helpers)
├── public/                          # Static assets (images, icons, fonts)
├── .gitignore                       # Files/folders to ignore in Git
├── README.md                        # Project overview and documentation
├── components.json                  # Component configuration file (e.g., for shadcn/ui)
├── eslint.config.mjs                # ESLint configuration
├── jsconfig.json                   # JavaScript config (path aliases, etc.)
├── next.config.mjs                  # Next.js configuration
├── package-lock.json                # Exact dependency versions
├── package.json                    # Project dependencies and scripts
└── postcss.config.mjs               # Tailwind CSS/PostCSS config


```

---

## 📆 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Visit the App

```
https://portfolio-one-omega-53.vercel.app/
```

---

## 🔄 Roadmap / To-Do

* [x] Firebase email/password + OAuth login
* [x] Blog posts stored in Firestore
* [x] Markdown rendering
* [x] Admin markdown editor & preview UI
* [x] Add dark mode toggle persistence
* [x] Add admin panel

---

## 📸 Screenshots

> Coming soon...

---

## 🙌 Acknowledgements

* [Firebase](https://firebase.google.com/)
* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [EmailJS](https://www.emailjs.com/)
* [React Markdown](https://github.com/remarkjs/react-markdown)
* [Lucide Icons](https://lucide.dev/)

---

> Built and maintained with care by **Prem Shaw** – Full Stack Developer, passionate about clean code, open source, and creating meaningful web experiences.
