-- Enable PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Racers table
CREATE TABLE public.racers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female')) NOT NULL,
    total_time INTEGER DEFAULT 0 NOT NULL,
    total_sprint_points INTEGER DEFAULT 0 NOT NULL,
    total_kom_points INTEGER DEFAULT 0 NOT NULL,
    current_day INTEGER DEFAULT 1 NOT NULL CHECK (current_day BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Rest of the schema remains the same...