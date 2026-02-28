# 🎓 Student Info Portal

A secure, full-stack web application that allows students to view their personal information by logging in with their **Full Name** and **Registered Email**.

---

## 🌐 Live Demo

👉 [https://student-info-xf9k.onrender.com](https://student-info-xf9k.onrender.com)

---

## 🔒 Features

- **Secure Two-Factor Login** — Students must enter both their **Name** and **Email** to authenticate
- **PostgreSQL Database** — All student data is stored securely in a cloud database (Neon)
- **No Excel Exposure** — Raw data files are never accessible from the browser
- **Admin Panel** — Hidden admin panel (triple-click the dots) for administrators
- **Glassmorphism UI** — Modern, beautiful dark-themed interface

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js + Express |
| Database | PostgreSQL (Neon Cloud) |
| Hosting | Render |

---

## 🚀 Run Locally

### Prerequisites
- Node.js installed
- PostgreSQL database (local or Neon cloud)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/omkar2xt/student-info.git
cd student-info

# 2. Install dependencies
npm install

# 3. Create a .env file
echo DATABASE_URL=your_postgres_connection_string > .env

# 4. (Optional) Migrate Excel data to database
node migrate.js

# 5. Start the server
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (e.g. from Neon.tech) |

---

## 📁 Project Structure

```
studentport/
├── index.html       # Frontend portal UI
├── server.js        # Express backend API
├── migrate.js       # Excel → PostgreSQL migration script
├── package.json     # Dependencies & scripts
└── .env             # Environment variables (not committed)
```

---

## 👨‍💻 Author

**Omkar Gurav** — [github.com/omkar2xt](https://github.com/omkar2xt)
