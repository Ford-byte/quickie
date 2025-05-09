import mysql from "serverless-mysql";

const connection = mysql({
  config: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectTimeout: 60000,
  },
  backoff: "exponential",
  base: 5,
  cap: 200,
});

async function query(sql, params) {
  try {
    await connection.connect();
    const results = await connection.query(sql, params);
    await connection.end();
    return results;
  } catch (error) {
    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Reconnecting...");
      return query(sql, params);
    } else {
      throw error;
    }
  }
}

export { connection, query };
