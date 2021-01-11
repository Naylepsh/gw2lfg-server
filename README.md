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

API uses following complex types:

```
rolePropsObject {
  // required
  name: [string]
  class: [string]

  // optional
  description: [string]
}

requirementPropsObject {
  // required
  itemsProps: [itemPropsObject]
}

itemPropsObject {
  // required
  name: [string]
  quantity: [integer]
}
```

### Users

#### Register

---

Registers an user. Returns json data about created resource and associated jwt.

- **URL**

  /register

- **Method:**

  `POST`

- **Additional Headers**

  None

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
      name: "BadRequestError",
      message: "Invalid body, check 'errors' property for more info.",
      errors: [
        {
          target: {
            username: "u",
            password: "p",
            apiKey: "e",
          },
          value: "u",
          property: "username",
          children: [],
          constraints: {
            minLength: "username must be longer than or equal to 6 characters",
          },
        },
        {
          target: {
            username: "u",
            password: "p",
            apiKey: "e",
          },
          value: "p",
          property: "password",
          children: [],
          constraints: {
            minLength: "password must be longer than or equal to 6 characters",
          },
        },
        {
          target: {
            username: "u",
            password: "p",
            apiKey: "e",
          },
          value: "e",
          property: "apiKey",
          children: [],
          constraints: {
            IsValidApiKeyConstraint: "Invalid API key",
          },
        },
      ],
    }
    ```

  OR

  - **Code:** 409 CONFLICT <br />
    **Content:**
    ```
    {
      name: "ConflictError",
      message: "Username already in use"
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

Logins an user. Returns json data with associated jwt.

- **URL**

  /login

- **Method:**

  `POST`

- **Additional Headers**

  None

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
      name: "BadRequestError",
      message: "Invalid body, check 'errors' property for more info.",
      errors: [
        {
          target: {
            username: "u",
            password: "p",
          },
          value: "u",
          property: "username",
          children: [],
          constraints: {
            minLength: "username must be longer than or equal to 6 characters",
          },
        },
        {
          target: {
            username: "u",
            password: "p",
          },
          value: "p",
          property: "password",
          children: [],
          constraints: {
            minLength: "password must be longer than or equal to 6 characters",
          },
        },
      ],
    }
    ```

  OR

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      name: "UnauthorizedError",
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

---

Returns json data about a user that's associated with given jwt.

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
      data: {
        id: 2,
        username: "username2",
        createdAt: "2021-01-09T08:21:15.128Z",
        updatedAt: "2021-01-09T08:21:15.128Z"
      }
    }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      name: "AuthorizationRequiredError",
      message: "Authorization is required for request on GET /me",
    }
    ```

- **Sample Call:**

  ```javascript
  axios.get("/me", {
    headers: {
      "gw2lfg-auth-token": "my.jwt.token",
    },
  });
  ```

#### Find User

---

Returns json data about a single user

- **URL**

  /user/:id

- **Method:**

  `GET`

- **Additional Headers**

  None

- **URL Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      data: {
        user: {
          id: 2,
          username: "username2",
          createdAt: "2021-01-09T08:21:15.128Z",
          updatedAt: "2021-01-09T08:21:15.128Z",
        },
        account: {
          name: "username2acc.1234",
        },
      },
    }
    ```

- **Error Response:**

  - **Code:** 404 NOT FOUND <br />
    **Content:**
    ```
    {
      name: "NotFoundError"
    }
    ```

- **Sample Call:**

  ```javascript
  axios.get("/users/2");
  ```

#### Find User's Items

---

Returns json data about a single user's items

- **URL**

  /user/:id/items

- **Method:**

  `GET`

- **Additional Headers**

  None

- **URL Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      data: [
        {
          name: "Legendary Insight",
          quantity: 782,
        },
        {
          name: "Legendary Divination",
          quantity: 163,
        },
        {
          name: "Vale Guardian Fragment",
          quantity: 0,
        },
        {
          name: "Gorseval Tentacle Piece",
          quantity: 0,
        },
        {
          name: "Sabetha Flamethrower Fragment Piece",
          quantity: 154,
        },
        {
          name: "Slothasor Mushroom",
          quantity: 0,
        },
        {
          name: "White Mantle Abomination Crystal",
          quantity: 141,
        },
        {
          name: "Turret Fragment",
          quantity: 4,
        },
        {
          name: "Keep Construct Rubble",
          quantity: 0,
        },
        {
          name: "Ribbon Scrap",
          quantity: 98,
        },
        {
          name: "Cairn Fragment",
          quantity: 6,
        },
        {
          name: "Recreation Room Floor Fragment",
          quantity: 1,
        },
        {
          name: "Impaled Prisoner Token",
          quantity: 0,
        },
        {
          name: "Fragment of Saul's Burden",
          quantity: 110,
        },
        {
          name: "Desmina's Token",
          quantity: 70,
        },
        {
          name: "Dhuum's Token",
          quantity: 18,
        },
        {
          name: "Conjured Amalgamate Token",
          quantity: 75,
        },
        {
          name: "Twin Largos Token",
          quantity: 60,
        },
        {
          name: "Qadim's Token",
          quantity: 14,
        },
        {
          name: "Cardinal Sabir's Token",
          quantity: 48,
        },
        {
          name: "Cardinal Adina's Token",
          quantity: 63,
        },
        {
          name: "Ether Djinn's Token",
          quantity: 27,
        },
      ],
    }
    ```

