import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Clash Intelligence API",
            version: "1.0.0",
            description: "A set of apis to compare your favourite clash royale players!"
        },
        servers:[
            { url: "http://localhost:5000" }
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
    apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
