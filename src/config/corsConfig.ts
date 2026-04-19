import { CorsOptions } from "cors";

// Research for choices below from https://www.npmjs.com/package/cors
export const authenticatedCorsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const allowed = process.env.ALLOWED_ORIGINS?.split(",") || [];

        console.log(">>> STRICT CORS HIT:", origin);
        console.log("ALLOWED LIST:", allowed);

        // Allow calls from same machine (e.g., Postman) or if no origin is provided (e.g., curl)
        if (!origin) {
            return callback(null, true);
        }
        // Allows calls if listed in allowed origins
        if (allowed.includes(origin)) {
            return callback(null, true);
        }
        // Reject calls from unlisted origins
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};