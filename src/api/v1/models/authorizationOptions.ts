export interface AuthorizationOptions {
    hasRole: Array<"admin" | "officer" | "manager">;
    allowSameUser?: boolean;
}