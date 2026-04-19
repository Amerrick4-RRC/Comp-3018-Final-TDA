export interface AuthorizationOptions {
    hasRole: Array<"admin" | "creator">;
    allowSameUser?: boolean;
}