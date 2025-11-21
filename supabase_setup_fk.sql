-- Add foreign key constraints to analytics tables
-- This enables Supabase's relationship syntax: courses(title)

-- For course_views table
ALTER TABLE course_views
ADD CONSTRAINT fk_course_views_course
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE course_views
ADD CONSTRAINT fk_course_views_provider
FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE;

-- For course_clicks table
ALTER TABLE course_clicks
ADD CONSTRAINT fk_course_clicks_course
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE course_clicks
ADD CONSTRAINT fk_course_clicks_provider
FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE;
