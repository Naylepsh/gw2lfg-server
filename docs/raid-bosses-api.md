# Raid Bosses API

## Find Raid Bosses

---

Returns json data about multiple raid bosses.

- **URL**

  /raid-bosses

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
          id: 1,
          name: "Vale Guardian",
          isCm: false,
        },
        {
          id: 2,
          name: "Spirit Woods",
          isCm: false,
        },
        {
          id: 3,
          name: "Gorseval the Multifarious",
          isCm: false,
        },
        {
          id: 4,
          name: "Sabetha the Saboteur",
          isCm: false,
        },
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
        {
          id: 9,
          name: "Keep Construct",
          isCm: false,
        },
        {
          id: 10,
          name: "Keep Construct",
          isCm: true,
        },
        {
          id: 11,
          name: "Twisted Castle",
          isCm: false,
        },
        {
          id: 12,
          name: "Xera",
          isCm: false,
        },
        {
          id: 13,
          name: "Cairn the Indomitable",
          isCm: false,
        },
        {
          id: 14,
          name: "Cairn the Indomitable",
          isCm: true,
        },
        {
          id: 15,
          name: "Mursaat Overseer",
          isCm: false,
        },
        {
          id: 16,
          name: "Mursaat Overseer",
          isCm: true,
        },
        {
          id: 17,
          name: "Samarog",
          isCm: false,
        },
        {
          id: 18,
          name: "Samarog",
          isCm: true,
        },
        {
          id: 19,
          name: "Deimos",
          isCm: false,
        },
        {
          id: 20,
          name: "Deimos",
          isCm: true,
        },
        {
          id: 21,
          name: "Soulless Horror",
          isCm: false,
        },
        {
          id: 22,
          name: "Soulless Horror",
          isCm: true,
        },
        {
          id: 23,
          name: "River of Souls",
          isCm: false,
        },
        {
          id: 24,
          name: "Statues of Grenth",
          isCm: false,
        },
        {
          id: 25,
          name: "Voice in the Void",
          isCm: false,
        },
        {
          id: 26,
          name: "Voice in the Void",
          isCm: true,
        },
        {
          id: 27,
          name: "Conjured Amalgamate",
          isCm: false,
        },
        {
          id: 28,
          name: "Conjured Amalgamate",
          isCm: true,
        },
        {
          id: 29,
          name: "Twin Largos",
          isCm: false,
        },
        {
          id: 30,
          name: "Twin Largos",
          isCm: true,
        },
        {
          id: 31,
          name: "Qadim",
          isCm: false,
        },
        {
          id: 32,
          name: "Qadim",
          isCm: true,
        },
        {
          id: 33,
          name: "Cardinal Sabir",
          isCm: false,
        },
        {
          id: 34,
          name: "Cardinal Sabir",
          isCm: true,
        },
        {
          id: 35,
          name: "Cardinal Adina",
          isCm: false,
        },
        {
          id: 36,
          name: "Cardinal Adina",
          isCm: true,
        },
        {
          id: 37,
          name: "Qadim the Peerless",
          isCm: false,
        },
        {
          id: 38,
          name: "Qadim the Peerless",
          isCm: true,
        },
      ],
    }
    ```

- **Error Response:**

  None

- **Sample Call:**

  ```javascript
  axios.get("/raid-bosses");
  ```
