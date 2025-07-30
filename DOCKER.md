# Posity - Docker Setup 🐳

Posity is a full-stack MERN application consisting of a React frontend (Vite), Node.js backend, and MongoDB database. This guide provides Docker configurations to build and run the application seamlessly using containers.

---

## 📁 Project Structure

```
posity/
├── backend/
│   ├── Dockerfile
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── nginx/
│   │   └── default.conf
│   ├── src/
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── README.md
```

---

## 🔧 Prerequisites

Before getting started, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/) (v20.0 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher recommended)

---

## 🚀 Quick Start with Docker

### Method 1: Using Docker Compose (Recommended)

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd posity
   ```

2. **Set up environment variables:**

   - Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories
   - Update the environment variables as needed

3. **Build and start all services:**

   ```bash
   docker-compose up -d --build
   ```

4. **Access the application:**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000/api/v1
   - **MongoDB**: Available internally on Docker network

### Method 2: Manual Docker Commands

If you prefer to build and run containers individually:

1. **Build Docker images:**

   ```bash
   docker build -t posity-backend ./backend
   docker build -t posity-frontend ./frontend
   ```

2. **Run containers:**

   ```bash
   # Start MongoDB
   docker run -d -p 27017:27017 --name posity-mongo mongo:latest

   # Start Backend
   docker run -d -p 5000:5000 --name posity-backend posity-backend

   # Start Frontend
   docker run -d -p 3000:80 --name posity-frontend posity-frontend
   ```

---

## 🔄 Development Workflow

### Making Changes

1. **Modify your code** in `frontend/src` or `backend/src`

2. **Rebuild and restart services:**

   ```bash
   docker-compose build
   docker-compose up -d
   ```

3. **For faster development**, you can rebuild specific services:

   ```bash
   # Rebuild only backend
   docker-compose build backend
   docker-compose up -d backend

   # Rebuild only frontend
   docker-compose build frontend
   docker-compose up -d frontend
   ```

### Hot Reloading (Development Mode)

To enable hot reloading during development, you can override the Docker setup:

```bash
# Create a docker-compose.override.yml for development
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

---

## 🌐 Network Configuration

### Handling CORS Issues

If you encounter CORS errors, ensure your backend server accepts requests from your frontend URL. In your Express backend:

```javascript
import cors from 'cors';

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
```

### Environment Variables

Make sure your environment variables are properly configured:

**Backend (.env):**

```env
CLIENT_URL=http://localhost:3000
MONGO_DB_URI=mongodb://posity-mongo:27017/posity
# ... other variables
```

**Frontend (.env):**

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 📋 Useful Docker Commands

| Command                            | Description                         |
| ---------------------------------- | ----------------------------------- |
| `docker-compose up -d`             | Start all services in detached mode |
| `docker-compose down`              | Stop and remove all containers      |
| `docker-compose build`             | Build or rebuild all images         |
| `docker-compose logs -f`           | Follow logs from all services       |
| `docker-compose logs <service>`    | View logs for specific service      |
| `docker ps`                        | List running containers             |
| `docker exec -it <container> bash` | Open shell inside container         |
| `docker system prune`              | Clean up unused Docker resources    |

### Service-Specific Commands

```bash
# Restart specific service
docker-compose restart backend

# View logs for specific service
docker-compose logs -f frontend

# Execute commands in running container
docker-compose exec backend npm run seed
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

**1. Port Conflicts**

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :5000
lsof -i :27017

# Kill processes if needed
sudo kill -9 <PID>
```

**2. 404 Not Found in Frontend**

- Verify Nginx configuration in `frontend/nginx/default.conf`
- Ensure the build directory is correctly mapped
- Check if frontend build was successful

**3. CORS Policy Errors**

- Verify `CLIENT_URL` in backend environment variables
- Ensure CORS middleware is properly configured
- Check if frontend URL matches backend CORS origin

**4. Database Connection Issues**

- Verify MongoDB container is running: `docker ps`
- Check MongoDB connection string in backend `.env`
- Ensure database container name matches connection string

**5. Changes Not Applied**

```bash
# Force rebuild without cache
docker-compose build --no-cache

# Remove containers and rebuild
docker-compose down
docker-compose up -d --build
```

**6. Container Memory Issues**

```bash
# Check Docker resource usage
docker stats

# Clean up unused resources
docker system prune -a
```

---

## 🔒 Security Considerations

### Production Deployment

- Use specific image tags instead of `latest`
- Set up proper secrets management
- Configure reverse proxy (Nginx/Traefik)
- Enable HTTPS/SSL certificates
- Set up proper backup strategies for MongoDB

### Environment Variables

Never commit sensitive environment variables to version control:

```bash
# Add to .gitignore
.env
.env.local
.env.production
```

---

## 📦 Production Deployment

While this Docker setup works for production, consider these platforms for easier deployment:

- **Frontend**: Vercel, Netlify
- **Backend**: Render, Railway, DigitalOcean
- **Database**: MongoDB Atlas, AWS DocumentDB

For containerized production deployment:

- Use Docker Swarm or Kubernetes
- Implement proper logging and monitoring
- Set up CI/CD pipelines
- Configure load balancing

---

## 🤝 Contributing

When contributing to the Docker setup:

1. Test your changes with both development and production builds
2. Update documentation for any new Docker configurations
3. Ensure backward compatibility when possible
4. Test on different operating systems if available

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Need help?** Check the main [README.md](../README.md) for general project information or open an issue for Docker-specific problems.

Built with ❤️ and containerized with 🐳
