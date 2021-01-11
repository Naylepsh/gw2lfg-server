# Join Requests API

## Find Join Requests

---

Returns json data about multiple join requests.

- **URL**

  /join-requests

- **Method:**

  `GET`

- **Additional Headers**

  None

- **URL Params**

  **Optional:**

  `userId: [positive-integer]`

  `postId: [positive-integer]`

  `roleId: [positive-integer]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      data: [
        {
          id: 1,
          status: "PENDING",
          createdAt: "2021-01-05T20:07:39.764Z",
          updatedAt: "2021-01-05T20:07:39.764Z",
          post: {
            id: 3,
            date: "2021-01-13T18:15:00.000Z",
            server: "EU",
            description: "third post",
            createdAt: "2021-01-05T18:15:33.290Z",
            updatedAt: "2021-01-05T18:15:33.290Z",
          },
          role: {
            id: 9,
            name: "dps",
            class: "any",
            description: null,
            createdAt: "2021-01-05T18:15:33.290Z",
            updatedAt: "2021-01-05T18:15:33.290Z",
          },
          user: {
            id: 1,
            username: "username1",
            createdAt: "2021-01-05T17:45:48.618Z",
            updatedAt: "2021-01-05T17:45:48.618Z",
          },
        },
      ],
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
            userId: -1,
            roleId: -1,
            postId: -1,
          },
          value: -1,
          property: "userId",
          children: [],
          constraints: {
            isPositive: "userId must be a positive number",
          },
        },
        {
          target: {
            userId: -1,
            roleId: -1,
            postId: -1,
          },
          value: -1,
          property: "postId",
          children: [],
          constraints: {
            isPositive: "postId must be a positive number",
          },
        },
        {
          target: {
            userId: -1,
            roleId: -1,
            postId: -1,
          },
          value: -1,
          property: "roleId",
          children: [],
          constraints: {
            isPositive: "roleId must be a positive number",
          },
        },
      ],
      paramName: "",
    }
    ```

- **Sample Call:**

  ```javascript
  axios.get("/join-requests?userId=1&postId=3&roleId=9");
  ```

## Create Join Request

---

Creates a new join request.
Returns json data about created resource.

- **URL**

  /join-requests

- **Method:**

  `POST`

- **Additional Headers**

  **Required:**

  `gw2lfg-auth-token: [string]`

- **URL Params**

  None

- **Data Params**

  **Required:**

  `postId: [positive-integer]`

  `roleId: [positive-integer]`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    ```
    {
      data: {
        post: {
          id: 2,
          date: "2021-01-11T17:53:00.000Z",
          server: "NA",
          description: "second post",
          createdAt: "2021-01-05T17:53:38.545Z",
          updatedAt: "2021-01-05T17:53:38.545Z",
          roles: [
            {
              id: 8,
              name: "any",
              class: "scrapper",
              description: null,
              createdAt: "2021-01-05T17:53:38.545Z",
              updatedAt: "2021-01-05T17:53:38.545Z",
            },
          ],
          requirements: [
            {
              id: 2,
              name: "Legendary Insight",
              createdAt: "2021-01-05T17:53:38.545Z",
              updatedAt: "2021-01-05T17:53:38.545Z",
              quantity: 4,
            },
          ],
        },
        role: {
          id: 8,
          name: "any",
          class: "renegade",
          description: null,
          createdAt: "2021-01-05T17:53:38.545Z",
          updatedAt: "2021-01-05T17:53:38.545Z",
        },
        status: "PENDING",
        id: 16,
        createdAt: "2021-01-11T16:42:29.402Z",
        updatedAt: "2021-01-11T16:42:29.402Z",
        user: {
          id: 2,
          username: "username2",
          createdAt: "2021-01-09T08:21:15.128Z",
          updatedAt: "2021-01-09T08:21:15.128Z",
        },
      },
    }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      name: "AuthorizationRequiredError",
      message: "Authorization is required for request on POST /join-requests",
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
            postId: -2,
            roleId: -8,
          },
          value: -2,
          property: "postId",
          children: [],
          constraints: {
            isPositive: "postId must be a positive number",
          },
        },
        {
          target: {
            postId: -2,
            roleId: -8,
          },
          value: -8,
          property: "roleId",
          children: [],
          constraints: {
            isPositive: "roleId must be a positive number",
          },
        },
      ],
    }
    ```

  OR

  - **Code:** 404 NOT FOUND <br />
    **Content:**
    ```
    {
      name: "NotFoundError",
      message: "Post not found",
    }
    ```

