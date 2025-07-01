const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./yourdb.sqlite");

db.get("SELECT * FROM interviews WHERE id = 7", (err, row) => {
  if (err) return console.error("Interview query failed:", err);
  console.log("Interview row:", row);
});

db.all("SELECT * FROM interview_questions WHERE interview_id = 7", (err, rows) => {
  if (err) return console.error("Questions query failed:", err);
  console.log("Interview questions:", rows);
});