- **Error Response:**

  - **Code:** 404 NOT FOUND <br />
    **Content:**
    ```
    {
      name: "NotFoundError"
    }
    ```

- **Sample Call:**

  ```javascript
  axios.get("/users/2/items");
  ```

#### Find User's Raid Posts

---

Returns json data about a single user's raid posts. Providing jwt will check whether user associated with it can join their raids

- **URL**

  /user/:id/raid-posts

- **Method:**

  `GET`

- **Additional Headers**

  **Optional:**

  `gw2lfg-auth-token:[string]`

- **URL Params**

  **Optional:**

  `skip=[non-negative-number]`

  `take=[positive-number]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      data: [
        {
          id: 6,
          date: "2021-01-22T08:24:00.000Z",
          server: "EU",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus viverra, lacus quis sodales varius, erat ligula vehicula quam, nec aliquam metus dolor in nulla. Ut massa erat, sodales in venenatis eu, molestie a nunc. Etiam sit amet lacus id lacus posuere facilisis. Quisque at velit sed nulla gravida tempus. Proin ut varius sa",
          createdAt: "2021-01-09T08:24:36.334Z",
          updatedAt: "2021-01-09T08:24:36.334Z",
          bosses: [
            {
              id: 5,
              name: "Slothasor",
              isCm: false,
            },
            {
              id: 6,
              name: "Prison Camp",
              isCm: false,
            },
            {
              id: 7,
              name: "Matthias Gabrel",
              isCm: false,
            },
            {
              id: 8,
              name: "Siege the Stronghold",
              isCm: false,
            },
          ],
          roles: [
            {
              id: 24,
              name: "any",
              class: "revenant",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus viverra, lacus quis sodales varius, erat ligula vehicula quam, nec aliquam metus dolor in nulla. Ut massa erat, sodales in venenatis eu, molestie a nunc. Etiam sit amet lacus id lacus posuere facilisis. Quisque at velit sed nulla gravida tempus. Proin ut varius sa",
              createdAt: "2021-01-09T08:24:36.334Z",
              updatedAt: "2021-01-09T08:24:36.334Z",
            },
            {
              id: 22,
              name: "any",
              class: "scourge",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus viverra, lacus quis sodales varius, erat ligula vehicula quam, nec aliquam metus dolor in nulla. Ut massa erat, sodales in venenatis eu, molestie a nunc. Etiam sit amet lacus id lacus posuere facilisis. Quisque at velit sed nulla gravida tempus. Proin ut varius sa",
              createdAt: "2021-01-09T08:24:36.334Z",
              updatedAt: "2021-01-09T08:24:36.334Z",
            },
            {
              id: 23,
              name: "any",
              class: "druid",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus viverra, lacus quis sodales varius, erat ligula vehicula quam, nec aliquam metus dolor in nulla. Ut massa erat, sodales in venenatis eu, molestie a nunc. Etiam sit amet lacus id lacus posuere facilisis. Quisque at velit sed nulla gravida tempus. Proin ut varius sa",
              createdAt: "2021-01-09T08:24:36.334Z",
              updatedAt: "2021-01-09T08:24:36.334Z",
            },
          ],
          userMeetsRequirements: false,
          author: {
            id: 2,
            username: "username2",
            createdAt: "2021-01-09T08:21:15.128Z",
            updatedAt: "2021-01-09T08:21:15.128Z",
          },
          requirements: {
            items: [
              {
                id: 9,
                name: "Legendary Insight",
                createdAt: "2021-01-09T08:24:36.334Z",
                updatedAt: "2021-01-09T08:24:36.334Z",
                quantity: 200,
              },
              {
                id: 10,
                name: "Slothasor Mushroom",
                createdAt: "2021-01-09T08:24:36.334Z",
                updatedAt: "2021-01-09T08:24:36.334Z",
                quantity: 40,
              },
              {
                id: 11,
                name: "White Mantle Abomination Crystal",
                createdAt: "2021-01-09T08:24:36.334Z",
                updatedAt: "2021-01-09T08:24:36.334Z",
                quantity: 40,
              },
            ],
          },
        },
      ],
      hasMore: false,
    };
    ```

