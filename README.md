# About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

# How to Setup?

1. clone the repository
2. Install dependencies

```cmd
npm i
```

3. create your .env file from .env.<test/prod/development>.example

4. start the project
   
```cmd
npm run dev
```

# How to push ?
If you have changes on the project before pushing configure the environment for github

```cmd
git config core.hooksPath .husky

```

check lint issues and fix them

```cmd
npm run lint

```

Open new branch and push your changes...

```cmd
git add .
git commit -m "your message"
git checkout -b branch_name
git push
```

"your message" and branch_name please replace with correct name and message

## Available Scripts

### `npm run dev`

Run the server in development mode.

### `npm test`

Run all unit-tests with hot-reloading.

### `npm test -- --testFile="name of test file" (i.e. --testFile=Users).`

Run a single unit-test.

### `npm run test:no-reloading`

Run all unit-tests without hot-reloading.

### `npm run lint`

Check for linting errors.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm start -- --env="name of env file" (default is production).`

Run production build with a different env file.

### Migrations

Generate migration based on entities

```cmd
npm run migration:generate src/repos/migrations/<migration_name>

```

Create entity

```cmd
 npm run entity:create src/repos/entities/
```

migrate database

```cmd
npm run migrate

```

## Configure the husky for pre-push

```cmd
git config core.hooksPath .husky

```

## Prettier command

```cmd
npm run format

```

## ESlint command

```cmd
npm run lint

```

## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`.

## Deployment (Additional information)

if you will get issues with deployment check "pre-start.ts" file for .env
