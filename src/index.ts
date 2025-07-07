import { Elysia } from "elysia";
import sql, { config, ConnectionError } from "mssql";

console.log("Starting Elysia server...");

const mssqlConfig: config = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.HOST,
  port: +process.env.PORT,
  database: process.env.DATABASE,
  pool: {
    max: 2,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
  },
};

console.log("Connecting to MSSQL with config:", mssqlConfig);
if (!mssqlConfig.user || !mssqlConfig.password || !mssqlConfig.server || !mssqlConfig.database || !mssqlConfig.port) {
  console.error("MSSQL configuration is incomplete. Please check your environment variables.");
  process.exit(1);
}

const mssqlClient = new sql.ConnectionPool(mssqlConfig)
  .connect()
  .catch((err: ConnectionError) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

const app = new Elysia()
  .onError((error) => {
    console.error("An error occurred:", error);
    return { message: "Internal Server Error", status: 500 };
  })
  .get("/", () => {
    console.log("Received request at /");
    return { message: "Hello, Elysia!" };
  })
  .get("/test", async () => {
    console.log("Received request at /");
    const result = await (await mssqlClient)
      .request()
      .query(`SELECT 
        DIVISION_CODE as division_code,
        DIVISION_NAME as division_name,
        DIVISION_AS as division_as,
        DIVISION_MN_CODE as division_mn_code,
        DIVISION_MN_AS as division_mn_as,
        COST_CODE as cost_code,
        COST_NAME as cost_name,
        DIVISION_AREA as division_area
      FROM DIVISION`);
    return result.recordset;
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
