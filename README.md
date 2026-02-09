# Docker Compose Cheat Sheet 📄

## 📁 File Structure
```yaml
version: '3.8'           # Compose file version
services:                # Your containers go here
  service1:              # Service/container name
    # configuration
  service2:
    # configuration
volumes:                 # Persistent storage
networks:               # Custom networking
```

## 🚀 Quick Start Commands
```bash
# Start all services
docker-compose up                    # Foreground
docker-compose up -d                 # Background (detached)

# Stop services
docker-compose down                  # Stop and remove containers
docker-compose down -v               # Stop and remove containers+volumes

# Management
docker-compose ps                    # List running services
docker-compose logs                  # View all logs
docker-compose logs [service]        # View specific service logs
docker-compose restart [service]     # Restart service
docker-compose stop                  # Stop services
docker-compose start                 # Start stopped services

# Build & Updates
docker-compose up --build            # Rebuild images
docker-compose pull                  # Pull latest images
docker-compose build [service]       # Build specific service
```

## 🔧 Service Configuration Cheat Sheet

### Image & Build
```yaml
service:
  image: nginx:alpine                # Use existing image
  build: .                           # Build from Dockerfile in current dir
  build:
    context: ./app                   # Build from specific directory
    dockerfile: Dockerfile.dev       # Custom Dockerfile name
    args:                            # Build arguments
      - BUILD_VERSION=1.0
```

### Ports & Networking
```yaml
service:
  ports:
    - "80:80"                        # Host:Container
    - "3000-3005:3000-3005"         # Port range
    - "443:443"                      # Multiple ports
  
  expose:
    - "3000"                         # Expose to other containers only
  
  networks:
    - frontend
    - backend
  
  network_mode: "host"               # Use host network
```

### Environment Variables
```yaml
service:
  environment:
    - NODE_ENV=production
    - DATABASE_URL=postgres://...
  
  env_file:
    - .env                           # Load from .env file
    - ./config.env                   # Multiple env files
  
  # Shorter syntax
  environment:
    NODE_ENV: production
    DATABASE_URL: postgres://...
```

### Volumes & Mounts
```yaml
service:
  volumes:
    # Mount host directory
    - ./html:/usr/share/nginx/html
    
    # Named volume
    - db_data:/var/lib/mysql
    
    # Read-only mount
    - ./config:/etc/config:ro
    
    # Anonymous volume
    - /var/log
    
    # Bind specific file
    - ./app.conf:/etc/nginx/conf.d/app.conf
```

### Dependencies & Order
```yaml
service:
  depends_on:
    - database
    - redis
  
  # Health check dependency
  depends_on:
    db:
      condition: service_healthy
    redis:
      condition: service_started
```

### Health Checks
```yaml
service:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

### Resource Limits
```yaml
service:
  deploy:                           # For swarm mode
    resources:
      limits:
        cpus: '0.50'
        memory: 512M
      reservations:
        cpus: '0.25'
        memory: 256M
```

## 📊 Volume Types
```yaml
volumes:
  # Named volume (managed by Docker)
  db_data:
  
  # Named volume with options
  app_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/to/data
  
  # External volume (existing)
  existing_volume:
    external: true
    name: my_volume
```

## 🌐 Network Types
```yaml
networks:
  # Bridge network (default)
  frontend:
    driver: bridge
  
  # Isolated network
  backend:
    driver: bridge
    internal: true                    # No external access
  
  # External network
  proxy:
    external: true
    name: nginx-proxy
  
  # Custom driver
  mynet:
    driver: macvlan
    driver_opts:
      parent: eth0
    ipam:
      config:
        - subnet: 172.20.0.0/24
```

## 🎯 Common Service Templates

### Nginx Web Server
```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - ./html:/usr/share/nginx/html
  restart: unless-stopped
```

### PostgreSQL Database
```yaml
postgres:
  image: postgres:14-alpine
  environment:
    POSTGRES_DB: mydb
    POSTGRES_USER: user
    POSTGRES_PASSWORD: password
  volumes:
    - postgres_data:/var/lib/postgresql/data
  ports:
    - "5432:5432"
```

### Redis Cache
```yaml
redis:
  image: redis:alpine
  command: redis-server --requirepass redispassword
  volumes:
    - redis_data:/data
  ports:
    - "6379:6379"
```

### Node.js App
```yaml
nodeapp:
  build: .
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=production
  volumes:
    - ./:/app
    - /app/node_modules
  depends_on:
    - postgres
    - redis
```

## ⚡ Useful Shortcuts
```bash
# Execute command in running container
docker-compose exec [service] [command]

# Run one-time command
docker-compose run [service] [command]

# View service logs in real-time
docker-compose logs -f [service]

# Check service status
docker-compose ps [service]

# Scale specific service
docker-compose up --scale [service]=3

# Remove all unused data
docker-compose down --rmi all --volumes
```

## 🔄 Restart Policies
```yaml
service:
  restart: "no"              # Never restart (default)
  restart: always            # Always restart
  restart: on-failure        # Restart on failure
  restart: unless-stopped    # Restart unless explicitly stopped
```

## 🏷️ Labels & Metadata
```yaml
service:
  labels:
    - "com.example.description=My web app"
    - "com.example.version=1.0"
  
  container_name: my_custom_name
  hostname: myapp.local
  domainname: example.com
```

## 📝 Example: Full Stack App
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    volumes: ["./frontend:/app"]
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["5000:5000"]
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: password
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:alpine
    volumes: [redis_data:/data]

volumes:
  postgres_data:
  redis_data:
```

## 🚨 Troubleshooting Commands
```bash
# See what's happening
docker-compose ps -a                    # All containers
docker-compose top                      # Running processes
docker-compose config                   # Validate compose file
docker-compose config --services        # List services

# Cleanup
docker-compose down --remove-orphans    # Remove orphan containers
docker-compose rm -f                    # Force remove stopped containers
docker volume prune                     # Remove unused volumes
```


