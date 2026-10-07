# Skill Exchange Backend

This backend is separate from the existing website. No existing HTML, CSS, or JavaScript files are modified by this backend setup.

## Start it

Open PowerShell in this folder and run:

```powershell
python3 server.py
```

Then open the database viewer at <http://127.0.0.1:8001/database>.

## Database file

SQLite creates the database automatically at `backend/data/skill_exchange.db` when the server first starts. It contains `users`, `connection_requests`, `sessions`, and `reviews` tables. Use the database viewer to inspect rows; DB Browser for SQLite can also open the `.db` file directly.

## API

- `GET /api/health`
- `GET /api/tables`
- `GET /api/records?table=users`
- `POST /api/records?table=users`
- `POST /api/records?table=connection_requests`
- `POST /api/records?table=sessions`
- `POST /api/records?table=reviews`

The server binds to `127.0.0.1` for local development. The current website still stores its data in browser `localStorage`; this separate backend is not connected to the website yet, because its frontend files are being kept unchanged.