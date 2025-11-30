-- =====================================================
-- NOTIFICATIONS TABLE MIGRATION
-- =====================================================
-- This migration creates the notifications system for
-- students and providers in the Kursfind AI platform.
-- =====================================================

-- 1. Create the notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User references (one of these should be non-null)
    user_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE,
    
    -- Role to distinguish notification target
    role TEXT NOT NULL CHECK (role IN ('student', 'provider')),
    
    -- Notification type and category
    type TEXT NOT NULL,
    -- Types: application_submitted, application_status_changed, additional_info_requested,
    --        application_withdrawn, platform_update, security, provider_new_application,
    --        provider_pending_decisions, provider_performance_update
    
    category TEXT NOT NULL DEFAULT 'applications',
    -- Categories: applications, actions_required, analytics, platform, security, billing
    
    -- Content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT, -- Internal app URL path, e.g., /student/dashboard/applications/123
    
    -- Status
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_user_reference CHECK (
        (role = 'student' AND user_id IS NOT NULL AND provider_id IS NULL) OR
        (role = 'provider' AND provider_id IS NOT NULL AND user_id IS NULL)
    )
);

-- 2. Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read 
    ON notifications(user_id, is_read) 
    WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_provider_id_is_read 
    ON notifications(provider_id, is_read) 
    WHERE provider_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_created_at 
    ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_role 
    ON notifications(role);

-- 3. Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Students
-- Students can only see their own notifications
CREATE POLICY "Students can view own notifications"
    ON notifications
    FOR SELECT
    TO authenticated
    USING (
        role = 'student' 
        AND user_id IN (
            SELECT id FROM students WHERE auth_user_id = auth.uid()
        )
    );

-- Students can update (mark as read) their own notifications
CREATE POLICY "Students can update own notifications"
    ON notifications
    FOR UPDATE
    TO authenticated
    USING (
        role = 'student' 
        AND user_id IN (
            SELECT id FROM students WHERE auth_user_id = auth.uid()
        )
    )
    WITH CHECK (
        role = 'student' 
        AND user_id IN (
            SELECT id FROM students WHERE auth_user_id = auth.uid()
        )
    );

-- 5. RLS Policies for Providers
-- Providers can only see their own notifications
CREATE POLICY "Providers can view own notifications"
    ON notifications
    FOR SELECT
    TO authenticated
    USING (
        role = 'provider' 
        AND provider_id IN (
            SELECT id FROM providers WHERE auth_user_id = auth.uid()
        )
    );

-- Providers can update (mark as read) their own notifications
CREATE POLICY "Providers can update own notifications"
    ON notifications
    FOR UPDATE
    TO authenticated
    USING (
        role = 'provider' 
        AND provider_id IN (
            SELECT id FROM providers WHERE auth_user_id = auth.uid()
        )
    )
    WITH CHECK (
        role = 'provider' 
        AND provider_id IN (
            SELECT id FROM providers WHERE auth_user_id = auth.uid()
        )
    );

-- 6. Service role can do everything (for backend notification creation)
CREATE POLICY "Service role full access"
    ON notifications
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- HELPER FUNCTION: Create a notification
-- =====================================================
CREATE OR REPLACE FUNCTION create_notification(
    p_role TEXT,
    p_user_id INTEGER DEFAULT NULL,
    p_provider_id INTEGER DEFAULT NULL,
    p_type TEXT DEFAULT 'platform_update',
    p_category TEXT DEFAULT 'platform',
    p_title TEXT DEFAULT '',
    p_message TEXT DEFAULT '',
    p_link TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO notifications (
        role,
        user_id,
        provider_id,
        type,
        category,
        title,
        message,
        link
    ) VALUES (
        p_role,
        p_user_id,
        p_provider_id,
        p_type,
        p_category,
        p_title,
        p_message,
        p_link
    )
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$;

-- Grant execute permission to authenticated users (for service role usage)
GRANT EXECUTE ON FUNCTION create_notification TO service_role;

-- =====================================================
-- VERIFICATION QUERIES (run after migration)
-- =====================================================
-- Check table exists:
-- SELECT * FROM notifications LIMIT 1;

-- Check indexes:
-- SELECT indexname FROM pg_indexes WHERE tablename = 'notifications';

-- Check RLS policies:
-- SELECT policyname FROM pg_policies WHERE tablename = 'notifications';
