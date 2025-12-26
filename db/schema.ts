import { pgTable, serial, text, timestamp, index, foreignKey, integer, smallint, numeric, boolean, date, char, uniqueIndex, primaryKey, pgView, pgMaterializedView, pgSequence, pgEnum, customType } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const mpaaRating = pgEnum("mpaa_rating", ['G', 'PG', 'PG-13', 'R', 'NC-17'])

export const customerCustomerIdSeq = pgSequence("customer_customer_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const actorActorIdSeq = pgSequence("actor_actor_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const categoryCategoryIdSeq = pgSequence("category_category_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const filmFilmIdSeq = pgSequence("film_film_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const addressAddressIdSeq = pgSequence("address_address_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const cityCityIdSeq = pgSequence("city_city_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const countryCountryIdSeq = pgSequence("country_country_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const inventoryInventoryIdSeq = pgSequence("inventory_inventory_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const languageLanguageIdSeq = pgSequence("language_language_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const paymentPaymentIdSeq = pgSequence("payment_payment_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const rentalRentalIdSeq = pgSequence("rental_rental_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const staffStaffIdSeq = pgSequence("staff_staff_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const storeStoreIdSeq = pgSequence("store_store_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: text(),
	email: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const film = pgTable("film", {
	filmId: integer("film_id").default(sql`nextval('public.film_film_id_seq'::regclass)`).primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	// TODO: failed to parse database type 'public.year'
	releaseYear: integer("release_year"),
	languageId: integer("language_id").notNull(),
	originalLanguageId: integer("original_language_id"),
	rentalDuration: smallint("rental_duration").default(3).notNull(),
	rentalRate: numeric("rental_rate", { precision: 4, scale:  2 }).default('4.99').notNull(),
	length: smallint(),
	replacementCost: numeric("replacement_cost", { precision: 5, scale:  2 }).default('19.99').notNull(),
	rating: mpaaRating().default('G'),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	specialFeatures: text("special_features").array(),
	// TODO: failed to parse database type 'tsvector'
	fulltext: customType<{ data: string }>({ dataType: () => 'tsvector' })("fulltext").notNull(),
}, (table) => [
	index("film_fulltext_idx").using("gist", table.fulltext.asc().nullsLast().op("tsvector_ops")),
	index("idx_fk_language_id").using("btree", table.languageId.asc().nullsLast().op("int4_ops")),
	index("idx_fk_original_language_id").using("btree", table.originalLanguageId.asc().nullsLast().op("int4_ops")),
	index("idx_title").using("btree", table.title.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.languageId],
			foreignColumns: [language.languageId],
			name: "film_language_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.originalLanguageId],
			foreignColumns: [language.languageId],
			name: "film_original_language_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const actor = pgTable("actor", {
	actorId: integer("actor_id").default(sql`nextval('public.actor_actor_id_seq'::regclass)`).primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_actor_last_name").using("btree", table.lastName.asc().nullsLast().op("text_ops")),
]);

export const address = pgTable("address", {
	addressId: integer("address_id").default(sql`nextval('public.address_address_id_seq'::regclass)`).primaryKey().notNull(),
	address: text().notNull(),
	address2: text(),
	district: text().notNull(),
	cityId: integer("city_id").notNull(),
	postalCode: text("postal_code"),
	phone: text().notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_fk_city_id").using("btree", table.cityId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.cityId],
			foreignColumns: [city.cityId],
			name: "address_city_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const category = pgTable("category", {
	categoryId: integer("category_id").default(sql`nextval('public.category_category_id_seq'::regclass)`).primaryKey().notNull(),
	name: text().notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const city = pgTable("city", {
	cityId: integer("city_id").default(sql`nextval('public.city_city_id_seq'::regclass)`).primaryKey().notNull(),
	city: text().notNull(),
	countryId: integer("country_id").notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_fk_country_id").using("btree", table.countryId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [country.countryId],
			name: "city_country_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const country = pgTable("country", {
	countryId: integer("country_id").default(sql`nextval('public.country_country_id_seq'::regclass)`).primaryKey().notNull(),
	country: text().notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const customer = pgTable("customer", {
	customerId: integer("customer_id").default(sql`nextval('public.customer_customer_id_seq'::regclass)`).primaryKey().notNull(),
	storeId: integer("store_id").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text(),
	addressId: integer("address_id").notNull(),
	activebool: boolean().default(true).notNull(),
	createDate: date("create_date").default(sql`CURRENT_DATE`).notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow(),
	active: integer(),
}, (table) => [
	index("idx_fk_address_id").using("btree", table.addressId.asc().nullsLast().op("int4_ops")),
	index("idx_fk_store_id").using("btree", table.storeId.asc().nullsLast().op("int4_ops")),
	index("idx_last_name").using("btree", table.lastName.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.addressId],
			foreignColumns: [address.addressId],
			name: "customer_address_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [store.storeId],
			name: "customer_store_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const inventory = pgTable("inventory", {
	inventoryId: integer("inventory_id").default(sql`nextval('public.inventory_inventory_id_seq'::regclass)`).primaryKey().notNull(),
	filmId: integer("film_id").notNull(),
	storeId: integer("store_id").notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_store_id_film_id").using("btree", table.storeId.asc().nullsLast().op("int4_ops"), table.filmId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.filmId],
			foreignColumns: [film.filmId],
			name: "inventory_film_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [store.storeId],
			name: "inventory_store_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const language = pgTable("language", {
	languageId: integer("language_id").default(sql`nextval('public.language_language_id_seq'::regclass)`).primaryKey().notNull(),
	name: char({ length: 20 }).notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const rental = pgTable("rental", {
	rentalId: integer("rental_id").default(sql`nextval('public.rental_rental_id_seq'::regclass)`).primaryKey().notNull(),
	rentalDate: timestamp("rental_date", { withTimezone: true, mode: 'string' }).notNull(),
	inventoryId: integer("inventory_id").notNull(),
	customerId: integer("customer_id").notNull(),
	returnDate: timestamp("return_date", { withTimezone: true, mode: 'string' }),
	staffId: integer("staff_id").notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_fk_inventory_id").using("btree", table.inventoryId.asc().nullsLast().op("int4_ops")),
	uniqueIndex("idx_unq_rental_rental_date_inventory_id_customer_id").using("btree", table.rentalDate.asc().nullsLast().op("int4_ops"), table.inventoryId.asc().nullsLast().op("timestamptz_ops"), table.customerId.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customer.customerId],
			name: "rental_customer_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.inventoryId],
			foreignColumns: [inventory.inventoryId],
			name: "rental_inventory_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.staffId],
			foreignColumns: [staff.staffId],
			name: "rental_staff_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const staff = pgTable("staff", {
	staffId: integer("staff_id").default(sql`nextval('public.staff_staff_id_seq'::regclass)`).primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	addressId: integer("address_id").notNull(),
	email: text(),
	storeId: integer("store_id").notNull(),
	active: boolean().default(true).notNull(),
	username: text().notNull(),
	password: text(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// TODO: failed to parse database type 'bytea'
	picture: customType<{ data: Buffer }>({ dataType: () => 'bytea' })("picture"),
}, (table) => [
	foreignKey({
			columns: [table.addressId],
			foreignColumns: [address.addressId],
			name: "staff_address_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [store.storeId],
			name: "staff_store_id_fkey"
		}),
]);

export const store = pgTable("store", {
	storeId: integer("store_id").default(sql`nextval('public.store_store_id_seq'::regclass)`).primaryKey().notNull(),
	managerStaffId: integer("manager_staff_id").notNull(),
	addressId: integer("address_id").notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("idx_unq_manager_staff_id").using("btree", table.managerStaffId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.addressId],
			foreignColumns: [address.addressId],
			name: "store_address_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const filmActor = pgTable("film_actor", {
	actorId: integer("actor_id").notNull(),
	filmId: integer("film_id").notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_fk_film_id").using("btree", table.filmId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.actorId],
			foreignColumns: [actor.actorId],
			name: "film_actor_actor_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.filmId],
			foreignColumns: [film.filmId],
			name: "film_actor_film_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	primaryKey({ columns: [table.actorId, table.filmId], name: "film_actor_pkey"}),
]);

export const filmCategory = pgTable("film_category", {
	filmId: integer("film_id").notNull(),
	categoryId: integer("category_id").notNull(),
	lastUpdate: timestamp("last_update", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [category.categoryId],
			name: "film_category_category_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.filmId],
			foreignColumns: [film.filmId],
			name: "film_category_film_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	primaryKey({ columns: [table.filmId, table.categoryId], name: "film_category_pkey"}),
]);

export const paymentP202207 = pgTable("payment_p2022_07", {
	paymentId: integer("payment_id").default(sql`nextval('public.payment_payment_id_seq'::regclass)`).notNull(),
	customerId: integer("customer_id").notNull(),
	staffId: integer("staff_id").notNull(),
	rentalId: integer("rental_id").notNull(),
	amount: numeric({ precision: 5, scale:  2 }).notNull(),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.paymentId, table.paymentDate], name: "payment_p2022_07_pkey"}),
]);

export const paymentP202201 = pgTable("payment_p2022_01", {
	paymentId: integer("payment_id").default(sql`nextval('public.payment_payment_id_seq'::regclass)`).notNull(),
	customerId: integer("customer_id").notNull(),
	staffId: integer("staff_id").notNull(),
	rentalId: integer("rental_id").notNull(),
	amount: numeric({ precision: 5, scale:  2 }).notNull(),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("idx_fk_payment_p2022_01_customer_id").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	index("idx_fk_payment_p2022_01_staff_id").using("btree", table.staffId.asc().nullsLast().op("int4_ops")),
	index("payment_p2022_01_customer_id_idx").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customer.customerId],
			name: "payment_p2022_01_customer_id_fkey"
		}),
	foreignKey({
			columns: [table.rentalId],
			foreignColumns: [rental.rentalId],
			name: "payment_p2022_01_rental_id_fkey"
		}),
	foreignKey({
			columns: [table.staffId],
			foreignColumns: [staff.staffId],
			name: "payment_p2022_01_staff_id_fkey"
		}),
	primaryKey({ columns: [table.paymentId, table.paymentDate], name: "payment_p2022_01_pkey"}),
]);

export const paymentP202202 = pgTable("payment_p2022_02", {
	paymentId: integer("payment_id").default(sql`nextval('public.payment_payment_id_seq'::regclass)`).notNull(),
	customerId: integer("customer_id").notNull(),
	staffId: integer("staff_id").notNull(),
	rentalId: integer("rental_id").notNull(),
	amount: numeric({ precision: 5, scale:  2 }).notNull(),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("idx_fk_payment_p2022_02_customer_id").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	index("idx_fk_payment_p2022_02_staff_id").using("btree", table.staffId.asc().nullsLast().op("int4_ops")),
	index("payment_p2022_02_customer_id_idx").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customer.customerId],
			name: "payment_p2022_02_customer_id_fkey"
		}),
	foreignKey({
			columns: [table.rentalId],
			foreignColumns: [rental.rentalId],
			name: "payment_p2022_02_rental_id_fkey"
		}),
	foreignKey({
			columns: [table.staffId],
			foreignColumns: [staff.staffId],
			name: "payment_p2022_02_staff_id_fkey"
		}),
	primaryKey({ columns: [table.paymentId, table.paymentDate], name: "payment_p2022_02_pkey"}),
]);

export const paymentP202203 = pgTable("payment_p2022_03", {
	paymentId: integer("payment_id").default(sql`nextval('public.payment_payment_id_seq'::regclass)`).notNull(),
	customerId: integer("customer_id").notNull(),
	staffId: integer("staff_id").notNull(),
	rentalId: integer("rental_id").notNull(),
	amount: numeric({ precision: 5, scale:  2 }).notNull(),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("idx_fk_payment_p2022_03_customer_id").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	index("idx_fk_payment_p2022_03_staff_id").using("btree", table.staffId.asc().nullsLast().op("int4_ops")),
	index("payment_p2022_03_customer_id_idx").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customer.customerId],
			name: "payment_p2022_03_customer_id_fkey"
		}),
	foreignKey({
			columns: [table.rentalId],
			foreignColumns: [rental.rentalId],
			name: "payment_p2022_03_rental_id_fkey"
		}),
	foreignKey({
			columns: [table.staffId],
			foreignColumns: [staff.staffId],
			name: "payment_p2022_03_staff_id_fkey"
		}),
	primaryKey({ columns: [table.paymentId, table.paymentDate], name: "payment_p2022_03_pkey"}),
]);

export const paymentP202204 = pgTable("payment_p2022_04", {
	paymentId: integer("payment_id").default(sql`nextval('public.payment_payment_id_seq'::regclass)`).notNull(),
	customerId: integer("customer_id").notNull(),
	staffId: integer("staff_id").notNull(),
	rentalId: integer("rental_id").notNull(),
	amount: numeric({ precision: 5, scale:  2 }).notNull(),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("idx_fk_payment_p2022_04_customer_id").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	index("idx_fk_payment_p2022_04_staff_id").using("btree", table.staffId.asc().nullsLast().op("int4_ops")),
	index("payment_p2022_04_customer_id_idx").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customer.customerId],
			name: "payment_p2022_04_customer_id_fkey"
		}),
	foreignKey({
			columns: [table.rentalId],
			foreignColumns: [rental.rentalId],
			name: "payment_p2022_04_rental_id_fkey"
		}),
	foreignKey({
			columns: [table.staffId],
			foreignColumns: [staff.staffId],
			name: "payment_p2022_04_staff_id_fkey"
		}),
	primaryKey({ columns: [table.paymentId, table.paymentDate], name: "payment_p2022_04_pkey"}),
]);

