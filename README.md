# 🌐 Prem Shaw - Developer Portfolio

Welcome to my **personal developer portfolio**, designed and built to showcase my technical skills, projects, achievements, and professional journey. This site also includes admin login functionality for easy content management and dynamic updates.

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
* 🔐 **Admin Login** – Secure access for managing content.
* 🧠 **MongoDB Integration** – Stores dynamic data like messages or projects (optional).
* 🛠️ **Firebase Auth** – Email/Password, Google, and GitHub sign-in with "Remember Me" support.

---

## 🛠️ Tech Stack

### Frontend

* **Next.js** – React-based framework for SSR and performance.
* **Tailwind CSS** – Utility-first CSS framework for fast styling.
* **TypeScript / JavaScript** – Type-safe and dynamic code.
* **Framer Motion** – For smooth animations and visual polish.
* **ShadCN UI** – Clean and consistent UI components.
* **Lucide Icons** – Lightweight and stylish icon pack.

### Backend / Services

* **Firebase** – Handles authentication and Firestore for storing blog content.
* **MongoDB** *(optional)* – Stores project metadata and contact messages.
* **EmailJS** – Sends emails from the contact form without a backend.
* **JWT / Cookies** – Secure admin route protection.

---

## 🔐 Admin Login

* JWT-based secure login.
* Access restricted to authenticated users only.
* Features:

  * Create, edit, delete blog posts (Markdown)
  * View submitted messages
  * Manage profile and portfolio content

---

## 📆 Folder Structure

```
/pages
  /admin           # Admin dashboard
  /blog            # Blog reading pages
  /login           # Authentication page
/components
  /BlogCard        # Blog previews
  /MarkdownView    # Blog content renderer
/context
  AuthContext      # Authentication context
  LoadingContext   # Global loading state
/lib
  firebase.js      # Firebase setup & utilities
/public
  /assets          # Icons, images, etc.
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
http://localhost:3000
```

---

## 🔄 Roadmap / To-Do

* [x] Firebase email/password + OAuth login
* [x] Blog posts stored in Firestore
* [x] Markdown rendering
* [ ] Admin markdown editor & preview UI
* [ ] Add phone number auth (optional)
* [ ] Add dark mode toggle persistence
* [ ] Add admin dashboard analytics

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

> Made with ❤️ by **Prem Shaw**
