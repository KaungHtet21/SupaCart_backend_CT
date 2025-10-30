# Gym Management System Backend

A comprehensive gym management system built with NestJS, PostgreSQL, and Prisma ORM.

## Features

- **Member Management**: Registration, membership packages, check-in system
- **Admin Dashboard**: User management, membership approval, statistics
- **Personal Training**: Trainer management and session booking
- **Real-time Notifications**: WebSocket-based notifications
- **Authentication**: JWT-based authentication with role-based access control
- **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Real-time**: Socket.IO with Redis
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- Yarn package manager

## Quick Start

### 1. Clone and Install Dependencies

```bash
cd gym_backend
yarn install
```

### 2. Environment Setup

```bash
cp env.example .env
# Edit .env file with your configuration
```

### 3. Database Setup

```bash
# Start PostgreSQL database
yarn db:start

# Run migrations
yarn db:migrate

# Generate Prisma client
yarn db:generate

# Seed database with sample data
yarn db:seed

# Start redis
yarn redis:start
```

### 4. Start Development Server

```bash
yarn start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/api/docs`

## Database Scripts

```bash
# Using yarn scripts
yarn db:start      # Start database
yarn db:stop       # Stop database
yarn db:reset      # Reset database (removes all data)
yarn db:migrate    # Run migrations
yarn db:generate   # Generate Prisma client
yarn db:seed       # Seed database
yarn db:studio     # Open Prisma Studio
yarn redis:start   # Start redis

# Using shell script
./scripts/db.sh start
./scripts/db.sh stop
./scripts/db.sh reset
./scripts/db.sh migrate
./scripts/db.sh generate
./scripts/db.sh seed
./scripts/db.sh studio
./scripts/db.sh status
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

### Members
- `GET /members/packages` - Get membership packages
- `POST /members/memberships` - Create membership
- `POST /members/checkin` - Check in to gym
- `GET /members/checkin` - Get check-in history

### Admin (Admin only)
- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/users` - Get all users
- `POST /members/packages` - Create membership package
- `PUT /members/memberships/:id/status` - Update membership status

### Personal Trainers
- `GET /personal-trainers` - Get all trainers
- `POST /personal-trainers/sessions` - Book training session
- `GET /personal-trainers/sessions/my` - Get user sessions

### Notifications
- `GET /notifications/my` - Get user notifications
- `PUT /notifications/mark-all-read` - Mark all as read

## Database Schema

The system includes the following main entities:

- **Users**: Members and admins
- **MembershipPackages**: Available membership plans
- **Memberships**: User memberships with status tracking
- **CheckIns**: Gym check-in records
- **PersonalTrainers**: Trainer profiles and specialties
- **PersonalTrainingSessions**: Booked training sessions
- **Notifications**: Real-time notifications

## Real-time Features

The system includes WebSocket support for:
- Real-time notifications
- Admin alerts for new registrations
- Check-in status updates

## Authentication

The system uses JWT-based authentication with:
- Access tokens (15 minutes expiry)
- Refresh tokens (90 days expiry)
- Role-based access control (ADMIN, MEMBER)

## Development

### Project Structure

```
src/
├── common/           # Shared utilities, constants, pipes
├── config/           # Configuration and Prisma service
├── domains/          # Feature modules
│   ├── auth/         # Authentication
│   ├── members/      # Member management
│   ├── admin/        # Admin functionality
│   ├── notifications/# Notifications
│   └── personal-trainers/ # Personal training
├── guards/           # Authentication guards
├── infrastructure/  # External services (Redis, WebSocket)
├── middlewares/      # Global middlewares
└── main.ts          # Application entry point
```

### Adding New Features

1. Create domain folder in `src/domains/`
2. Add DTOs, inputs, operations, service, controller, and module
3. Import module in `app.module.ts`
4. Add API documentation with Swagger decorators

## Production Deployment

1. Set production environment variables
2. Build the application: `yarn build`
3. Start production server: `yarn start:prod`
4. Use process manager like PM2 for production

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include Swagger documentation
4. Write tests for new features
5. Follow NestJS best practices

## License

This project is licensed under the MIT License.