export const paymentP202205 = pgTable("payment_p2022_05", {
	paymentId: integer("payment_id").default(sql`nextval('public.payment_payment_id_seq'::regclass)`).notNull(),
	customerId: integer("customer_id").notNull(),
	staffId: integer("staff_id").notNull(),
	rentalId: integer("rental_id").notNull(),
	amount: numeric({ precision: 5, scale:  2 }).notNull(),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("idx_fk_payment_p2022_05_customer_id").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	index("idx_fk_payment_p2022_05_staff_id").using("btree", table.staffId.asc().nullsLast().op("int4_ops")),
	index("payment_p2022_05_customer_id_idx").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customer.customerId],
			name: "payment_p2022_05_customer_id_fkey"
		}),
	foreignKey({
			columns: [table.rentalId],
			foreignColumns: [rental.rentalId],
			name: "payment_p2022_05_rental_id_fkey"
		}),
	foreignKey({
			columns: [table.staffId],
			foreignColumns: [staff.staffId],
			name: "payment_p2022_05_staff_id_fkey"
		}),
	primaryKey({ columns: [table.paymentId, table.paymentDate], name: "payment_p2022_05_pkey"}),
]);

export const paymentP202206 = pgTable("payment_p2022_06", {
	paymentId: integer("payment_id").default(sql`nextval('public.payment_payment_id_seq'::regclass)`).notNull(),
	customerId: integer("customer_id").notNull(),
	staffId: integer("staff_id").notNull(),
	rentalId: integer("rental_id").notNull(),
	amount: numeric({ precision: 5, scale:  2 }).notNull(),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("idx_fk_payment_p2022_06_customer_id").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	index("idx_fk_payment_p2022_06_staff_id").using("btree", table.staffId.asc().nullsLast().op("int4_ops")),
	index("payment_p2022_06_customer_id_idx").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customer.customerId],
			name: "payment_p2022_06_customer_id_fkey"
		}),
	foreignKey({
			columns: [table.rentalId],
			foreignColumns: [rental.rentalId],
			name: "payment_p2022_06_rental_id_fkey"
		}),
	foreignKey({
			columns: [table.staffId],
			foreignColumns: [staff.staffId],
			name: "payment_p2022_06_staff_id_fkey"
		}),
	primaryKey({ columns: [table.paymentId, table.paymentDate], name: "payment_p2022_06_pkey"}),
]);
export const actorInfo = pgView("actor_info", {	actorId: integer("actor_id"),
	firstName: text("first_name"),
	lastName: text("last_name"),
	filmInfo: text("film_info"),
}).as(sql`SELECT a.actor_id, a.first_name, a.last_name, public.group_concat(DISTINCT (c.name || ': '::text) || (( SELECT public.group_concat(f.title) AS group_concat FROM public.film f JOIN public.film_category fc_1 ON f.film_id = fc_1.film_id JOIN public.film_actor fa_1 ON f.film_id = fa_1.film_id WHERE fc_1.category_id = c.category_id AND fa_1.actor_id = a.actor_id GROUP BY fa_1.actor_id))) AS film_info FROM public.actor a LEFT JOIN public.film_actor fa ON a.actor_id = fa.actor_id LEFT JOIN public.film_category fc ON fa.film_id = fc.film_id LEFT JOIN public.category c ON fc.category_id = c.category_id GROUP BY a.actor_id, a.first_name, a.last_name`);

