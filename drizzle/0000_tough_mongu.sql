-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."mpaa_rating" AS ENUM('G', 'PG', 'PG-13', 'R', 'NC-17');--> statement-breakpoint
CREATE SEQUENCE "public"."customer_customer_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."actor_actor_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."category_category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."film_film_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."address_address_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."city_city_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."country_country_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."inventory_inventory_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."language_language_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."payment_payment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."rental_rental_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."staff_staff_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."store_store_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "film" (
	"film_id" integer PRIMARY KEY DEFAULT nextval('public.film_film_id_seq'::regclass) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"release_year" "public.year",
	"language_id" integer NOT NULL,
	"original_language_id" integer,
	"rental_duration" smallint DEFAULT 3 NOT NULL,
	"rental_rate" numeric(4, 2) DEFAULT '4.99' NOT NULL,
	"length" smallint,
	"replacement_cost" numeric(5, 2) DEFAULT '19.99' NOT NULL,
	"rating" "mpaa_rating" DEFAULT 'G',
	"last_update" timestamp with time zone DEFAULT now() NOT NULL,
	"special_features" text[],
	"fulltext" "tsvector" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "actor" (
	"actor_id" integer PRIMARY KEY DEFAULT nextval('public.actor_actor_id_seq'::regclass) NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "address" (
	"address_id" integer PRIMARY KEY DEFAULT nextval('public.address_address_id_seq'::regclass) NOT NULL,
	"address" text NOT NULL,
	"address2" text,
	"district" text NOT NULL,
	"city_id" integer NOT NULL,
	"postal_code" text,
	"phone" text NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"category_id" integer PRIMARY KEY DEFAULT nextval('public.category_category_id_seq'::regclass) NOT NULL,
	"name" text NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "city" (
	"city_id" integer PRIMARY KEY DEFAULT nextval('public.city_city_id_seq'::regclass) NOT NULL,
	"city" text NOT NULL,
	"country_id" integer NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country" (
	"country_id" integer PRIMARY KEY DEFAULT nextval('public.country_country_id_seq'::regclass) NOT NULL,
	"country" text NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"customer_id" integer PRIMARY KEY DEFAULT nextval('public.customer_customer_id_seq'::regclass) NOT NULL,
	"store_id" integer NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"address_id" integer NOT NULL,
	"activebool" boolean DEFAULT true NOT NULL,
	"create_date" date DEFAULT CURRENT_DATE NOT NULL,
	"last_update" timestamp with time zone DEFAULT now(),
	"active" integer
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"inventory_id" integer PRIMARY KEY DEFAULT nextval('public.inventory_inventory_id_seq'::regclass) NOT NULL,
	"film_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "language" (
	"language_id" integer PRIMARY KEY DEFAULT nextval('public.language_language_id_seq'::regclass) NOT NULL,
	"name" char(20) NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rental" (
	"rental_id" integer PRIMARY KEY DEFAULT nextval('public.rental_rental_id_seq'::regclass) NOT NULL,
	"rental_date" timestamp with time zone NOT NULL,
	"inventory_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"return_date" timestamp with time zone,
	"staff_id" integer NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"staff_id" integer PRIMARY KEY DEFAULT nextval('public.staff_staff_id_seq'::regclass) NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"address_id" integer NOT NULL,
	"email" text,
	"store_id" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"username" text NOT NULL,
	"password" text,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL,
	"picture" "bytea"
);
--> statement-breakpoint
CREATE TABLE "store" (
	"store_id" integer PRIMARY KEY DEFAULT nextval('public.store_store_id_seq'::regclass) NOT NULL,
	"manager_staff_id" integer NOT NULL,
	"address_id" integer NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "film_actor" (
	"actor_id" integer NOT NULL,
	"film_id" integer NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "film_actor_pkey" PRIMARY KEY("actor_id","film_id")
);
--> statement-breakpoint
CREATE TABLE "film_category" (
	"film_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"last_update" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "film_category_pkey" PRIMARY KEY("film_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "payment_p2022_07" (
	"payment_id" integer DEFAULT nextval('public.payment_payment_id_seq'::regclass) NOT NULL,
	"customer_id" integer NOT NULL,
	"staff_id" integer NOT NULL,
	"rental_id" integer NOT NULL,
	"amount" numeric(5, 2) NOT NULL,
	"payment_date" timestamp with time zone NOT NULL,
	CONSTRAINT "payment_p2022_07_pkey" PRIMARY KEY("payment_id","payment_date")
);
--> statement-breakpoint
CREATE TABLE "payment_p2022_01" (
	"payment_id" integer DEFAULT nextval('public.payment_payment_id_seq'::regclass) NOT NULL,
	"customer_id" integer NOT NULL,
	"staff_id" integer NOT NULL,
	"rental_id" integer NOT NULL,
	"amount" numeric(5, 2) NOT NULL,
	"payment_date" timestamp with time zone NOT NULL,
	CONSTRAINT "payment_p2022_01_pkey" PRIMARY KEY("payment_id","payment_date")
);
--> statement-breakpoint
CREATE TABLE "payment_p2022_02" (
	"payment_id" integer DEFAULT nextval('public.payment_payment_id_seq'::regclass) NOT NULL,
	"customer_id" integer NOT NULL,
	"staff_id" integer NOT NULL,
	"rental_id" integer NOT NULL,
	"amount" numeric(5, 2) NOT NULL,
	"payment_date" timestamp with time zone NOT NULL,
	CONSTRAINT "payment_p2022_02_pkey" PRIMARY KEY("payment_id","payment_date")
);
--> statement-breakpoint
CREATE TABLE "payment_p2022_03" (
	"payment_id" integer DEFAULT nextval('public.payment_payment_id_seq'::regclass) NOT NULL,
	"customer_id" integer NOT NULL,
	"staff_id" integer NOT NULL,
	"rental_id" integer NOT NULL,
	"amount" numeric(5, 2) NOT NULL,
	"payment_date" timestamp with time zone NOT NULL,
	CONSTRAINT "payment_p2022_03_pkey" PRIMARY KEY("payment_id","payment_date")
);
--> statement-breakpoint
CREATE TABLE "payment_p2022_04" (
	"payment_id" integer DEFAULT nextval('public.payment_payment_id_seq'::regclass) NOT NULL,
	"customer_id" integer NOT NULL,
	"staff_id" integer NOT NULL,
	"rental_id" integer NOT NULL,
	"amount" numeric(5, 2) NOT NULL,
	"payment_date" timestamp with time zone NOT NULL,
	CONSTRAINT "payment_p2022_04_pkey" PRIMARY KEY("payment_id","payment_date")
);
--> statement-breakpoint
CREATE TABLE "payment_p2022_05" (
	"payment_id" integer DEFAULT nextval('public.payment_payment_id_seq'::regclass) NOT NULL,
	"customer_id" integer NOT NULL,
	"staff_id" integer NOT NULL,
	"rental_id" integer NOT NULL,
	"amount" numeric(5, 2) NOT NULL,
	"payment_date" timestamp with time zone NOT NULL,
	CONSTRAINT "payment_p2022_05_pkey" PRIMARY KEY("payment_id","payment_date")
);
--> statement-breakpoint
CREATE TABLE "payment_p2022_06" (
	"payment_id" integer DEFAULT nextval('public.payment_payment_id_seq'::regclass) NOT NULL,
	"customer_id" integer NOT NULL,
	"staff_id" integer NOT NULL,
	"rental_id" integer NOT NULL,
	"amount" numeric(5, 2) NOT NULL,
	"payment_date" timestamp with time zone NOT NULL,
	CONSTRAINT "payment_p2022_06_pkey" PRIMARY KEY("payment_id","payment_date")
);
--> statement-breakpoint
ALTER TABLE "film" ADD CONSTRAINT "film_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."language"("language_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "film" ADD CONSTRAINT "film_original_language_id_fkey" FOREIGN KEY ("original_language_id") REFERENCES "public"."language"("language_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."city"("city_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "city" ADD CONSTRAINT "city_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."country"("country_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("address_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."store"("store_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "public"."film"("film_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."store"("store_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rental" ADD CONSTRAINT "rental_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rental" ADD CONSTRAINT "rental_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("inventory_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rental" ADD CONSTRAINT "rental_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("staff_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("address_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."store"("store_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store" ADD CONSTRAINT "store_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("address_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "film_actor" ADD CONSTRAINT "film_actor_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."actor"("actor_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "film_actor" ADD CONSTRAINT "film_actor_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "public"."film"("film_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "film_category" ADD CONSTRAINT "film_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "film_category" ADD CONSTRAINT "film_category_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "public"."film"("film_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "payment_p2022_01" ADD CONSTRAINT "payment_p2022_01_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_01" ADD CONSTRAINT "payment_p2022_01_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "public"."rental"("rental_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_01" ADD CONSTRAINT "payment_p2022_01_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("staff_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_02" ADD CONSTRAINT "payment_p2022_02_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_02" ADD CONSTRAINT "payment_p2022_02_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "public"."rental"("rental_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_02" ADD CONSTRAINT "payment_p2022_02_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("staff_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_03" ADD CONSTRAINT "payment_p2022_03_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_03" ADD CONSTRAINT "payment_p2022_03_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "public"."rental"("rental_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_03" ADD CONSTRAINT "payment_p2022_03_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("staff_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_04" ADD CONSTRAINT "payment_p2022_04_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_04" ADD CONSTRAINT "payment_p2022_04_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "public"."rental"("rental_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_04" ADD CONSTRAINT "payment_p2022_04_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("staff_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_05" ADD CONSTRAINT "payment_p2022_05_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_05" ADD CONSTRAINT "payment_p2022_05_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "public"."rental"("rental_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_05" ADD CONSTRAINT "payment_p2022_05_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("staff_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_06" ADD CONSTRAINT "payment_p2022_06_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_06" ADD CONSTRAINT "payment_p2022_06_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "public"."rental"("rental_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_p2022_06" ADD CONSTRAINT "payment_p2022_06_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("staff_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "film_fulltext_idx" ON "film" USING gist ("fulltext" tsvector_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_language_id" ON "film" USING btree ("language_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_original_language_id" ON "film" USING btree ("original_language_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_title" ON "film" USING btree ("title" text_ops);--> statement-breakpoint
CREATE INDEX "idx_actor_last_name" ON "actor" USING btree ("last_name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_city_id" ON "address" USING btree ("city_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_country_id" ON "city" USING btree ("country_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_address_id" ON "customer" USING btree ("address_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_store_id" ON "customer" USING btree ("store_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_last_name" ON "customer" USING btree ("last_name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_store_id_film_id" ON "inventory" USING btree ("store_id" int4_ops,"film_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_inventory_id" ON "rental" USING btree ("inventory_id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_unq_rental_rental_date_inventory_id_customer_id" ON "rental" USING btree ("rental_date" int4_ops,"inventory_id" timestamptz_ops,"customer_id" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_unq_manager_staff_id" ON "store" USING btree ("manager_staff_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_film_id" ON "film_actor" USING btree ("film_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_01_customer_id" ON "payment_p2022_01" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_01_staff_id" ON "payment_p2022_01" USING btree ("staff_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payment_p2022_01_customer_id_idx" ON "payment_p2022_01" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_02_customer_id" ON "payment_p2022_02" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_02_staff_id" ON "payment_p2022_02" USING btree ("staff_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payment_p2022_02_customer_id_idx" ON "payment_p2022_02" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_03_customer_id" ON "payment_p2022_03" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_03_staff_id" ON "payment_p2022_03" USING btree ("staff_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payment_p2022_03_customer_id_idx" ON "payment_p2022_03" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_04_customer_id" ON "payment_p2022_04" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_04_staff_id" ON "payment_p2022_04" USING btree ("staff_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payment_p2022_04_customer_id_idx" ON "payment_p2022_04" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_05_customer_id" ON "payment_p2022_05" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_05_staff_id" ON "payment_p2022_05" USING btree ("staff_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payment_p2022_05_customer_id_idx" ON "payment_p2022_05" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_06_customer_id" ON "payment_p2022_06" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fk_payment_p2022_06_staff_id" ON "payment_p2022_06" USING btree ("staff_id" int4_ops);--> statement-breakpoint
CREATE INDEX "payment_p2022_06_customer_id_idx" ON "payment_p2022_06" USING btree ("customer_id" int4_ops);--> statement-breakpoint
CREATE VIEW "public"."actor_info" AS (SELECT a.actor_id, a.first_name, a.last_name, public.group_concat(DISTINCT (c.name || ': '::text) || (( SELECT public.group_concat(f.title) AS group_concat FROM public.film f JOIN public.film_category fc_1 ON f.film_id = fc_1.film_id JOIN public.film_actor fa_1 ON f.film_id = fa_1.film_id WHERE fc_1.category_id = c.category_id AND fa_1.actor_id = a.actor_id GROUP BY fa_1.actor_id))) AS film_info FROM public.actor a LEFT JOIN public.film_actor fa ON a.actor_id = fa.actor_id LEFT JOIN public.film_category fc ON fa.film_id = fc.film_id LEFT JOIN public.category c ON fc.category_id = c.category_id GROUP BY a.actor_id, a.first_name, a.last_name);--> statement-breakpoint
CREATE VIEW "public"."customer_list" AS (SELECT cu.customer_id AS id, (cu.first_name || ' '::text) || cu.last_name AS name, a.address, a.postal_code AS "zip code", a.phone, city.city, country.country, CASE WHEN cu.activebool THEN 'active'::text ELSE ''::text END AS notes, cu.store_id AS sid FROM public.customer cu JOIN public.address a ON cu.address_id = a.address_id JOIN public.city ON a.city_id = city.city_id JOIN public.country ON city.country_id = country.country_id);--> statement-breakpoint
CREATE VIEW "public"."film_list" AS (SELECT film.film_id AS fid, film.title, film.description, category.name AS category, film.rental_rate AS price, film.length, film.rating, public.group_concat((actor.first_name || ' '::text) || actor.last_name) AS actors FROM public.category LEFT JOIN public.film_category ON category.category_id = film_category.category_id LEFT JOIN public.film ON film_category.film_id = film.film_id JOIN public.film_actor ON film.film_id = film_actor.film_id JOIN public.actor ON film_actor.actor_id = actor.actor_id GROUP BY film.film_id, film.title, film.description, category.name, film.rental_rate, film.length, film.rating);--> statement-breakpoint
CREATE VIEW "public"."nicer_but_slower_film_list" AS (SELECT film.film_id AS fid, film.title, film.description, category.name AS category, film.rental_rate AS price, film.length, film.rating, public.group_concat(((upper("substring"(actor.first_name, 1, 1)) || lower("substring"(actor.first_name, 2))) || upper("substring"(actor.last_name, 1, 1))) || lower("substring"(actor.last_name, 2))) AS actors FROM public.category LEFT JOIN public.film_category ON category.category_id = film_category.category_id LEFT JOIN public.film ON film_category.film_id = film.film_id JOIN public.film_actor ON film.film_id = film_actor.film_id JOIN public.actor ON film_actor.actor_id = actor.actor_id GROUP BY film.film_id, film.title, film.description, category.name, film.rental_rate, film.length, film.rating);--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."rental_by_category" AS (SELECT c.name AS category, sum(p.amount) AS total_sales FROM public.payment p JOIN public.rental r ON p.rental_id = r.rental_id JOIN public.inventory i ON r.inventory_id = i.inventory_id JOIN public.film f ON i.film_id = f.film_id JOIN public.film_category fc ON f.film_id = fc.film_id JOIN public.category c ON fc.category_id = c.category_id GROUP BY c.name ORDER BY (sum(p.amount)) DESC);--> statement-breakpoint
CREATE VIEW "public"."sales_by_film_category" AS (SELECT c.name AS category, sum(p.amount) AS total_sales FROM public.payment p JOIN public.rental r ON p.rental_id = r.rental_id JOIN public.inventory i ON r.inventory_id = i.inventory_id JOIN public.film f ON i.film_id = f.film_id JOIN public.film_category fc ON f.film_id = fc.film_id JOIN public.category c ON fc.category_id = c.category_id GROUP BY c.name ORDER BY (sum(p.amount)) DESC);--> statement-breakpoint
CREATE VIEW "public"."sales_by_store" AS (SELECT (c.city || ','::text) || cy.country AS store, (m.first_name || ' '::text) || m.last_name AS manager, sum(p.amount) AS total_sales FROM public.payment p JOIN public.rental r ON p.rental_id = r.rental_id JOIN public.inventory i ON r.inventory_id = i.inventory_id JOIN public.store s ON i.store_id = s.store_id JOIN public.address a ON s.address_id = a.address_id JOIN public.city c ON a.city_id = c.city_id JOIN public.country cy ON c.country_id = cy.country_id JOIN public.staff m ON s.manager_staff_id = m.staff_id GROUP BY cy.country, c.city, s.store_id, m.first_name, m.last_name ORDER BY cy.country, c.city);--> statement-breakpoint
CREATE VIEW "public"."staff_list" AS (SELECT s.staff_id AS id, (s.first_name || ' '::text) || s.last_name AS name, a.address, a.postal_code AS "zip code", a.phone, city.city, country.country, s.store_id AS sid FROM public.staff s JOIN public.address a ON s.address_id = a.address_id JOIN public.city ON a.city_id = city.city_id JOIN public.country ON city.country_id = country.country_id);
*/