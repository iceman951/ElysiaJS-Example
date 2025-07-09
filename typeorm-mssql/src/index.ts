import { Elysia, t } from "elysia";
import { DS1 } from "./db.provider";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/division/:division_code", async ({ params }) => {
    const sql = `SELECT TOP 10 * FROM Division WHERE DIVISION_CODE LIKE @0`;
    const results: any[] = await DS1.query(sql, [
      params.division_code,
    ])
    return results;
  }, {
    params: t.Object({
      division_code: t.Number(),
    })
  })
  // Add a new division record with transaction management
  .post("/division", async ({ body }) => {
    let queryRunner = DS1.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Perform the insert operation
      const sql1 = `INSERT INTO Division (DIVISION_CODE, DIVISION_NAME) VALUES (@0, @1)`;
      const results: any[] = await queryRunner.query(sql1, [
        body.division_code,
        body.division_name,
      ]);
      console.log("Insert results:", results);

      const sql2 = `SELECT TOP 10 (DIVISION_CODE, DIVISION_NAME) FROM Division WHERE DIVISION_CODE LIKE @0`;
      const results2: any[] = await queryRunner.query(sql2, [
        body.division_code,
      ]);

      // Commit the transaction
      await queryRunner.commitTransaction();
      const message = `Division ${body.division_code} added successfully.`;
      console.log(message);

      // Return the results
      return {
        message,
        data: results2,
      };

    } catch (error) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }, {
    body: t.Object({
      division_code: t.String(),
      division_name: t.String(),
    }),
    response: {
      200: t.Object({
        message: t.String(),
        data: t.Array(t.Object({
          DIVISION_CODE: t.String(),
          DIVISION_NAME: t.String(),
        }))
      }),
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
