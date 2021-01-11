# API

## Complex Types

API uses following complex types:

- rolePropsObject

  ```
  rolePropsObject {
    // required
    name: [string]
    class: [string]

    // optional
    description: [string]
  }
  ```

- requirementPropsObject

  ```
  requirementPropsObject {
    // required
    itemsProps: [itemPropsObject]
  }
  ```

- itemPropsObject
  ```
  itemPropsObject {
    // required
    name: [string]
    quantity: [integer]
  }
  ```

## Routes

- [Users](users-api.md)
- [Raid Posts](raid-posts-api.md)
