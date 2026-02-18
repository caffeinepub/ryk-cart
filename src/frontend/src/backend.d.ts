import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type RedemptionType = {
    __kind__: "mysteryBox";
    mysteryBox: string;
} | {
    __kind__: "cashback";
    cashback: bigint;
};
export type ProductId = bigint;
export interface CartItem {
    productId: ProductId;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: ProductId;
    imageUrls: Array<string>;
    name: string;
    description: string;
    isActive: boolean;
    stock: bigint;
    category: string;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: ProductId, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(name: string, price: bigint, description: string, category: string, stock: bigint, imageUrls: Array<string>): Promise<ProductId>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getPointsBalance(): Promise<bigint>;
    getProduct(productId: ProductId): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(): Promise<void>;
    redeemPoints(reward: RedemptionType): Promise<void>;
    removeFromCart(productId: ProductId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleProductActive(productId: ProductId): Promise<void>;
    updateProduct(productId: ProductId, name: string, price: bigint, description: string, category: string, stock: bigint, imageUrls: Array<string>, isActive: boolean): Promise<void>;
}
