# Glossary
## Every Technical Term Defined

> Terms are grouped by category. Each definition explains the concept, why it matters, and the layer of the architecture where it lives.

---

## A

**ABAC (Attribute-Based Access Control)**
Authorization model where access decisions are based on attributes of the user, resource, and environment. More flexible than RBAC. Example: "allow access if user.department == 'engineering' AND resource.environment == 'staging'". → Layer 4

**ACID**
Atomicity, Consistency, Isolation, Durability. The four properties that guarantee database transactions are processed reliably. A transaction either fully succeeds or fully rolls back. → Layer 3

**API Gateway**
A server that acts as the entry point for API clients. Handles: authentication, rate limiting, request routing, load balancing, SSL termination, logging. Examples: AWS API Gateway, Kong, NGINX. → Layers 2, 9

**Autoscaling**
Automatically adding or removing compute resources (servers, containers, pods) based on demand. Kubernetes HPA and AWS Auto Scaling Groups both implement this. → Layer 11

**Availability Zone (AZ)**
A physically separate data center within a cloud region. AZs within a region are connected by low-latency fiber. Deploying across multiple AZs eliminates single data center as a point of failure. → Layer 6

---

## B

**Backfill**
The process of populating existing data with a new field or transformation. Example: when you add a `full_name` column, you backfill it as `first_name || ' ' || last_name` for all existing rows. → Layer 3

**Background Job**
A task executed asynchronously outside the request/response cycle. Examples: sending emails, processing images, generating reports. Implemented with queue libraries like BullMQ, Sidekiq, or cloud services like SQS. → Layer 2

**Blue-Green Deployment**
A deployment strategy with two identical environments (blue/current and green/new). Traffic switches instantly from blue to green. Blue is kept as immediate rollback option. → Layer 5

**Bulkhead Pattern**
Isolating resources (connection pools, thread pools) so failures in one component don't cascade to others. Named after ship bulkheads that prevent flooding from spreading. → Layer 2

---

## C

**Cache-Aside (Lazy Loading)**
The most common caching pattern. Application checks cache first; on miss, fetches from database and populates cache. Application manages cache explicitly. → Layer 10

**Cache Invalidation**
The process of removing stale data from a cache so subsequent reads fetch fresh data. Phil Karlton famously called this one of the two hard problems in CS. → Layer 10

**Cache Stampede (Thundering Herd)**
When a popular cache key expires and many concurrent requests simultaneously miss and hit the database. Can overwhelm the database. Solutions: distributed locking, probabilistic early refresh. → Layer 10

**Canary Deployment**
A gradual rollout strategy where new code is deployed to a small percentage (5%) of servers/users first. Traffic increases as metrics look healthy. Enables rollback with minimal user impact. → Layer 5

**CAP Theorem**
States a distributed system can guarantee at most two of: Consistency, Availability, Partition Tolerance. Network partitions are inevitable, so the practical choice is CP (consistent) vs AP (available). → Layer 11

**CDN (Content Delivery Network)**
A globally distributed network of servers that cache content close to users. Reduces latency from 200ms (cross-continent) to 20ms (nearest PoP). Examples: Cloudflare, AWS CloudFront, Fastly. → Layer 10

**Circuit Breaker**
A pattern that stops calling a failing service to give it time to recover. Similar to an electrical circuit breaker. States: Closed (normal), Open (failing, fast-fail), Half-Open (testing recovery). → Layer 2

**CORS (Cross-Origin Resource Sharing)**
Browser security mechanism that controls which origins can make API requests to your server. Backend configures which origins are allowed via Access-Control-Allow-Origin headers. → Layer 8

**CSRF (Cross-Site Request Forgery)**
Attack where a malicious website tricks a user's browser into making unintended requests to another site where they're authenticated. Prevented by: SameSite cookies, CSRF tokens. → Layer 8

**CSR (Client-Side Rendering)**
The entire application UI is rendered in the browser using JavaScript. Server sends a minimal HTML shell + JS bundle. SEO-unfriendly. Best for: dashboards, authenticated apps. → Layer 1

---

## D

**DDoS (Distributed Denial of Service)**
An attack that overwhelms a service with traffic from many sources (botnet). Mitigated by: CDN/WAF, rate limiting, IP reputation blocking, traffic scrubbing. → Layer 9

**Denormalization**
Intentionally duplicating data in a database to improve read performance (avoiding joins). Trade-off: faster reads vs. risk of data inconsistency on updates. → Layer 3

**Docker**
Platform for packaging applications and their dependencies into containers. Ensures "works on my machine" → "works everywhere." Foundation of modern cloud deployments. → Layer 5

**DR (Disaster Recovery)**
Plans and procedures for restoring service after a catastrophic failure. Includes: RTO/RPO targets, documented runbooks, tested restore procedures, failover automation. → Layer 13

