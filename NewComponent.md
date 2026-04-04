# Caching Component Overview

This document explains the caching strategy implemented in the provided module, focusing on how tool definitions are cached, invalidated, and refreshed.

---

## Purpose of the Caching Layer

The caching system is the chosen back-end component to optimize performance by reducing repeated database calls for tool definitions. This document outlines the detailed implementation and integration plans for this caching component.

The caching layer provides:

- Faster read performance  
- Reduced load on the underlying repository  
- Temporary in-memory storage with TTL-based expiration  

---

## Component Selection Rationale

Caching was selected due to its direct impact on improving API responsiveness and scalability. By storing tool definitions temporarily in memory, the system minimizes expensive database queries, which is critical for high-throughput environments.

### Alternative components considered included:

#### **Message Queue for Asynchronous Processing**
- **Pros:** Decouples components, improves scalability for write-heavy operations  
- **Cons:** Adds complexity, eventual consistency delays  

#### **Distributed Configuration Store**
- **Pros:** Centralized config management, supports dynamic updates  
- **Cons:** Overhead for simple caching needs, increased operational complexity  

Caching was chosen as the most straightforward and effective solution for the current API needs due to its simplicity, efficiency, and direct benefits to read performance.

---

## Implementation and Integration Plan

### Cache Structures

#### 1. **Per-Tool Cache (`toolMap`)**
A `Map` is used to store individual tool entries.

Each entry contains:
- `value`: The `ToolDef` object  
- `expires`: A timestamp indicating when the cache entry becomes invalid  

#### 2. **All-Tools Cache (`ALL_TOOLS_CACHE`)**
A single object storing:
- `values`: An array of all `ToolDef` objects  
- `expires`: Expiration timestamp  

This cache is used when retrieving the full list of tools.

---

## Cache Write Operations

### **`setCache(key, value, ttlMs)`**
Stores a single tool in the `toolMap` with a TTL.

### **`setAllToolsCache(tools, ttlMs)`**
Stores the full tool list in `ALL_TOOLS_CACHE`.

Both use a TTL of **30 minutes**.

---

## Cache Read Operations

### **`getCache(key)`**
- Returns the cached tool if present and not expired  
- Deletes expired entries automatically  

### **`getAllToolsCache()`**
- Returns the cached list of tools if valid  
- Clears expired cache automatically  

---

## Cache Usage in Service Functions

### **`createNewTool`**
- Adds a new tool to the repository  
- Immediately caches the new tool  

### **`getByToolName`**
- Checks per-tool cache first  
- Falls back to repository lookup  
- Refreshes cache after DB fetch  

### **`getAllTools`**
- Checks the all-tools cache first  
- If expired or missing, fetches from DB  
- Caches both the list and each individual tool  

### **`updateToolByName`**
- Updates the tool in the repository  
- Refreshes the cache entry  

### **`deleteToolWithName`**
- Removes the tool from the repository  
- Deletes the cache entry  

---

## Expiration Strategy

All cache entries use a **30-minute TTL**:

- Ensures data freshness  
- Prevents stale tool definitions from persisting indefinitely  

Expired entries are removed lazily during read operations.

---

## Summary

Caching is the selected back-end component to enhance API performance by minimizing database load and improving response times. This caching layer provides:

- Efficient retrieval of tool definitions  
- Automatic expiration and cleanup  
- Consistent caching behavior across CRUD operations  

It serves as a lightweight, in-memory optimization layer for tool metadata management, fully integrated with the API service functions to maintain data consistency and freshness.