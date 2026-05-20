# Frontend Public Demo Deployment

This guide prepares the RematePOS frontend for a public demo deployment while keeping it compatible with local development and SPA routing platforms.

## 1. Local Development

```bash
npm install
npm start
```

The app runs with Create React App and uses the development server on the default port, or `PORT` if provided.

## 2. Build

```bash
npm run build
```

Output directory: `build`

## 3. Environment Variables

Use only non-sensitive frontend environment variables.

- `REACT_APP_API_GATEWAY_URL`
  - Example local value: `http://localhost:8080`
  - Example demo value: `https://api-demo-url`
- `REACT_APP_DEMO`
  - Example: `false`

Example `.env.example` values:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_GATEWAY_URL=http://localhost:8080
REACT_APP_DEMO=false
```

## 4. Vercel

Recommended settings:

- Import the repository.
- Build command: `npm run build`
- Output directory: `build`
- Configure the same environment variables in the Vercel project settings.
- Keep SPA routing enabled through `vercel.json` rewrites to `index.html`.

The frontend should consume the API Gateway URL directly via `REACT_APP_API_GATEWAY_URL`.

## 5. Netlify

Recommended settings:

- Build command: `npm run build`
- Publish directory: `build`
- Configure the same environment variables in the Netlify site settings.
- Keep SPA routing enabled through `public/_redirects`.

Redirect rule:

```txt
/* /index.html 200
```

## 6. Cloudflare Tunnel for Quick Demo

For a temporary public demo, run the frontend locally and expose it through Cloudflare Tunnel.

- Frontend local port: `3002`
- API Gateway local port: `8080`
- Use a public tunnel URL for demo access.

This setup is for staging/demo only, not production.

## 7. Demo Checklist

- Login
- Sales flow
- Billing
- Analytics UI
- Tenant isolation
- Billing provider status

## 8. Security

- Do not commit `.env` files with secrets.
- Do not include tokens or passwords in frontend config.
- Keep DIAN or sandbox credentials in backend secrets only.
- The frontend must never know provider tokens directly.
- Do not store sensitive credentials in localStorage.

## 9. Notes

- The app already supports configurable API Gateway URLs through `REACT_APP_API_GATEWAY_URL`.
- Hardcoded localhost values are only safe as local fallbacks, not as deployment targets.