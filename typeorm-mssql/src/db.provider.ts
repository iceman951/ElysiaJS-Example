import { DataSource } from "typeorm";

export const DS1: DataSource = new DataSource({
  type: "mssql",
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
