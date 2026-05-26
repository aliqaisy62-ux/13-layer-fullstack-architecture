# Production Architecture Examples
## Real System Designs for Real Applications

> These architectures are battle-tested patterns used by production companies. They show how all 13 layers work together in specific real-world scenarios.

---

## 1. Social Media Platform (Instagram-scale)

### System Requirements

```
Scale: 100M+ daily active users
Core features: User feed, posts (images/video), likes, comments, follows, stories
Performance: Feed loads < 1s, images render < 500ms
Availability: 99.99% uptime
Consistency: Eventually consistent (slight lag in feed acceptable)
```

### Architecture

```mermaid
graph TB
    subgraph Client["📱 Client"]
        APP[iOS/Android/Web App\nReact Native / Next.js]
    end

    subgraph Edge["🌐 Edge"]
        CDN[CloudFront CDN\nImages · Videos · Static]
        WAF[Cloudflare WAF\nDDoS Protection]
    end

    subgraph API_Gateway["🚦 API Layer"]
        APIGW[API Gateway\nRate Limiting · Auth · Routing]
        LB[AWS ALB\nLoad Balancer]
    end

    subgraph Services["⚙️ Backend Services"]
        USER_SVC[User Service\nProfiles · Follows · Auth]
        FEED_SVC[Feed Service\nTimeline generation]
        POST_SVC[Post Service\nCreate · Like · Comment]
        NOTIF_SVC[Notification Service\nPush · In-app]
        MEDIA_SVC[Media Service\nUpload · Transcode]
    end

    subgraph Queue["📬 Async Processing"]
        KAFKA[Apache Kafka\nEvent streaming]
        WORKERS[Worker Pool\nFan-out · Processing]
    end

    subgraph Data["🗄️ Data Stores"]
        PG[(PostgreSQL\nUsers · Posts meta)]
        CASSANDRA[(Cassandra\nActivity logs · Follows)]
        REDIS_CACHE[(Redis Cluster\nFeed cache · Sessions)]
        ELASTIC[(Elasticsearch\nSearch · Discovery)]
        S3[(AWS S3\nImages · Videos raw)]
    end

    subgraph ML["🤖 ML"]
        RANK[Feed Ranking\nML Model]
        RECOMMEND[Recommendations\nContent discovery]
    end

    APP --> WAF --> CDN
    CDN --> LB
    LB --> APIGW
    APIGW --> USER_SVC & FEED_SVC & POST_SVC
    POST_SVC --> KAFKA
    KAFKA --> WORKERS
    WORKERS --> CASSANDRA & REDIS_CACHE & NOTIF_SVC
    FEED_SVC --> REDIS_CACHE & RANK
    USER_SVC --> PG
    POST_SVC --> PG & S3
    MEDIA_SVC --> S3
    ELASTIC --> RECOMMEND

    style Client fill:#dbeafe
    style Edge fill:#dcfce7
    style Services fill:#fef9c3
    style Data fill:#fce7f3
    style ML fill:#f3e8ff
```

### Key Design Decisions

**Feed Architecture (Fan-out):**
```
When Alice (1M followers) posts a photo:

Option A: Fan-out on Write (push model)
  On post → write Alice's post to 1M follower timelines in Redis
  On read → instant (Redis lookup)
  Problem: Writing 1M Redis entries per celebrity post is slow/expensive

Option B: Fan-out on Read (pull model)
  On post → only write Alice's post to Alice's post store
  On read → fetch followed users' posts, merge, sort
  Problem: User follows 1000 accounts → 1000 DB queries per feed load

Instagram's hybrid approach:
  Regular users (< 10K followers): Fan-out on write
  Celebrity users (> 1M followers): Fan-out on read (pulled on demand)
  Redis stores the timeline (pre-computed list of post IDs)
```

**Media Processing Pipeline:**
```
1. User uploads via presigned S3 URL (mobile → S3 directly, no backend overhead)
2. S3 event trigger → SNS → Lambda → Media processing queue
3. Workers transcode video (4K → 1080p → 720p → 480p)
4. Workers generate image thumbnails (multiple sizes)
5. Output stored in S3 CDN bucket
6. CloudFront serves from edge (200+ PoPs globally)
7. Adaptive bitrate: video quality adjusts to connection speed
```

