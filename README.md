# Gw2lfg Server

Backend for gw2lfg service. Allows organisation of raid events with automated player requirements checking.

## PREREQUISITES

- `tsc 3.x` (tested on `3.9.7`)
- `node 12+` (tested on `12.16.3` and `14.15.4`)
- `nodemon 2.x` (tested on `2.0.4`) (not needed if building manually)
- `yarn 1.x` (tested on `1.22.4`)
- `PostgreSQL` (tested on `12.3`)

## SETUP

1. **Env Variables**
   - `example.env.test` contains example env config. `GW2API_TOKEN` variable is only required for testing environment.
   - Separate `env.<env-name>` files are needed for each environment you want to run (`test`, `dev`, or your own custom environments).  
     If, for example, you only intend to run `dev`, you only need `env.dev` file.
2. **Database**
   - Look at the `ormconfig.js` file. It's a sample setup of database connection,
     you can provide your own data for database if needed.
   - Migrations will autorun on application start

## HOW TO RUN LOCALLY

1. Follow `SETUP` section first and install `PREREQUISITIES`
2. `yarn install` - install dependencies
3. `yarn build` - build the app
4. `yarn seed:bosses` - fill database with bosses (only has to be done once - after the initial build)
5. `yarn start` - run the app

Server will be available at `localhost:<port-specified-in-env>`

## WORKING WITH DATABASE

- `yarn seed:bosses` - seeds the database with currently available raid bosses
- `yarn migration:generate <migration-name>` - generates a migration (migration code has to be compiled with `yarn build` before it can be run!)
- `yarn migration:run` - runs a migration

## TESTING

The option of running all the tests at the same time was kind of buggy, thus it was temporary removed. It's recommended to run tests by layers (pick one of `unit`, `integr`, `e2e`). Currently the following tests commands are available:

- `yarn test:unit` - runs all test files in `test/unit` directory
- `yarn test:integr` - runs all test files in `test/integration` directory
- `yarn test:integr:controllers` - runs all test files in `test/integration/api/controllers` directory
- `yarn test:integr:services` - runs all test files in `test/integration/services` directory
- `yarn test:integr:data` - runs all test files in `test/integration/data` directory
- `yarn test:e2e` - runs all test files in `test/e2e` directory

## OTHER COMMANDS

- `raid-post:delete <id>` - deletes a raid post of given id (and all related entities)
- `user:delete <id>` - deleted an user of given id (and all related entities)

## TECHNOLOGIES USED

- TypeScript
- Express.js
- Routing Controllers
- TypeORM
- TypeDI
- Jest

## API

[Click here to check out API docs](docs/api.md)
