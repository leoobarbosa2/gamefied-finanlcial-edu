"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    jwt: {
        secret: process.env.JWT_SECRET ?? 'default-secret',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'default-refresh-secret',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    },
    database: {
        url: process.env.DATABASE_URL,
    },
});
//# sourceMappingURL=configuration.js.map