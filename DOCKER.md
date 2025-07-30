# Postify

Postify is a full-stack application consisting of a React frontend, Node.js backend, and MongoDB database. This repository contains Docker configurations to build and run the app seamlessly using containers.

---

## Folder Structure

postify/
├── backend/
│ ├── Dockerfile
│ ├── src/
│ ├── package.json
│ └── ...
├── frontend/
│ ├── Dockerfile
│ ├── nginx/
│ │ └── default.conf
│ ├── src/
│ ├── package.json
│ └── ...
├── docker-compose.yml
└── README.md

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (optional but recommended)

---

## Setup & Running Locally with Docker

### 1. Build Docker Images

Navigate to the project root and build the images manually:

```bash
docker build -t postify-backend ./backend
docker build -t postify-frontend ./frontend
```

Or build all with Docker Compose: docker-compose build

### 2. Run Containers

Manually start each container:
docker run -d -p 5000:5000 --name postify-backend postify-backend
docker run -d -p 3000:80 --name postify-frontend postify-frontend
docker run -d -p 27017:27017 --name postify-mongo mongo
Or start all with Docker Compose: docker-compose up -d

3. Access the App
   Frontend: http://localhost:3000

Backend API: http://localhost:5000/api/v1

MongoDB: connects internally inside Docker network (no UI)

Development Workflow
Make code changes in frontend/src or backend/src.

Rebuild Docker images to apply changes:
docker-compose build
docker-compose up -d

Or manually rebuild and restart containers (see Running Containers).

Handling CORS Issues
If you encounter CORS errors, ensure your backend server is configured to accept requests from your frontend URL (http://localhost:3000), for example using the cors middleware in Express:

import cors from 'cors';

app.use(cors({
origin: 'http://localhost:3000',
credentials: true,
}));

Useful Docker Commands

| Command                            | Description                       |
| ---------------------------------- | --------------------------------- |
| `docker ps`                        | List running containers           |
| `docker logs <container>`          | Show logs for a container         |
| `docker exec -it <container> bash` | Open shell inside a container     |
| `docker-compose up -d`             | Start containers in detached mode |
| `docker-compose down`              | Stop and remove containers        |
| `docker-compose build`             | Build or rebuild images           |
| `docker-compose logs -f`           | Follow container logs             |

Troubleshooting
404 Not Found in Frontend: Confirm Nginx is serving the correct build directory and check your default.conf file.

CORS Policy Errors: Double-check backend CORS config matches your frontend origin URL.

Port Conflicts: Make sure ports 3000, 5000, and 27017 are free on your machine.

Changes not applied: Rebuild images with --no-cache option or remove containers before restarting.

Deployment
You can deploy your backend and frontend separately on platforms like Render or Vercel if you prefer not to use Docker in production.
License
MIT

Feel free to open issues or submit pull requests for improvements!
