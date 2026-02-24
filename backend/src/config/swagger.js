import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Clash Intelligence API",
            version: "1.0.0",
            description: `
                A set of apis to compare your favourite clash royale players!
                Main capabilities:
                • Player ingestion from the official API  
                • Battle log analytics  
                • Deck intelligence and progression tracking  
                • Playstyle classification  
                • Player comparison engine  

                Typical workflow:
                1. Authenticate
                2. Sync cards
                3. Ingest player
                4. Ingest battles
                5. Access analytics endpoints
                
                Note on Authentication:
                All /api/player and /api/cards routes require a JWT authentication. To obtain a JWT token, follow the steps below -
                1. Register → POST /api/auth/register  
                2. Login → POST /api/auth/login  
                3. Copy the returned JWT token  
                4. Click **Authorize** in Swagger  
                5. Enter: Bearer <token>`
        },
        servers:[
            { 
                url: "http://localhost:5000",
                description: "Local development server running on port 5000"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/*.js", "./app.js"],
};

export const swaggerSpec = swaggerJsdoc(options);

fs.writeFileSync(
    "../docs/swagger.json",
    JSON.stringify(swaggerSpec, null, 2)
);

export { swaggerUi };