export const customerList = pgView("customer_list", {	id: integer(),
	name: text(),
	address: text(),
	zipCode: text("zip code"),
	phone: text(),
	city: text(),
	country: text(),
	notes: text(),
	sid: integer(),
}).as(sql`SELECT cu.customer_id AS id, (cu.first_name || ' '::text) || cu.last_name AS name, a.address, a.postal_code AS "zip code", a.phone, city.city, country.country, CASE WHEN cu.activebool THEN 'active'::text ELSE ''::text END AS notes, cu.store_id AS sid FROM public.customer cu JOIN public.address a ON cu.address_id = a.address_id JOIN public.city ON a.city_id = city.city_id JOIN public.country ON city.country_id = country.country_id`);

export const filmList = pgView("film_list", {	fid: integer(),
	title: text(),
	description: text(),
	category: text(),
	price: numeric({ precision: 4, scale:  2 }),
	length: smallint(),
	rating: mpaaRating(),
	actors: text(),
}).as(sql`SELECT film.film_id AS fid, film.title, film.description, category.name AS category, film.rental_rate AS price, film.length, film.rating, public.group_concat((actor.first_name || ' '::text) || actor.last_name) AS actors FROM public.category LEFT JOIN public.film_category ON category.category_id = film_category.category_id LEFT JOIN public.film ON film_category.film_id = film.film_id JOIN public.film_actor ON film.film_id = film_actor.film_id JOIN public.actor ON film_actor.actor_id = actor.actor_id GROUP BY film.film_id, film.title, film.description, category.name, film.rental_rate, film.length, film.rating`);

