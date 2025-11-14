
# 📦 Lost & Found API (v1) — Technical Overview

A lightweight REST API for reporting found items and searching for lost items using AI (DeepSeek API).

**Base URL:** `/api/v1`
**Auth:** None (Temp)

---

# 🧱 Data Model: Item

Every item stored and returned by the API follows this structure:

```json
{
  "id": "uuid",
  "status": "found",
  "name": "Blue iPhone",
  "description": "AI-generated summary",
  "category": "Electronics",
  "tags": ["iphone", "blue", "library"],
  "location": "Main Library, 2nd Floor",
  "contact": "user@example.com",
  "imageUrl": "https://.../img.png",
  "createdAt": "ISO timestamp"
}
```

---

# 🚨 Error Format

All errors return:

```json
{ "error": "Message here." }
```

---

# 🔌 API Endpoints

---

## 1. **Report a Found Item**

**POST** `/api/v1/items`
Creates a new item and runs AI processing.

### Request Body (raw user input)

```json
{
  "name": "Blue iPhone",
  "description": "I found a blue iPhone 14...",
  "location": "Main Library, 2nd Floor",
  "contact": "finder@school.edu",
  "imageUrl": "https://.../image.png"
}
```

### Processing Flow (Backend)

1. Receive raw data
2. Send description → DeepSeek API for:

   * category
   * tags
   * 1-sentence summary
3. Construct final Item object
4. Store in database
5. Return full Item

### Success (201)

Returns full AI-processed item.

### Error (400)

Missing required fields.

---

## 2. **Browse All Found Items**

**GET** `/api/v1/items`

### Query Params

* `page` (optional)
* `limit` (optional)

### Success (200)

Returns an array of items sorted by newest.

---

## 3. **Get Item by ID**

**GET** `/api/v1/items/:id`

### Success (200)

Returns full item.

### Error (404)

Item not found.

---

## 4. **AI Search for Lost Items**

**POST** `/api/v1/search`
Used to match a user’s “lost item” description to all stored found items.

### Request Body

```json
{ "query": "I lost my blue iPhone near the library" }
```

### Processing Flow (Backend)

1. Fetch all found items
2. Build simplified item list
3. Send (query + list) → DeepSeek API
4. DeepSeek API returns match scores
5. Re-map scores to full items
6. Sort by `matchPercentage`
7. Return results

### Success (200)

```json
[
  { "matchPercentage": 0.95, "item": { ... } },
  { "matchPercentage": 0.62, "item": { ... } }
]
```

### Error (400)

Empty query.

---

# 🤖 AI Logic (DeepSeek API)

---

## 1. **Categorization + Summary Prompt**

Used in `POST /items`.

DeepSeek API outputs:

```json
{
  "category": "...",
  "summary": "...",
  "tags": ["...", "..."]
}
```

---

## 2. **Matching Prompt**

Used in `POST /search`.

DeepSeek API outputs:

```json
[
  { "id": "...", "matchPercentage": 0.95 },
  { "id": "...", "matchPercentage": 0.62 }
]
```

---

# 🗄 Backend Notes

* Database: Nonexistent (At The Moment)
* AI-generated fields overwrite user description (`description = summary`)
* Sorting defaults: `createdAt DESC`
* No pagination logic enforced
* No Auth (Temporarily)