# Gw2lfg Server

Backend for gw2lfg service. Allows organisation of raid events with automated player requirements checking.

## PREREQUISITES

- `tsc 3.x` (tested on `3.9.7`)
- `node 12.x` (tested on `12.16.3`)
- `nodemon 2.x` (tested on `2.0.4`)
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
2. `yarn install` - installing dependencies
3. `yarn build` - build the app
4. `yarn start` - run the app

Server will be available at `localhost:<port-specified-in-env>`

## WORKING WITH DATABASE

- `yarn seed:bosses` - seeds the database with currently available raid bosses
- `yarn migration:generate <migration-name>` - generates a migration (migration has to be compiled with `yarn build` before it can be run!)
- `yarn migration:run` - runs a migration

## TESTING

The option of running all the tests at the same time was kind of buggy, thus it was temporary removed. It's recommended to run tests by layers (pick one of `unit`, `integr`, `e2e`). Currently the following tests commands are available:

- `yarn test:unit` - runs all test files in `test/unit` directory
- `yarn test:integr` - runs all test files in `test/integration` directory
- `yarn test:integr:controllers` - runs all test files in `test/integration/controllers` directory
- `yarn test:integr:services` - runs all test files in `test/integration/services` directory
- `yarn test:integr:typeorm` - runs all test files in `test/integration/typeorm` directory
- `yarn test:e2e` - runs all test files in `test/e2e` directory

## TECHNOLOGIES USED

- TypeScript
- Express.js
- Routing Controllers
- TypeORM
- TypeDI
- Jest

## API

### Users

#### Register

---

Registers an user. Returns created resource and associated jwt.

- **URL**

  /register

- **Method:**

  `POST`

- **URL Params**

  None

- **Data Params**

  **Required**:

  `username=[string]`

  `password=[string]`

  `apiKey=[string]`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    ```
    {
      data: {
        user: {
          id: 1,
          username: "sample-username",
          createdAt: "2021-01-09T08:21:15.128Z",
          updatedAt: "2021-01-09T08:21:15.128Z"
        },
        token: "my.jwt.token"
      }
    }
    ```

- **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    **Content:**
    ```
    {
      "name": "BadRequestError",
      "message": "Invalid body, check 'errors' property for more info.",
      "errors": [
        {
          "target": {
            "username": "u",
            "password": "p",
            "apiKey": "e"
          },
          "value": "u",
          "property": "username",
          "children": [],
          "constraints": {
            "minLength": "username must be longer than or equal to 6 characters"
          }
        },
        {
          "target": {
            "username": "u",
            "password": "p",
            "apiKey": "e"
          },
          "value": "p",
          "property": "password",
          "children": [],
          "constraints": {
            "minLength": "password must be longer than or equal to 6 characters"
          }
        },
        {
          "target": {
            "username": "u",
            "password": "p",
            "apiKey": "e"
          },
          "value": "e",
          "property": "apiKey",
          "children": [],
          "constraints": {
            "IsValidApiKeyConstraint": "Invalid API key"
          }
        }
      ]
    }
    ```

  OR

  - **Code:** 409 CONFLICT <br />
    **Content:**
    ```
    {
      "name": "ConflictError",
      "message": "Username already in use"
    }
    ```

- **Sample Call:**

  ```javascript
  axios.post("/register", {
    username: "username",
    password: "password",
    apiKey: "S0m3-V4L1D-GW2-API-K3Y",
  });
  ```

#### Login

---

Logins an user. Returns associated jwt.

- **URL**

  /login

- **Method:**

  `POST`

- **URL Params**

  None

- **Data Params**

  **Required**:

  `username=[string]`

  `password=[string]`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      data: {
        token: "my.jwt.token"
      }
    }
    ```

- **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    **Content:**
    ```
    {
      "name": "BadRequestError",
      "message": "Invalid body, check 'errors' property for more info.",
      "errors": [
        {
          "target": {
            "username": "u",
            "password": "p",
          },
          "value": "u",
          "property": "username",
          "children": [],
          "constraints": {
            "minLength": "username must be longer than or equal to 6 characters"
          }
        },
        {
          "target": {
            "username": "u",
            "password": "p",
          },
          "value": "p",
          "property": "password",
          "children": [],
          "constraints": {
            "minLength": "password must be longer than or equal to 6 characters"
          }
        }
      ]
    }
    ```

  OR

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      "name": "UnauthorizedError",
    }
    ```

- **Sample Call:**

  ```javascript
  axios.post("/login", {
    username: "username",
    password: "password",
  });
  ```

#### Me

Gets user info that's associated with given jwt.

- **URL**

  /me

- **Method:**

  `GET`

- **Additional Headers**

  **Required:**

  `gw2lfg-auth-token:[string]`

- **URL Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      "data": {
        "id": 2,
        "username": "username2",
        "createdAt": "2021-01-09T08:21:15.128Z",
        "updatedAt": "2021-01-09T08:21:15.128Z"
      }
    }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      "name": "AuthorizationRequiredError",
      "message": "Authorization is required for request on GET /me",
    }
    ```

- **Sample Call:**

  ```javascript
  axios.post(
    "/me",
    {
      username: "username",
      password: "password",
    },
    {
      headers: {
        "gw2lfg-auth-token": "my.jwt.token",
      },
    }
  );
  ```

#### Find User

#### Find User's Items

#### Find User's Raid Posts
