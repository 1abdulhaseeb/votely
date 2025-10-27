# Votely

A modern voting application built with a scalable architecture.

## Project Structure

This is a monorepo containing the following components:

```
votely/
├── backend/          # NestJS REST API server
└── README.md         # This file
```

## Backend (NestJS API)

The backend is built with [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient and scalable server-side applications.

### Technologies Used

- **Framework**: NestJS v11
- **Language**: TypeScript
- **Package Manager**: Yarn
- **Testing**: Jest
- **Linting**: ESLint + Prettier

### Getting Started with Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start the development server:**
   ```bash
   yarn start:dev
   ```

   The API will be available at `http://localhost:3000`

4. **Other useful commands:**
   ```bash
   # Build for production
   yarn build
   
   # Run tests
   yarn test
   
   # Run e2e tests
   yarn test:e2e
   
   # Check test coverage
   yarn test:cov
   
   # Format code
   yarn format
   
   # Lint code
   yarn lint
   ```

## Development Workflow

1. Clone the repository
2. Follow the setup instructions for the component you want to work on
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
