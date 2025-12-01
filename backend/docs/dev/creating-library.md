# General Steps

In order to add new library follow the steps below:

1. Create folder with name `<lib-name>` in `libs/<programming-language>/`,
2. add a README.md describing the library purpose,

# Specific Technologies

## Typescript

1. run npm init
2. install typescript and @types/node
3. remove package-lock.json and node_modules
4. add library to the npm workspace
5. use following tsconfig:
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "nodenext",
    "target": "esnext",
    "lib": ["esnext"],
    "types": ["node"],

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strictNullChecks": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}

```
6. use following package.json
```json
{
  "name": "<lib-name>",
  "version": "1.0.0",
  "description": "",
  "keywords": [],
  "license": "ISC",
  "author": "",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "@types/node": "^22.10.7",
    "typescript": "^5.7.3"
  }
}

```
7. Configure exports field in package.json