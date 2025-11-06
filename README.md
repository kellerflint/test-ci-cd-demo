# Full-Stack CI/CD Demo

A minimal full-stack application demonstrating Docker containerization, comprehensive testing, and CI/CD with GitHub Actions.

## Stack

- **Frontend**: React 18
- **Backend**: Node.js + Express
- **Database**: MySQL 8.0
- **Testing**: Jest, Supertest, React Testing Library, Cypress
- **CI/CD**: GitHub Actions
- **Containerization**: Docker & Docker Compose

## Features

- Simple CRUD operations (Create & Read items)
- Fully Dockerized services
- Unit tests for frontend and backend
- Integration tests for API endpoints
- End-to-end tests with Cypress
- Automated CI/CD pipeline

## Project Structure

```
.
├── backend/              # Node.js Express API
│   ├── tests/
│   │   ├── unit/        # Unit tests
│   │   └── integration/ # Integration tests
│   ├── server.js
│   ├── init.sql
│   └── Dockerfile
├── frontend/            # React application
│   ├── src/
│   │   ├── App.js
│   │   └── App.test.js  # React component tests
│   └── Dockerfile
├── e2e/                 # Cypress E2E tests
│   ├── cypress/
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/
    └── ci.yml           # CI/CD pipeline
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. Clone the repository:
```bash
git clone <your-repo-url>
cd test-ci-cd-demo
```

2. Start all services with Docker Compose:
```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MySQL: localhost:3306

### Running Tests

All tests run in Docker containers to ensure consistency between local and CI environments.

#### Backend Tests (unit + integration)

```bash
# Start database for integration tests
docker-compose up -d db

# Run all backend tests
docker-compose run --rm backend npm test

# Run only unit tests
docker-compose run --rm backend npm run test:unit

# Run only integration tests
docker-compose run --rm backend npm run test:integration

# Clean up
docker-compose down
```

#### Frontend Tests

```bash
# Run frontend tests
docker-compose run --rm frontend npm test
```

#### E2E Tests with Cypress

```bash
# Start all services
docker-compose up -d

# Wait a moment for services to be ready, then run E2E tests
docker-compose run --rm -e CYPRESS_baseUrl=http://frontend:3000 e2e npm run cypress:run

# Clean up
docker-compose down
```

#### Run All Tests at Once

```bash
# Backend tests
docker-compose up -d db
docker-compose run --rm backend npm test
docker-compose down

# Frontend tests
docker-compose run --rm frontend npm test

# E2E tests
docker-compose up -d
docker-compose run --rm -e CYPRESS_baseUrl=http://frontend:3000 e2e npm run cypress:run
docker-compose down
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request:

1. **Backend Tests**: Unit and integration tests in Docker container with MySQL
2. **Frontend Tests**: React component tests in Docker container
3. **E2E Tests**: Full application tests with Cypress in Docker
4. **Build**: Docker image build verification

**All tests run in Docker containers** - the exact same environment locally and in CI, matching production.

## API Endpoints

- `GET /health` - Health check
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item (requires `{ name: string }`)

## Database Schema

```sql
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development Notes

This is a minimal demo project. Several best practices are intentionally simplified:

- No authentication/authorization
- Minimal error handling
- No data validation library
- Simple database connection (no connection pooling)
- No environment-specific configurations
- Basic styling

## License

MIT