---

## E

**Edge Function**
Serverless code running at CDN edge nodes, geographically distributed worldwide. Extremely low latency. Examples: Cloudflare Workers, Vercel Edge Functions. → Layer 6

**Elasticsearch**
A distributed search and analytics engine. Used for: full-text search, log analytics, time-series data, faceted search. Backs Kibana dashboards. → Layer 3

**Environment Variable**
A configuration value injected into an application at runtime from the operating system environment. Used to: change behavior between dev/staging/prod, store secrets outside code. → Layer 5

**Eventual Consistency**
A consistency model in distributed systems where, given no new updates, all replicas will converge to the same value — eventually. Acceptable for: view counts, social feeds. Not acceptable for: bank balances. → Layer 11

---

## F

**Fan-out**
The process of distributing a single event to many recipients. Example: when you post a tweet, your post is "fanned out" to all your followers' timelines. Can happen on write (push) or read (pull). → Layer 2

**Feature Flag**
A configuration toggle that enables or disables features at runtime without deploying new code. Enables: gradual rollouts, A/B testing, instant kill switches. Tools: LaunchDarkly, Unleash, GrowthBook. → Layer 5

**Foreign Key**
A database constraint that enforces referential integrity between tables. `posts.user_id REFERENCES users(id)` means every post must reference a valid user. → Layer 3

**FaaS (Function as a Service)**
Serverless computing where you deploy individual functions, not servers. Provider handles all infrastructure. Examples: AWS Lambda, Google Cloud Functions, Vercel Functions. → Layer 6

---

## G

**gRPC**
A high-performance RPC framework using Protocol Buffers for serialization. Much faster than REST/JSON for service-to-service calls. Supports bidirectional streaming. → Layer 2

**GraphQL**
A query language for APIs where clients specify exactly what data they need. Eliminates over-fetching and under-fetching. Single endpoint. Developed by Facebook. → Layer 2

---

## H

**HA (High Availability)**
System design that eliminates single points of failure to maintain uptime despite individual component failures. Achieved through redundancy, health checks, and automatic failover. → Layer 13

**Horizontal Scaling (Scale Out)**
Adding more servers/instances to distribute load. Requires stateless application design. Theoretically unlimited. Most cost-effective scaling approach for stateless services. → Layer 11

**HTTP/2**
Updated HTTP protocol with multiplexing (multiple requests over one connection), header compression, and server push. Significant performance improvement over HTTP/1.1. → Layer 10

**Hydration**
The process of attaching React event handlers to server-rendered HTML. React reuses the existing DOM instead of re-rendering. Mismatch between server and client HTML causes hydration errors. → Layer 1

---

## I

**Idempotency**
An operation that produces the same result regardless of how many times it's performed. Critical for payment processing: same charge request twice → only one charge. Implemented with idempotency keys. → Layer 2

**Index (Database)**
A data structure that improves query speed at the cost of additional storage and write overhead. B-tree index (default) enables O(log N) lookup instead of O(N) table scan. → Layer 3

**Infrastructure as Code (IaC)**
Managing infrastructure through code rather than manual processes. Terraform and Pulumi are the most popular tools. Enables: version control, reproducibility, team review. → Layer 7

**ISR (Incremental Static Regeneration)**
Next.js feature combining SSG and SSR. Pages are pre-built but can be regenerated on a schedule or on-demand. Best of both worlds for most content sites. → Layer 1

---

## J

**JWT (JSON Web Token)**
A compact, self-contained token that includes signed claims (user ID, role, expiry). Server validates the signature without a database lookup. Access tokens are short-lived (1 hour). → Layer 4

**JSON (JavaScript Object Notation)**
A lightweight data interchange format. The de facto standard for API responses. Human readable, language-agnostic. Example: `{"id": 1, "name": "Alice"}`. → Layer 2

---

## K

**Kubernetes (K8s)**
An open-source container orchestration platform. Automates: deployment, scaling, self-healing, rolling updates. Core objects: Pod, Deployment, Service, Ingress, HPA. → Layer 6

---

## L

**Latency**
The time delay between a request being made and the response being received. Measured in milliseconds. Components: network (RTT), processing, queuing. p95/p99 metrics more useful than average. → Layer 12

**Leaky Bucket**
Rate limiting algorithm that processes requests at a constant rate, queuing excess requests. Smooths bursty traffic into uniform flow. Different from token bucket (which allows bursting). → Layer 9

**Load Balancer**
A server or service that distributes incoming traffic across multiple backend servers. Algorithms: Round Robin, Least Connections, IP Hash. L4 (TCP) or L7 (HTTP). → Layer 11

**Logging**
Recording significant events in an application, typically to a time-series log store. Structured logging (JSON) is far more useful than plain text for querying at scale. → Layer 12

---

## M

