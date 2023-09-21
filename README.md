# Getting Started

Note: These commands are for Mac computer

## Define environment variables for local development

Create .env.local file in the root of the project and have the following environemnt variable defined.

- `DATABASE_URL`
- `REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `BUCKET_NAME`
- `JWT_SECRET`
- `NODE_ENV="development"`
- `IMAGE_BASE_URL_DEVELOPMENT`

Please contact admin of the repo for values of these variables.

### Install dependencies

In your terminal, in the root of the project run `npm install`

### Start development server

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note: You need to use posr 3000 for this applicaton to run, otherwise you will not be able to interact with aws services. The services in aws have been designed to accept traffic only from port 3000 in development mode.

### Branching Strategy

Our base branch that everything comes from is called main. All branches originate from the main branch.
