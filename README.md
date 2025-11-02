# Counter API

A simple API for counting webpage views.

## Setup

### Option 1: Using Docker Compose (Recommended)

**Note:** Docker Desktop uses `docker compose` (with a space). If you have the standalone version, use `docker-compose` (with a hyphen).

```bash
# For Docker Desktop (recommended)
docker compose up -d

# OR for standalone docker-compose
docker-compose up -d
```

This will build and start the API on port 3000.

### Option 2: Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the server:
```bash
npm start
```

The server will run on port 3000 (or the PORT environment variable if set).

## Usage

### Increment and get counter value

```bash
GET http://counter.yrieix.com/mycounter/
```

Response:
```json
{
  "counter": "mycounter",
  "value": 1
}
```

Each request increments the counter and returns the new value.

## Docker Commands

**Note:** Use `docker compose` (space) for Docker Desktop, or `docker-compose` (hyphen) for standalone.

- Start: `docker compose up -d` or `docker-compose up -d`
- Stop: `docker compose down` or `docker-compose down`
- View logs: `docker compose logs -f` or `docker-compose logs -f`
- Rebuild: `docker compose up -d --build` or `docker-compose up -d --build`

## Storage

Counters are persisted in `counters.json` in the project root. When using Docker Compose, this file is mounted as a volume so data persists across container restarts.

## Production Deployment

For production with counter.yrieix.com:
1. Set up a reverse proxy (nginx/traefik) pointing to port 3000
2. Consider using environment variables for configuration
3. Ensure the `counters.json` file is backed up regularly

