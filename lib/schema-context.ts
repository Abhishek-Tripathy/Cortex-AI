export function getSchemaContext(): string {
  // Detailed schema context for accurate SQL generation
  return `
Table: actor
- actor_id (integer, primary key)
- first_name (text)
- last_name (text)
- last_update (timestamp)

Table: address
- address_id (integer, primary key)
- address (text)
- address2 (text)
- district (text)
- city_id (integer) -> city.city_id
- postal_code (text)
- phone (text)

Table: category
- category_id (integer, primary key)
- name (text)
- last_update (timestamp)

Table: city
- city_id (integer, primary key)
- city (text)
- country_id (integer) -> country.country_id

Table: country
- country_id (integer, primary key)
- country (text)

Table: customer
- customer_id (integer, primary key)
- store_id (integer) -> store.store_id
- first_name (text)
- last_name (text)
- email (text)
- address_id (integer) -> address.address_id
- activebool (boolean) -- Use this for active status (true/false)
- active (integer) -- Legacy column, 0 or 1
- create_date (date)
- last_update (timestamp)

Table: film
- film_id (integer, primary key)
- title (text)
- description (text)
- release_year (integer)
- language_id (integer) -> language.language_id
- original_language_id (integer) -> language.language_id
- rental_duration (integer) -- Default: 3
- rental_rate (numeric) -- Default: 4.99
- length (integer)
- replacement_cost (numeric) -- Default: 19.99
- rating (enum: G, PG, PG-13, R, NC-17)
- last_update (timestamp)
- special_features (text[])
- fulltext (tsvector)

Table: film_actor
- actor_id (integer) -> actor.actor_id
- film_id (integer) -> film.film_id

Table: film_category
- film_id (integer) -> film.film_id
- category_id (integer) -> category.category_id

Table: inventory
- inventory_id (integer, primary key)
- film_id (integer) -> film.film_id
- store_id (integer) -> store.store_id

Table: language
- language_id (integer, primary key)
- name (char)

Table: payment
- payment_id (integer, primary key)
- customer_id (integer) -> customer.customer_id
- staff_id (integer) -> staff.staff_id
- rental_id (integer) -> rental.rental_id
- amount (numeric)
- payment_date (timestamp)

Table: rental
- rental_id (integer, primary key)
- rental_date (timestamp)
- inventory_id (integer) -> inventory.inventory_id
- customer_id (integer) -> customer.customer_id
- return_date (timestamp)
- staff_id (integer) -> staff.staff_id

Table: staff
- staff_id (integer, primary key)
- first_name (text)
- last_name (text)
- address_id (integer) -> address.address_id
- email (text)
- store_id (integer) -> store.store_id
- active (boolean) -- Note: in staff table active IS boolean
- username (text)
- password (text)

Table: store
- store_id (integer, primary key)
- manager_staff_id (integer) -> staff.staff_id
- address_id (integer) -> address.address_id

Relationships:
- Customers rent Inventory items via Rental table.
- Payments are made for Rentals.
- Inventory links Films to Stores.
- Films have Categories and Actors.
`;
}
