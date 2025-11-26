# WinMix TipsterHub - Comprehensive Database Migration Guide

## Overview

This document explains the comprehensive database migration (`20260120000000_comprehensive_database_setup.sql`) that consolidates all database schema, RBAC, functions, triggers, RLS policies, and seed data into a single, production-ready migration script.

## Migration Structure

### 1. Role-Based Access Control (RBAC) System

The migration creates a hierarchical role system with the following roles:

- **`winmix_admin`**: Full access to all resources
- **`winmix_analyst`**: Read access to analytics, write access to experiments
- **`winmix_predictor`**: Can create and manage predictions
- **`winmix_team_manager`**: Can manage team-related data
- **`winmix_viewer`**: Read-only access to public data
- **`winmix_service`**: Service role for background tasks

#### Role Hierarchy
```
admin
└── analyst
    └── predictor
        └── team_manager
            └── viewer
```

### 2. Security Helper Functions

#### Core Functions
- `get_current_user_id()`: Safely retrieves current user ID
- `get_user_role(p_user_id)`: Gets user role from user_profiles
- `is_admin(p_user_id)`: Checks if user has admin role
- `is_analyst(p_user_id)`: Checks if user has analyst or higher role
- `is_predictor(p_user_id)`: Checks if user has predictor or higher role
- `is_team_manager(p_user_id)`: Checks if user has team_manager or higher role
- `is_service_role()`: Checks if current execution is from a service role

### 3. Database Schema

#### Core Tables

##### `user_profiles`
Stores user profile information and role assignments:
- `id`: UUID primary key (references auth.users)
- `email`: User email (unique)
- `full_name`: User's full name
- `role`: User role (admin, analyst, predictor, team_manager, viewer, demo)
- `is_active`: Whether the profile is active
- `preferences`: JSON object for user preferences
- `created_at`, `updated_at`: Timestamps

##### `leagues`
Football leagues with statistical metrics:
- `id`: UUID primary key
- `name`: League name
- `country`: Country of the league
- `season`: Season identifier
- `avg_goals_per_match`: Average goals per match
- `home_win_percentage`: Percentage of home wins
- `btts_percentage`: Both Teams To Score percentage
- `over_2_5_percentage`: Over 2.5 goals percentage
- `is_active`: Whether the league is currently active

##### `teams`
Football teams with league associations:
- `id`: UUID primary key
- `name`: Team name
- `league_id`: Reference to leagues table
- `short_name`: Short team name/abbreviation
- `founded_year`: Year the team was founded
- `stadium_name`: Home stadium name
- `stadium_capacity`: Stadium capacity
- `is_active`: Whether the team is currently active

##### `matches`
Football matches with scores and status:
- `id`: UUID primary key
- `league_id`: Reference to leagues table
- `home_team_id`: Reference to teams table (home team)
- `away_team_id`: Reference to teams table (away team)
- `match_date`: Match date and time
- `home_score`, `away_score`: Final scores
- `status`: Match status (scheduled, live, finished, postponed, cancelled)
- `match_week`: Match week number
- `venue`: Match venue (if different from team stadium)
- `attendance`: Match attendance
- `referee`: Match referee
- `weather_conditions`: Weather during match

##### `pattern_templates`
Predefined pattern types for prediction analysis:
- `id`: UUID primary key
- `name`: Pattern name (unique)
- `description`: Pattern description
- `category`: Pattern category (form, h2h, league, team_stats, external)
- `base_confidence_boost`: Base confidence boost for this pattern
- `is_active`: Whether the pattern is currently active
- `required_data`: JSON schema of required data for this pattern

##### `detected_patterns`
Specific patterns detected for matches:
- `id`: UUID primary key
- `match_id`: Reference to matches table
- `template_id`: Reference to pattern_templates
- `confidence_contribution`: Confidence contribution of this pattern
- `pattern_data`: Pattern-specific data (JSON)
- `created_by`: User who detected the pattern
- `detected_at`: When the pattern was detected

