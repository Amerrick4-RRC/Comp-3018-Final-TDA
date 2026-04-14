# AI Tool Registration Service

A robust REST API service built with Node.js and TypeScript for registering and managing AI tools. This service provides endpoints for tool registration, administration, and health checks, with comprehensive documentation via Swagger.

## Features

- **Tool Registration**: Register and manage AI tools with detailed metadata
- **Admin Panel**: Administrative endpoints for managing tools and system health
- **Authentication & Authorization**: Secure middleware for user authentication and role-based access
- **Validation**: Input validation using schemas for data integrity
- **Error Handling**: Centralized error handling with custom error utilities
- **Logging**: Request logging middleware for monitoring and debugging
- **API Documentation**: Interactive Swagger UI for exploring and testing endpoints
- **Testing**: Comprehensive test suite with Jest for unit and integration tests
- **TypeScript**: Full TypeScript support for type safety and better development experience

## Technologies Used

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Firebase (configuration)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Linting**: ESLint
- **Build Tool**: TypeScript Compiler

## Project Structure

```
src/
├── api/
│   └── v1/
│       ├── controllers/     # Request handlers
│       ├── errors/          # Custom error definitions
│       ├── middleware/      # Authentication, authorization, logging, etc.
│       ├── models/          # Data models and response structures
│       ├── repositories/    # Data access layer
│       ├── routes/          # API route definitions
│       ├── services/        # Business logic
│       ├── utils/           # Utility functions
│       └── validation/      # Input validation schemas
├── config/                  # Configuration files (Firebase, Swagger)
└── constants/               # HTTP constants and other constants
tests/                       # Test files
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd AI-Tool-registration-service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Configure Firebase settings in `src/config/firebaseConfig.ts`
   - Update Swagger configuration in `src/config/swagger.ts` if needed

4. **Build the project** (optional, as scripts use ts-node):
   ```bash
   npx tsc
   ```

## Usage

### Development

Start the development server:
```bash
npm start
```

The server will start on the default port (check `src/server.ts` for port configuration). API documentation will be available at `/api-docs`.

### Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate test coverage:
```bash
npm run test:coverage
```

## API Endpoints

### Tools
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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

The project includes comprehensive tests covering:
- Route handlers
- Service logic
- Middleware functionality
- Error handling

Ensure all tests pass before submitting changes.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the repository or contact the development team.