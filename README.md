# !! This project is still in development !!

# LicenseGate

LicenseGate is an open-source licensing tool for developers. Create and manage license or api keys for your software with ease. Easily check the validity of a license through our REST API or with one of our wrapper libraries.

## As easy as a GET request

```http
GET /license/{user-id}/{license-key}/verify
```

```json
{
  "valid": true,
}
```

## Hosted Version
A hosted version of LicenseGate will be available soon. Stay tuned!

## Self-Hosting
This repository is a monorepo containing both the frontend and backend code. The frontend is built with SvelteKit and the backend is a NodeJS Express server. 

### Frontend
We do not use any SSR in SvelteKit, so the frontend can be hosted as a static site. 
To build the frontend, you need to:
1. Setup the environment variables in `frontend/.env` (see `.env.example` for an example)
2. Run `npm install` and `npm run generate` in the `backend` directory.
Note: The backend is required to build the frontend because the frontend uses the backend's tRPC types. For security reasons the backend's `.env` file should not have any sensitive data when building the frontend.
3. Run `npm install` and `npm run build` in the `frontend` directory.
4. The frontend is now built and can be hosted as a static site. The output is in the `frontend/build` directory.

### Backend
1. Navigate to the `backend` directory.
2. Setup the environment variables `.env` (see `.env.example` for an example)
3. Run `npm install`, `npm run prisma-up` and `npm run generate` to setup the database and generate the Prisma client.
4. Run `npm run start` to start the backend server.

## Features
- Create and manage licenses
- Live usage statistics
- REST API and wrapper libraries
- RSA key validation for unsecure environments
- Restrict license key usage
  - IP Limit
  - Rate Limit
  - Expiration Date
  - Scopes

## Community
Join our thriving community on [Discord](https://discord.gg/ycDG6rS)! Contribute to our open-source project, share ideas, or ask questions. Together, we shape the future of LicenseGate.

## Stack
Key technologies used in LicenseGate:
- SvelteKit
- Express
- tRPC: Type-safe API calls between frontend and backend
- Prisma: Next-generation ORM for TypeScript and Node.js
- Zod: TypeScript-first schema declaration and validation
- TanStack Query: Asynchronous state management, server-state utilities and data fetching