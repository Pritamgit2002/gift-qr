# GiftQR

Turn links, messages and photos into a gift QR code. Each scan shows one random
item from the list: a link opens, a message appears, or a photo is shown.

## How it works

1. Sign in with Google, or as a guest (guests get up to 2 free lists).
2. Create a list and add links, messages and images.
3. Pay with Razorpay (₹1 per link or message, ₹2 per image, at least 5 items) to unlock the QR code.
4. Share the QR code. It points to `/<owner email>/<list name>`.
5. After paying, extra items go into a draft that is paid for separately and then merged into the list.

## Repository layout

```
apps/
  client/    Next.js 14 app: pages, UI and Google/guest sign-in (Auth.js)
  server/    Express API: MongoDB, S3 uploads, Razorpay
packages/
  shared/    Types shared by client and server (lists, drafts, users, API responses)
```

The browser never talks to the API server directly. Next.js proxies
`/api/server/*` to it, so requests stay same-origin and carry the Auth.js
session cookie. The server decodes that cookie with the shared `AUTH_SECRET`
and checks it on every route except `/public/*`.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
cp apps/client/.env.example apps/client/.env.local
cp apps/server/.env.example apps/server/.env
```

Fill in both env files (`AUTH_SECRET` must match), then run everything:

```bash
npm run dev
```

The client runs on http://localhost:3000 and the API on http://localhost:4000.

## Scripts

Run these from the repository root.

| Script              | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Watches the shared types and runs both apps      |
| `npm run build`     | Builds shared, then the server, then the client  |
| `npm run start`     | Starts the built server and client               |
| `npm run typecheck` | Type-checks every workspace                      |
| `npm run lint`      | Lints the client                                 |

To work on one app, use `npm run dev -w @giftqr/client` or `npm run dev -w @giftqr/server`.

## API

All routes return `{ success: true, data, message }` or `{ success: false, message }`.

| Method | Route                                   | Purpose                                |
| ------ | --------------------------------------- | -------------------------------------- |
| GET    | `/public/lists/:ownerEmail/:listName`   | List contents for a scanned QR code    |
| GET    | `/users/me`                             | Signed-in user                         |
| POST   | `/users/me`                             | Save the signed-in user                |
| DELETE | `/users/me`                             | Delete the signed-in user              |
| GET    | `/lists`                                | The user's lists                       |
| POST   | `/lists`                                | Create a list, or add links/messages   |
| DELETE | `/lists/:listName`                      | Delete a list, its draft and images    |
| DELETE | `/lists/:listName/links`                | Remove a link                          |
| DELETE | `/lists/:listName/messages`             | Remove a message                       |
| POST   | `/lists/:listName/images`               | Upload an image (multipart `image`)    |
| DELETE | `/lists/:listName/images`               | Remove an image                        |
| POST   | `/lists/:listName/payment`              | Mark a list as paid                    |
| GET    | `/lists/:listName/draft`                | Draft items for a paid list            |
| PUT    | `/lists/:listName/draft`                | Replace draft links/messages           |
| POST   | `/lists/:listName/draft/images`         | Upload a draft image                   |
| DELETE | `/lists/:listName/draft/{images,links,messages}` | Remove a draft item           |
| POST   | `/lists/:listName/draft/merge`          | Move paid draft items into the list    |
| POST   | `/payments/orders`                      | Create a Razorpay order                |
| POST   | `/payments/verify`                      | Verify a Razorpay payment signature    |

## Deploying

The client and server deploy separately. For the client (e.g. Vercel), set the
project root to `apps/client` and `SERVER_URL` to the server's public URL. The
server is a plain Node app: `npm run build -w @giftqr/server`, then
`npm run start -w @giftqr/server`.
