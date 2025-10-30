#!/bin/bash

# Database management scripts for Gym Management System

case "$1" in
  "start")
    echo "Starting PostgreSQL database..."
    docker-compose up -d postgres
    echo "Waiting for database to be ready..."
    sleep 10
    echo "Database started successfully!"
    ;;
  "stop")
    echo "Stopping PostgreSQL database..."
    docker-compose down
    echo "Database stopped successfully!"
    ;;
  "reset")
    echo "Resetting PostgreSQL database..."
    docker-compose down -v
    docker-compose up -d postgres
    echo "Waiting for database to be ready..."
    sleep 10
    echo "Database reset successfully!"
    ;;
  "migrate")
    echo "Running database migrations..."
    npx prisma migrate dev
    echo "Migrations completed!"
    ;;
  "generate")
    echo "Generating Prisma client..."
    npx prisma generate
    echo "Prisma client generated!"
    ;;
  "seed")
    echo "Seeding database..."
    npx prisma db seed
    echo "Database seeded successfully!"
    ;;
  "studio")
    echo "Opening Prisma Studio..."
    npx prisma studio
    ;;
  "status")
    echo "Checking database status..."
    docker-compose ps
    ;;
  *)
    echo "Usage: $0 {start|stop|reset|migrate|generate|seed|studio|status}"
    echo ""
    echo "Commands:"
    echo "  start   - Start PostgreSQL database"
    echo "  stop    - Stop PostgreSQL database"
    echo "  reset   - Reset PostgreSQL database (removes all data)"
    echo "  migrate - Run database migrations"
    echo "  generate- Generate Prisma client"
    echo "  seed    - Seed database with sample data"
    echo "  studio  - Open Prisma Studio"
    echo "  status  - Check database status"
    exit 1
    ;;
esac
