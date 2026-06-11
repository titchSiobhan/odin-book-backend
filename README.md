
# Barely Social backend

A social media backend built as part of the final assignment in The Odin Project.

Provides user authentication, post creation, likes, comments friendship an infinite scroll.

## Features

- User authentication (JWT)
- Create posts (text and images)
- Like posts
- Comment on posts
- Friends system (send/ accept requests)
- Infinite scroll
- Profile pages (public or private)
- Cloudinary image uploads
- Secure REST API


## Tech Stack

**Frontend** 
(separate repo)
- React
- Vite
- React Router
- CSS

**Server:** 
- Node.js 
- Express
- PostgreSQL
- Prisma
- JWT Authentication
- Cloudinary
- REST API

## Setup

**Prerequisites** 
- Node.js
- npm 
- PostgreSQL
- Cloudinary (optional)

## Clone

`git clone <https://github.com/titchSiobhan/odin-book-backend>`
`cd backend`

## Install dependencies

npm install


## Related

Links for this project

[Barely social frontend](https://github.com/titchSiobhan/odin-book-frontend),

[Barely social backend](https://github.com/titchSiobhan/odin-book-frontend)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/barely_social"`

`JWT_SECRET="your-secret"`

`CLOUDINARY_CLOUD_NAME=""`

`CLOUDINARY_API_KEY=""`

`CLOUDINARY_API_SECRET=""`


## Database Setup

`npx prisma migrate dev`

**Seed the Database**

`npx prisma db seed`

## Start server

`npm run dev`

**Server**

runs on `http://localhost:3000`