- **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    **Content:**
    ```
    {
      name: "BadRequestError",
      message: "Invalid queries, check 'errors' property for more info.",
      errors: [
        {
          target: {
            take: -1,
            skip: -1,
          },
          value: -1,
          property: "take",
          children: [],
          constraints: {
            isPositive: "take must be a positive number",
          },
        },
        {
          target: {
            take: -1,
            skip: -1,
          },
          value: -1,
          property: "skip",
          children: [],
          constraints: {
            min: "skip must not be less than 0",
          },
        },
      ],
      paramName: "",
    }
    ```

- **Sample Call:**

  ```javascript
  axios.get("/users/2/raid-posts");
  ```

### Raid Posts

#### Find Raid Posts

---

Returns json data about multiple raid posts.
Providing auth token will check whether a user with associated token can join those raids.

- **URL**

  /raid-posts

- **Method:**

  `GET`

- **Additional Headers**

  **Optional:**

  `gw2lfg-auth-token: [string]`

- **URL Params**

  **Optional:**

  `skip:[non-negative-integer]`

  `take:[positive-integer]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      data: [
        {
          id: 2,
          date: "2021-01-11T17:53:00.000Z",
          server: "NA",
          description: "second post",
          createdAt: "2021-01-05T17:53:38.545Z",
          updatedAt: "2021-01-05T17:53:38.545Z",
          bosses: [
            {
              id: 1,
              name: "Vale Guardian",
              isCm: false,
            },
          ],
          roles: [
            {
              id: 4,
              name: "any",
              class: "scrapper",
              description: null,
              createdAt: "2021-01-05T17:53:38.545Z",
              updatedAt: "2021-01-05T17:53:38.545Z",
            },
          ],
          userMeetsRequirements: false,
          author: {
            id: 1,
            username: "username1",
            createdAt: "2021-01-05T17:45:48.618Z",
            updatedAt: "2021-01-05T17:45:48.618Z",
          },
          requirements: {
            items: [
              {
                id: 2,
                name: "Legendary Insight",
                createdAt: "2021-01-05T17:53:38.545Z",
                updatedAt: "2021-01-05T17:53:38.545Z",
                quantity: 4,
              },
            ],
          },
        },
      ],
      hasMore: true,
    }
    ```

- **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    **Content:**
    ```
    {
      name: "BadRequestError",
      message: "Invalid queries, check 'errors' property for more info.",
      errors: [
        {
          target: {
            take: -1,
            skip: -1,
          },
          value: -1,
          property: "take",
          children: [],
          constraints: {
            isPositive: "take must be a positive number",
          },
        },
        {
          target: {
            take: -1,
            skip: -1,
          },
          value: -1,
          property: "skip",
          children: [],
          constraints: {
            min: "skip must not be less than 0",
          },
        },
      ],
      paramName: "",
    }
    ```

- **Sample Call:**

  ```javascript
  axios.get("/raid-posts?skip=1&take=1", {
    apiKey: "S0m3-V4L1D-GW2-API-K3Y",
  });
  ```

#### Create Raid Post

---

Creates new raid post.
Returns json data about created resource.

- **URL**

  /raid-posts

- **Method:**

  `POST`

- **Additional Headers**

  **Required:**

  `gw2lfg-auth-token: [string]`

- **URL Params**

  None