**Message Queue**
A system where producers send messages that consumers process asynchronously. Decouples producers from consumers, enables retry, handles backpressure. Examples: Redis Streams, RabbitMQ, AWS SQS, Kafka. → Layer 2

**Metrics**
Numerical measurements collected over time that describe system behavior. The four golden signals: latency, traffic, errors, saturation. Stored in time-series databases (Prometheus, InfluxDB). → Layer 12

**Microservices**
An architectural pattern where an application is decomposed into small, independently deployable services. Each service owns its own database. Increases operational complexity significantly. → Layer 2

**MFA (Multi-Factor Authentication)**
Requiring two or more verification factors to authenticate. Factors: something you know (password), something you have (TOTP app), something you are (biometric). → Layer 4

**Migration (Database)**
A versioned, sequential script that modifies the database schema. Enables: team collaboration on schema changes, rollbacks, reproducible environments. Tools: Prisma Migrate, Flyway, Knex. → Layer 3

---

## N

**N+1 Problem**
A database performance anti-pattern where fetching N records results in N additional queries (one per record). Fix: JOINs, eager loading, or DataLoader (batching). → Layer 3

**Normalization**
The process of organizing a database to reduce redundancy. Data appears in one place, related data referenced via foreign keys. Trade-off: consistent data vs. slower join queries. → Layer 3

---

## O

**OAuth 2.0**
An authorization framework enabling "Login with Google/GitHub" flows. Delegates authentication to a trusted identity provider. Users grant your app limited access to their data. → Layer 4

**Observability**
The ability to understand the internal state of a system from its external outputs (logs, metrics, traces). Goes beyond monitoring — enables debugging novel failures. → Layer 12

**OpenTelemetry**
A vendor-neutral observability framework for generating logs, metrics, and traces. Supported by all major observability vendors (Datadog, Grafana, Jaeger). → Layer 12

**ORM (Object-Relational Mapper)**
A library that maps database tables to objects in code. Simplifies database queries. Examples: Prisma (Node.js), SQLAlchemy (Python), ActiveRecord (Ruby). → Layer 3

---

## P

**Partitioning (Database)**
Dividing a large table into smaller pieces for performance and manageability. Range partitioning (by date) is most common. Old partitions can be archived or dropped cheaply. → Layer 3

**Passkey (WebAuthn)**
Phishing-resistant authentication using public key cryptography. Device generates key pair; private key stored in secure enclave; public key stored on server. Replaces passwords. → Layer 4

**PgBouncer**
A lightweight connection pooler for PostgreSQL. Maintains a small pool of actual DB connections, serves many application connections. Prevents connection limit exhaustion. → Layer 3

**PKCE (Proof Key for Code Exchange)**
A security extension for OAuth 2.0 that prevents authorization code interception attacks. Essential for public clients (SPAs, mobile apps) that can't store client secrets securely. → Layer 4

**Pod (Kubernetes)**
The smallest deployable unit in Kubernetes. Contains one or more containers sharing network and storage. Most pods have one application container. Ephemeral — can be replaced anytime. → Layer 6

**Point-in-Time Recovery (PITR)**
The ability to restore a database to any specific moment in the past using WAL (Write-Ahead Log) archives. Achieves near-zero RPO. Essential for financial and healthcare data. → Layer 3

**Presigned URL**
A temporary URL granting time-limited access to a private S3 object. Allows direct client-to-S3 uploads/downloads without routing through your backend. Signature expires after set time. → Layer 3

---

## R

**RBAC (Role-Based Access Control)**
Authorization model where permissions are assigned to roles, and users are assigned roles. Simpler than ABAC, suitable for most applications. → Layer 4

**Read Replica**
A copy of a database that receives changes via replication from the primary and handles read queries. Offloads read traffic, improves read throughput. Cannot accept writes. → Layer 3

**Redis**
An in-memory data structure store used as: cache, message queue, session store, real-time leaderboard, distributed lock. Sub-millisecond latency. Persistence options: RDB snapshots, AOF log. → Layers 4, 9, 10

**Replication**
Copying data from one database (primary) to one or more databases (replicas). Provides: read scaling, high availability, geographic distribution. Modes: synchronous (zero data loss) or asynchronous (performance). → Layer 3

**REST (Representational State Transfer)**
An architectural style for APIs using HTTP methods (GET, POST, PUT, DELETE) to operate on resources (nouns). Resources identified by URLs. Most widely used API style. → Layer 2

**RLS (Row-Level Security)**
A PostgreSQL feature that enforces data access policies at the database level. Policies filter rows based on current user context. Defense in depth — works even if application code is buggy. → Layers 4, 8

**Rolling Deployment**
Updating servers/pods one at a time, maintaining availability throughout. v1 and v2 run simultaneously during rollout. Requires backward-compatible API changes. → Layer 5

