# Getting Started

Note: These commands are for Mac computer

## Define environment variables for local development

Create .env.local file in the root of the project and have the following environemnt variablee defined.
`DATABASE_URL`
`REGION`
`AWS_ACCESS_KEY_ID`
`AWS_SECRET_ACCESS_KEY`
`BUCKET_NAME`
`NODE_ENV="development"`

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

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
