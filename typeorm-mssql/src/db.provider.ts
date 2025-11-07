import { DataSource } from "typeorm";

export const DS1: DataSource = new DataSource({
  type: "mssql", // ถ้าเป็น postgresql เปลี่ยนเป็น pg (bun add pg ด้วย)
  host: "myhost.example.com",
  port: 1433,
  username: "sa",
  password: "mypasseord",
  database: "mydb",
  extra: {
    trustServerCertificate: true,
  },
  logging: true,
});

DS1.initialize()
  .then(() => {
    console.log(`DS1 has been initialized!`);
  })
  .catch((error) => {
    console.error(`Error during DS1 initialization`, error);
  });