### Full Request Lifecycle: Loading the Instagram Feed

```
1. App opens → auth token read from secure storage
2. Request: GET https://api.instagram.com/v1/feed?limit=12
3. DNS: Route53 → nearest region load balancer
4. Cloudflare: rate limit check, DDoS scrubbing
5. ALB: route to available API server
6. API Gateway: JWT validation (verify signature, check expiry)
7. Feed Service: check Redis cache for user's timeline
8. Cache HIT: return pre-computed list of 12 post IDs
9. Batch fetch post metadata from PostgreSQL
10. Response returned to client: JSON with post data + media URLs
11. Client renders skeleton immediately
12. Images fetched lazily from CloudFront CDN
13. Total time: ~150ms (95th percentile)
```

---

## 2. SaaS Application (Multi-tenant)

### System Requirements

```
Scale: 50K business customers, millions of end users
Core features: Per-tenant data isolation, subscription billing, analytics, teams/roles
Performance: API < 200ms p95, dashboards < 2s
Compliance: SOC2, GDPR
Availability: 99.9% (downtime budget: 8.7 hours/year)
```

### Architecture

```mermaid
graph TB
    subgraph Tenants["🏢 Tenants"]
        T1[Tenant A\nEnterprise]
        T2[Tenant B\nStartup]
        T3[Tenant C\nFree]
    end

    subgraph Routing["🔀 Tenant Routing"]
        DNS[app.yoursaas.com\ntenantA.yoursaas.com]
        IDENT[Tenant Identifier\nSubdomain · JWT claim · API key]
    end

    subgraph Auth["🔐 Auth"]
        AUTH[Auth Service\nJWT · OAuth · SAML SSO\nMFA · RBAC]
    end

    subgraph App_Layer["⚙️ Application"]
        API[API Servers\nTenant-aware middleware]
        WORKER[Background Workers\nTenant job queue]
    end

    subgraph Data["🗄️ Data Isolation"]
        subgraph Strategy["Isolation Strategies"]
            SHARED_DB[(Shared DB\nRLS per tenant\nCost-effective)]
            SCHEMA[(Schema per tenant\nmedium isolation)]
            DEDICATED[(Dedicated DB\nEnterprise tenants\nFull isolation)]
        end
    end

    subgraph Billing["💳 Billing"]
        STRIPE[Stripe\nSubscriptions · Metering · Invoices]
        USAGE[Usage Tracking\nAPI calls · Storage · Seats]
    end

    T1 & T2 & T3 --> DNS --> IDENT
    IDENT --> AUTH
    AUTH --> API
    API --> SHARED_DB & SCHEMA & DEDICATED
    API --> USAGE --> STRIPE
    WORKER --> SHARED_DB

    style Tenants fill:#dbeafe
    style Data fill:#dcfce7
    style Billing fill:#fef9c3
```

### Multi-Tenancy Patterns

```sql
-- Pattern 1: Shared database with tenant isolation via RLS (most common for SMB)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- All data in one table, tenant_id column everywhere
CREATE TABLE projects (
  id          UUID PRIMARY KEY,
  tenant_id   UUID NOT NULL REFERENCES tenants(id),
  name        VARCHAR(200) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS ensures tenants never see each other's data
CREATE POLICY projects_tenant_isolation ON projects
  FOR ALL
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Application sets tenant context per request
await db.query(`SET LOCAL app.tenant_id = '${tenantId}'`)
```

