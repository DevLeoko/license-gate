<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/DevLeoko/license-gate/assets/13747815/65026d9c-86eb-47c8-804a-6b768a5786de">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/DevLeoko/license-gate/assets/13747815/e6425f96-e41b-431c-975c-4699006c6b04">
  <img src="https://github.com/DevLeoko/license-gate/assets/13747815/35c05ca5-51b7-440f-b589-29da9e27c876">
</picture>

# LicenseGate

LicenseGate is an open-source licensing tool for developers. Create and manage license or api keys for your software with ease. Easily check the validity of a license through our REST API or with one of our wrapper libraries.

## As easy as a GET request

```http
GET /license/{user-id}/{license-key}/verify
```

```json
{
  "valid": true,
  "status": "VALID"
}
```

## Documentation

You can find the documentation for LicenseGate at [docs.licensegate.io](https://docs.licensegate.io).

## Hosted Version

We offer a hosted version of LicenseGate. You can sign up for free at [licensegate.io](https://licensegate.io).

## Self-Hosting

You can also self-host LicenseGate. You can find the installation instructions in our [documentation](https://docs.licensegate.io).

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
- Discord Integration (Third Party)

## Discord Integration

Issue license keys to your users using a fully automated bot on your discord server.
Users with a certain role can request their license keys. Check out this third-party integration:
https://github.com/abhiyanpa/Discord-License-Manager-Bot

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
