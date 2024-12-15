-- Enable PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Racers table
CREATE TABLE public.racers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    total_time INTEGER DEFAULT 0 NOT NULL,
    total_sprint_points INTEGER DEFAULT 0 NOT NULL,
    total_kom_points INTEGER DEFAULT 0 NOT NULL,
    current_day INTEGER DEFAULT 1 NOT NULL CHECK (current_day BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Daily results table
CREATE TABLE public.daily_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    racer_id UUID REFERENCES public.racers(id) ON DELETE CASCADE NOT NULL,
    day INTEGER NOT NULL CHECK (day BETWEEN 1 AND 5),
    time INTEGER NOT NULL,
    sprint_points INTEGER DEFAULT 0 NOT NULL,
    kom_points INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(racer_id, day)
);

-- Create indexes
CREATE INDEX idx_racers_current_day ON public.racers(current_day);
CREATE INDEX idx_daily_results_racer_day ON public.daily_results(racer_id, day);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER handle_racers_updated_at
    BEFORE UPDATE ON public.racers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_daily_results_updated_at
    BEFORE UPDATE ON public.daily_results
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.racers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.racers
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.daily_results
    FOR SELECT USING (true);

CREATE POLICY "Enable write access for authenticated users" ON public.racers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write access for authenticated users" ON public.daily_results
    FOR ALL USING (auth.role() = 'authenticated');

-- Function to update racer totals
CREATE OR REPLACE FUNCTION public.update_racer_totals(racer_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.racers
    SET 
        total_time = (
            SELECT COALESCE(SUM(time), 0)
            FROM public.daily_results
            WHERE racer_id = racer_uuid
        ),
        total_sprint_points = (
            SELECT COALESCE(SUM(sprint_points), 0)
            FROM public.daily_results
            WHERE racer_id = racer_uuid
        ),
        total_kom_points = (
            SELECT COALESCE(SUM(kom_points), 0)
            FROM public.daily_results
            WHERE racer_id = racer_uuid
        ),
        current_day = (
            SELECT 
                CASE 
                    WHEN COUNT(*) >= 5 THEN 5
                    ELSE COUNT(*) + 1
                END
            FROM public.daily_results
            WHERE racer_id = racer_uuid
        )
    WHERE id = racer_uuid;
END;
$$ LANGUAGE plpgsql;