- **Sample Call:**

  ```javascript
  axios.post(
    "/join-requests",
    {
      postId: 1,
      roleId: 1,
    },
    {
      headers: {
        "gw2lfg-auth-token": "my.jwt.token",
      },
    }
  );
  ```

## Find Join Request

---

Returns json data about single join request.

- **URL**

  /raid-posts/:id

- **Method:**

  `GET`

- **Additional Headers**

  None

- **URL Params**

  **Required:**

  `id:[positive-integer]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      data: {
        id: 11,
        status: "ACCEPTED",
        createdAt: "2021-01-10T09:49:01.967Z",
        updatedAt: "2021-01-10T09:49:14.481Z",
        post: {
          id: 4,
          date: "2021-01-22T15:20:00.000Z",
          server: "NA",
          description: "",
          createdAt: "2021-01-07T20:38:54.529Z",
          updatedAt: "2021-01-07T20:38:54.529Z",
        },
        role: {
          id: 16,
          name: "any",
          class: "scourge",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque auctor odio ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam accumsan fringilla nisi ac interdum.",
          createdAt: "2021-01-07T20:38:54.529Z",
          updatedAt: "2021-01-07T20:38:54.529Z",
        },
        user: {
          id: 2,
          username: "username2",
          createdAt: "2021-01-09T08:21:15.128Z",
          updatedAt: "2021-01-09T08:21:15.128Z",
        },
      },
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
  axios.get("/join-requests/11");
  ```

## Update Join Request

---

Updates the status of a single join request.
Returns json data about updated resource.
User has to be the author of the post that the join-request points.

- **URL**

  /join-requests/:id

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

  `status: [string]`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      data: {
        id: 1,
        status: "ACCEPTED",
        createdAt: "2021-01-05T20:07:39.764Z",
        updatedAt: "2021-01-11T17:09:21.497Z",
        post: {
          id: 3,
          date: "2021-01-13T18:15:00.000Z",
          server: "EU",
          description: "third post",
          createdAt: "2021-01-05T18:15:33.290Z",
          updatedAt: "2021-01-05T18:15:33.290Z",
        },
        role: {
          id: 9,
          name: "dps",
          class: "any",
          description: null,
          createdAt: "2021-01-05T18:15:33.290Z",
          updatedAt: "2021-01-05T18:15:33.290Z",
        },
        user: {
          id: 1,
          username: "username1",
          createdAt: "2021-01-05T17:45:48.618Z",
          updatedAt: "2021-01-05T17:45:48.618Z",
        },
      },
    }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      name: "AuthorizationRequiredError",
      message: "Authorization is required for request on PUT /join-requests/1",
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
            status: "kapuczina",
          },
          value: "kapuczina",
          property: "status",
          children: [],
          constraints: {
            IsValidJoinRequestStatusConstraint: "Invalid Join Request status",
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
    "/join-requests/1",
    {
      status: "ACCEPTED",
    },
    {
      headers: {
        "gw2lfg-auth-token": "my.jwt.token",
      },
    }
  );
  ```

## Delete Raid Post

---

Deletes a single join request.
User has to be either join request author (cancels their own request) or the author of the post that the join request points to (declines the request).

- **URL**

  /join-requests/:id

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

    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      name: "AuthorizationRequiredError",
      message: "Authorization is required for request on DELETE /join-requests/1",
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
  axios.delete("/join-requests/1", {
    headers: {
      "gw2lfg-auth-token": "my.jwt.token",
    },
  });
  ```
