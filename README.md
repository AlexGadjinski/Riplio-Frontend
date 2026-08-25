# Riplio — Frontend

Single-page web client for **Riplio**, a Reddit-inspired community platform. It provides the user interface for communities, posts, nested comments, ripple voting, moderation and user profiles.

> **Repository:** https://github.com/AlexGadjinski/Riplio-Frontend

This is the **frontend** app. It talks to the Riplio main backend REST API — see [Related repositories](#related-repositories).

## Features

- **Authentication** — register and log in with JWT (token stored client-side, attached to every request).
- **Communities** — browse and open communities, join/leave, view members and moderators.
- **Posts & comments** — read posts with media, create posts and comments, collapsible nested reply threads.
- **Ripples** — up/down (RISE/FALL) voting on posts and comments.
- **Moderation** — member management, bans/unbans, community settings (info, appearance, ownership transfer, deletion) and a reports queue with dismiss/remove actions.
- **Reporting** — report posts and comments with a reason and optional details.
- **Profile** — view your posts and comments, open a comment's thread, and edit your username, email and avatar.

## Tech stack

- React + Vite
- Ant Design 5 (`antd`, `@ant-design/icons`)
- React Router (`react-router-dom`)
- axios
- `react-infinite-scroll-component`

## Getting started

### Prerequisites

- Node.js 18+
- npm
- A running instance of the [Riplio main backend](https://github.com/AlexGadjinski/Riplio-Backend) on `http://localhost:8080`

### Install

```bash
npm install
```

### Configure the API proxy

During development, requests to `/api` are proxied to the backend. This is configured in `vite.config.js`:

```js
server: {
  proxy: {
    '/api': 'http://localhost:8080',
  },
}
```

Update the target if your backend runs on a different host or port.

### Run

```bash
npm run dev
```

The app starts on `http://localhost:5173`.

### Build

```bash
npm run build
```

The production bundle is generated in `dist/`. Preview it locally with:

```bash
npm run preview
```

## Related repositories

- **Frontend (this repo):** https://github.com/AlexGadjinski/Riplio-Frontend
- **Main backend:** https://github.com/AlexGadjinski/Riplio-Backend
- **Moderation microservice:** https://github.com/AlexGadjinski/Moderation-Service

## License

This project was developed as an individual project for the Spring Advanced course at SoftUni.