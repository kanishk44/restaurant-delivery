# Restaurant Delivery Web App

A full-featured restaurant delivery web application built with **React**, **Vite**, **Firebase**, and **TailwindCSS**. The app supports both user and admin roles, providing a seamless experience for customers to browse, order, and track food, as well as for admins to manage categories, recipes, and orders.

## Features

### User
- **Authentication:** Sign up, log in, and password reset.
- **Browse Categories:** View food categories and explore recipes.
- **Cart & Checkout:** Add items to cart, checkout, and receive order confirmation.
- **Order History:** View past orders and order details.
- **Profile Management:** Update user profile information.
- **Protected Routes:** Only authenticated users can access main app features.

### Admin
- **Authentication:** Secure admin login.
- **Dashboard:** Overview of orders and activity.
- **Category Management:** Create, update, and delete food categories.
- **Recipe Management:** Add, edit, and remove recipes.
- **Order Management:** View and manage all user orders.
- **Protected Routes:** Only authenticated admins can access admin features.

## Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** TailwindCSS
- **Routing:** React Router DOM v7
- **State Management:** React Context API
- **Authentication & Database:** Firebase
- **Linting:** ESLint

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/restaurant-delivery.git
   cd restaurant-delivery
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Copy your Firebase config to `src/firebaseConfig.js`.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint code with ESLint

## License

[MIT](LICENSE)

---

*Built with ❤️ using React, Vite, and Firebase.*


