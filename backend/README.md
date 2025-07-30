# .env.example

# Node environment

NODE_ENV=development

# Application port

PORT=5000

# Frontend URL (for CORS)

CLIENT_URL=http://localhost:3000 or http://localhost:5173

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