- **Data Params**

  **Required:**

  `date: [date-string]`
  `server: [string]`
  `bossesIds: [array[positive-integer]]`

  **Optional:**

  `description: [string]`
  `rolesProps: [array[rolePropsObject]]`
  `requirementsProps: [array[requirementPropsObject]]`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    ```
    {
      data: {
        id: 2,
        date: "2021-01-11T17:53:00.000Z",
        server: "NA",
        description: "second post",
        createdAt: "2021-01-05T17:53:38.545Z",
        updatedAt: "2021-01-05T17:53:38.545Z",
        bosses: [
          {
            id: 1,
            name: "Vale Guardian",
            isCm: false,
          },
        ],
        roles: [
          {
            id: 4,
            name: "any",
            class: "scrapper",
            description: null,
            createdAt: "2021-01-05T17:53:38.545Z",
            updatedAt: "2021-01-05T17:53:38.545Z",
          },
        ],
        author: {
          id: 1,
          username: "username1",
          createdAt: "2021-01-05T17:45:48.618Z",
          updatedAt: "2021-01-05T17:45:48.618Z",
        },
        requirements: {
          items: [
            {
              id: 2,
              name: "Legendary Insight",
              createdAt: "2021-01-05T17:53:38.545Z",
              updatedAt: "2021-01-05T17:53:38.545Z",
              quantity: 4,
            },
          ],
        },
      }
    }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      name: "AuthorizationRequiredError",
      message: "Authorization is required for request on POST /raid-posts",
    }
    ```

  OR

  - **Code:** 400 BAD REQUEST <br />
    **Content:**
    ```
    {
      name: "BadRequestError",
      message: "Invalid body, check 'errors' property for more info.",
      errors: [
        {
          target: {
            rolesProps: [],
            requirementsProps: {
              itemsProps: [],
            },
          },
          property: "date",
          children: [],
          constraints: {
            isDateString: "date must be a ISOString",
          },
        },
        {
          target: {
            rolesProps: [],
            requirementsProps: {
              itemsProps: [],
            },
          },
          property: "bossesIds",
          children: [],
          constraints: {
            isInt: "each value in bossesIds must be an integer number",
          },
        },
      ],
    }
    ```

- **Sample Call:**

  ```javascript
  axios.post("/raid-posts", {
    date: "2021-01-05T17:53:38.545Z",
    server: "EU",
    description: "bring pots and food",
    bossesIds: [1,2,3],
    rolesProps: [{
      name: 'dps',
      class: 'warrior'
    }],
    requirementsProps: {
      itemsProps: [{
        name: 'Legendary Insight',
        quantity: 10
      }]
    }
  } {
    apiKey: "S0m3-V4L1D-GW2-API-K3Y",
  });
  ```

#### Find Raid Post

---

Returns json data about single raid post.
Providing auth token will check whether a user with associated token can join that raid.

- **URL**

  /raid-posts/:id

- **Method:**

  `GET`

- **Additional Headers**

  **Optional:**

  `gw2lfg-auth-token: [string]`

- **URL Params**

  **Required:**

  `id:[positive-integer]`

  **Optional:**

  `skip:[non-negative-integer]`

  `take:[positive-integer]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      data: {
        id: 2,
        date: "2021-01-11T17:53:00.000Z",
        server: "NA",
        description: "second post",
        createdAt: "2021-01-05T17:53:38.545Z",
        updatedAt: "2021-01-05T17:53:38.545Z",
        bosses: [
          {
            id: 1,
            name: "Vale Guardian",
            isCm: false,
          },
        ],
        roles: [
          {
            id: 4,
            name: "any",
            class: "scrapper",
            description: null,
            createdAt: "2021-01-05T17:53:38.545Z",
            updatedAt: "2021-01-05T17:53:38.545Z",
          },
        ],
        userMeetsRequirements: false,
        author: {
          id: 1,
          username: "username1",
          createdAt: "2021-01-05T17:45:48.618Z",
          updatedAt: "2021-01-05T17:45:48.618Z",
        },
        requirements: {
          items: [
            {
              id: 2,
              name: "Legendary Insight",
              createdAt: "2021-01-05T17:53:38.545Z",
              updatedAt: "2021-01-05T17:53:38.545Z",
              quantity: 4,
            },
          ],
        },
      }
    }
    ```

