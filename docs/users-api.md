# Users API

## Register

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
        token: "Bearer <my-token>"
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

## Login

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
        token: "Bearer <my-token>"
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

## Me

---

Returns json data about a user that's associated with given jwt.

- **URL**

  /me

- **Method:**

  `GET`

- **Additional Headers**

  **Required:**

  `Authentication:[string]`

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
      Authentication: "Bearer <my-token>",
    },
  });
  ```

## Find User

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

## Find User's Items

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

## Find User's Raid Posts

---

Returns json data about a single user's raid posts. Providing jwt will check whether user associated with it can join their raids

- **URL**

  /user/:id/raid-posts

- **Method:**

  `GET`

- **Additional Headers**

  **Optional:**

  `Authentication:[string]`

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
  axios.get("/users/2/raid-posts", {
    headers: {
      Authentication: "Bearer <my-token>",
    },
  });
  ```

## Find User's Weekly Raid Clear

---

Returns json data about a single user's weekly raid clear status

- **URL**

  /user/:id/raid-clear

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
      data: ["Vale Guardian", "Cairn", "Mursaat Overseer", "Samarog"],
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
  axios.get("/users/2/raid-clear");
  ```
