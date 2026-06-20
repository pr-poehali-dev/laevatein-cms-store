-- Таблица логов запросов к AI
CREATE TABLE IF NOT EXISTS requests_log (
    id SERIAL PRIMARY KEY,
    license_key VARCHAR(64) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    prompt_preview TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requests_log_license ON requests_log(license_key);
CREATE INDEX IF NOT EXISTS idx_requests_log_user ON requests_log(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_log_created ON requests_log(created_at DESC);