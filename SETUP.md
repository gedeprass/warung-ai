# AI Shopping Assistant - Setup Guide

## Overview

This is an interactive e-commerce web application where users can discover products through natural language conversations with an AI assistant. The AI provides personalized product recommendations and displays product cards directly within the chat interface.

## Features

- 🤖 **AI Chatbot Interface**: Natural language product discovery
- 🛍️ **Product Recommendations**: AI-powered suggestions with visual product cards
- 🔐 **User Authentication**: Secure sign-in with chat history for logged-in users
- 👨‍💼 **Admin Panel**: Complete CRUD operations for product management
- 💬 **Chat History**: View and manage past conversations
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI & Chat**: Vercel AI SDK with OpenAI GPT-4o-mini
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: better-auth
- **UI Components**: shadcn/ui with Tailwind CSS
- **Language**: TypeScript

## Quick Setup

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Database Setup

Start the PostgreSQL database:

```bash
# Start the database using Docker
npm run db:up

# Generate and run database migrations
npm run db:generate
npm run db:push

# Seed the database with sample products
npm run db:seed
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Admin Access

For testing admin functionality, use these credentials:

- **Email**: `admin@example.com`
- **Password**: Any password you choose during registration

The admin panel will show an "Admin" button in the navigation for users with this email address.

## API Endpoints

### Authentication
- `POST /api/auth/*` - Better Auth endpoints for sign-in, sign-out, registration

### Chat
- `POST /api/chat` - AI chat endpoint with tool calling for product display

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Chat History
- `GET /api/chat-history` - Get user's chat history (authenticated users only)

## Key Features Explained

### AI Chat Interface

The main feature is the AI chatbot that:
- Understands natural language product requests
- Provides personalized recommendations
- Displays product cards directly in chat
- Maintains conversation context
- Saves chat history for authenticated users

### Product Cards

Products are displayed as interactive cards with:
- Product images (with fallback placeholders)
- Name, description, and pricing
- Stock status indicators
- Click-to-view functionality

### Admin Panel

Administrators can:
- Create, read, update, and delete products
- Manage inventory levels
- View all products in a table format
- Access through admin@example.com email

### User Authentication

- Users can sign up and sign in
- Chat history is saved for authenticated users
- Sessions are managed securely
- Access to personal chat history page

## Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database Management
npm run db:up            # Start PostgreSQL
npm run db:down          # Stop PostgreSQL
npm run db:generate      # Generate migrations
npm run db:push          # Push schema changes
npm run db:seed          # Seed sample data
npm run db:studio        # Open Drizzle Studio
npm run db:reset         # Reset database

# Docker
npm run docker:up        # Start all services
npm run docker:down      # Stop all services
```

## Sample Questions to Try

Once the app is running, try these questions with the AI assistant:

- "Find comfortable running shoes"
- "What's a good birthday gift for my girlfriend?"
- "Show me wireless headphones under $50"
- "I need eco-friendly kitchen products"
- "Recommend something for marathon training"
- "Find me a birthday gift for a tech enthusiast"

## Troubleshooting

### Database Connection Issues
- Ensure Docker is running
- Check that PostgreSQL is accessible at the configured port
- Verify DATABASE_URL in `.env` file

### AI Response Issues
- Verify OPENAI_API_KEY is valid and has sufficient credits
- Check network connectivity to OpenAI API
- Review the chat API endpoint logs

### Authentication Issues
- Ensure BETTER_AUTH_SECRET is set in `.env`
- Check that the auth URLs match your development setup
- Verify session storage in browser

## Production Deployment

1. Set up a production PostgreSQL database
2. Configure all environment variables
3. Set up proper authentication secrets
4. Configure your OpenAI API key
5. Deploy using your preferred hosting platform (Vercel, Railway, etc.)

## Security Notes

- The admin role is simplified for demo purposes (email-based)
- In production, implement proper role-based access control
- Use environment-specific secrets for authentication
- Ensure proper CORS configuration for API endpoints
- Validate and sanitize all user inputs

## Contributing

Feel free to extend the application with:
- More sophisticated AI recommendation logic
- Product categories and filtering
- Shopping cart functionality
- Order management
- Payment integration
- Advanced admin features
- Analytics and reporting