```typescript
// Tenant middleware — identifies and validates tenant on every request
const tenantMiddleware = async (req, res, next) => {
  // Extract tenant from: subdomain, JWT, or API key header
  const tenantId = extractTenantId(req)

  // Validate tenant exists and subscription is active
  const tenant = await tenantCache.get(tenantId)
    ?? await tenantRepo.findActive(tenantId)

  if (!tenant) return res.status(401).json({ error: 'Invalid tenant' })
  if (tenant.suspended) return res.status(402).json({
    error: 'Account suspended',
    billingUrl: `https://app.yoursaas.com/${tenant.slug}/billing`
  })

  // Check plan limits
  if (!tenant.plan.canDoAction(req.path, req.method)) {
    return res.status(403).json({
      error: 'Feature not available on your plan',
      upgradeUrl: `https://app.yoursaas.com/${tenant.slug}/upgrade`
    })
  }

  req.tenant = tenant
  next()
}
```

---

## 3. AI Application (ChatGPT-scale)

### System Requirements

```
Scale: 100M+ users, millions of concurrent conversations
Core features: Streaming responses, conversation history, tool use, multimodal
Latency: First token < 1s, streaming tokens in real-time
Cost: LLM API calls are expensive — optimize aggressively
```

### Architecture

```mermaid
graph TB
    subgraph Client["💬 Client"]
        WEB[Web App\nStreaming SSE · WebSocket]
        MOBILE[Mobile App]
    end

    subgraph Gateway["🚦 AI Gateway"]
        RATE[Rate Limiting\nPer user token budget]
        COST[Cost Tracking\nPer user spend]
        CACHE_CHECK[Semantic Cache\nSimilar prompts → cached response]
    end

    subgraph Routing["🔀 Model Routing"]
        ROUTER[Smart Router]
        ROUTER -->|Simple queries| FAST_MODEL[Fast Model\nClaude Haiku\nLow cost, fast]
        ROUTER -->|Complex queries| SMART_MODEL[Smart Model\nClaude Sonnet/Opus\nHigh quality]
        ROUTER -->|Cached| SEMANTIC_CACHE[(Semantic Cache\nRedis Vector DB)]
    end

    subgraph Streaming["📡 Response Streaming"]
        STREAM[Streaming Handler\nSSE / WebSocket]
        BUFFER[Response Buffer\nCollect tokens for storage]
    end

    subgraph Memory["🧠 Memory & Context"]
        CONV_HISTORY[(Conversation History\nPostgreSQL)]
        VECTOR_DB[(Vector Database\nPinecone / pgvector\nUser memories)]
        RAG[RAG Pipeline\nRetrieve relevant context]
    end

    WEB & MOBILE --> GATEWAY
    GATEWAY --> RATE & COST & CACHE_CHECK
    CACHE_CHECK --> ROUTER
    ROUTER --> STREAM
    STREAM -->|Tokens| WEB
    STREAM --> BUFFER
    BUFFER --> CONV_HISTORY
    RAG --> SMART_MODEL
    VECTOR_DB --> RAG

    style Client fill:#dbeafe
    style Gateway fill:#fef9c3
    style Memory fill:#dcfce7
