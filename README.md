# Posity 📝

A full-stack blog web application built with the MERN stack, featuring modern authentication, image management, and a sleek user interface.

## 🚀 Features

- **User Authentication**

  - Sign up and sign in functionality
  - Password reset with OTP verification
  - Email verification for new accounts
  - JWT-based session management

- **Blog Management**

  - Create, edit, and delete blog posts
  - Create, edit, and delete comments on blog posts
  - Rich text editor powered by TipTap
  - Image upload and management via Cloudinary

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Beautiful components using shadcn/ui
  - TypeScript for enhanced development experience

## 🛠️ Tech Stack

### Frontend

- **React** with TypeScript
- **TipTap** for rich text editing
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- Hosted on **Vercel**

### Backend

- **Node.js** with Express
- **MongoDB** for database
- **JWT** for authentication
- **Mailjet** for email services
- **Cloudinary** for image storage
- Hosted on **Render**

### DevOps & Monitoring

- **Docker** for containerization
- **UptimeRobot** for backend monitoring

## 📁 Project Structure

This repository contains two main directories:

```
posity/
├── backend/     # Express.js API server
└── frontend/    # React TypeScript application (Vite)
```

## 🔧 Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance
- Cloudinary account
- Mailjet account

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.development` file with the following variables:

   ```env
   # Node environment
   NODE_ENV=development

   # when deploying use on your hosting platform
   NODE_ENV=production

   # Application port
   PORT=5000

   # Frontend URL (for CORS)
   CLIENT_URL=http://localhost:5173

   # MongoDB connection string
   MONGO_DB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<db_name>?retryWrites=true&w=majority&appName=<app_name>

   # JWT authentication
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d

   # Cloudinary credentials
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Mailjet SMTP settings
   MAILJET_HOST=in-v3.mailjet.com
   MAILJET_PORT=2525
   MAILJET_API_KEY=your_mailjet_api_key
   MAILJET_SECRET_KEY=your_mailjet_secret_key
   SENDER_EMAIL=your_email@example.com

   # Optional: Mailtrap SMTP (for testing only)
   # MAIL_TRAP_HOST=sandbox.smtp.mailtrap.io
   # MAIL_TRAP_PORT=2525
   # MAIL_TRAP_USERNAME=your_mailtrap_username
   # MAIL_TRAP_PASSWORD=your_mailtrap_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🐳 Docker Setup

The application is fully containerized for easy development and deployment. For detailed Docker setup instructions, configuration options, and troubleshooting, please refer to our comprehensive [Docker README](./DOCKER.md).

**Quick Start:**

```bash
git clone <repository-url>
cd posity
docker-compose up -d --build
```

Access the application at http://localhost:3000

## 🌐 Live Demo

- **Frontend**: [Deployed on Vercel]
- **Backend**: [Deployed on Render]

## 📊 Monitoring & Deployment

- **GitHub Actions**: Automated CI/CD pipeline for seamless deployments to Vercel and Render
- **UptimeRobot**: Backend uptime and performance monitoring to ensure reliable service availability

## 🎯 Development Journey

This project represents my first full-stack application with a custom backend. The development process involved:

- Learning Express.js and Node.js fundamentals
- Implementing secure authentication patterns
- Integrating third-party services (Cloudinary, Mailjet)
- Utilizing various learning resources including YouTube tutorials, technical blogs, and AI assistance
- Overcoming challenges through research and community support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using the MERN stack
