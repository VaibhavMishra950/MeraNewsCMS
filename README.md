# MeraNewsCMS

## Description:

A content management system (CMS) built using Next.js for the frontend, Express.js for the backend, MySQL for the database, and Tailwind CSS for the UI library. This CMS is specifically designed for managing news articles and related content.

## Technologies:

Frontend: [Next.js](https://nextjs.org/) <br/>
Backend: [Express.js](https://expressjs.com/) <br/>
Database: [MySQL](https://www.mysql.com/) <br/>
UI Library: [Tailwind CSS](https://tailwindcss.com/) <br/>

## Installation:

### Clone the repository:

```bash
git clone https://github.com/VaibhavMishra950/MeraNewsCMS.git
```

### Install dependencies:

```bash
cd MeraNewsCMS

# Backend
cd mera-news-cms-backend
npm install

# Frontend
cd mera-news-cms-frontend
npm install
```



Create a ```.env``` file in both ```mera-news-cms-frontend``` and ```mera-news-cms-backend``` to store their respective environment variables. Refer to ```.env.example``` file for required variables.

Also, create a database with same name as mentioned in ```.env``` file of ```mera-news-cms-backend``` directory in ```MySQL```.

## Running the Application:

### Start the backend server:

```bash
cd mera-news-cms-backend
node app.js
```

### Start the development server:

```bash
cd mera-news-cms-frontend
yarn run dev
```

This will typically start the server on http://localhost:3000 (or a different port if ```3000``` is already in use).