```

### Key AI Patterns

**Streaming Implementation:**
```typescript
// Server-Sent Events for streaming LLM responses
app.post('/chat', requireAuth, async (req, res) => {
  const { message, conversationId } = req.body

  // Set up streaming headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Fetch conversation history for context
  const history = await conversationRepo.getHistory(conversationId, 20)

  // Retrieve relevant memories from vector DB
  const memories = await vectorDB.similarSearch(message, { userId: req.user.id, limit: 5 })

  // Stream from Claude API
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: buildSystemPrompt(memories),
    messages: [...history, { role: 'user', content: message }],
  })

  let fullResponse = ''

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      const token = chunk.delta.text
      fullResponse += token

      // Stream token to client
      res.write(`data: ${JSON.stringify({ token })}\n\n`)
    }
  }

  // Save complete conversation to DB
  await conversationRepo.addMessage(conversationId, {
    role: 'assistant',
    content: fullResponse,
    usage: await stream.finalUsage(),
  })

  // Track cost
  const usage = await stream.finalUsage()
  await usageTracker.record(req.user.id, {
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cost: calculateCost(usage, 'claude-sonnet-4-6'),
  })

  res.write(`data: [DONE]\n\n`)
  res.end()
})
```

**Prompt Caching (Anthropic API):**
```typescript
// Cache long system prompts to reduce cost and latency
// Claude API - prompt caching feature

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: LONG_SYSTEM_PROMPT,  // 1000+ tokens
      cache_control: { type: 'ephemeral' }  // Cache this for 5 minutes
      // First call: paid at full price
      // Subsequent calls within 5 min: 90% cheaper!
    }
  ],
  messages: [{ role: 'user', content: userMessage }],
})
```

---

## 4. E-Commerce Platform (Shopify-scale)

### System Requirements

```
Scale: Millions of products, thousands of merchants, peak: Black Friday
Core features: Product catalog, inventory, cart, checkout, payments, orders, fulfillment
Transactions: Must be ACID — no double-charging, no selling out-of-stock
Latency: Product pages < 500ms, checkout < 1s
Availability: 99.99% — downtime during checkout = direct revenue loss
```

### Architecture

```mermaid
graph TB
    subgraph Storefront["🛍️ Storefront"]
        NEXT[Next.js + ISR\nProduct pages cached at CDN\nCart via client state]
        SEARCH_UI[Search\nInstant results]
    end

    subgraph Commerce["🏪 Commerce Services"]
        CATALOG[Product Catalog Service\nPostgreSQL + Elasticsearch]
        INVENTORY[Inventory Service\nReal-time stock levels]
        CART[Cart Service\nRedis ephemeral]
        ORDER[Order Service\nFull ACID transactions]
        PAYMENT[Payment Service\nStripe integration]
        FULFILL[Fulfillment Service\nShipping · Tracking]
    end

    subgraph Data_Layer["🗄️ Data"]
        PG_PRIMARY[(PostgreSQL Primary\nOrders · Users · Payments)]
        PG_READ[(Read Replicas ×3\nProduct reads)]
        REDIS[(Redis\nCart · Sessions · Locks)]
        ES[(Elasticsearch\nProduct search · Facets)]
        S3[(S3\nProduct images)]
    end

    subgraph Events["📬 Event Bus"]
        KAFKA[Kafka\nOrder events · Inventory updates]
    end

    NEXT --> CATALOG & CART & ORDER
    CATALOG --> PG_READ & ES
    CART --> REDIS
    ORDER --> PG_PRIMARY
    ORDER --> KAFKA
    KAFKA --> INVENTORY & FULFILL
    PAYMENT --> PG_PRIMARY

    style Storefront fill:#dbeafe
    style Commerce fill:#dcfce7
    style Data_Layer fill:#fce7f3
    style Events fill:#fef9c3
```

### Checkout Flow (Critical Path)

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant CART as 🛒 Cart
    participant CHECKOUT as 💳 Checkout
    participant INV as 📦 Inventory
    participant PAY as 💰 Payment
    participant ORDER as 📋 Order

    U->>CART: Add item to cart
    CART->>INV: Check availability (soft check)
    INV-->>CART: Available
    CART-->>U: Added to cart ✅

    U->>CHECKOUT: Begin checkout
    CHECKOUT->>INV: Reserve inventory\n(optimistic lock, 15 min TTL)
    INV-->>CHECKOUT: Reserved ✅

    U->>PAY: Submit payment
    PAY->>PAY: Stripe payment intent
    PAY-->>U: Payment successful

    PAY->>ORDER: BEGIN TRANSACTION
    Note over ORDER: Atomic operation:
    ORDER->>INV: Confirm inventory deduction
    ORDER->>ORDER: Create order record
    ORDER->>PAY: Record payment
    ORDER->>ORDER: COMMIT
    ORDER-->>U: Order confirmed #12345

    ORDER->>KAFKA: order.created event
    KAFKA->>FULFILL: Process fulfillment
    KAFKA->>EMAIL: Send confirmation email
```

