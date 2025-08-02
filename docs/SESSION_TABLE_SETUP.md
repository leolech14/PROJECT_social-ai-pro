# PostgreSQL Session Table

The server stores login sessions in PostgreSQL using [`connect-pg-simple`](https://github.com/voxpelli/node-connect-pg-simple).
The table is created automatically on startup via `createTableIfMissing: true`, but you can also create it manually.

## Manual creation

Run the following SQL against your database:

```sql
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL PRIMARY KEY,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_session_expire" ON "session" ("expire");
```

Or execute the SQL bundled with the package:

```bash
psql $DATABASE_URL -f node_modules/connect-pg-simple/table.sql
```

Ensure the `DATABASE_URL` environment variable points to your PostgreSQL instance.
