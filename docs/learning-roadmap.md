# Learning Roadmap
## From Zero to Production Engineer

> This roadmap is opinionated and practical. It prioritizes skills that employers pay for and users depend on. Every section includes what to build — because building is the only way to learn engineering.

---

## Reading This Roadmap

Each phase builds on the previous. Don't skip phases — the knowledge compounds. Estimated time assumes 10-15 hours of focused practice per week. Spending more time compresses the timeline.

---

## Phase 1: Foundation (0-3 months)
### Become Dangerous with the Basics

**Goal:** Build and deploy a working full-stack application from scratch.

### Skills to Learn

```
HTML & CSS
  ├── Semantic HTML5
  ├── CSS Flexbox & Grid
  ├── Responsive design (mobile-first)
  └── CSS Variables + modern CSS

JavaScript (Core)
  ├── Variables, functions, loops, conditionals
  ├── DOM manipulation
  ├── Fetch API (HTTP requests)
  ├── Promises & async/await
  ├── ES6+ features (destructuring, spread, modules)
  └── Error handling

Git & Version Control
  ├── git init, add, commit, push, pull
  ├── Branches and merging
  └── GitHub PRs (working in a team)

Basic Backend
  ├── What is a server?
  ├── Node.js + Express
  ├── REST API design (GET, POST, PUT, DELETE)
  ├── JSON request/response
  └── Environment variables (.env)

Basic Database
  ├── What is a database?
  ├── SQL basics (SELECT, INSERT, UPDATE, DELETE)
  ├── Tables, columns, rows
  └── PostgreSQL with Prisma ORM
```

### Projects to Build

```
Project 1: Personal Portfolio Website
  - Pure HTML/CSS/JS
  - Deploy to Netlify or Vercel (free)
  - Skills: HTML, CSS, responsive design

Project 2: Todo List API
  - Node.js + Express
  - PostgreSQL database
  - CRUD operations
  - Deploy to Railway or Render
  - Skills: REST APIs, databases, deployment

Project 3: Full-Stack Notes App
  - React frontend + Express backend
  - User can create/read/update/delete notes
  - Deployed with frontend + backend + database
  - Skills: React basics, API calls from frontend
```

### Technologies to Start With

| Category | Technology | Why |
|----------|-----------|-----|
| Frontend | HTML/CSS/JavaScript | Required foundation |
| UI Framework | React | Most in-demand, largest ecosystem |
| Backend | Node.js + Express | Same language as frontend |
| Database | PostgreSQL + Prisma | Best beginner SQL experience |
| Deployment | Vercel (frontend) + Railway (backend) | Simplest path to production |
| Version Control | Git + GitHub | Industry standard |

---

## Phase 2: Core Skills (3-9 months)
### Build Production-Ready Applications

**Goal:** Build applications that are secure, properly structured, and could handle real users.

### Skills to Learn

```
TypeScript
  ├── Types and interfaces
  ├── Generic types
  ├── Type narrowing
  └── Strict mode

React Advanced
  ├── useState, useEffect, useContext
  ├── Custom hooks
  ├── React Query (server state)
  ├── React Router (client-side routing)
  └── Form handling (React Hook Form + Zod)

Next.js
  ├── File-based routing
  ├── SSR vs SSG vs ISR (understand all three)
  ├── API routes
  ├── Image optimization
  └── Middleware

Authentication
  ├── Password hashing (bcrypt)
  ├── JWT tokens (access + refresh)
  ├── Session management
  ├── OAuth (NextAuth.js / Auth.js)
  └── Protected routes

Database Advanced
  ├── Database relationships (one-to-many, many-to-many)
  ├── Indexes and query performance
  ├── Database migrations
  ├── Transactions
  └── ORM patterns (Prisma)

API Design
  ├── RESTful design principles
  ├── Input validation (Zod)
  ├── Error handling middleware
  ├── Rate limiting
  └── API versioning

Basic DevOps
  ├── Docker (build containers)
  ├── Environment management (dev/staging/prod)
  ├── GitHub Actions (basic CI/CD)
  └── Reading application logs
```

### Projects to Build

```
Project 4: SaaS Starter (Authentication + Billing)
  - Full auth: register, login, OAuth (GitHub)
  - Protected routes and role-based access
  - Stripe subscription billing integration
  - Skills: auth, payments, full-stack patterns

Project 5: Real-Time Chat Application
  - WebSocket communication (Socket.IO)
  - Multiple chat rooms
  - Message history (database)
  - Online/offline presence
  - Skills: WebSockets, real-time, state management

Project 6: E-Commerce Platform
  - Product catalog with search
  - Shopping cart
  - Checkout with Stripe
  - Order history
  - Admin dashboard
  - Skills: complex data modeling, payments, admin
```

