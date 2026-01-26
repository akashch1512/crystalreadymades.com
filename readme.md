# 💎 Crystal Readymades

**Crystal Readymades** is a full-stack e-commerce platform for crystal-enhanced fashion, accessories, and home décor.
Built with a **FastAPI backend**, **PostgreSQL database**, and **React + TypeScript frontend**.

---

## 🚀 Tech Stack

### Backend

* **FastAPI**
* **SQLAlchemy**
* **PostgreSQL**
* **Pydantic**
* **Uvicorn**

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Axios**
* **React Router**

---

## 📦 Features

* Category & product management
* RESTful API
* PostgreSQL relational database
* Clean API → Frontend data flow
* Modular & scalable architecture
* Ready for authentication, orders, and payments

---

## 📁 Project Structure

```
crystal-readymades/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── database/
│   │   ├── schemas/
│   │   └── main.py
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── hooks/
│   └── pages/
│
└── README.md
```

---

## ⚙️ Backend Setup

### 1️⃣ Create virtual environment

```bash
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows
```

### 2️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Environment variables (`.env`)

```env
DATABASE_URL=postgresql://username:password@localhost:5432/crystal_db
```

### 4️⃣ Run backend

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

## 🌐 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔗 API Example

```http
GET /categories
```

Response:

```json
[
  {
    "id": 1,
    "name": "Clothing",
    "slug": "clothing",
    "image": "...",
    "description": "Trendy clothes for all occasions"
  }
]
```

---

## 🧠 Architecture Principles

* Backend is the **single source of truth**
* Frontend consumes **only API data**
* DB sessions are **request-scoped**
* Clean separation of concerns

---

## 🛠️ Future Enhancements

* Authentication & authorization
* Product reviews & ratings
* Cart & checkout
* Admin dashboard
* Payments integration
* Search & filters

---

## 👨‍💻 Author

**Crystal Readymades Team**
Built with ❤️ using FastAPI & React

