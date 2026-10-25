# 1. Requirement Analysis & Component Mapping

## Component-to-Functionality Mapping Matrix

| System-Design Component | Targeted HRM Functionality | Architectural Justification |
| :--- | :--- | :--- |
| **1. Rate Limiter** | API Gateway & HR Services | Throttles burst traffic using a Token Bucket algorithm to protect sensitive endpoints. |
| **2. Sharding** | Database Layer | Partitions employee profile data across horizontal DB shards (`Shard-1`, `Shard-2`, `Shard-3`). |
| **3. Consistent Hashing** | HR Application Server Ring | Distributes requests evenly across app server nodes (`srv-app-01`, `srv-app-02`, `srv-app-03`). |
| **4. Key-Value Store** | Profile & Metric Caching | In-memory cache store delivering sub-millisecond lookup latencies (~1.2ms). |
| **5. Unique ID Generator** | Employee & Transaction IDs | Snowflake 64-bit ID generator ensuring 0 collisions (`EMP-{timestamp}-{random}`). |
| **6. URL Shortener** | Candidate Management & Job Posts | Encodes long external recruitment URLs into shortened links (`hrm.link/{hash}`). |
| **7. Web Crawler** | Talent Acquisition Pipeline | Web crawler bot aggregating external job portal listings into the HRM recruitment portal. |
| **8. Autocomplete** | Directory & Candidate Search | Prefix trie search providing instant real-time employee lookup in the header. |
