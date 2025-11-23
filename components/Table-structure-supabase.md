| Table Name    | Column Name          | Data Type                | Max Length | Nullable | Default Value                             | Primary Key |
| ------------- | -------------------- | ------------------------ | ---------- | -------- | ----------------------------------------- | ----------- |
| applications  | id                   | bigint                   | null       | NO       | nextval('applications_id_seq'::regclass)  | YES         |
| applications  | student_id           | bigint                   | null       | YES      | null                                      | NO          |
| applications  | course_id            | bigint                   | null       | NO       | null                                      | NO          |
| applications  | provider_id          | bigint                   | null       | NO       | null                                      | NO          |
| applications  | first_name           | text                     | null       | NO       | null                                      | NO          |
| applications  | last_name            | text                     | null       | NO       | null                                      | NO          |
| applications  | email                | text                     | null       | NO       | null                                      | NO          |
| applications  | phone                | text                     | null       | NO       | null                                      | NO          |
| applications  | message              | text                     | null       | YES      | null                                      | NO          |
| applications  | funding_type         | text                     | null       | YES      | null                                      | NO          |
| applications  | has_funding_approved | boolean                  | null       | YES      | false                                     | NO          |
| applications  | status               | text                     | null       | YES      | 'pending'::text                           | NO          |
| applications  | provider_notes       | text                     | null       | YES      | null                                      | NO          |
| applications  | rejection_reason     | text                     | null       | YES      | null                                      | NO          |
| applications  | applied_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| applications  | updated_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| applications  | contacted_at         | timestamp with time zone | null       | YES      | null                                      | NO          |
| applications  | interview_at         | timestamp with time zone | null       | YES      | null                                      | NO          |
| applications  | enrolled_at          | timestamp with time zone | null       | YES      | null                                      | NO          |
| applications  | source               | text                     | null       | YES      | 'course_page'::text                       | NO          |
| applications  | provider_viewed      | boolean                  | null       | NO       | false                                     | NO          |
| applications  | provider_viewed_at   | timestamp with time zone | null       | YES      | null                                      | NO          |
| applications  | gdpr_consent         | boolean                  | null       | NO       | true                                      | NO          |
| applications  | marketing_consent    | boolean                  | null       | NO       | false                                     | NO          |
| chat_history  | id                   | bigint                   | null       | NO       | nextval('chat_history_id_seq'::regclass)  | YES         |
| chat_history  | student_id           | bigint                   | null       | YES      | null                                      | NO          |
| chat_history  | conversation_id      | uuid                     | null       | YES      | gen_random_uuid()                         | NO          |
| chat_history  | conversation_title   | text                     | null       | YES      | null                                      | NO          |
| chat_history  | role                 | text                     | null       | NO       | null                                      | NO          |
| chat_history  | content              | text                     | null       | NO       | null                                      | NO          |
| chat_history  | course_context_id    | bigint                   | null       | YES      | null                                      | NO          |
| chat_history  | page_url             | text                     | null       | YES      | null                                      | NO          |
| chat_history  | created_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| course_clicks | id                   | bigint                   | null       | NO       | nextval('course_clicks_id_seq'::regclass) | YES         |
| course_clicks | course_id            | bigint                   | null       | YES      | null                                      | NO          |
| course_clicks | provider_id          | bigint                   | null       | YES      | null                                      | NO          |
| course_clicks | clicked_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| course_clicks | user_agent           | text                     | null       | YES      | null                                      | NO          |
| course_clicks | ip_address           | text                     | null       | YES      | null                                      | NO          |
| course_clicks | referrer             | text                     | null       | YES      | null                                      | NO          |
| course_clicks | click_type           | text                     | null       | YES      | null                                      | NO          |
| course_clicks | date                 | date                     | null       | YES      | CURRENT_DATE                              | NO          |
| course_views  | id                   | bigint                   | null       | NO       | nextval('course_views_id_seq'::regclass)  | YES         |
| course_views  | course_id            | bigint                   | null       | YES      | null                                      | NO          |
| course_views  | provider_id          | bigint                   | null       | YES      | null                                      | NO          |
| course_views  | viewed_at            | timestamp with time zone | null       | YES      | now()                                     | NO          |
| course_views  | user_agent           | text                     | null       | YES      | null                                      | NO          |
| course_views  | ip_address           | text                     | null       | YES      | null                                      | NO          |
| course_views  | referrer             | text                     | null       | YES      | null                                      | NO          |
| course_views  | date                 | date                     | null       | YES      | CURRENT_DATE                              | NO          |
| courses       | id                   | bigint                   | null       | NO       | nextval('courses_id_seq'::regclass)       | YES         |
| courses       | course_id            | text                     | null       | NO       | null                                      | NO          |
| courses       | title                | text                     | null       | NO       | null                                      | NO          |
| courses       | subtitle             | text                     | null       | YES      | null                                      | NO          |
| courses       | description          | text                     | null       | NO       | null                                      | NO          |
| courses       | format               | text                     | null       | NO       | null                                      | NO          |
| courses       | duration             | text                     | null       | NO       | null                                      | NO          |
| courses       | duration_hours       | text                     | null       | YES      | null                                      | NO          |
| courses       | location             | text                     | null       | YES      | null                                      | NO          |
| courses       | start_date           | date                     | null       | YES      | null                                      | NO          |
| courses       | next_start_dates     | ARRAY                    | null       | YES      | null                                      | NO          |
| courses       | price                | numeric                  | null       | YES      | null                                      | NO          |
| courses       | price_type           | text                     | null       | YES      | null                                      | NO          |
| courses       | funding_eligible     | boolean                  | null       | YES      | false                                     | NO          |
| courses       | funding_types        | ARRAY                    | null       | YES      | null                                      | NO          |
| courses       | prerequisites        | ARRAY                    | null       | YES      | null                                      | NO          |
| courses       | curriculum           | jsonb                    | null       | YES      | null                                      | NO          |
| courses       | learning_objectives  | ARRAY                    | null       | YES      | null                                      | NO          |
| courses       | target_audience      | ARRAY                    | null       | YES      | null                                      | NO          |
| courses       | career_paths         | jsonb                    | null       | YES      | null                                      | NO          |
| courses       | certificate_type     | text                     | null       | YES      | null                                      | NO          |
| courses       | job_placement_rate   | integer                  | null       | YES      | null                                      | NO          |
| courses       | provider_id          | text                     | null       | NO       | null                                      | NO          |
| courses       | slug                 | text                     | null       | NO       | null                                      | NO          |
| courses       | meta_title           | text                     | null       | YES      | null                                      | NO          |
| courses       | meta_description     | text                     | null       | YES      | null                                      | NO          |
| courses       | keywords             | ARRAY                    | null       | YES      | null                                      | NO          |
| courses       | badges               | ARRAY                    | null       | YES      | null                                      | NO          |
| courses       | view_count           | integer                  | null       | YES      | 0                                         | NO          |
| courses       | application_count    | integer                  | null       | YES      | 0                                         | NO          |
| courses       | click_count          | integer                  | null       | YES      | 0                                         | NO          |
| courses       | status               | text                     | null       | YES      | 'active'::text                            | NO          |
| courses       | is_featured          | boolean                  | null       | YES      | false                                     | NO          |
| courses       | created_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| courses       | updated_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| courses       | published_at         | timestamp with time zone | null       | YES      | null                                      | NO          |
| courses       | infomaterial_url     | text                     | null       | YES      | null                                      | NO          |
| courses       | image_url            | text                     | null       | YES      | null                                      | NO          |
| courses       | benefits             | text                     | null       | YES      | null                                      | NO          |
| courses       | language             | text                     | null       | YES      | 'Deutsch'::text                           | NO          |
| courses       | category             | text                     | null       | YES      | null                                      | NO          |
| provider_faqs | id                   | bigint                   | null       | NO       | nextval('provider_faqs_id_seq'::regclass) | YES         |
| provider_faqs | provider_id          | text                     | null       | NO       | null                                      | NO          |
| provider_faqs | question             | text                     | null       | NO       | null                                      | NO          |
| provider_faqs | answer               | text                     | null       | NO       | null                                      | NO          |
| provider_faqs | display_order        | integer                  | null       | YES      | 0                                         | NO          |
| provider_faqs | is_active            | boolean                  | null       | YES      | true                                      | NO          |
| provider_faqs | created_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| provider_faqs | updated_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| providers     | id                   | bigint                   | null       | NO       | null                                      | YES         |
| providers     | auth_user_id         | uuid                     | null       | YES      | auth.uid()                                | NO          |
| providers     | provider_id          | text                     | null       | YES      | null                                      | NO          |
| providers     | email                | text                     | null       | NO       | null                                      | NO          |
| providers     | company_name         | text                     | null       | NO       | null                                      | NO          |
| providers     | contact_name         | text                     | null       | NO       | null                                      | NO          |
| providers     | phone                | text                     | null       | YES      | null                                      | NO          |
| providers     | website              | text                     | null       | YES      | null                                      | NO          |
| providers     | description          | text                     | null       | YES      | null                                      | NO          |
| providers     | street               | text                     | null       | YES      | null                                      | NO          |
| providers     | city                 | text                     | null       | YES      | null                                      | NO          |
| providers     | postal_code          | text                     | null       | YES      | null                                      | NO          |
| providers     | logo_url             | text                     | null       | YES      | null                                      | NO          |
| providers     | created_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| providers     | updated_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| providers     | certifications       | ARRAY                    | null       | YES      | '{}'::text[]                              | NO          |
| providers     | year_founded         | integer                  | null       | YES      | null                                      | NO          |
| providers     | employee_count       | text                     | null       | YES      | null                                      | NO          |
| providers     | social_media         | jsonb                    | null       | YES      | '{}'::jsonb                               | NO          |
| providers     | faq                  | jsonb                    | null       | YES      | '[]'::jsonb                               | NO          |
| providers     | Certification        | text                     | null       | YES      | null                                      | NO          |
| saved_courses | id                   | bigint                   | null       | NO       | nextval('saved_courses_id_seq'::regclass) | YES         |
| saved_courses | student_id           | bigint                   | null       | NO       | null                                      | NO          |
| saved_courses | course_id            | bigint                   | null       | NO       | null                                      | NO          |
| saved_courses | notes                | text                     | null       | YES      | null                                      | NO          |
| saved_courses | saved_at             | timestamp with time zone | null       | YES      | now()                                     | NO          |
| students      | id                   | bigint                   | null       | NO       | nextval('students_id_seq'::regclass)      | YES         |
| students      | auth_user_id         | uuid                     | null       | YES      | null                                      | NO          |
| students      | email                | USER-DEFINED             | null       | NO       | null                                      | NO          |
| students      | first_name           | text                     | null       | YES      | null                                      | NO          |
| students      | last_name            | text                     | null       | YES      | null                                      | NO          |
| students      | phone                | text                     | null       | YES      | null                                      | NO          |
| students      | bio                  | text                     | null       | YES      | null                                      | NO          |
| students      | avatar_url           | text                     | null       | YES      | null                                      | NO          |
| students      | education_level      | text                     | null       | YES      | null                                      | NO          |
| students      | interests            | ARRAY                    | null       | YES      | null                                      | NO          |
| students      | location_preference  | text                     | null       | YES      | null                                      | NO          |
| students      | email_notifications  | boolean                  | null       | YES      | true                                      | NO          |
| students      | is_active            | boolean                  | null       | YES      | true                                      | NO          |
| students      | created_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |
| students      | updated_at           | timestamp with time zone | null       | YES      | now()                                     | NO          |