- **Error Response:**

  - **Code:** 404 NOT FOUND <br />
    **Content:**
    ```
    {
      name: "NotFoundError",
    }
    ```

- **Sample Call:**

  ```javascript
  axios.get("/raid-posts?skip=1&take=1", {
    apiKey: "S0m3-V4L1D-GW2-API-K3Y",
  });
  ```

#### Update Raid Post

---

Updates a single raid post.
Returns json data about updated resource.

- **URL**

  /raid-posts

- **Method:**

  `PUT`

- **Additional Headers**

  **Required:**

  `gw2lfg-auth-token: [string]`

- **URL Params**

  **Required:**

  `id:[positive-integer]`

- **Data Params**

  **Required:**

  `date: [date-string]`
  `server: [string]`
  `bossesIds: [array[positive-integer]]`

  **Optional:**

  `description: [string]`
  `rolesProps: [array[rolePropsObject]]`
  `requirementsProps: [array[requirementPropsObject]]`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      data: {
        id: 2,
        date: "2021-01-11T17:53:00.000Z",
        server: "NA",
        description: "second post",
        createdAt: "2021-01-05T17:53:38.545Z",
        updatedAt: "2021-01-05T17:53:38.545Z",
        bosses: [
          {
            id: 1,
            name: "Vale Guardian",
            isCm: false,
          },
        ],
        roles: [
          {
            id: 4,
            name: "any",
            class: "scrapper",
            description: null,
            createdAt: "2021-01-05T17:53:38.545Z",
            updatedAt: "2021-01-05T17:53:38.545Z",
          },
        ],
        author: {
          id: 1,
          username: "username1",
          createdAt: "2021-01-05T17:45:48.618Z",
          updatedAt: "2021-01-05T17:45:48.618Z",
        },
        requirements: {
          items: [
            {
              id: 2,
              name: "Legendary Insight",
              createdAt: "2021-01-05T17:53:38.545Z",
              updatedAt: "2021-01-05T17:53:38.545Z",
              quantity: 4,
            },
          ],
        },
      }
    }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      name: "AuthorizationRequiredError",
      message: "Authorization is required for request on PUT /raid-posts/2",
    }
    ```

  OR

  - **Code:** 400 BAD REQUEST <br />
    **Content:**
    ```
    {
      name: "BadRequestError",
      message: "Invalid body, check 'errors' property for more info.",
      errors: [
        {
          target: {
            rolesProps: [],
            requirementsProps: {
              itemsProps: [],
            },
          },
          property: "date",
          children: [],
          constraints: {
            isDateString: "date must be a ISOString",
          },
        },
        {
          target: {
            rolesProps: [],
            requirementsProps: {
              itemsProps: [],
            },
          },
          property: "bossesIds",
          children: [],
          constraints: {
            isInt: "each value in bossesIds must be an integer number",
          },
        },
      ],
    }
    ```

  OR

  - **Code:** 403 FORBIDDEN <br />
    **Content:**
    ```
    {
      name: "ForbiddenError",
    }
    ```

- **Sample Call:**

  ```javascript
  axios.put("/raid-posts", {
    date: "2021-01-05T17:53:38.545Z",
    server: "EU",
    description: "bring pots and food",
    bossesIds: [1,2,3],
    rolesProps: [{
      name: 'dps',
      class: 'warrior'
    }],
    requirementsProps: {
      itemsProps: [{
        name: 'Legendary Insight',
        quantity: 10
      }]
    }
  } {
    apiKey: "S0m3-V4L1D-GW2-API-K3Y",
  });
  ```

#### Delete Raid Post

---

Deletes a single raid post.

- **URL**

  /raid-posts/:id

- **Method:**

  `DELETE`

- **Additional Headers**

  **Required:**

  `gw2lfg-auth-token: [string]`

- **URL Params**

  **Required:**

  `id:[positive-integer]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 204 <br />
    **Content:**
    ```
    {}
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      name: "AuthorizationRequiredError",
      message: "Authorization is required for request on DELETE /raid-posts/2",
    }
    ```

  OR

  - **Code:** 403 FORBIDDEN <br />
    **Content:**
    ```
    {
      name: "ForbiddenError",
    }
    ```

- **Sample Call:**

  ```javascript
  axios.delete("/raid-posts", {
    apiKey: "S0m3-V4L1D-GW2-API-K3Y",
  });
  ```
