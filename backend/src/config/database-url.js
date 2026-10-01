const getDatabaseUrl = () => {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }

    if (process.env.VCAP_SERVICES) {
        const vcapServices = JSON.parse(process.env.VCAP_SERVICES);

        const postgresService =
            vcapServices["postgresql-db"]?.[0];

        const uri = postgresService?.credentials?.uri;

        if (uri) {
            return uri.includes("?")
                ? `${uri}&sslmode=require`
                : `${uri}?sslmode=require`;
        }
    }

    throw new Error(
        "Database connection information was not found"
    );
};

export default getDatabaseUrl();