##### `predictions`
System-generated match predictions with evaluation:
- `id`: UUID primary key
- `match_id`: Reference to matches table
- `predicted_outcome`: Predicted outcome (home_win, draw, away_win)
- `confidence_score`: Confidence score (0-100)
- `predicted_home_score`, `predicted_away_score`: Predicted scores
- `btts_prediction`: Both Teams To Score prediction
- `over_under_prediction`: Over/under 2.5 goals prediction
- `model_version`: Model version used for prediction
- `created_by`: User/system that created prediction
- `actual_outcome`: Actual outcome (filled after match)
- `was_correct`: Whether prediction was correct
- `evaluation_confidence`: Confidence in evaluation
- `evaluated_at`: When prediction was evaluated

##### `pattern_accuracy`
Accuracy tracking for pattern templates:
- `id`: UUID primary key
- `template_id`: Reference to pattern_templates
- `total_predictions`: Total number of predictions using this pattern
- `correct_predictions`: Number of correct predictions
- `accuracy_rate`: Accuracy percentage
- `last_updated`: When accuracy was last updated

##### `user_predictions`
User-submitted predictions for collaborative intelligence:
- `id`: UUID primary key
- `match_id`: Reference to matches table
- `user_id`: Reference to auth.users
- `predicted_outcome`: User's predicted outcome
- `confidence_score`: User's confidence score
- `predicted_home_score`, `predicted_away_score`: User's score predictions
- `btts_prediction`: User's BTTS prediction
- `over_under_prediction`: User's over/under prediction
- `reasoning`: User's reasoning for the prediction
- `is_public`: Whether the prediction is public
- `created_at`, `updated_at`: Timestamps

##### `crowd_wisdom`
Aggregated crowd wisdom compared against model predictions:
- `id`: UUID primary key
- `match_id`: Reference to matches table
- `total_predictions`: Total number of user predictions
- `home_win_predictions`, `draw_predictions`, `away_win_predictions`: Prediction counts by outcome
- `average_confidence`: Average confidence of all predictions
- `consensus_prediction`: Crowd consensus prediction
- `consensus_confidence`: Confidence in consensus
- `model_vs_crowd_divergence`: Percentage difference between model and crowd
- `last_calculated_at`: When crowd wisdom was last calculated
- `created_at`, `updated_at`: Timestamps

### 4. Indexes for Performance

The migration creates comprehensive indexes for optimal query performance:

#### User-related indexes
- `idx_user_profiles_role`: Fast role-based queries
- `idx_user_profiles_active`: Quick active user lookup
- `idx_user_profiles_email`: Email-based lookups

#### Match-related indexes
- `idx_matches_date`: Chronological queries
- `idx_matches_status`: Status-based filtering
- `idx_matches_upcoming`: Upcoming matches optimization
- `idx_matches_league`, `idx_matches_home_team`, `idx_matches_away_team`: Join optimization

#### Prediction-related indexes
- `idx_predictions_evaluated`: Evaluation queries
- `idx_predictions_confidence`: High-confidence predictions
- `idx_user_predictions_public`: Public prediction queries

### 5. Triggers for Data Integrity

#### Automatic Timestamp Updates
- `update_updated_at_column()`: Automatically updates `updated_at` columns
- Applied to all tables with `updated_at` columns

#### Created By Management
- `set_created_by()`: Automatically sets `created_by` to current user
- Applied to user-owned tables

#### Pattern Accuracy Updates
- `update_pattern_accuracy()`: Updates pattern accuracy when predictions are evaluated
- Automatically tracks pattern performance

#### Crowd Wisdom Updates
- `update_crowd_wisdom()`: Updates crowd wisdom when user predictions change
- Maintains real-time crowd consensus

### 6. Row Level Security (RLS) Policies

#### Access Control Model

**Public Read Access:**
- `leagues`, `teams`, `matches`, `pattern_templates`, `predictions`, `pattern_accuracy`, `crowd_wisdom`
- Anonymous users can read basic data

**User-Owned Data:**
- `user_profiles`: Users can only access their own profile
- `detected_patterns`: Users can only access patterns they created
- `user_predictions`: Users can only access their own predictions (unless public)

**Role-Based Access:**
- **Admins**: Full access to all tables
- **Analysts**: Read access to analytics, write access to experiments
- **Service Role**: Write access to system-generated data
- **Authenticated Users**: Read access to public data

#### Policy Examples

```sql
-- User can only see their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Admins have full access
CREATE POLICY "Admins full access to user profiles" ON public.user_profiles
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Public can read active leagues
CREATE POLICY "Public read access to leagues" ON public.leagues
    FOR SELECT USING (is_active = true);
```

### 7. Utility Functions