**Inventory Locking (Preventing Overselling):**
```typescript
// Optimistic locking prevents selling more than available
async function reserveInventory(productId: string, quantity: number, ttlSeconds = 900) {
  const lockKey = `inventory:lock:${productId}`
  const reservationKey = `inventory:reserved:${productId}`

  // Lua script — atomic check and reserve
  const script = `
    local available = tonumber(redis.call('GET', KEYS[1])) or 0
    local requested = tonumber(ARGV[1])

    if available < requested then
      return 0  -- Not enough stock
    end

    redis.call('DECRBY', KEYS[1], requested)
    redis.call('SETEX', KEYS[2], ARGV[2], ARGV[1])
    return 1  -- Reserved successfully
  `

  const result = await redis.eval(
    script, 2,
    `inventory:available:${productId}`,
    `inventory:reserved:${productId}:${cartId}`,
    quantity, ttlSeconds
  )

  if (!result) throw new InsufficientInventoryError(`Insufficient stock for ${productId}`)
}
```

---

## Common Failure Modes & Solutions

### 1. Database Bottleneck

```
Symptom: DB CPU at 100%, queries timing out, reads slow
Causes:
  - Missing indexes on frequently queried columns
  - N+1 query pattern
  - Missing connection pooling
  - Too many simultaneous connections
  - Long-running transactions holding locks

Solutions (in order):
  1. Add missing indexes (check pg_stat_user_tables, slow query log)
  2. Fix N+1 with eager loading
  3. Add PgBouncer connection pooling
  4. Add read replicas for SELECT-heavy workloads
  5. Vertical scale (more RAM = more data in buffer pool)
```

### 2. Cache Stampede

```
Symptom: Brief thundering herd on cache expiry, DB spike every N minutes
Cause: Popular cache key expires, thousands of requests all miss and hit DB

Solution: Probabilistic early refresh
  if (remaining_ttl < threshold && random() < probability) {
    backgroundRefresh(key)  // One request refreshes in background
  }
  return stale_cached_value  // Others use stale data briefly
```

### 3. Deployment Failure

```
Symptom: Error rate spikes after new deployment
Detection: Alert fires within 2 minutes
Response:
  1. Immediate rollback (kubectl rollout undo / feature flag disable)
  2. Error rate should recover within 5 minutes
  3. Investigate in staging before re-deploying
  4. Post-mortem: why did tests not catch this?
```

### 4. Security Vulnerability Discovered

```
Scenario: Security researcher reports SQLi in /api/search endpoint

Immediate (< 1 hour):
  1. Disable endpoint or add WAF rule to block exploit pattern
  2. Review access logs: was it exploited? What data was accessed?
  3. If exploited: notify affected users, legal team, DPA within 72 hours (GDPR)

Short-term (< 1 week):
  1. Fix the vulnerability
  2. Add parameterized queries
  3. Add input validation
  4. Deploy fix

Long-term:
  1. Audit all similar code patterns
  2. Add automated security scanning to CI/CD
  3. Schedule penetration test
  4. Add SQLi to internal security training
```

---

## Scaling Journey: 0 to 10M Users

```
0 - 1K users: Single server + PostgreSQL
  Architecture: 1 server, 1 database, no Redis, no CDN
  Cost: $50-100/month (Railway, Render, DigitalOcean)
  Focus: Build the product, find product-market fit

1K - 10K users: Add reliability
  Architecture: 2 servers behind load balancer, managed database
  Add: CDN for static assets, Redis for sessions
  Cost: $200-500/month
  Focus: Uptime, basic monitoring

10K - 100K users: Add performance
  Architecture: Auto-scaling API servers, read replicas, queue workers
  Add: Database read replica, Redis cluster, job queue
  Cost: $1K-5K/month
  Focus: Performance, caching strategy

100K - 1M users: Add scalability
  Architecture: Kubernetes, microservice extraction (auth/notifications)
  Add: Elasticsearch for search, CDN for images, proper observability
  Cost: $10K-50K/month
  Focus: Reliability, team structure, observability

1M - 10M users: System design decisions matter
  Architecture: Multi-region, dedicated databases per domain
  Add: Global load balancing, chaos engineering, SRE practices
  Cost: $100K-$500K/month
  Focus: Global reliability, team scaling, cost optimization
```

---

*Back to [Index →](./index.md) | [Learning Roadmap →](./learning-roadmap.md) | [Glossary →](./glossary.md)*
