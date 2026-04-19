# AI Tool Registration Service

This is a CRUD API for managing AI tools, built with Node.js, Express, and Firebase. It provides endpoints for creating, retrieving, updating, and deleting tool definitions, with authentication and authorization.

## Features
- Create, read, update, and delete AI tool definitions
- Admin endpoints for system management
- Authentication & authorization with role-based access (admin, creator)
- CORS configuration for public and authenticated endpoints
- Helmet configuration for enhanced security
- Comprehensive API documentation with Swagger
- Joi validation for request data

## Project Overview
The AI Tool Registration Service is designed to allow users to register and manage AI tools through a set of RESTful endpoints. It solves the problem of tool organization and management by providing a centralized API for creating and managing tool definitions with JSON schemas.
The project was created to demonstrate the implementation of a secure and well-documented API using modern web development practices.

## Installation Instructions
### Prerequisites
- Node.js (version 14 or higher)
- NPM (Node Package Manager)
- TypeScript (installed)
- Firebase database with admin SDK credentials
- .env file storing your Firebase credentials
    -- `FIREBASE_PROJECT_ID`
    -- `FIREBASE_CLIENT_EMAIL`
    -- `FIREBASE_PRIVATE_KEY`
    -- `ALLOWED_ORIGINS` (comma-separated list of allowed origins for authenticated endpoints)

        {
        NODE_ENV=development
            PORT=3000
            FIREBASE_PROJECT_ID=your-project-id
            FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
            FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
            SWAGGER_SERVER_URL=http://localhost:3000/api/v1
            ALLOWED_ORIGINS=http://localhost:3000,http://example.com
            FIREBASE_WEB_API_KEY="your-web-api-key"
        }

## Setup Instructions
1. Clone the repository
    -- git clone <repository-url>
2. Install dependencies
    -- npm install
3. Place .env file in the root directory with the required environment variables
4. Start the server
    -- npm start

## API Request Examples
### Get all tools
GET 'http://localhost:3000/api/v1/tools' \
  --header 'Authorization: Bearer <token>'

Response:
  {
    "Listing": "Tool Definitions",
    "Count": 2,
    "data": [
        {
            "name": "image_generator",
            "description": "Generates images from text prompts",
            "jsonSchema": "{\"type\":\"object\",\"properties\":{\"prompt\":{\"type\":\"string\"}}}",
            "creator": "user123",
            "createdAt": "2025-01-15T18:32:00.000Z",
            "updatedAt": "2025-01-15T18:32:00.000Z"
        },
        {
            "name": "text_summarizer",
            "description": "Summarizes long text inputs",
            "jsonSchema": "{\"type\":\"object\",\"properties\":{\"text\":{\"type\":\"string\"},\"maxLength\":{\"type\":\"integer\"}}}",
            "creator": "user456",
            "createdAt": "2025-01-20T10:15:00.000Z",
            "updatedAt": "2025-01-20T10:15:00.000Z"
        }
    ]
  }

### Create a new tool
POST 'http://localhost:3000/api/v1/tools' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <token>' \
  --body '{
    "name": "code_formatter",
    "description": "Formats code according to specified style guidelines",
    "jsonSchema": "{\"type\":\"object\",\"properties\":{\"code\":{\"type\":\"string\"},\"language\":{\"type\":\"string\"}}}"
  }'

Response:
  {
    "Listing": "Tool Definitions",
    "data": {
        "name": "code_formatter",
        "description": "Formats code according to specified style guidelines",
        "jsonSchema": "{\"type\":\"object\",\"properties\":{\"code\":{\"type\":\"string\"},\"language\":{\"type\":\"string\"}}}",
        "creator": "user123",
        "createdAt": "2025-02-01T14:22:00.000Z",
        "updatedAt": "2025-02-01T14:22:00.000Z"
    }
  }

### Update a tool
PUT 'http://localhost:3000/api/v1/tools/code_formatter' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <token>' \
  --body '{
    "description": "Formats code with improved style guidelines",
    "jsonSchema": "{\"type\":\"object\",\"properties\":{\"code\":{\"type\":\"string\"},\"language\":{\"type\":\"string\"},\"style\":{\"type\":\"string\"}}}"
  }'

Response:
  {
    "update": {
        "name": "code_formatter",
        "description": "Formats code with improved style guidelines",
        "jsonSchema": "{\"type\":\"object\",\"properties\":{\"code\":{\"type\":\"string\"},\"language\":{\"type\":\"string\"},\"style\":{\"type\":\"string\"}}}",
        "creator": "user123",
        "createdAt": "2025-02-01T14:22:00.000Z",
        "updatedAt": "2025-02-05T09:30:00.000Z"
    }
  }

### Delete a tool
DELETE 'http://localhost:3000/api/v1/tools/code_formatter' \
  --header 'Authorization: Bearer <token>'

Response:
  {
    "deleted": {
        "name": "code_formatter",
        "creator": "user123",
        "createdAt": "2025-02-01T14:22:00.000Z",
        "deletedAt": "2025-02-05T09:35:00.000Z"
    }
  }

### Validation
Fields are validated using Joi. Name must be 3-50 characters, description 10-200 characters, jsonSchema up to 5000 characters for creation. For updates, description 10-200, jsonSchema up to 1000. All fields are required for creation, description and jsonSchema for updates.

## Documentation
Swagger UI is available at: http://localhost:3000/api-docs

## Author
- Andrew Merrick

### Creator
- `GET /api/v1/tools` - Retrieve all registered tools
- `POST /api/v1/tools` - Register a new tool
- `GET /api/v1/tools/:id` - Get a specific tool by ID
- `PUT /api/v1/tools/:id` - Update a tool
- `DELETE /api/v1/tools/:id` - Delete a tool

### Admin
- `GET /api/v1/admin/health` - Health check endpoint
- `GET /api/v1/admin/tools` - Admin view of all tools
- Additional admin endpoints for system management

### Documentation
- `GET /api-docs` - Swagger UI for API documentation

## Configuration

- **Firebase**: Configure your Firebase project settings in `src/config/firebaseConfig.ts`
- **Swagger**: Customize API documentation in `src/config/swagger.ts` and `src/config/swaggerOptions.ts`
- **Server**: Adjust server settings in `src/server.ts` and `src/app.ts`

## Testing

The project includes comprehensive tests covering:
- Route handlers
- Service logic
- Middleware functionality
- Error handling
