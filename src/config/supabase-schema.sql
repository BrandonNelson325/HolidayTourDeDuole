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

-- Daily Results table
CREATE TABLE public.daily_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    racer_id UUID NOT NULL REFERENCES public.racers(id),
    day INTEGER NOT NULL CHECK (day BETWEEN 1 AND 5),
    time INTEGER NOT NULL,
    sprint_points INTEGER DEFAULT 0 NOT NULL,
    kom_points INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(racer_id, day)
);

-- Function to update racer totals
CREATE OR REPLACE FUNCTION public.update_racer_totals(racer_uuid UUID)
RETURNS void AS $$
BEGIN
    -- Update the racer's totals
    UPDATE public.racers
    SET 
        total_time = COALESCE((
            SELECT SUM(time)
            FROM public.daily_results
            WHERE racer_id = racer_uuid
        ), 0),
        total_sprint_points = COALESCE((
            SELECT SUM(sprint_points)
            FROM public.daily_results
            WHERE racer_id = racer_uuid
        ), 0),
        total_kom_points = COALESCE((
            SELECT SUM(kom_points)
            FROM public.daily_results
            WHERE racer_id = racer_uuid
        ), 0),
        current_day = LEAST(
            (SELECT COUNT(*) + 1
             FROM public.daily_results
             WHERE racer_id = racer_uuid), 5),
        updated_at = NOW()
    WHERE id = racer_uuid;
END;
$$ LANGUAGE plpgsql;

-- View for racer standings with completed stages count
CREATE OR REPLACE VIEW public.racer_standings AS
SELECT 
    r.id,
    r.name,
    r.gender,
    r.total_time,
    r.total_sprint_points,
    r.total_kom_points,
    r.current_day,
    COALESCE((
        SELECT COUNT(*)
        FROM public.daily_results dr
        WHERE dr.racer_id = r.id
    ), 0) as completed_stages
FROM public.racers r
WHERE r.is_active = true
ORDER BY 
    CASE WHEN r.total_time = 0 THEN 1 ELSE 0 END,
    r.total_time ASC;

-- Enable Row Level Security (RLS)
ALTER TABLE public.racers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access" ON public.racers
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.daily_results
    FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated insert" ON public.racers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert/update" ON public.daily_results
    FOR ALL USING (auth.role() = 'authenticated');