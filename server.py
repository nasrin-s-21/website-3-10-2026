import json
import sqlite3
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


BACKEND_DIR = Path(__file__).resolve().parent
DATABASE_DIR = BACKEND_DIR / "data"
DATABASE_PATH = DATABASE_DIR / "skill_exchange.db"
TABLE_COLUMNS = {
    "users": [
        "id", "name", "email", "title", "bio", "location", "education",
        "experience", "availability", "skills_json", "skills_to_learn_json",
        "photo", "created_at",
    ],
    "connection_requests": [
        "id", "from_user_id", "to_user_id", "skill", "status", "message", "created_at",
    ],
    "sessions": [
        "id", "host_user_id", "partner_user_id", "skill", "started_at", "ended_at",
    ],
    "reviews": [
        "id", "session_id", "from_user_id", "to_user_id", "rating", "text", "created_at",
    ],
}


def connect_database():
    DATABASE_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database():
    with connect_database() as database:
        database.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL DEFAULT '',
                bio TEXT NOT NULL DEFAULT '',
                location TEXT NOT NULL DEFAULT '',
                education TEXT NOT NULL DEFAULT '',
                experience TEXT NOT NULL DEFAULT 'Beginner',
                availability TEXT NOT NULL DEFAULT 'Available',
                skills_json TEXT NOT NULL DEFAULT '[]',
                skills_to_learn_json TEXT NOT NULL DEFAULT '[]',
                photo TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS connection_requests (
                id TEXT PRIMARY KEY,
                from_user_id TEXT NOT NULL REFERENCES users(id),
                to_user_id TEXT NOT NULL REFERENCES users(id),
                skill TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                message TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                host_user_id TEXT NOT NULL REFERENCES users(id),
                partner_user_id TEXT NOT NULL REFERENCES users(id),
                skill TEXT NOT NULL,
                started_at TEXT NOT NULL,
                ended_at TEXT
            );
            CREATE TABLE IF NOT EXISTS reviews (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL REFERENCES sessions(id),
                from_user_id TEXT NOT NULL REFERENCES users(id),
                to_user_id TEXT NOT NULL REFERENCES users(id),
                rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
                text TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            """
        )


class SkillExchangeHandler(BaseHTTPRequestHandler):
    server_version = "SkillExchangeLocal/1.0"

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=True).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        request = urlparse(self.path)
        if request.path == "/api/health":
            self.send_json(200, {"ok": True, "database": str(DATABASE_PATH)})
            return

        if request.path == "/api/tables":
            with connect_database() as database:
                tables = []
                for name in TABLE_COLUMNS:
                    count = database.execute(f"SELECT COUNT(*) FROM {name}").fetchone()[0]
                    tables.append({"name": name, "count": count})
            self.send_json(200, {"tables": tables})
            return

        if request.path == "/api/records":
            table = parse_qs(request.query).get("table", [""])[0]
            if table not in TABLE_COLUMNS:
                self.send_json(400, {"error": "Unknown table name."})
                return
            with connect_database() as database:
                rows = database.execute(f"SELECT * FROM {table} ORDER BY rowid DESC LIMIT 500").fetchall()
            self.send_json(200, {"table": table, "columns": TABLE_COLUMNS[table], "rows": [dict(row) for row in rows]})
            return

        if request.path == "/" or request.path == "/database":
            self.serve_file("database.html", "text/html; charset=utf-8")
            return

        if request.path in ("/database.css", "/database.js"):
            filename = request.path.lstrip("/")
            content_type = "text/css; charset=utf-8" if filename.endswith(".css") else "text/javascript; charset=utf-8"
            self.serve_file(filename, content_type)
            return

        self.send_json(404, {"error": "Not found."})

    def do_POST(self):
        request = urlparse(self.path)
        table = parse_qs(request.query).get("table", [""])[0]
        if request.path != "/api/records" or table not in TABLE_COLUMNS:
            self.send_json(404, {"error": "Unknown table endpoint."})
            return

        try:
            payload = json.loads(self.rfile.read(int(self.headers.get("Content-Length", "0"))))
            if not isinstance(payload, dict):
                raise ValueError("Expected a JSON object.")
            values = self.prepare_record(table, payload)
            columns = list(values)
            placeholders = ", ".join("?" for _ in columns)
            column_sql = ", ".join(columns)
            with connect_database() as database:
                database.execute(
                    f"INSERT INTO {table} ({column_sql}) VALUES ({placeholders})",
                    [values[column] for column in columns],
                )
            self.send_json(201, {"saved": True, "table": table, "id": values["id"]})
        except (ValueError, TypeError, json.JSONDecodeError) as error:
            self.send_json(400, {"error": str(error)})
        except sqlite3.IntegrityError as error:
            self.send_json(409, {"error": str(error)})

    def prepare_record(self, table, payload):
        now = datetime.now(timezone.utc).isoformat()
        values = {key: value for key, value in payload.items() if key in TABLE_COLUMNS[table]}
        values.setdefault("id", f"{table}-{uuid.uuid4().hex}")

        if table == "users":
            if not str(values.get("name", "")).strip() or not str(values.get("email", "")).strip():
                raise ValueError("Users need a name and email.")
            for key in ("skills_json", "skills_to_learn_json"):
                value = values.get(key, "[]")
                if isinstance(value, list):
                    value = json.dumps(value)
                if not isinstance(value, str):
                    raise ValueError(f"{key} must be a JSON string or list.")
                json.loads(value)
                values[key] = value
            values.setdefault("experience", "Beginner")
            values.setdefault("availability", "Available")
            values.setdefault("created_at", now)
        elif table == "connection_requests":
            for key in ("from_user_id", "to_user_id", "skill"):
                if not str(values.get(key, "")).strip():
                    raise ValueError(f"{key} is required.")
            values.setdefault("status", "pending")
            values.setdefault("message", "")
            values.setdefault("created_at", now)
        elif table == "sessions":
            for key in ("host_user_id", "partner_user_id", "skill"):
                if not str(values.get(key, "")).strip():
                    raise ValueError(f"{key} is required.")
            values.setdefault("started_at", now)
        elif table == "reviews":
            for key in ("session_id", "from_user_id", "to_user_id", "text"):
                if not str(values.get(key, "")).strip():
                    raise ValueError(f"{key} is required.")
            rating = int(values.get("rating", 0))
            if rating < 1 or rating > 5:
                raise ValueError("rating must be between 1 and 5.")
            values["rating"] = rating
            values.setdefault("created_at", now)
        return values

    def serve_file(self, filename, content_type):
        path = BACKEND_DIR / filename
        body = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format_string, *args):
        print(f"{self.log_date_time_string()} {format_string % args}")


if __name__ == "__main__":
    initialize_database()
    address = ("127.0.0.1", 8001)
    print(f"Skill Exchange backend: http://{address[0]}:{address[1]}")
    print(f"Database file: {DATABASE_PATH}")
    ThreadingHTTPServer(address, SkillExchangeHandler).serve_forever()