export const nicerButSlowerFilmList = pgView("nicer_but_slower_film_list", {	fid: integer(),
	title: text(),
	description: text(),
	category: text(),
	price: numeric({ precision: 4, scale:  2 }),
	length: smallint(),
	rating: mpaaRating(),
	actors: text(),
}).as(sql`SELECT film.film_id AS fid, film.title, film.description, category.name AS category, film.rental_rate AS price, film.length, film.rating, public.group_concat(((upper("substring"(actor.first_name, 1, 1)) || lower("substring"(actor.first_name, 2))) || upper("substring"(actor.last_name, 1, 1))) || lower("substring"(actor.last_name, 2))) AS actors FROM public.category LEFT JOIN public.film_category ON category.category_id = film_category.category_id LEFT JOIN public.film ON film_category.film_id = film.film_id JOIN public.film_actor ON film.film_id = film_actor.film_id JOIN public.actor ON film_actor.actor_id = actor.actor_id GROUP BY film.film_id, film.title, film.description, category.name, film.rental_rate, film.length, film.rating`);

export const rentalByCategory = pgMaterializedView("rental_by_category", {	category: text(),
	totalSales: numeric("total_sales"),
}).as(sql`SELECT c.name AS category, sum(p.amount) AS total_sales FROM public.payment p JOIN public.rental r ON p.rental_id = r.rental_id JOIN public.inventory i ON r.inventory_id = i.inventory_id JOIN public.film f ON i.film_id = f.film_id JOIN public.film_category fc ON f.film_id = fc.film_id JOIN public.category c ON fc.category_id = c.category_id GROUP BY c.name ORDER BY (sum(p.amount)) DESC`);

