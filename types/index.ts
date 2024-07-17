import { Id } from "@/convex/_generated/dataModel";

export interface Product {
    _id: Id<"products">;
    title: string;
    description: string;
    size: string;
    price: number;
    imageUrl: string;
}
export interface CartItem {
    _id: string;
    title: string;
    price: number;
    size: string;
    quantity: number;
    imageUrl: string;
}