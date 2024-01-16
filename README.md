# SaaS-AI

This repository is for a SaaS AI Platform built with the following technologies:

## Technologies Used

- **Next.js 13**: The foundation of the project, providing server-side rendering and routing.
- **React**: Used for building the user interface and managing the state of the application.
- **TypeScript**: Improving code quality and productivity with static typing.
- **Tailwind CSS**: A utility-first CSS framework for simplified and consistent styling.
- **ShadcnUI**: Reusable UI component library for visual consistency.
- **Prisma**: Secure and efficient database operations with a type-safe query language.
- **Stripe**: Handling secure online transactions and payments.
- **Clerk**: Authentication and user management for enhanced security.
- **MySQL**: Storing and managing data in a relational database.
- **zod**: TypeScript-oriented schema validation for data integrity.
- **Zustand**: State management for React applications.
- **React Hook Form**: Efficient form state and validation management in React.
- **React Toast**: Displaying notifications and alerts in React applications.

[Explore the Live Demo](https://sass-ai-xi.vercel.app/)

## Features:

- Tailwind design, animations, effects and responsive
- Clerk Authentication (Email, Google, 9+ Social Logins)
- Client form validation and handling using react-hook-form
- Server error handling using react-toast
- Image Generation Tool (Open AI)
- Video Generation Tool (Replicate AI)
- Conversation Generation Tool (Open AI)
- Music Generation Tool (Replicate AI)
- Page loading state
- Stripe monthly subscription
- Free tier with API limiting

### Prerequisites

**Node version 18.x.x**

## Installation and Usage

### 1. Cloning the repository

```shell
git clone https://github.com/DmitriyAngve/sass-ai
```

### 2. Install packages

```shell
npm i
```

### 3. Setup .env file

```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

OPENAI_API_KEY=
REPLICATE_API_TOKEN=

DATABASE_URL=

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Setup Prisma

Add MySQL Database (I used PlanetScale)

```shell
npx prisma db push
```

### 5. Start the app

```shell
npm run dev
```

## 6. Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