#### `calculate_win_probability(p_confidence_score, p_home_advantage)`
Converts confidence score to win probability with optional home advantage.

#### `validate_prediction_data(p_match_id, p_predicted_outcome, p_confidence_score)`
Validates prediction data before insertion:
- Checks if match exists
- Prevents predictions on finished matches
- Validates confidence score range
- Validates predicted outcome

#### `get_user_statistics(p_user_id)`
Returns comprehensive user statistics as JSON:
```json
{
    "total_predictions": 150,
    "correct_predictions": 87,
    "accuracy_rate": 58.0,
    "average_confidence": 72.5,
    "last_prediction_date": "2024-01-15T14:30:00Z"
}
```

#### `get_match_prediction_summary(p_match_id)`
Returns complete match prediction summary:
```json
{
    "match_id": "uuid",
    "system_prediction": {
        "predicted_outcome": "home_win",
        "confidence_score": 75.5,
        "predicted_home_score": 2,
        "predicted_away_score": 1
    },
    "crowd_wisdom": {
        "total_predictions": 45,
        "consensus_prediction": "home_win",
        "consensus_confidence": 68.2,
        "average_confidence": 71.3
    },
    "user_predictions_count": 45
}
```

### 8. Views for Easy Access

#### `upcoming_matches_with_predictions`
Combines upcoming matches with system and crowd predictions:
```sql
SELECT * FROM public.upcoming_matches_with_predictions 
WHERE match_date > NOW() 
ORDER BY match_date ASC 
LIMIT 10;
```

#### `user_prediction_leaderboard`
Ranks users by prediction accuracy:
```sql
SELECT * FROM public.user_prediction_leaderboard 
ORDER BY accuracy_rate DESC 
LIMIT 20;
```

#### `pattern_performance_summary`
Shows pattern template performance:
```sql
SELECT * FROM public.pattern_performance_summary 
WHERE category = 'form' 
ORDER BY accuracy_rate DESC;
```

### 9. Seed Data

#### Pattern Templates
Pre-configured patterns for various prediction scenarios:
- Form patterns (winning streaks, recent form)
- Head-to-head patterns
- League-specific patterns
- Team statistics patterns
- External factors (derby matches)

#### Leagues and Teams
Major European leagues with complete team data:
- Premier League (England)
- La Liga (Spain)
- Serie A (Italy)
- Bundesliga (Germany)
- Ligue 1 (France)
- Eredivisie (Netherlands)
- Primeira Liga (Portugal)

#### Sample Matches
Automatically generated matches for the next 30 days to demonstrate functionality.

### 10. Permissions and Security

#### Default Security Setup
- Revokes all default permissions from `public`
- Grants minimal necessary permissions to `authenticated`
- Grants full permissions to `service_role` for system operations
- Sets up proper sequence permissions

#### View Access
- All authenticated users can read analytical views
- Views are pre-configured with appropriate RLS

### 11. Validation and Cleanup

#### Data Integrity Checks
- Ensures all pattern templates have accuracy records
- Updates crowd wisdom for existing user predictions
- Creates admin user profile if missing

#### Migration Logging
Logs successful migration completion with timestamp.

## Usage Instructions

### Running the Migration

1. **Backup Existing Database:**
   ```bash
   pg_dump your_database > backup_before_migration.sql
   ```

2. **Apply Migration:**
   ```bash
   psql your_database -f 20260120000000_comprehensive_database_setup.sql
   ```

3. **Verify Migration:**
   ```sql
   -- Check table creation
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   
   -- Check RLS is enabled
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   
   -- Check seed data
   SELECT COUNT(*) FROM leagues;
   SELECT COUNT(*) FROM teams;
   SELECT COUNT(*) FROM pattern_templates;
   ```

### Post-Migration Setup

1. **Create Additional Users:**
   ```sql
   INSERT INTO public.user_profiles (id, email, full_name, role, is_active)
   VALUES (
       gen_random_uuid(),
       'analyst@example.com',
       'John Analyst',
       'analyst',
       true
   );
   ```

2. **Configure Application Roles:**
   ```sql
   -- Grant application roles to database users
   GRANT winmix_analyst TO app_analyst_user;
   GRANT winmix_predictor TO app_predictor_user;
   ```

