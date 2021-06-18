# Notifications API

## Find Notifications

---

Returns json data about multiple notifications.

- **URL**

  /notifications

- **Method:**

  `GET`

- **Additional Headers**

  None

- **URL Params**

  `recipent:[string]`

  **Optional:**

  `skip: [positive-integer]`

  `take: [positive-integer]`

  `ids:[string-of-integers-separated-by-commas]`

  `seen:[boolean-string]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
    "data": [
        {
            "id": 96,
            "recipent": "username1",
            "text": "User#1 canceled their request to join your post#47",
            "seen": false,
            "createdAt": "2021-06-18T17:31:01.542Z",
            "updatedAt": "2021-06-18T17:31:01.542Z"
        },
        {
            "id": 92,
            "recipent": "username1",
            "text": "user#1 left your post#47",
            "seen": false,
            "createdAt": "2021-06-18T17:30:13.595Z",
            "updatedAt": "2021-06-18T17:30:13.595Z"
        },
        {
            "id": 91,
            "recipent": "username1",
            "text": "User#1 wants to join your post#38",
            "seen": false,
            "createdAt": "2021-06-18T17:25:41.798Z",
            "updatedAt": "2021-06-18T17:25:41.798Z"
        },
    ],
      "hasMore": false
    }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**

    ```
    {
        "name": "AuthorizationRequiredError",
        "message": "Authorization is required for request on GET /notifications?seen=maybe",
    }
    ```

  - **Code:** 400 BAD REQUEST <br />
    **Content:**
    ```
    {
        "name": "BadRequestError",
        "message": "Invalid queries, check 'errors' property for more info.",
        "errors": [
            {
                "target": {
                    "take": 10,
                    "skip": 0,
                    "seen": "maybe"
                },
                "value": "maybe",
                "property": "seen",
                "children": [],
                "constraints": {
                    "isBooleanString": "seen must be a boolean string"
                }
            }
        ],
        "paramName": ""
    }
    ```

- **Sample Call:**

  ```javascript
  axios.get("/notifications?recipent=username1",
    headers: {
      "Authentication": "Bearer <my-token>",
    },
  );
  ```

## Find Notification

---

Returns json data about single notification.

- **URL**

  /notification/:id

- **Method:**

  `GET`

- **Additional Headers**

  None

- **URL Params**

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
        "data": {
            "id": 97,
            "recipent": "username1",
            "text": "You've canceled your join request to the post#47",
            "seen": false,
            "createdAt": "2021-06-18T17:31:01.579Z",
            "updatedAt": "2021-06-18T17:31:01.579Z"
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
  axios.get("/notifications/11");
  ```

## Update Notification

---

Updates the seen status of a single join request.
Returns json data about updated resource.
User has to be the recipent of the notification.

- **URL**

  /notification/:id

- **Method:**

  `PATCH`

- **Additional Headers**

  **Required:**

  `Authentication: [string]`

- **URL Params**

  **Required:**

- **Data Params**

  **Required:**

  `seen: [boolean-string]`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
        "data": {
            "id": 97,
            "recipent": "username1",
            "text": "You've canceled your join request to the post#47",
            "seen": false,
            "createdAt": "2021-06-18T17:31:01.579Z",
            "updatedAt": "2021-06-18T17:31:01.579Z"
        }
    }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```
    {
      name: "AuthorizationRequiredError",
      message: "Authorization is required for request on PATCH /notifications/1",
    }
    ```

  OR

  - **Code:** 400 BAD REQUEST <br />
    **Content:**
    ```
    {
        "name": "BadRequestError",
        "message": "Invalid body, check 'errors' property for more info.",
        "errors": [
            {
                "target": {
                    "seen": "maybe"
                },
                "value": "maybe",
                "property": "seen",
                "children": [],
                "constraints": {
                    "isBoolean": "seen must be a boolean value"
                }
            }
        ]
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
  axios.patch(
    "/notifications/1",
    {
      seen: "true",
    },
    {
      headers: {
        Authorization: "Bearer <my-token>",
      },
    }
  );
  ```

## Delete Raid Post

---

Deletes a single notification.
User has to be the recipent of the notifiation.

- **URL**

  /notification/:id

- **Method:**

  `DELETE`

- **Additional Headers**

  **Required:**

  `Authentication: [string]`

- **URL Params**

  None

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
      message: "Authorization is required for request on DELETE /notifications/1",
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
  axios.delete("/notifications/1", {
    headers: {
      Authentication: "Bearer <my-token>",
    },
  });
  ```
