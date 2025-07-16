# User Creation Single Page Application

A React SPA for user creation with CI/CD pipeline deployment to AWS S3.

## Features

- User creation form with validation
- Material-UI components
- Vitest testing framework
- Storybook for component documentation
- GitHub Actions CI/CD pipeline for AWS S3 deployment

## Development

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
npm install
```

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the production-ready application |
| `npm run test` | Runs the automated tests with Vitest |
| `npm run storybook` | Starts the Storybook component explorer |
| `npm run preview` | Preview the production build locally |

## CI/CD Pipeline

The application includes a GitHub Actions workflow that:

1. **Builds** the application
2. **Tests** the application (tests must pass before deployment)
3. **Deploys** to AWS S3

### Required GitHub Secrets

Configure the following secrets in your GitHub repository:

- `API_URL`: The full URL for the user creation API endpoint
- `AWS_ACCESS_KEY_ID`: AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for deployment
- `AWS_S3_BUCKET_NAME`: Name of the target S3 bucket

### Deployment

The pipeline automatically deploys to AWS S3 on every push to the `main` branch.

## Architecture

The application follows a component-based architecture:

```
/src
├── /components/UserCreationForm
│   ├── UserCreationForm.jsx
│   ├── UserCreationForm.stories.jsx
│   └── UserCreationForm.test.jsx
├── /services/api.js
├── App.jsx
└── main.jsx
```

## API Integration

The application integrates with a user creation API using the `VITE_API_URL` environment variable.

### API Contract

- **Endpoint**: `POST /users`
- **Request Body**: `{ firstName, lastName, email }`
- **Success Response**: `201 Created`
- **Error Responses**: `400 Bad Request`, `500 Internal Server Error`
