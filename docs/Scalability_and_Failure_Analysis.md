# 5. Scalability & Failure Analysis Report

## Database Shard Scale-Out
* Expanded from 2 to 3 active database shards. Shard distribution: `Shard-1 (38%)`, `Shard-2 (34%)`, `Shard-3 (28%)`.

## Server Node Failover
* Simulated node failure on `srv-app-03`. Consistent hashing ring re-routed all recruitment traffic to `srv-app-01` and `srv-app-02` without request loss.
