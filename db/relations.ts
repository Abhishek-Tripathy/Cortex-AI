import { relations } from "drizzle-orm/relations";
import { language, film, city, address, country, customer, store, inventory, rental, staff, actor, filmActor, category, filmCategory, paymentP202201, paymentP202202, paymentP202203, paymentP202204, paymentP202205, paymentP202206 } from "./schema";

export const filmRelations = relations(film, ({one, many}) => ({
	language_languageId: one(language, {
		fields: [film.languageId],
		references: [language.languageId],
		relationName: "film_languageId_language_languageId"
	}),
	language_originalLanguageId: one(language, {
		fields: [film.originalLanguageId],
		references: [language.languageId],
		relationName: "film_originalLanguageId_language_languageId"
	}),
	inventories: many(inventory),
	filmActors: many(filmActor),
	filmCategories: many(filmCategory),
}));

export const languageRelations = relations(language, ({many}) => ({
	films_languageId: many(film, {
		relationName: "film_languageId_language_languageId"
	}),
	films_originalLanguageId: many(film, {
		relationName: "film_originalLanguageId_language_languageId"
	}),
}));

export const addressRelations = relations(address, ({one, many}) => ({
	city: one(city, {
		fields: [address.cityId],
		references: [city.cityId]
	}),
	customers: many(customer),
	staff: many(staff),
	stores: many(store),
}));

export const cityRelations = relations(city, ({one, many}) => ({
	addresses: many(address),
	country: one(country, {
		fields: [city.countryId],
		references: [country.countryId]
	}),
}));

export const countryRelations = relations(country, ({many}) => ({
	cities: many(city),
}));

export const customerRelations = relations(customer, ({one, many}) => ({
	address: one(address, {
		fields: [customer.addressId],
		references: [address.addressId]
	}),
	store: one(store, {
		fields: [customer.storeId],
		references: [store.storeId]
	}),
	rentals: many(rental),
	paymentP202201s: many(paymentP202201),
	paymentP202202s: many(paymentP202202),
	paymentP202203s: many(paymentP202203),
	paymentP202204s: many(paymentP202204),
	paymentP202205s: many(paymentP202205),
	paymentP202206s: many(paymentP202206),
}));

export const storeRelations = relations(store, ({one, many}) => ({
	customers: many(customer),
	inventories: many(inventory),
	staff: many(staff),
	address: one(address, {
		fields: [store.addressId],
		references: [address.addressId]
	}),
}));

export const inventoryRelations = relations(inventory, ({one, many}) => ({
	film: one(film, {
		fields: [inventory.filmId],
		references: [film.filmId]
	}),
	store: one(store, {
		fields: [inventory.storeId],
		references: [store.storeId]
	}),
	rentals: many(rental),
}));

export const rentalRelations = relations(rental, ({one, many}) => ({
	customer: one(customer, {
		fields: [rental.customerId],
		references: [customer.customerId]
	}),
	inventory: one(inventory, {
		fields: [rental.inventoryId],
		references: [inventory.inventoryId]
	}),
	staff: one(staff, {
		fields: [rental.staffId],
		references: [staff.staffId]
	}),
	paymentP202201s: many(paymentP202201),
	paymentP202202s: many(paymentP202202),
	paymentP202203s: many(paymentP202203),
	paymentP202204s: many(paymentP202204),
	paymentP202205s: many(paymentP202205),
	paymentP202206s: many(paymentP202206),
}));

export const staffRelations = relations(staff, ({one, many}) => ({
	rentals: many(rental),
	address: one(address, {
		fields: [staff.addressId],
		references: [address.addressId]
	}),
	store: one(store, {
		fields: [staff.storeId],
		references: [store.storeId]
	}),
	paymentP202201s: many(paymentP202201),
	paymentP202202s: many(paymentP202202),
	paymentP202203s: many(paymentP202203),
	paymentP202204s: many(paymentP202204),
	paymentP202205s: many(paymentP202205),
	paymentP202206s: many(paymentP202206),
}));

export const filmActorRelations = relations(filmActor, ({one}) => ({
	actor: one(actor, {
		fields: [filmActor.actorId],
		references: [actor.actorId]
	}),
	film: one(film, {
		fields: [filmActor.filmId],
		references: [film.filmId]
	}),
}));

export const actorRelations = relations(actor, ({many}) => ({
	filmActors: many(filmActor),
}));

export const filmCategoryRelations = relations(filmCategory, ({one}) => ({
	category: one(category, {
		fields: [filmCategory.categoryId],
		references: [category.categoryId]
	}),
	film: one(film, {
		fields: [filmCategory.filmId],
		references: [film.filmId]
	}),
}));

export const categoryRelations = relations(category, ({many}) => ({
	filmCategories: many(filmCategory),
}));

export const paymentP202201Relations = relations(paymentP202201, ({one}) => ({
	customer: one(customer, {
		fields: [paymentP202201.customerId],
		references: [customer.customerId]
	}),
	rental: one(rental, {
		fields: [paymentP202201.rentalId],
		references: [rental.rentalId]
	}),
	staff: one(staff, {
		fields: [paymentP202201.staffId],
		references: [staff.staffId]
	}),
}));

export const paymentP202202Relations = relations(paymentP202202, ({one}) => ({
	customer: one(customer, {
		fields: [paymentP202202.customerId],
		references: [customer.customerId]
	}),
	rental: one(rental, {
		fields: [paymentP202202.rentalId],
		references: [rental.rentalId]
	}),
	staff: one(staff, {
		fields: [paymentP202202.staffId],
		references: [staff.staffId]
	}),
}));

export const paymentP202203Relations = relations(paymentP202203, ({one}) => ({
	customer: one(customer, {
		fields: [paymentP202203.customerId],
		references: [customer.customerId]
	}),
	rental: one(rental, {
		fields: [paymentP202203.rentalId],
		references: [rental.rentalId]
	}),
	staff: one(staff, {
		fields: [paymentP202203.staffId],
		references: [staff.staffId]
	}),
}));

export const paymentP202204Relations = relations(paymentP202204, ({one}) => ({
	customer: one(customer, {
		fields: [paymentP202204.customerId],
		references: [customer.customerId]
	}),
	rental: one(rental, {
		fields: [paymentP202204.rentalId],
		references: [rental.rentalId]
	}),
	staff: one(staff, {
		fields: [paymentP202204.staffId],
		references: [staff.staffId]
	}),
}));

export const paymentP202205Relations = relations(paymentP202205, ({one}) => ({
	customer: one(customer, {
		fields: [paymentP202205.customerId],
		references: [customer.customerId]
	}),
	rental: one(rental, {
		fields: [paymentP202205.rentalId],
		references: [rental.rentalId]
	}),
	staff: one(staff, {
		fields: [paymentP202205.staffId],
		references: [staff.staffId]
	}),
}));

export const paymentP202206Relations = relations(paymentP202206, ({one}) => ({
	customer: one(customer, {
		fields: [paymentP202206.customerId],
		references: [customer.customerId]
	}),
	rental: one(rental, {
		fields: [paymentP202206.rentalId],
		references: [rental.rentalId]
	}),
	staff: one(staff, {
		fields: [paymentP202206.staffId],
		references: [staff.staffId]
	}),
}));