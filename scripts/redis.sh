#!/usr/bin/env bash
set -euo pipefail

# Simple helper to manage Redis via docker compose
# Usage: ./scripts/redis.sh [start|stop|restart|status|logs|ping]

CMD=${1:-status}

DC="docker compose"

case "$CMD" in
  start)
    $DC up -d redis
    ;;
  stop)
    $DC stop redis
    ;;
  restart)
    $DC restart redis
    ;;
  status)
    $DC ps redis
    ;;
  logs)
    $DC logs -f redis
    ;;
  ping)
    $DC exec redis redis-cli PING
    ;;
  *)
    echo "Unknown command: $CMD"
    echo "Usage: $0 [start|stop|restart|status|logs|ping]"
    exit 1
    ;;
esac
