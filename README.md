# ⛪ CMS Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"/>
  <img src="https://img.shields.io/badge/supabase-%233ECF8E.svg?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
</p>

## 📖 About The Project

A simple dashboard for managing content for a church. This project is built with Angular and uses Supabase for the backend.

## ✨ Features

*   **User Authentication:** 🔐 Users can sign up and log in to the dashboard.
*   **Church Management:** ⛪ Authenticated users can add, edit, and delete church information.
*   **Dashboard:** 📊 A dashboard to display a list of churches.

## 🚀 Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

*   Node.js and npm
*   Angular CLI

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/Project-Name.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  **Environment Configuration:**
    
    **For Development:**
    - The app uses the credentials in [`src/environments/environment.ts`](src/environments/environment.ts)
    - Replace the default Supabase URL and key with your own credentials
    
    **For Production:**
    - Update [`src/environments/environment.prod.ts`](src/environments/environment.prod.ts) with your production credentials
    - Use Angular's environment file replacement during build process
    
    **Optional:** You can also create a `.env` file for documentation purposes:
    ```
    SUPABASE_URL=your_supabase_project_url_here
    SUPABASE_ANON_KEY=your_supabase_anon_key_here
    ```
4.  Start the development server
    ```sh
    npm start
    ```

## ✍️ Author

*   **Ashish Jeevanesan**

## 🤝 Contributors

This project is maintained by the **CMS group**.
