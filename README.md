# Web-Services-CWK1

## Project Overview

This project is a **Player Intelligence Platform for Clash Royale**
built as part of the Web Services coursework.

The system ingests real-time data from the official Clash Royale API,
stores it in a relational database, and exposes a set of secure RESTful
endpoints that transform raw data into advanced analytics.

### Key Features

-   🔐 JWT-based authentication
-   📥 Data ingestion pipeline for players and battle logs
-   🧠 Player intelligence analytics:
    -   Performance overview
    -   Playstyle classification
    -   Card & deck intelligence
    -   Player comparison
-   🗄️ Relational database with Prisma ORM
-   📄 Fully documented API using Swagger
-   🧱 Modular service--controller architecture

------------------------------------------------------------------------

## Tech Stack

-   **Backend:** Node.js, Express
-   **Database:** MySQL
-   **ORM:** Prisma
-   **Authentication:** JWT
-   **API Documentation:** Swagger (OpenAPI)
-   **External API:** Clash Royale Developer API

------------------------------------------------------------------------

## Database Schema

The database is designed using a **normalised relational model**.

``` mermaid
erDiagram

    USER {
        INT id
        STRING email
        STRING passwordHash
        DATETIME createdAt
    }

    PLAYER {
        INT id
        STRING tag
        STRING name
        INT trophies
        INT bestTrophies
        INT wins
        INT losses
        STRING arena
        DATETIME createdAt
        STRING favouriteCardName
    }

    BATTLE {
        INT id
        INT playerId
        STRING result
        INT crowns
        STRING gameMode
        DATETIME createdAt
        DATETIME battleTime
    }

    PLAYERCARD {
        INT id
        INT playerId
        STRING cardName
        INT level
    }

    PLAYERDECK {
        INT id
        INT playerId
        STRING cardName
    }

    CARD {
        INT id
        STRING name
        INT maxLevel
        INT elixir
        STRING rarity
        STRING iconUrl
    }

    PLAYER ||--o{ BATTLE : has
    PLAYER ||--o{ PLAYERCARD : owns
    PLAYER ||--o{ PLAYERDECK : uses
    CARD ||--o{ PLAYERCARD : collection
    CARD ||--o{ PLAYERDECK : deck
    CARD ||--o{ PLAYER : favourite
```

------------------------------------------------------------------------

## Setup Instructions
> **Note**: The clash APIs will not work without a valid API key. The API key can be obtained from [here](https://developer.clashroyale.com/#/documentation) by following the instructions in the documentation. The authentication APIs will work but **without the clash API key, the player and card apis will NOT work.**

### Clone the repository

``` bash
git clone https://github.com/ArjunVarmaLeeds/Web-Services-CWK1.git
cd Web-Services-CWK1/backend
```

------------------------------------------------------------------------

### Install dependencies

``` bash
npm install
```

------------------------------------------------------------------------

### Configure environment variables

Create a `.env` file in the backend folder:

``` env
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_jwt_secret
CLASH_API_KEY=your_clash_api_key
PORT=5000
BASE_URL=https://api.clashroyale.com/v1
NODE_ENV=development
```

------------------------------------------------------------------------

### Setup the database

Run Prisma migrations:

``` bash
npx prisma migrate dev
```

(Optional) Open Prisma Studio:

``` bash
npx prisma studio
```

------------------------------------------------------------------------

### Start the server

``` bash
npm run start:dev
```

Server runs at:

    http://localhost:5000

------------------------------------------------------------------------

## API Documentation

Swagger UI:

    http://localhost:5000/api-docs

PDF Documentation:

    [api-docs.pdf](docs/api-docs.pdf)

> *Note*: The player and card apis require a valid JWT authentication token. Make an account with your email and password and then login to obtain a JWT token before using the player and card apis.

------------------------------------------------------------------------

## Health Check

    GET /health

------------------------------------------------------------------------

## Initial Data Sync (Required)

After starting the server:

### Sync card metadata

    POST /api/cards/sync

### Ingest a player

    POST /api/player/ingest/{tag}

### Ingest battle log

    POST /api/player/ingest/battles/{tag}

------------------------------------------------------------------------

## Authentication Flow

1.  Register → `/api/auth/register`
2.  Login → `/api/auth/login`
3.  Copy JWT token
4.  Authorize in Swagger → use protected endpoints

------------------------------------------------------------------------

## Example Intelligence Endpoints

-   `GET /api/player/{tag}` → Player profile
-   `GET /api/player/{tag}/overview` → Performance metrics
-   `GET /api/player/{tag}/playstyle` → Behavioural analytics
-   `GET /api/player/{tag}/cardIntelligence` → Deck & progression
    insights
-   `GET /api/player/compare?tag1=XXX&tag2=YYY` → Player comparison

------------------------------------------------------------------------

## Architecture Highlights

-   Separation of ingestion and analytics layers
-   Idempotent data synchronisation
-   Relational joins for intelligence computation
-   Parallel player comparison processing

------------------------------------------------------------------------

## Running the Test Suite

Automated tests exercise the full REST API (including authentication,
player ingestion, analytics and card sync) using [Jest](https://jestjs.io)
and [SuperTest](https://github.com/visionmedia/supertest).

**Prerequisites:**

1. Install dependencies (`npm install`) as described above.
2. Create a `.env` file with the same variables used for development.
   During tests `NODE_ENV` is set to `test` automatically by the
   `npm test` script; you can also provide a separate `DATABASE_URL`
   pointing to a temporary SQLite file if you prefer isolation.
3. Ensure `CLASH_API_KEY` is valid – tests will hit the real Clash Royale
   API when ingesting players. Alternatively, mock the responses or
   stub the network layer if running offline.

**Running tests:**

```bash
cd backend
npm test
```

The `package.json` includes the following script:

```json
"test": "cross-env NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand"
```

which sets the environment and executes Jest in a single process so
that the database file is reused correctly. All tests live under
`backend/tests` and are automatically picked up by Jest.

**What is covered:**

- `auth.test.js` – registration, login and `/me` endpoint
- `player.*.test.js` – player ingest, overview, playstyle, card
  intelligence, battles and comparison

Each spec includes unauthorised‑access checks and basic assertions on
response structure. Feel free to extend tests as you add features.

**Notes:**

- Running the server separately is **not required**; tests import the
  Express app directly.
- If network requests are unreliable, consider using `nock` or another
  HTTP mocking library to stub external API calls.

------------------------------------------------------------------------

## Author

Arjun Varma\
University of Leeds -- Web Services Coursework
