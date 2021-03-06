# Raid Posts API

## Find Raid Posts

---

Returns json data about multiple raid posts.

- **URL**

  /raid-posts

- **Method:**

  `GET`

- **Additional Headers**

  None

- **URL Params**

  **Optional:**

  `skip:[non-negative-integer]`

  `take:[positive-integer]`

  `minDate:[date-string]`

  `server:[string]`

  `bossesIds:[string-of-integers-separated-by-commas]`

  `authorId:[integer]`

  `authorName:[string]`

  `roleName:[string]`

  `roleClass:[string]`

  `joinRequestId:[integer]`

  `joinRequestStatus:[string]`

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
            {
              id: 2,
              name: "Gorseval",
              isCm: false,
            },
            {
              id: 3,
              name: "Sabetha",
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
  const queryParams = [
    "skip=1",
    "take=1",
    "authorId=1",
    "authorName=username1",
    "bossesIds=1,2,3",
    "roleName=dps",
    "roleClass=scrapper",
  ];
  axios.get(`/raid-posts?${queryParams.join("&")}`);
  ```

## Create Raid Post

---

Creates new raid post.
Returns json data about created resource.

- **URL**

  /raid-posts

- **Method:**

  `POST`

- **Additional Headers**

  **Required:**

  `Authentication: [string]`

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
  axios.post(
    "/raid-posts",
    {
      date: "2021-01-05T17:53:38.545Z",
      server: "EU",
      description: "bring pots and food",
      bossesIds: [1, 2, 3],
      rolesProps: [
        {
          name: "dps",
          class: "warrior",
        },
      ],
      requirementsProps: {
        itemsProps: [
          {
            name: "Legendary Insight",
            quantity: 10,
          },
        ],
      },
    },
    {
      headers: {
        "Authentication": "Bearer <my-token>",
      },
    }
  );
  ```

## Find Raid Post

---

Returns json data about single raid post.

- **URL**

  /raid-posts/:id

- **Method:**

  `GET`

- **Additional Headers**

  None

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
  axios.get("/raid-posts?skip=1&take=1");
  ```

## Update Raid Post

---

Updates a single raid post.
Returns json data about updated resource.

- **URL**

  /raid-posts

- **Method:**

  `PUT`

- **Additional Headers**

  **Required:**

  `Authentication: [string]`

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
  axios.put(
    "/raid-posts",
    {
      date: "2021-01-05T17:53:38.545Z",
      server: "EU",
      description: "bring pots and food",
      bossesIds: [1, 2, 3],
      rolesProps: [
        {
          name: "dps",
          class: "warrior",
        },
      ],
      requirementsProps: {
        itemsProps: [
          {
            name: "Legendary Insight",
            quantity: 10,
          },
        ],
      },
    },
    {
      headers: {
        "Authentication": "Bearer <my-token>",
      },
    }
  );
  ```

## Delete Raid Post

---

Deletes a single raid post.

- **URL**

  /raid-posts/:id

- **Method:**

  `DELETE`

- **Additional Headers**

  **Required:**

  `Authentication: [string]`

- **URL Params**

  **Required:**

  `id:[positive-integer]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 204 <br />
    **Content:**

    ```

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
    headers: {
      "Authentication": "Bearer <my-token>",
    },
  });
  ```
