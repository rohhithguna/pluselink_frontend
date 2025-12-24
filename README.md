# PulseLink Frontend

React + Vite frontend for the PulseLink real-time alert notification system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` for local development:
```bash
cp .env.example .env.local
# Edit with your backend URL
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g., `https://your-backend.onrender.com/api`) |

## Deployment on Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL` pointing to your Render backend
5. Deploy!

## Features

- Real-time alerts via WebSocket
- Role-based access control
- Emergency acknowledgments
- Alert reactions and analytics
- Dark/Light theme support