export const salesByFilmCategory = pgView("sales_by_film_category", {	category: text(),
	totalSales: numeric("total_sales"),
}).as(sql`SELECT c.name AS category, sum(p.amount) AS total_sales FROM public.payment p JOIN public.rental r ON p.rental_id = r.rental_id JOIN public.inventory i ON r.inventory_id = i.inventory_id JOIN public.film f ON i.film_id = f.film_id JOIN public.film_category fc ON f.film_id = fc.film_id JOIN public.category c ON fc.category_id = c.category_id GROUP BY c.name ORDER BY (sum(p.amount)) DESC`);

export const salesByStore = pgView("sales_by_store", {	store: text(),
	manager: text(),
	totalSales: numeric("total_sales"),
}).as(sql`SELECT (c.city || ','::text) || cy.country AS store, (m.first_name || ' '::text) || m.last_name AS manager, sum(p.amount) AS total_sales FROM public.payment p JOIN public.rental r ON p.rental_id = r.rental_id JOIN public.inventory i ON r.inventory_id = i.inventory_id JOIN public.store s ON i.store_id = s.store_id JOIN public.address a ON s.address_id = a.address_id JOIN public.city c ON a.city_id = c.city_id JOIN public.country cy ON c.country_id = cy.country_id JOIN public.staff m ON s.manager_staff_id = m.staff_id GROUP BY cy.country, c.city, s.store_id, m.first_name, m.last_name ORDER BY cy.country, c.city`);

export const staffList = pgView("staff_list", {	id: integer(),
	name: text(),
	address: text(),
	zipCode: text("zip code"),
	phone: text(),
	city: text(),
	country: text(),
	sid: integer(),
}).as(sql`SELECT s.staff_id AS id, (s.first_name || ' '::text) || s.last_name AS name, a.address, a.postal_code AS "zip code", a.phone, city.city, country.country, s.store_id AS sid FROM public.staff s JOIN public.address a ON s.address_id = a.address_id JOIN public.city ON a.city_id = city.city_id JOIN public.country ON city.country_id = country.country_id`);