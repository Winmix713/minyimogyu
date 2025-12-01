---
title: "API Reference – Supabase Edge Functions"
description: "Complete API reference for WinMix TipsterHub Edge Functions"
category: "05-api-reference"
language: "en"
version: "1.1.0"
last_updated: "2025-11-27"
author: "WinMix API Team"
status: "active"
related_docs:
  - "/docs/05-api-reference/AUTHENTICATION.md"
  - "/docs/07-security/JWT_ENFORCEMENT.md"
  - "/docs/07-security/RBAC_IMPLEMENTATION.md"
tags: ["api", "edge-functions", "reference", "endpoints"]
---

# API Reference – Supabase Edge Functions

> **Magyar Összefoglaló:** Teljes API referencia a Supabase Edge Functions-höz. Minden endpoint támogatja a CORS-t és JSON body vagy URL query paramétereket fogad. Az autentikációs követelmények endpointonként változnak.

---

## Base URLs

**Local Development:**
```
http://localhost:54321/functions/v1/<function-name>
```

**Production:**
```
https://<project-id>.supabase.co/functions/v1/<function-name>
```

---

## Authentication

Most endpoints require authentication via **JWT Bearer token**:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/models-performance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"period": "last_30_days"}'
```

---

## Edge Functions Reference

### 1. `team-streaks`

**Purpose:** Get team streak analysis  
**Method:** GET or POST  
**Auth:** Optional (read-only via service role)

**Parameters:**
- `teamId` (UUID, optional if `teamName` provided)
- `teamName` (string, optional)

**Response:**
```json
{
  "team_id": "uuid",
  "streaks": {
    "overall_winning": {
      "pattern_type": "string",
      "pattern_name": "string",
      "confidence": 0.85,
      "strength": 0.75,
      "prediction_impact": 0.15,
      "metadata": {}
    },
    "clean_sheet": {...},
    "btts": {...},
    "home_winning": 5
  }
}
```

**Error Codes:**
- `400` - Missing parameters
- `404` - Team not found
- `500` - Server error

---

### 2. `team-transition-matrix`

**Purpose:** Get Markov transition matrix for team results  
**Method:** GET or POST  
**Auth:** Optional (read-only via service role)

**Parameters:**
- `teamId` (UUID, optional if `teamName` provided)
- `teamName` (string, optional)
- `maxMatches` (number, default: 20, min: 5, max: 50)

**Response:**
```json
{
  "team_id": "uuid",
  "matrix": [
    [0.6, 0.2, 0.2],
    [0.3, 0.4, 0.3],
    [0.2, 0.3, 0.5]
  ],
  "counts": [[12, 4, 4], [6, 8, 6], [4, 6, 10]],
  "sampleSize": 20,
  "confidence": "medium"
}
```

---

### 3. `patterns-detect`

**Purpose:** Detect patterns for teams (existing implementation)  
**Method:** GET or POST  
**Auth:** Required (admin/analyst)

**Parameters:**
- `team_id` or `team_name` (required)
- `pattern_types` (array): `["winning_streak", "home_dominance", "high_scoring_trend", "form_surge"]`

**Response:**
```json
{
  "patterns": [
    {
      "id": "uuid",
      "team_id": "uuid",
      "pattern_name": "winning_streak",
      "confidence": 0.88,
      "valid_from": "2025-11-01T00:00:00Z",
      "valid_until": "2025-12-31T23:59:59Z"
    }
  ]
}
```

---

### 4. `jobs-list`

**Purpose:** List all scheduled jobs  
**Method:** GET  
**Auth:** Required (analyst/admin)

**Response:**
```json
{
  "jobs": [
    {
      "id": "uuid",
      "name": "Daily Data Collection",
      "schedule": "0 2 * * *",
      "enabled": true,
      "last_run": "2025-11-27T02:00:00Z",
      "next_run": "2025-11-28T02:00:00Z"
    }
  ]
}
```

---

### 5. `jobs-create`

**Purpose:** Create a new scheduled job  
**Method:** POST  
**Auth:** Required (admin)

**Body:**
```json
{
  "name": "Custom Job",
  "schedule": "0 3 * * *",
  "function_name": "my-edge-function",
  "enabled": true
}
```

---

### 6. `jobs-toggle`

**Purpose:** Enable/disable a job  
**Method:** POST  
**Auth:** Required (analyst/admin)

**Body:**
```json
{
  "job_id": "uuid",
  "enabled": false
}
```

---

### 7. `jobs-trigger`

**Purpose:** Manually trigger a job  
**Method:** POST  
**Auth:** Required (analyst/admin)

**Body:**
```json
{
  "job_id": "uuid"
}
```

---

### 8. `models-performance`

**Purpose:** Get model performance metrics  
**Method:** GET or POST  
**Auth:** Required (analyst/admin)

**Parameters:**
- `period` (string): `"last_7_days"`, `"last_30_days"`, `"last_90_days"`, `"all_time"`
- `model_id` (UUID, optional): Filter by specific model

**Response:**
```json
{
  "model_version": "v2.3",
  "period_start": "2025-11-01",
  "period_end": "2025-11-27",
  "total_predictions": 1248,
  "accuracy_overall": 0.742,
  "accuracy_winner": 0.68,
  "accuracy_btts": 0.79,
  "confidence_calibration_score": 0.91,
  "league_breakdown": {
    "Premier League": {...},
    "La Liga": {...}
  }
}
```

---

### 9. `admin-model-analytics`

**Purpose:** Advanced model analytics for admins  
**Method:** POST  
**Auth:** Required (admin only)

**Body:**
```json
{
  "metrics": ["accuracy", "precision", "recall", "f1_score"],
  "group_by": "league",
  "period": "last_30_days"
}
```

---

### 10. `admin-model-update-champion`

**Purpose:** Promote a challenger model to champion  
**Method:** POST  
**Auth:** Required (admin only)

**Body:**
```json
{
  "model_id": "uuid",
  "reason": "Improved accuracy by 5%"
}
```

---

### 11. `analyze-match`

**Purpose:** Analyze a match and generate prediction  
**Method:** POST  
**Auth:** Required (analyst/admin)

**Body:**
```json
{
  "match_id": "uuid",
  "include_patterns": true
}
```

**Response:**
```json
{
  "prediction": {
    "predicted_outcome": "home_win",
    "confidence_score": 0.78,
    "predicted_home_score": 2,
    "predicted_away_score": 1
  },
  "patterns": [...]
}
```

---

### 12. `predictions-track`

**Purpose:** Track prediction performance  
**Method:** POST  
**Auth:** Required (service role)

**Body:**
```json
{
  "prediction_id": "uuid",
  "actual_outcome": "home_win",
  "actual_home_score": 2,
  "actual_away_score": 0
}
```

---

### 13. `get-predictions` (Public)

**Purpose:** Get public predictions  
**Method:** GET  
**Auth:** None (public endpoint)

**Query Params:**
- `league_id` (UUID, optional)
- `limit` (number, default: 10, max: 100)

**Response:**
```json
{
  "predictions": [
    {
      "id": "uuid",
      "match_id": "uuid",
      "predicted_outcome": "home_win",
      "confidence_score": 0.75
    }
  ]
}
```

---

### 14. `phase9-collaborative-intelligence`

**Purpose:** Get crowd wisdom aggregation  
**Method:** POST  
**Auth:** Required (authenticated)

**Body:**
```json
{
  "match_id": "uuid"
}
```

---

### 15. `phase9-market-integration`

**Purpose:** Get market odds and value bets  
**Method:** POST  
**Auth:** Required (analyst/admin)

**Body:**
```json
{
  "match_id": "uuid"
}
```

---

## Error Response Format

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": {}
  }
}
```

**Common Error Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

**Default Limits:**
- Public endpoints: 100 requests/minute
- Authenticated endpoints: 500 requests/minute
- Admin endpoints: 1000 requests/minute

---

## CORS Configuration

All Edge Functions support CORS with the following headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
```

---

## Security Notes

- **Service Role Usage**: Keep service role read-only unless absolutely necessary
- **Sensitive Tables**: Protect endpoints using RBAC and `_shared/auth.ts` helpers
- **JWT Verification**: Configure per-function in `config.toml`

---

## Related Documentation

- **[Authentication Guide](./AUTHENTICATION.md)** - Auth implementation details
- **[JWT Enforcement](../07-security/JWT_ENFORCEMENT.md)** - Token management
- **[RBAC Implementation](../07-security/RBAC_IMPLEMENTATION.md)** - Role-based access

---

**Version**: 1.1.0  
**Last Updated**: 2025-11-27  
**Maintainer**: API Team
