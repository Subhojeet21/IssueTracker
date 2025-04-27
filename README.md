# Issue-Tracker Project

This project is a web application built using a modern technology stack, including TypeScript, React, Node.js, and Vite. It leverages the component library `shadcn/ui` for its user interface. The project is structured with a clear separation between the front-end (client) and back-end (server), with shared code for common types and utilities.

## Features

-   **User Authentication:** Secure login and registration system.
-   **Interactive UI:** Utilizes `shadcn/ui` components for a consistent and modern user experience.
-   **Data Management:** Efficiently manages data with a well-structured back-end.
-   **Responsive Design:** Adapts seamlessly to various screen sizes.
-   **Real-time Updates:** Provides live updates for certain features.
-   **Analytics Dashboard**: Visualize project and issues progress.
-   **Issues Tracking**: Track project issues, comments and status.
-   **Settings Page**: Customize app preferences.

## Technologies Used

-   **Front-end:**
    -   [React](https://reactjs.org/): A JavaScript library for building user interfaces.
    -   [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript.
    -   [Vite](https://vitejs.dev/): A build tool that aims to provide a faster and leaner development experience for modern web projects.
    -   [`shadcn/ui`](https://ui.shadcn.com/): A collection of reusable UI components.
-   **Back-end:**
    -   [Node.js](https://nodejs.org/): A JavaScript runtime environment.
    -   [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript.
-   **Shared:**
    -   [TypeScript](https://www.typescriptlang.org/): Used for types and shared utilities.

## Project Structure
```
web-application-project/
├── client/              # Front-end code (React, Vite, TypeScript)
│   ├── public/          # Static assets
│   ├── src/             # Source code
│   │   ├── components/  # UI components (including shadcn/ui)
│   │   ├── pages/       # Application pages/routes
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities and constants
│   │   ├── App.tsx      # Main application component
│   │   └── main.tsx     # Entry point
│   ├── index.html       # HTML template
│   ├── package.json     # Front-end dependencies and scripts
│   └── ...
├── server/              # Back-end code (Node.js, TypeScript)
│   ├── db/              # Database connection and models
│   ├── routes/          # API routes
│   ├── index.ts         # Server entry point
│   ├── package.json     # Back-end dependencies and scripts
│   └── ...
├── shared/              # Shared code (types, utilities)
│   └── schema.ts        # Shared data schemas/interfaces
├── package.json         # Root package.json (optional)
├── .gitignore           # Git ignore file
├── tsconfig.json        # TypeScript configuration
└── ...
```
## Installation

1.  **Clone the repository:**
```
bash
    git clone <repository-url>
    cd web-application-project
    
```
2.  **Install dependencies:**
    Install dependencies for both client and server.
```
bash
    cd client
    npm install # or yarn install
    cd ../server
    npm install # or yarn install
    
```
3.  **Setup environment variables**:
    Create a `.env` file in both `client` and `server` folders and fill in all the environment variables required.

## Usage

1.  **Start the development server:**
    Start the server and client at the same time in different terminals.
```
bash
    # In one terminal
    cd server
    npm run dev # or yarn dev

    # In another terminal
    cd client
    npm run dev # or yarn dev
    
```
2.  **Access the application:**
    Open your browser and go to the url outputted in the client terminal (usually `http://localhost:5173`).


## License

This code is proprietary and may not be copied, modified, or distributed without explicit permission from the owner.