---

## Phase 3: Depth & Breadth (9-18 months)
### Understand Systems, Not Just Code

**Goal:** Understand WHY things are built the way they are, not just how to build them.

### Skills to Learn

```
System Design Fundamentals
  ├── Horizontal vs vertical scaling
  ├── Load balancing
  ├── Caching strategies (Redis)
  ├── Database replication
  └── CAP theorem

Cloud & Infrastructure
  ├── AWS fundamentals (EC2, S3, RDS, ECS)
  ├── Docker advanced (multi-stage builds, compose)
  ├── Kubernetes basics (pods, deployments, services)
  ├── Terraform (Infrastructure as Code)
  └── CI/CD pipelines (GitHub Actions advanced)

Observability
  ├── Structured logging (Pino)
  ├── Metrics (Prometheus + Grafana)
  ├── Error tracking (Sentry)
  ├── Distributed tracing (OpenTelemetry)
  └── Setting up alerts

Security
  ├── OWASP Top 10 (understand each)
  ├── SQL injection prevention
  ├── XSS prevention
  ├── CSRF protection
  ├── Security headers
  └── Secrets management

Performance
  ├── Core Web Vitals
  ├── Bundle analysis and optimization
  ├── Database query optimization (EXPLAIN)
  ├── Caching strategies
  └── Load testing (k6)
```

### Projects to Build

```
Project 7: Clone a Real App at Scale
  - Choose one: Twitter feed, Instagram, Uber, Airbnb
  - Focus on: high-traffic patterns, caching, efficient queries
  - Implement: read replicas, Redis cache, queue for async work
  - Document your architecture decisions
  - Skills: system design, scalability

Project 8: Observability Stack
  - Set up Prometheus + Grafana + Loki
  - Instrument an existing app
  - Create meaningful dashboards
  - Set up alerting rules
  - Skills: operations, production readiness

Project 9: Full CI/CD Pipeline
  - GitHub Actions pipeline: lint → test → build → deploy
  - Deploy to Kubernetes (use managed: EKS, GKE, or k3s local)
  - Blue-green or canary deployment
  - Automated rollback on failure
  - Skills: DevOps, deployment, operations
```

---

## Phase 4: Senior-Level (18-36 months)
### Lead, Design, and Own Systems

**Goal:** Design distributed systems, mentor others, make architectural decisions.

### Skills to Learn

```
Advanced Architecture
  ├── Event-driven architecture (Kafka, RabbitMQ)
  ├── CQRS and Event Sourcing
  ├── Microservices patterns
  ├── API gateway patterns
  ├── Saga pattern (distributed transactions)
  └── Service mesh (Istio, Linkerd)

Data Engineering
  ├── Data warehousing (BigQuery, Redshift)
  ├── ETL pipelines
  ├── Analytics vs OLTP databases
  └── Time-series data (InfluxDB, TimescaleDB)

Security Advanced
  ├── Penetration testing concepts
  ├── Threat modeling
  ├── Zero trust architecture
  ├── Row-level security
  └── Compliance (SOC2, GDPR, HIPAA)

Leadership & Process
  ├── Technical design documents (TDDs/RFCs)
  ├── Code review best practices
  ├── On-call and incident management
  ├── Post-mortems
  └── Mentoring junior engineers
```

---

## Skills Needed by Role

### Junior Engineer (0-2 years)

```
Must have:
  ✅ HTML, CSS, JavaScript (proficient)
  ✅ React (component lifecycle, hooks, state)
  ✅ TypeScript (basic types)
  ✅ REST APIs (consume and build simple ones)
  ✅ SQL basics (CRUD, basic joins)
  ✅ Git (branch, commit, PR, merge)
  ✅ Can deploy a full-stack app
  ✅ Can read error messages and debug

Nice to have:
  ⭐ Next.js
  ⭐ Docker basics
  ⭐ Basic auth (JWT)
  ⭐ Testing (unit tests)
```

### Mid-Level Engineer (2-5 years)

```
Must have:
  ✅ Everything from junior level (proficient)
  ✅ TypeScript (advanced types, generics)
  ✅ React advanced patterns (custom hooks, context)
  ✅ API design (REST best practices, versioning)
  ✅ Database modeling (normalization, indexes)
  ✅ Authentication (JWT, OAuth, sessions)
  ✅ Docker + basic Kubernetes
  ✅ CI/CD pipelines
  ✅ Can independently deliver features end-to-end
  ✅ Security basics (OWASP, input validation)

Nice to have:
  ⭐ Redis (caching, queues)
  ⭐ AWS (EC2, S3, RDS, ECS)
  ⭐ Performance optimization
  ⭐ Monitoring/observability
```

### Senior Engineer (5+ years)

