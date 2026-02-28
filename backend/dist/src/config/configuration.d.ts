declare const _default: () => {
    port: number;
    nodeEnv: string;
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    database: {
        url: string | undefined;
    };
};
export default _default;