**RPO (Recovery Point Objective)**
Maximum acceptable data loss measured in time. RPO=0 means no data loss allowed. RPO=1hr means losing up to 1 hour of data is acceptable. Drives backup frequency. → Layer 13

**RTO (Recovery Time Objective)**
Maximum acceptable downtime after a failure. RTO=5min means service must be restored within 5 minutes. Drives failover automation and DR infrastructure choices. → Layer 13

---

## S

**S3 (Simple Storage Service)**
AWS object storage service for storing files, images, videos, backups. Virtually unlimited storage, 99.999999999% (11 nines) durability, pay-per-GB. Standard for object storage. → Layer 3

**Sharding**
Horizontally partitioning data across multiple database servers. Each shard holds a subset of data (e.g., users A-F on shard 1). Enables horizontal database scaling. Very complex to manage. → Layer 3

**SLA (Service Level Agreement)**
A contractual commitment to customers about service quality (uptime, performance). Typically less strict than internal SLO, creating a buffer for operations. Violations may trigger credits. → Layer 12

**SLI (Service Level Indicator)**
A metric that measures the quality of a service. Examples: request success rate, p95 latency, availability. The thing you measure to determine if SLOs are met. → Layer 12

**SLO (Service Level Objective)**
An internal target for an SLI. Example: "99.9% of requests succeed in 30 rolling days." Error budget = 100% - SLO. When budget is exhausted, slow down deployments. → Layer 12

**SSG (Static Site Generation)**
Pre-rendering all pages at build time. Pages served as static HTML from CDN. Best performance and cheapest hosting. Not suitable for user-specific content. → Layer 1

**SSO (Single Sign-On)**
Authentication mechanism where one login grants access to multiple applications. Implemented via: SAML (enterprise), OpenID Connect (consumer). Examples: Okta, Azure AD. → Layer 4

**SSR (Server-Side Rendering)**
Rendering the page HTML on the server for each request. Good SEO and initial load performance. Requires a server (can't be static files). → Layer 1

---

## T

**Terraform**
Infrastructure as Code tool that provisions cloud resources (AWS, GCP, Azure) from declarative configuration files. State stored in S3. Changes applied via `terraform plan` + `terraform apply`. → Layer 7

**TLS (Transport Layer Security)**
Cryptographic protocol that encrypts data in transit. HTTPS = HTTP over TLS. Provides: encryption, integrity, server authentication. TLS 1.3 is current standard (1.0/1.1 deprecated). → Layer 8

**Token Bucket**
Rate limiting algorithm where each user has a "bucket" of tokens. Each request consumes a token. Tokens refill at a constant rate. Allows natural bursting up to bucket capacity. → Layer 9

**Tracing (Distributed)**
Recording the journey of a request across multiple services. Each service adds a "span" to the trace. Visualizes where time is spent and where failures occur. OpenTelemetry is the standard. → Layer 12

---

## U

**UUID (Universally Unique Identifier)**
A 128-bit identifier with negligible collision probability. Better than sequential integers for: distributed systems, privacy (not enumerable), sharding. Format: `550e8400-e29b-41d4-a716-446655440000`. → Layer 3

---

## V

**Vertical Scaling (Scale Up)**
Increasing resources on a single server (more CPU, more RAM). Simpler than horizontal scaling. Has a hardware ceiling. No architectural changes required. Best starting point. → Layer 11

**VPC (Virtual Private Cloud)**
An isolated virtual network in a cloud provider. Contains: public subnets (internet-accessible), private subnets (internal only), security groups (firewall rules), route tables. → Layer 6

---

## W

**WAF (Web Application Firewall)**
A security layer that filters, monitors, and blocks HTTP traffic. Protects against: SQL injection, XSS, DDoS, bot traffic. Examples: Cloudflare WAF, AWS WAF. → Layer 8

**WAL (Write-Ahead Log)**
PostgreSQL's transaction log. Every change is written to WAL before the main data files. Enables: ACID guarantees, point-in-time recovery, streaming replication. → Layer 3

**WebSocket**
A protocol providing full-duplex communication over a single TCP connection. Enables: real-time chat, live notifications, collaborative editing, live dashboards. Persistent connection (unlike HTTP). → Layer 2

**Write-Through Cache**
Caching pattern where every write updates both cache and database simultaneously. Cache is always fresh. Higher write latency than write-back. → Layer 10

---

## X

**XSS (Cross-Site Scripting)**
Attack where malicious JavaScript is injected into a web page and executed in other users' browsers. Types: Reflected, Stored, DOM-based. Prevented by: HTML escaping, Content Security Policy. → Layer 8

---

## Z

**Zero Trust**
A security model that assumes no implicit trust based on network location. Every request must be authenticated and authorized regardless of origin (internal or external). → Layer 8

---

*Back to [Index →](./index.md)*
