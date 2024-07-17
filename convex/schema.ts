import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    products: defineTable({
        title: v.string(),
        description: v.string(),
        size: v.string(),
        price: v.number(),
        imageUrl: v.string(),
       
    }),
});