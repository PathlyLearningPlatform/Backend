# Top-level files

## Environment

`.env`* - file with environment variables for development <br/>
`.env.prod`* - file with environment variables for production <br/>
`.env.example` - file with environment variables with example values <br/>

## Docker

`compose.yaml` - docker compose file for development <br/>
`prod.compose.yaml` - docker compose file for production <br/>
`Dockerfile` - dockerfile <br/>

## Git

`.gitignore` - self-explanatory <br/>

## Nodejs / npm / typescript

`package.json` and `package-lock.json` - npm project config files <br/>
`tsconfig.*` - typescript config <br/>
`biome.json` - biome linter & formatter configuration <br/>
`jest.config.ts` - jest testing framework configuration <br/>
`nest-cli.json` - nestjs framework cli config <br/>
`drizzle.config.ts` - drizzle ORM config <br/>

# Top-level folders

`db` - folder for postgres db config files (docker, environment) <br/>
`docs` - service documentation <br/>
`src` - actual source code, see [code.md](./code.md) <br/>
`test` - e2e tests <br/>