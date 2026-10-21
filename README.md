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
  client/    Next.js 16 app: pages, UI and Google/guest sign-in (Auth.js)
  server/    Express API: MongoDB, S3 uploads, Razorpay
packages/
  shared/    Types and pricing shared by client and server (lists, drafts, users, API responses)
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
| GET    | `/public/lists/:ownerEmail/:listName`   | What a scan shows (items only once paid) |
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
| GET    | `/lists/:listName/draft`                | Draft items for a paid list            |
| PUT    | `/lists/:listName/draft`                | Replace draft links/messages           |
| POST   | `/lists/:listName/draft/images`         | Upload a draft image                   |
| DELETE | `/lists/:listName/draft/{images,links,messages}` | Remove a draft item           |
| POST   | `/payments/orders`                      | Price a list or draft and create its Razorpay order |
| POST   | `/payments/confirm`                     | Verify the payment, then mark the list paid or merge the draft |

Once a user's list is paid, new items can only go into its draft.

### Payments

The server decides what a payment unlocks; the client never sends a price.

1. `POST /payments/orders` with `{ listName, target }`, where `target` is
   `"list"` or `"draft"`. The server prices the stored items with `priceOf`
   from `packages/shared`, rejects a list under the minimums, creates the
   Razorpay order and stores it on the list or draft. It returns
   `{ id, amount, currency }` (amount in paise) for Razorpay Checkout.
2. Razorpay Checkout takes the payment.
3. `POST /payments/confirm` with `{ listName, target }` plus the
   `razorpay_order_id`, `razorpay_payment_id` and `razorpay_signature` that
   Checkout returned. The server checks that the order is the one stored on
   the list or draft, that the signature is valid, and that Razorpay holds a
   captured or authorized payment for the full amount. Only then does it mark
   the list paid or move the draft items into the list. It refuses if items
   were added after the order was created.

## Deploying

The client and server deploy separately. For the client (e.g. Vercel), set the
project root to `apps/client` and `SERVER_URL` to the server's public URL. The
server is a plain Node app: `npm run build -w @giftqr/server`, then
`npm run start -w @giftqr/server`.