3. **Test RLS Policies:**
   ```sql
   -- Test as different roles
   SET ROLE winmix_viewer;
   SELECT COUNT(*) FROM user_profiles; -- Should return 0 or 1
   
   SET ROLE winmix_admin;
   SELECT COUNT(*) FROM user_profiles; -- Should return all
   ```

### Monitoring and Maintenance

#### Regular Maintenance Tasks

1. **Update Pattern Accuracy:**
   ```sql
   -- This is handled automatically by triggers
   -- But you can manually recalculate if needed
   UPDATE public.pattern_accuracy pa
   SET 
       total_predictions = sub.total,
       correct_predictions = sub.correct,
       accuracy_rate = ROUND((sub.correct * 100.0 / sub.total)::NUMERIC, 2),
       last_updated = NOW()
   FROM (
       SELECT 
           dp.template_id,
           COUNT(*) as total,
           COUNT(*) FILTER (WHERE p.was_correct = true) as correct
       FROM public.detected_patterns dp
       JOIN public.predictions p ON dp.match_id = p.match_id
       WHERE p.evaluated_at IS NOT NULL
       GROUP BY dp.template_id
   ) sub
   WHERE pa.template_id = sub.template_id;
   ```

2. **Clean Up Old Data:**
   ```sql
   -- Archive old predictions (older than 2 years)
   CREATE TABLE predictions_archive AS
   SELECT * FROM public.predictions 
   WHERE created_at < NOW() - INTERVAL '2 years';
   
   DELETE FROM public.predictions 
   WHERE created_at < NOW() - INTERVAL '2 years';
   ```

#### Performance Monitoring

1. **Check Index Usage:**
   ```sql
   SELECT 
       schemaname,
       tablename,
       indexname,
       idx_scan,
       idx_tup_read,
       idx_tup_fetch
   FROM pg_stat_user_indexes
   ORDER BY idx_scan DESC;
   ```

2. **Monitor RLS Performance:**
   ```sql
   SELECT 
       schemaname,
       tablename,
       policyname,
       permissive,
       roles,
       cmd,
       qual
   FROM pg_policies
   WHERE schemaname = 'public';
   ```

## Troubleshooting

### Common Issues

1. **RLS Policy Conflicts:**
   - Ensure policies don't overlap in conflicting ways
   - Use `EXPLAIN (VERBOSE, FORMAT JSON)` to analyze query planning

2. **Permission Errors:**
   - Check user roles with `SELECT current_user, current_setting('request.jwt.claims', true);`
   - Verify role assignments in `user_profiles`

3. **Performance Issues:**
   - Check index usage with `pg_stat_user_indexes`
   - Monitor slow queries with `pg_stat_statements`

4. **Data Integrity Issues:**
   - Check constraint violations in application logs
   - Use `SELECT * FROM pg_constraint WHERE convalidated = false;`

### Debugging RLS

```sql
-- Enable RLS debugging
SET rls.enable = on;

-- Test policies with specific user
SET request.jwt.claims = '{"sub": "user-uuid", "role": "authenticated"}';

-- Check what policies apply
EXPLAIN (VERBOSE, FORMAT JSON) 
SELECT * FROM public.user_profiles;
```

## Best Practices

1. **Always use parameterized queries** to prevent SQL injection
2. **Implement proper error handling** in application code
3. **Monitor database performance** regularly
4. **Keep RLS policies simple** for better performance
5. **Use appropriate indexes** for common query patterns
6. **Regularly backup the database** before major changes
7. **Test migrations** in development environment first
8. **Document any custom modifications** to the schema

## Security Considerations

1. **Never expose service role keys** in client applications
2. **Use JWT claims** for role-based access control
3. **Implement proper authentication** before database access
4. **Regularly review RLS policies** for security gaps
5. **Monitor access logs** for suspicious activity
6. **Use least privilege principle** for all database roles
7. **Encrypt sensitive data** at rest and in transit
8. **Implement proper audit logging** for compliance

## Future Enhancements

1. **Add more sophisticated pattern detection algorithms**
2. **Implement machine learning model versioning**
3. **Add real-time prediction scoring**
4. **Implement advanced analytics dashboards**
5. **Add support for multiple sports**
6. **Implement prediction market integration**
7. **Add social features for user interaction**
8. **Implement advanced caching strategies**

This comprehensive migration provides a solid foundation for the WinMix TipsterHub platform with proper security, performance, and scalability considerations.