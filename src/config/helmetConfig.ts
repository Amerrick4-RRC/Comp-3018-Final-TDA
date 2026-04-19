import helmet from "helmet";

// Optimized configuration for JSON APIs
export const apiHelmetConfig = helmet({
    // Disable unnecessary middleware for API-only apps
    contentSecurityPolicy: false, // Not needed for JSON APIs would deal with XSS and content injection
    crossOriginEmbedderPolicy: false, // Prevents embedding of cross-origin resources, not needed for APIs

    // Keep essential security headers
    hsts: {
        maxAge: 31536000, // 1 year enforcement protects against downgrade attacks
        includeSubDomains: true,
        preload: true,
    },

    // Remove server information from responses prevents attackers from identifying the server software and version
    hidePoweredBy: true,

    // Prevent MIME type sniffing by setting the X-Content-Type-Options header to nosniff
    noSniff: true,

    // Prevent clickjacking by setting the X-Frame-Options header to DENY, which prevents the page from being displayed in a frame or iframe
    frameguard: { action: "deny" },
});