```
Must have:
  ✅ Everything from mid-level (expert)
  ✅ System design (design scalable systems)
  ✅ Cloud architecture (AWS/GCP/Azure)
  ✅ Kubernetes (deploy, scale, troubleshoot)
  ✅ Observability stack (metrics, logs, traces, alerts)
  ✅ Performance engineering (profiling, optimization)
  ✅ Security architecture
  ✅ Incident management and post-mortems
  ✅ Technical leadership (design docs, code review, mentoring)
  ✅ Cross-team communication

Nice to have:
  ⭐ Distributed systems (Kafka, microservices)
  ⭐ Data engineering
  ⭐ Machine learning integration
  ⭐ Infrastructure as Code (Terraform)
```

---

## How to Study This Guide

### Daily Practice (30-60 minutes)

```
Week 1-4: Read one layer per day
  Day 1: Layer 1 - Frontend
  Day 2: Layer 2 - Backend
  ... etc

Week 5-8: Build a project using learned concepts
  Implement each layer you learned in a real app
  Don't just read — BUILD

Week 9-12: Deep dive into weakest areas
  Re-read layers you didn't fully understand
  Search for blog posts and videos on specific topics
```

### Interview Preparation Schedule

```
Week 1: Layers 1-4 (Frontend, Backend, Database, Auth)
  → Most common interview topics
  → Build the ToDo/Notes app

Week 2: Layers 5-8 (Hosting, Cloud, CI/CD, Security)
  → DevOps topics increasingly common
  → Set up a CI/CD pipeline for your project

Week 3: Layers 9-11 (Rate Limiting, Caching, Scaling)
  → System design interview topics
  → Draw and explain caching architecture

Week 4: Layers 12-13 (Monitoring, Recovery)
  → Senior engineer topics
  → Set up Grafana + Prometheus

Week 5-8: Mock interviews
  → System design: design Twitter/Instagram/Uber
  → Coding: LeetCode medium (data structures)
  → Behavioral: STAR format stories

Resources:
  System Design Interview (book by Alex Xu) — essential
  Grokking the System Design Interview (course)
  Designing Data-Intensive Applications (book by Kleppmann) — advanced
```

---

## Recommended Learning Order by Job Goal

### Goal: Frontend Role at a Startup

```
Priority 1: React + TypeScript → Next.js → Tailwind
Priority 2: REST API consumption → GraphQL
Priority 3: Auth (how it works from frontend perspective)
Priority 4: Performance (Core Web Vitals, bundle size)
Priority 5: Deployment (Vercel, basic CI/CD)
```

### Goal: Full-Stack Role at Mid-size Company

```
Priority 1: React + Node.js + PostgreSQL (core loop)
Priority 2: Auth + Security basics
Priority 3: Docker + basic DevOps
Priority 4: Caching (Redis)
Priority 5: Monitoring basics
```

### Goal: Backend / Systems Role at Large Company

```
Priority 1: Deep database knowledge (indexing, transactions, scaling)
Priority 2: Distributed systems (CAP theorem, consistency)
Priority 3: Cloud architecture (AWS)
Priority 4: System design patterns
Priority 5: Observability engineering
```

### Goal: DevOps / Platform Engineer

```
Priority 1: Docker + Kubernetes (deep)
Priority 2: Terraform / Infrastructure as Code
Priority 3: CI/CD pipelines (GitHub Actions, ArgoCD)
Priority 4: Observability (Prometheus, Grafana, ELK)
Priority 5: Security (network policies, secret management)
```

---

## Common Learning Traps to Avoid

```
Trap 1: Tutorial Hell
  Symptom: You've watched 50 tutorials but can't build anything
  Fix: Build projects. Stop watching, start typing.
  Rule: For every 1 hour of tutorial, spend 2 hours coding

Trap 2: Premature Optimization
  Symptom: Worrying about microservices before you have users
  Fix: Build the simplest thing first. Optimize when you have a measured problem.
  Rule: Don't add complexity without a measured justification

Trap 3: Learning Everything Before Starting
  Symptom: "I'll start when I know enough TypeScript / Docker / etc."
  Fix: You learn by building. Start now with what you know.
  Rule: Ship something in week 1, improve it in week 2.

Trap 4: Not Reading Error Messages
  Symptom: Copying stack traces to Google without reading them
  Fix: Read the error message slowly. It usually tells you exactly what's wrong.
  Rule: Spend 15 minutes debugging before asking for help

Trap 5: Ignoring the Documentation
  Symptom: Following outdated tutorials for libraries that changed
  Fix: Always check the official docs for the library version you're using.
  Rule: Official docs > tutorials > Stack Overflow
```

---

*Back to [Index →](./index.md) | [Production Architecture Examples →](./production-architecture-examples.md)*
