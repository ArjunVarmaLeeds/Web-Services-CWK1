# Clash Royale Intelligence Dashboard (Frontend)

This is a React-based dashboard UI for the Clash Royale Player Intelligence Platform.

## Quick start

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Configure API endpoint:

Copy `.env.example` to `.env` and update the backend URL if needed.

```bash
cp .env.example .env
```

3. Start the dev server:

```bash
npm run dev
```

4. Open the app in your browser:

```
http://localhost:5173
```

> The frontend expects the backend to be running (default `http://localhost:5000`).

## Features

- Dark theme with modern dashboard layout
- JWT authentication (login / register)
- Player search and analytics
- Deck intelligence insights
- Player comparison view
- Admin user management (requires admin credentials)

## Notes

- This project uses Bootstrap 5 and Bootstrap Icons for UI.
- API calls are handled with Axios in `src/services/api.js`.
- Client-side routing is managed via React Router.
