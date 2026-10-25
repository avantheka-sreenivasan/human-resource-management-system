# 2. System Architecture & Design

```
[ Client Web UI / Admin / Mobile ]
               │
               ▼
┌──────────────────────────────┐
│     Rate Limiter Gateway     │ (Token Bucket: 15 req/10s)
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Consistent Hashing Router   │
└──────┬───────────────┬───────┘
       │               │
       ▼               ▼
┌──────────────┐┌──────────────┐
│  srv-app-01  ││  srv-app-02  │ ... [srv-app-03 (Simulated Failover)]
└──────┬───────┘└──────┬───────┘
       │               │
       ├── Key-Value Cache Store (Hit Rate: 94.2%, Latency: 1.2ms)
       ├── Unique ID Generator (Snowflake EMP-IDs)
       ├── Web Crawler & URL Shortener Engine
       │
       ▼
┌────────────────────────────────────────────────────────┐
│               Sharded Database Engine                  │
├───────────────────┬───────────────────┬────────────────┤
│      Shard-1      │      Shard-2      │    Shard-3     │
│  (DB Node 01)     │  (DB Node 02)     │ (DB Node 03)   │
└───────────────────┴───────────────────┴────────────────┘
```
