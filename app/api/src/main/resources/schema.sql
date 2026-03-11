CREATE TABLE IF NOT EXISTS banks (
    id INTEGER PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    student_number TEXT NOT NULL UNIQUE,
    bank_id INTEGER NOT NULL,
    allowance_amount NUMERIC NOT NULL DEFAULT 0,
    loan_limit NUMERIC NOT NULL DEFAULT 0,
    bank_account TEXT NOT NULL DEFAULT '0000000000000000',
    FOREIGN KEY (bank_id) REFERENCES banks(id)
);

CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    disbursed_at TEXT NOT NULL,
    note TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS allowances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    disbursed_at TEXT NOT NULL,
    note TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    student_id INTEGER NOT NULL,
    bank_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    processed_by TEXT NOT NULL,
    processed_at TEXT NOT NULL,
    note TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (bank_id) REFERENCES banks(id)
);

CREATE TABLE IF NOT EXISTS access_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor TEXT NOT NULL,
    role TEXT NOT NULL,
    bank_id INTEGER,
    student_id INTEGER,
    action TEXT NOT NULL,
    outcome TEXT NOT NULL,
    reason TEXT NOT NULL,
    timestamp TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    bank_id INTEGER,
    student_id INTEGER,
    enabled INTEGER NOT NULL DEFAULT 1
);
