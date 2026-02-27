-- Recent Security Logs
SELECT * FROM "SecurityLog" ORDER BY "createdAt" DESC LIMIT 10;

-- Client Users
SELECT id, name, email, role FROM "User" WHERE role = 'CLIENT';

-- Active Magic Tokens
SELECT * FROM "MagicToken" WHERE "expiresAt" > NOW() AND used = false ORDER BY "createdAt" DESC LIMIT 5;
