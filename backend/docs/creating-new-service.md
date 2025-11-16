# Nestjs

In order to create new nestjs service follow the steps below:

- create directory named `<service-name>` in [../services](../services/)
- run `nest new --skip-git --strict --directory`
- run `npm init -w ./services/<service-name>` in the [../](../) directory
- go to `services/<service-name>` directory
- remove node_modules and package-lock.json
- remove baseUrl field from tsconfig and add @app/\* alias which resolves to ./src/\*
- create jest.config.ts
- paste jest config from package.json into jest.config.ts
- remove jest config from package.json
- add this to jest.config.ts

```
moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/$1',
  },
```

- add Dockerfile
- add .env and .env.example
- add `'@typescript-eslint/no-unsafe-call': 'warn'` to eslint config
