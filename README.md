# Refácil coding challenge

## Description

Events backend ticketing system in which a user can buy up to 4 tickets of any event and an admin can create, update and delete events.

## Requirements

- Node.js - Latest stable version.
- PostgreSQL.
- A user and password "postgres" on PostgreSQL and a database called "tickets".

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Endpoints

### `POST /auth/signup`

Admin signup. Password has to have a minimum of 10 characters, 3 symbols, 3 numbers, 2 uppercase and 2 lowercase

Body sample:

```json
{
  "username": "username",
  "password": "password"
}
```

### `POST /auth/signin`

Admin signin.

Body sample:

```json
{
  "username": "username",
  "password": "password"
}
```

### `POST /auth/signout`

Admin signout.

### `GET /buyers/:id`

Get buyer by id.

### `DELETE /buyers/:id`

Delete buyer by id. All tickets bought are set as NOT NULL.

### `GET /events`

Gets all created events.

### `GET /events/:id`

Gets a single event with all its available seats.

### `POST /events`

Creates an event. Rows are limited from 1 to 27, columns are limited from 1 to 35.

Body sample:

```json
{
  "name": "event name",
  "rows": 15,
  "columns": 10,
  "price": 400
}
```

### `POST /events/:id/buy`

Buy tickets for an event. Maximum 4 seats per buyer.

Body sample:

```json
{
 "id": "78340129340",
 "birthday": "1998-01-10",
 "seats": [
  {
   "row": "A",
   "column": 1
  },
  {
   "row": "A",
   "column": 2
  },
  {
   "row": "A",
   "column": 3
  },
  {
   "row": "A",
   "column": 4
  }
 ]
}
```

### `PATCH /events/:id`

Updates an event.

Body sample:

```json
{
  "name": "event name",
  "rows": 15,
  "columns": 10,
  "price": 400
}
```

### `DELETE /events/:id`

Deletes an event.

## Further work

- Pending authorization rules for admins.
- Dockerization.

## Contact

Alfredo Delgado Moreno - [LinkedIn](https://www.linkedin.com/in/alfredo-delgado-moreno/)
