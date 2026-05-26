var LAYERS = [
  {
    id: 0,
    title: "Frontend",
    sub: "الواجهة الأمامية — ما يراه المستخدم",
    color: "#e9a20b",
    bg: "rgba(233,162,11,0.1)",
    steps: [
      { h: "اختر إطار العمل", d: "React للمشاريع الكبيرة والمعقدة، Vue للمتوسطة، HTML/CSS خالص للصفحات البسيطة. Next.js هو الخيار الأول لمعظم المشاريع الحديثة لأنه يوفر SSR وSSG وAPI routes في مكان واحد.", c: "npx create-next-app@latest my-app\nnpx create-vue@latest my-app\n# أو Vite للبدء السريع\nnpm create vite@latest my-app" },
      { h: "هيكل المجلدات", d: "نظّم الكود من البداية: components للمكونات القابلة لإعادة الاستخدام، pages للصفحات، hooks للمنطق المشترك، utils للدوال المساعدة، styles للتصميم.", c: "/src\n  /components    ← مكونات قابلة لإعادة الاستخدام\n  /pages         ← صفحات التطبيق\n  /hooks         ← custom hooks\n  /utils         ← دوال مساعدة\n  /styles        ← CSS/SCSS" },
      { h: "إدارة الحالة (State)", d: "للبيانات البسيطة: useState وuseContext كافيان. للتطبيقات الكبيرة: Zustand (أبسط) أو Redux Toolkit (أقوى). تجنب تمرير props أكثر من مستويين (prop drilling).", c: "// Zustand — بسيط وقوي\nimport { create } from 'zustand';\n\nconst useStore = create((set) => ({\n  user: null,\n  setUser: (u) => set({ user: u }),\n  logout: ()  => set({ user: null })\n}));" },
      { h: "التصميم والاستجابة", d: "Tailwind CSS للسرعة في البناء أو CSS Modules للعزل. تأكد من Responsive Design لكل الشاشات باستخدام breakpoints مناسبة. اختبر على موبايل من البداية.", c: "<div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">\n  {items.map(item => (\n    <Card key={item.id} {...item} />\n  ))}\n</div>" },
      { h: "الأداء والتحسين", d: "Lazy loading للمكونات الثقيلة باستخدام React.lazy وSuspense. حسّن الصور باستخدام next/image. احرص على Lighthouse score فوق 90. Code splitting يقلل حجم الحزمة الأولية.", c: "const HeavyChart = lazy(() => import('./HeavyChart'));\n\n<Suspense fallback={<Spinner />}>\n  <HeavyChart data={data} />\n</Suspense>" }
    ],
    tools: [
      { n: "React", d: "UI library" },
      { n: "Next.js", d: "Framework" },
      { n: "Tailwind", d: "Styling" },
      { n: "TypeScript", d: "Type safety" },
      { n: "Vite", d: "Build tool" }
    ],
    tip: "الخطأ الشائع: بناء كل شيء في component واحد ضخم. قسّم واجهتك إلى مكونات صغيرة قابلة لإعادة الاستخدام من البداية — ستوفّر وقتاً هائلاً لاحقاً.",
    ask: "كيف أختار بين Next.js و Vite للمشاريع الجديدة؟"
  },
  {
    id: 1,
    title: "APIs & Backend",
    sub: "الخادم والمنطق التجاري",
    color: "#378add",
    bg: "rgba(55,138,221,0.1)",
    steps: [
      { h: "صمّم هيكل الـ API", d: "قرر بين REST وGraphQL. REST أبسط وأشيع ومناسب لأغلب التطبيقات. GraphQL أفضل حين يحتاج العميل بيانات مخصصة متنوعة لتجنب over-fetching.", c: "GET    /api/users          → قائمة المستخدمين\nGET    /api/users/:id      → مستخدم واحد\nPOST   /api/users          → إنشاء مستخدم\nPUT    /api/users/:id      → تحديث كامل\nPATCH  /api/users/:id      → تحديث جزئي\nDELETE /api/users/:id      → حذف" },
      { h: "طبقة Controllers و Services", d: "افصل منطق المسارات عن منطق العمل. Controllers تستقبل الطلبات وتُعيد الاستجابات. Services تحتوي المنطق الفعلي. هذا يُسهّل الاختبار وإعادة الاستخدام.", c: "// controllers/user.controller.js\nexport async function getUser(req, res) {\n  try {\n    const user = await UserService.findById(req.params.id);\n    if (!user) return res.status(404).json({ error: 'Not found' });\n    res.json(user);\n  } catch (err) {\n    next(err);\n  }\n}" },
      { h: "التحقق من البيانات (Validation)", d: "تحقق من كل بيانات الطلب قبل معالجتها. استخدم Zod أو Joi. لا تثق أبداً ببيانات قادمة من العميل — حتى لو كانت من تطبيقك أنت.", c: "import { z } from 'zod';\n\nconst CreateUserSchema = z.object({\n  email:    z.string().email(),\n  password: z.string().min(8),\n  age:      z.number().min(18).optional()\n});\n\nconst data = CreateUserSchema.parse(req.body);" },
      { h: "معالجة الأخطاء المركزية", d: "أنشئ middleware مركزي لمعالجة كل الأخطاء. أعد أكواداً واضحة: 400 بيانات خاطئة، 401 غير مُصادق، 403 ممنوع، 404 غير موجود، 500 خطأ داخلي.", c: "// middleware/error.middleware.js\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  const status  = err.status || 500;\n  const message = err.message || 'Internal Server Error';\n  res.status(status).json({\n    error: message,\n    code:  err.code\n  });\n});" },
      { h: "Middleware للمهام المشتركة", d: "استخدم middleware للمهام المتكررة: logging كل الطلبات، rate limiting لمنع الإساءة، CORS للسماح للـ frontend، compression لضغط الاستجابات.", c: "app.use(cors({ origin: process.env.FRONTEND_URL }));\napp.use(compression());\napp.use(requestLogger());\napp.use('/api', authMiddleware);\napp.use('/api', rateLimiter);" }
    ],
    tools: [
      { n: "Node.js", d: "Runtime" },
      { n: "Express", d: "Framework" },
      { n: "Fastify", d: "Fast API" },
      { n: "Zod", d: "Validation" },
      { n: "Prisma", d: "ORM" }
    ],
    tip: "ابدأ بـ REST بسيط ومنظّم. لا تحتاج GraphQL إلا حين يكون لديك clients متعددة (موبايل، ويب، ثالث طرف) بمتطلبات بيانات مختلفة جداً.",
    ask: "كيف أبني REST API آمناً ومنظّماً في Node.js من الصفر؟"
  },
  {
    id: 2,
    title: "Database & Storage",
    sub: "قواعد البيانات والتخزين",
    color: "#1d9e75",
    bg: "rgba(29,158,117,0.1)",
    steps: [
      { h: "اختر نوع قاعدة البيانات", d: "PostgreSQL للبيانات العلاقية المنظمة — هو الاختيار الصحيح لـ 99% من التطبيقات. MongoDB للبيانات المرنة غير المنتظمة. Redis للتخزين المؤقت والسرعة. S3 وR2 للملفات والصور.", c: "PostgreSQL → users, orders, products, invoices\nMongoDB   → logs, CMS content, flexible schemas\nRedis     → sessions, cache, real-time queues\nS3/R2     → images, videos, documents, backups" },
      { h: "تصميم الـ Schema", d: "فكّر في العلاقات أولاً قبل كتابة أي كود. one-to-many، many-to-many. تجنب تكرار البيانات (Normalization). أضف indexes على الأعمدة التي ستُبحث كثيراً.", c: "CREATE TABLE users (\n  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email      TEXT UNIQUE NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE posts (\n  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES users(id) ON DELETE CASCADE,\n  title   TEXT NOT NULL,\n  body    TEXT\n);\n\nCREATE INDEX idx_posts_user_id ON posts(user_id);" },
      { h: "استخدم ORM", d: "Prisma يُعطيك type-safety كاملاً مع auto-complete رائع ومنع أخطاء كثيرة في وقت التطوير. Drizzle أخف وأقرب للـ SQL الخام.", c: "// Prisma — type-safe وسهل\nconst user = await prisma.user.findUnique({\n  where:   { email: 'user@example.com' },\n  include: { posts: { take: 5, orderBy: { createdAt: 'desc' } } }\n});\n\n// إنشاء مع علاقة\nconst post = await prisma.post.create({\n  data: { title, body, userId: user.id }\n});" },
      { h: "الـ Migrations", d: "لا تُعدّل قاعدة البيانات يدوياً في الإنتاج أبداً. كل تغيير هيكلي يكون عبر migration file موثّق، يمكن تطبيقه أو التراجع عنه، ومتتبَّع في Git.", c: "# إنشاء migration جديد (Prisma)\nnpx prisma migrate dev --name add_role_to_users\n\n# مراجعة الـ migration قبل التطبيق\ncat prisma/migrations/*/migration.sql\n\n# تطبيق على الإنتاج\nnpx prisma migrate deploy" },
      { h: "النسخ الاحتياطي والاسترداد", d: "فعّل automated backups يومياً على الأقل. احفظ في منطقة جغرافية مختلفة عن السيرفر الرئيسي. اختبر الاستعادة كل شهر — نسخة احتياطية لم تُختبر كأنها غير موجودة.", c: "# pg_dump تلقائي — cron job\n0 2 * * * pg_dump $DATABASE_URL \\\n  | gzip > /backups/db-$(date +%Y%m%d).sql.gz\n\n# رفع فوري على S3\naws s3 cp /backups/ s3://my-backups/db/ --recursive\n\n# اختبار الاستعادة\npsql $TEST_DB < backup.sql" }
    ],
    tools: [
      { n: "PostgreSQL", d: "Relational" },
      { n: "Prisma", d: "ORM" },
      { n: "Redis", d: "Cache" },
      { n: "S3 / R2", d: "Files" },
      { n: "Supabase", d: "BaaS" }
    ],
    tip: "أضف indexes مبكراً على foreign keys وأعمدة البحث المتكررة. Query بدون index يقرأ الجدول كله ويصبح بطيئاً جداً مع النمو — مشكلة تظهر فجأة عند 100k سجل.",
    ask: "كيف أصمم schema قاعدة بيانات لتطبيق تجارة إلكترونية؟"
  },
  {
    id: 3,
    title: "Auth & Permissions",
    sub: "المصادقة والصلاحيات",
    color: "#639922",
    bg: "rgba(99,153,34,0.1)",
    steps: [
      { h: "اختر استراتيجية المصادقة", d: "JWT للـ stateless APIs ومناسب لـ mobile وSPA. Sessions للتطبيقات التقليدية. OAuth للتسجيل عبر Google/GitHub/Apple. استخدم مكتبة جاهزة كـ Auth.js أو Clerk — لا تبنِ Auth من الصفر.", c: "# مكتبات جاهزة وموثوقة\nnpm install next-auth     # Next.js\nnpm install @clerk/nextjs # Managed service\nnpm install lucia-auth    # Flexible, lightweight\nnpm install better-auth   # Modern, full-featured" },
      { h: "تخزين كلمات المرور", d: "لا تخزّن كلمات المرور كنص عادي أبداً — هذا خطأ لا يُغتفر. استخدم bcrypt (work factor 12) أو Argon2. Salt مدمج تلقائياً في bcrypt.", c: "import bcrypt from 'bcrypt';\n\n// عند التسجيل\nconst hash = await bcrypt.hash(plainPassword, 12);\nawait db.user.create({ data: { email, password: hash } });\n\n// عند تسجيل الدخول\nconst isValid = await bcrypt.compare(plainPassword, storedHash);\nif (!isValid) throw new Error('Invalid credentials');" },
      { h: "JWT — الإنشاء والتحقق", d: "الـ JWT يحمل بيانات المستخدم مشفرة. لا يحتاج قاعدة بيانات للتحقق. اجعل access token قصير (15 دقيقة) واستخدم refresh token مخزون في httpOnly cookie للتجديد.", c: "import jwt from 'jsonwebtoken';\n\n// إنشاء access token\nconst accessToken = jwt.sign(\n  { userId: user.id, role: user.role },\n  process.env.JWT_SECRET,\n  { expiresIn: '15m' }\n);\n\n// التحقق في middleware\nconst payload = jwt.verify(token, process.env.JWT_SECRET);" },
      { h: "نظام الصلاحيات RBAC", d: "حدد roles: admin, moderator, user. كل role له permissions محددة. تحقق من الصلاحية في كل endpoint حساس. لا تثق بأي بيانات قادمة من العميل.", c: "// Middleware للتحقق من الدور\nfunction requireRole(...roles) {\n  return (req, res, next) => {\n    if (!roles.includes(req.user.role)) {\n      return res.status(403).json({ error: 'Forbidden' });\n    }\n    next();\n  };\n}\n\n// الاستخدام\nrouter.delete('/users/:id', requireRole('admin'), deleteUser);\nrouter.put('/posts/:id',   requireRole('admin', 'moderator'), editPost);" },
      { h: "حماية الـ Routes", d: "Middleware للتحقق من التوثيق على كل مسار محمي. Rate limit صارم على نقاط الدخول الحساسة. سجّل كل محاولات تسجيل دخول فاشلة.", c: "// Protect all /api/dashboard routes\nrouter.use('/dashboard', authenticate);\n\n// Specific role check\nrouter.use('/admin', authenticate, requireRole('admin'));\n\n// Rate limit on auth endpoints\nrouter.post('/login',    strictLimiter, login);\nrouter.post('/register', strictLimiter, register);" }
    ],
    tools: [
      { n: "Auth.js", d: "Next.js auth" },
      { n: "Clerk", d: "Managed auth" },
      { n: "JWT", d: "Tokens" },
      { n: "bcrypt", d: "Hashing" },
      { n: "Supabase", d: "Auth + DB" }
    ],
    tip: "لا تبنِ Auth من صفر في الإنتاج أبداً. استخدم مكتبة موثوقة. ثغرة واحدة في المصادقة تُعرّض بيانات كل مستخدميك للخطر وقد تُدمّر سمعة منتجك.",
    ask: "ما الفرق بين JWT و Sessions وأيهما أختار لتطبيقي؟"
  },
  {
    id: 4,
    title: "Hosting & Deployment",
    sub: "الاستضافة ونشر التطبيق",
    color: "#888780",
    bg: "rgba(136,135,128,0.1)",
    steps: [
      { h: "اختر منصة النشر المناسبة", d: "Vercel للـ Frontend وNext.js: أسرع deployment وأفضل DX. Railway أو Render للـ Backend: سهل وبأسعار معقولة. Fly.io لـ Docker containers. VPS (DigitalOcean) للتحكم الكامل.", c: "# Frontend على Vercel\nnpx vercel deploy --prod\n\n# Backend على Railway\nrailway up\n\n# Docker على Fly.io\nfly deploy\n\n# VPS: نشر يدوي\nscp -r ./dist user@server:/var/www/app" },
      { h: "إدارة المتغيرات البيئية", d: "لا تضع API keys أو passwords في الكود أبداً — حتى في private repositories. استخدم .env.local للتطوير وenvironment variables في منصة النشر.", c: "# .env.local (مضاف في .gitignore)\nDATABASE_URL=postgresql://user:pass@localhost/db\nJWT_SECRET=your-super-secret-key-here\nSTRIPE_SECRET_KEY=sk_test_...\nNEXT_PUBLIC_API_URL=http://localhost:3001" },
      { h: "Dockerfile للبيئات المتسقة", d: "Docker يضمن أن التطبيق يعمل بنفس الطريقة في كل بيئة. Multi-stage build يُقلّل حجم الصورة النهائية.", c: "# Multi-stage build\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runner\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nEXPOSE 3000\nCMD [\"node\", \"dist/server.js\"]" },
      { h: "Health Check Endpoint", d: "أضف endpoint بسيط للتحقق من صحة التطبيق. منصات الاستضافة تستخدمه لإعادة التشغيل التلقائي عند التوقف. Load balancers تستخدمه لتوجيه الحركة.", c: "app.get('/health', async (req, res) => {\n  try {\n    await prisma.$queryRaw`SELECT 1`; // تحقق DB\n    res.json({\n      status:    'healthy',\n      timestamp: new Date().toISOString(),\n      uptime:    Math.floor(process.uptime())\n    });\n  } catch {\n    res.status(503).json({ status: 'unhealthy' });\n  }\n});" },
      { h: "Zero-downtime Deployment", d: "Rolling deployment: انشر الإصدار الجديد بجانب القديم، حوّل الحركة تدريجياً، ثم أزل القديم. يضمن عدم انقطاع الخدمة أثناء التحديثات.", c: "# Fly.io\nfly deploy --strategy rolling\n\n# Docker Swarm\ndocker service update \\\n  --image myapp:v2 \\\n  --update-parallelism 1 \\\n  --update-delay 10s \\\n  myapp_web\n\n# Vercel: تلقائي دائماً" }
    ],
    tools: [
      { n: "Vercel", d: "Frontend" },
      { n: "Railway", d: "Backend" },
      { n: "Fly.io", d: "Containers" },
      { n: "Docker", d: "Packaging" },
      { n: "Nginx", d: "Reverse proxy" }
    ],
    tip: "ابدأ بـ Vercel + Railway. رخيصان وسهلان وكافيان لأغلب المشاريع حتى 10k مستخدم يومياً. انتقل لـ VPS فقط حين تحتاج تحكماً خاصاً لا توفّره المنصات.",
    ask: "كيف أنشر تطبيق Next.js مع Backend منفصل بشكل احترافي؟"
  },
  {
    id: 5,
    title: "Cloud & Compute",
    sub: "السحابة والحوسبة المرنة",
    color: "#888780",
    bg: "rgba(136,135,128,0.08)",
    steps: [
      { h: "افهم نماذج الحوسبة", d: "IaaS: سيرفرات افتراضية تديرها أنت (EC2, VMs). PaaS: منصات جاهزة تدير الخادم (Railway, Heroku). Serverless: دوال تنفَّذ عند الطلب وتتوقف تلقائياً — دفع على التنفيذ الفعلي فقط.", c: "# مقارنة النماذج\nIaaS  → EC2, DigitalOcean VMs\n        أنت تدير كل شيء\n\nPaaS  → Railway, Render, Heroku\n        المنصة تدير الخادم\n\nFaaS  → Vercel Functions, AWS Lambda\n        دالة واحدة = وحدة نشر\n        دفع على ms التنفيذ فعلياً" },
      { h: "Serverless Functions", d: "مناسبة للعمليات المتقطعة: معالجة صور بعد رفعها، إرسال بريد، معالجة webhooks. تحذير: cold start يضيف 200-500ms للطلب الأول بعد فترة خمول.", c: "// Vercel Edge Function\nexport default async function handler(req: Request) {\n  const body = await req.json();\n  const result = await processWebhook(body);\n  return Response.json({ success: true, result });\n}\n\nexport const config = {\n  runtime: 'edge',\n  regions: ['iad1', 'fra1'] // multi-region\n};" },
      { h: "Object Storage للملفات", d: "لا تخزّن الملفات على السيرفر — تضيع عند restart. استخدم S3 أو Cloudflare R2 (أرخص بكثير، بدون egress fees). أنشئ signed URLs لمدة محدودة للوصول الآمن.", c: "import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\n\n// رفع ملف\nawait s3.send(new PutObjectCommand({\n  Bucket: 'my-bucket',\n  Key:    `uploads/${userId}/${filename}`,\n  Body:   buffer\n}));\n\n// رابط مؤقت صالح ساعة\nconst url = await getSignedUrl(s3, new GetObjectCommand({\n  Bucket: 'my-bucket', Key: key\n}), { expiresIn: 3600 });" },
      { h: "Message Queues للعمليات الطويلة", d: "للعمليات التي تأخذ وقتاً: معالجة فيديو، إرسال بريد جماعي، تقارير PDF. لا تنفّذها في HTTP request — ضعها في queue وعالجها في background worker.", c: "// إضافة مهمة للـ queue\nimport { Queue } from 'bullmq';\n\nconst emailQueue = new Queue('emails', {\n  connection: { host: process.env.REDIS_HOST }\n});\n\nawait emailQueue.add('welcome-email', {\n  userId, email, name\n}, {\n  attempts: 3,\n  backoff: { type: 'exponential', delay: 2000 }\n});" },
      { h: "اختيار الـ Region المناسبة", d: "اختر region قريبة من أغلب مستخدميك. للشرق الأوسط: eu-west-1 (أيرلندا) أو me-south-1 (البحرين). الفرق بين region قريبة وبعيدة قد يصل 200ms على كل طلب.", c: "# زمن الاستجابة التقريبي من الخليج العربي\nus-east-1  (Virginia)  → ~180ms\neu-west-1  (Ireland)   → ~90ms\nme-south-1 (Bahrain)   → ~20ms\n\n# اختبر بنفسك\ncurl -w '%{time_total}' https://region.example.com/ping" }
    ],
    tools: [
      { n: "AWS", d: "Full cloud" },
      { n: "Cloudflare", d: "Edge + CDN" },
      { n: "R2", d: "Storage" },
      { n: "BullMQ", d: "Queues" },
      { n: "Upstash", d: "Serverless Redis" }
    ],
    tip: "Cloudflare R2 لتخزين الملفات أرخص بكثير من AWS S3 — لا توجد رسوم egress إطلاقاً. هو الخيار الأمثل للمشاريع الجديدة ويمكن التحويل لـ S3 لاحقاً إن احتجت.",
    ask: "متى أستخدم Serverless Functions بدلاً من سيرفر دائم؟"
  },
  {
    id: 6,
    title: "CI/CD & Version Control",
    sub: "التكامل المستمر والنشر التلقائي",
    color: "#ba7517",
    bg: "rgba(186,117,23,0.1)",
    steps: [
      { h: "Git Flow — استراتيجية الفروع", d: "main: كود الإنتاج فقط — لا push مباشر. develop: التطوير المستمر. feature/*: ميزة جديدة. hotfix/*: إصلاحات طارئة في الإنتاج. كل تغيير يمر عبر Pull Request.", c: "# سير عمل يومي\ngit checkout develop\ngit pull origin develop\ngit checkout -b feature/user-notifications\n\n# ... اكتب الكود ...\ngit add .\ngit commit -m 'feat: add email notifications'\ngit push origin feature/user-notifications\n\n# افتح Pull Request على GitHub" },
      { h: "Conventional Commits", d: "اتبع نمطاً ثابتاً في رسائل الـ commit. يُسهّل تتبع التغييرات، إنشاء CHANGELOG تلقائياً، وتحديد نوع الـ release (major/minor/patch).", c: "feat:     ميزة جديدة → minor release\nfix:      إصلاح خطأ → patch release\ndocs:     تحديث توثيق\nrefactor: إعادة هيكلة\ntest:     إضافة اختبارات\nchore:    مهام صيانة\n\n# مثال كامل\nfeat(auth): add Google OAuth login\nfix(api): correct pagination offset\ndocs(readme): update deployment guide" },
      { h: "CI Pipeline — GitHub Actions", d: "كل push أو PR يُشغّل تلقائياً: تثبيت الحزم، تشغيل الاختبارات، فحص الكود (lint). إن فشل أي خطوة يتوقف ولا يُنشر الكود.", c: "# .github/workflows/ci.yml\nname: CI\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: '20' }\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test\n      - run: npm run build" },
      { h: "CD — النشر التلقائي على main", d: "بعد دمج الكود في main ونجاح جميع الاختبارات: انشر تلقائياً للإنتاج. أضف خطوة موافقة يدوية للإنتاج الحساس إن أردت.", c: "# الجزء الثاني من workflow\n  deploy:\n    needs: test\n    if: github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    environment: production  # يطلب موافقة يدوية\n    steps:\n      - uses: actions/checkout@v4\n      - name: Deploy to Vercel\n        run: |\n          npx vercel deploy --prod \\\n            --token ${{ secrets.VERCEL_TOKEN }}" },
      { h: "حماية الفروع (Branch Protection)", d: "فعّل branch protection على main: لا push مباشر، يجب PR وموافقة شخص آخر، يجب نجاح جميع checks. يمنع الأخطاء من الوصول للإنتاج.", c: "# GitHub → Settings → Branches\n# Add rule for: main\n\n✓ Require a pull request before merging\n  ✓ Require 1 approval\n✓ Require status checks to pass\n  ✓ CI / test (required)\n✓ Do not allow bypassing above settings\n✓ Restrict force pushes" }
    ],
    tools: [
      { n: "Git", d: "Version control" },
      { n: "GitHub", d: "Repository" },
      { n: "Actions", d: "CI/CD" },
      { n: "Husky", d: "Git hooks" },
      { n: "Semantic Release", d: "Versioning" }
    ],
    tip: "أضف Husky لتشغيل lint وtests محلياً قبل كل commit. يمنع رفع كود مكسور للـ repository ويوفّر وقت انتظار الـ CI pipeline.",
    ask: "كيف أبني GitHub Actions pipeline كامل للاختبار والنشر التلقائي؟"
  },
  {
    id: 7,
    title: "Security & RLS",
    sub: "الأمان وحماية البيانات",
    color: "#d85a30",
    bg: "rgba(216,90,48,0.1)",
    steps: [
      { h: "HTTPS وشهادات SSL", d: "كل التطبيقات تحتاج HTTPS بلا استثناء. Vercel وRailway يُفعّلانه تلقائياً. للـ VPS: استخدم Certbot مجاناً مع Let's Encrypt. أعدّ redirect تلقائي من HTTP.", c: "# Nginx — redirect HTTP to HTTPS\nserver {\n  listen 80;\n  server_name example.com www.example.com;\n  return 301 https://$host$request_uri;\n}\n\n# تثبيت Let's Encrypt\ncertbot --nginx -d example.com -d www.example.com\n# يُجدَّد تلقائياً كل 90 يوم" },
      { h: "Row Level Security — RLS", d: "RLS في Supabase/PostgreSQL يمنع المستخدم من رؤية أو تعديل بيانات غيره على مستوى قاعدة البيانات نفسها — طبقة حماية إضافية حتى لو كان في الكود bug.", c: "-- فعّل RLS على الجدول\nALTER TABLE posts ENABLE ROW LEVEL SECURITY;\n\n-- مستخدم يقرأ منشوراته فقط\nCREATE POLICY select_own_posts ON posts\n  FOR SELECT USING (author_id = auth.uid());\n\n-- مستخدم يُعدّل منشوراته فقط\nCREATE POLICY update_own_posts ON posts\n  FOR UPDATE USING (author_id = auth.uid());" },
      { h: "حماية من SQL Injection", d: "استخدم parameterized queries أو ORM دائماً. لا تضع أبداً متغيرات مستخدم مباشرة في SQL query. هجوم SQL Injection يستغل هذه الثغرة لسرقة أو حذف كل البيانات.", c: "// خاطئ — خطير جداً!\nconst q = `SELECT * FROM users WHERE id='${userId}'`;\n// مهاجم يُدخل: ' OR '1'='1 → يحصل على كل البيانات!\n\n// صحيح — Parameterized query\nconst user = await db.query(\n  'SELECT * FROM users WHERE id = $1',\n  [userId]\n);\n// أو ORM:\nconst user = await prisma.user.findUnique({ where: { id: userId } });" },
      { h: "إدارة الأسرار (Secrets)", d: "لا تضع API keys في الكود أبداً — حتى في branches خاصة. استخدم .env.local للتطوير وSecrets Manager في الإنتاج. دوّر المفاتيح دورياً وعند انتهاء عمل مطوّر.", c: "# .gitignore — إضافة إلزامية\n.env\n.env.local\n.env.*.local\n*.pem\n*.key\n\n# استخدام في الكود\nconst stripe  = new Stripe(process.env.STRIPE_SECRET_KEY!);\nconst db      = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });\n\n# فحص دوري للـ secrets المكشوفة\ngitguardian monitor" },
      { h: "Security Headers وCSP", d: "أضف HTTP security headers لمنع هجمات المتصفح الشائعة: clickjacking، MIME sniffing، XSS. Content Security Policy يحدد من أين يُحمَّل الكود.", c: "// next.config.js\nconst securityHeaders = [\n  { key: 'X-DNS-Prefetch-Control',    value: 'on' },\n  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },\n  { key: 'X-Content-Type-Options',    value: 'nosniff' },\n  { key: 'Referrer-Policy',           value: 'origin-when-cross-origin' },\n  { key: 'Permissions-Policy',        value: 'camera=(), microphone=()' }\n];" }
    ],
    tools: [
      { n: "Helmet.js", d: "HTTP headers" },
      { n: "Certbot", d: "SSL certs" },
      { n: "OWASP", d: "Guidelines" },
      { n: "Snyk", d: "Vuln scan" },
      { n: "Supabase RLS", d: "DB security" }
    ],
    tip: "شغّل 'npm audit' بانتظام لاكتشاف ثغرات في حزم الـ dependencies. أضفه كخطوة إلزامية في CI pipeline ليتوقف النشر عند ثغرات خطيرة.",
    ask: "كيف أحمي تطبيقي من هجمات SQL Injection و XSS؟"
  },
  {
    id: 8,
    title: "Rate Limiting",
    sub: "تحديد معدل الطلبات وحماية الـ API",
    color: "#e24b4a",
    bg: "rgba(226,75,74,0.1)",
    steps: [
      { h: "لماذا Rate Limiting ضروري", d: "بدونه: مستخدم واحد يستطيع إرسال آلاف الطلبات في الثانية ويُعطّل الخدمة للجميع. هجمات brute force على login. استنزاف APIs مدفوعة كـ OpenAI وSendGrid.", c: "# حالات تحتاج Rate Limiting فوري\n/api/auth/login     → 5 محاولات / دقيقة / IP\n/api/auth/register  → 3 طلبات / ساعة / IP\n/api/auth/reset     → 3 طلبات / ساعة / email\n/api/send-email     → 10 رسائل / يوم / user\n/api/ai/chat        → 20 رسالة / دقيقة / user\n/api/*              → 200 طلب / دقيقة / IP" },
      { h: "التطبيق مع Express", d: "express-rate-limit للبدء السريع. يعمل في الذاكرة — مناسب للسيرفر الواحد. للتوزيع على عدة سيرفرات يجب Redis كمخزن مشترك.", c: "import rateLimit from 'express-rate-limit';\n\nconst loginLimiter = rateLimit({\n  windowMs:     15 * 60 * 1000, // 15 دقيقة\n  max:          5,              // 5 محاولات\n  standardHeaders: true,\n  message: { error: 'Too many login attempts, try later' },\n  // أبطئ بدل الحظر الكامل\n  handler: (req, res) => res.status(429).json(\n    { error: 'Rate limit exceeded', retryAfter: 900 })\n});\napp.post('/auth/login', loginLimiter, loginHandler);" },
      { h: "Rate Limiting مع Redis وUpstash", d: "Redis يُمكّن rate limiting موزّعاً عبر عدة instances أو serverless functions. Upstash يُوفّر Redis serverless مثالياً لهذا الاستخدام.", c: "import { Ratelimit } from '@upstash/ratelimit';\nimport { Redis } from '@upstash/redis';\n\nconst ratelimit = new Ratelimit({\n  redis:     Redis.fromEnv(),\n  limiter:   Ratelimit.slidingWindow(10, '10 s'),\n  analytics: true // تحليلات في dashboard\n});\n\nexport async function POST(req: Request) {\n  const ip = req.headers.get('x-forwarded-for') ?? 'anon';\n  const { success, remaining } = await ratelimit.limit(ip);\n  if (!success) return new Response('Rate limited', { status: 429 });\n}" },
      { h: "أنواع خوارزميات Rate Limiting", d: "Fixed Window: أبسط لكن قابل للتجاوز عند حدود النافذة. Sliding Window: أدق وأعدل. Token Bucket: مرن يسمح بنبضات. Leaky Bucket: معدل ثابت.", c: "# Fixed Window\n0 ────[10 req]──── 60s ثم يُعاد العداد\n# مشكلة: 10 req في آخر ثانية + 10 req في أول الدقيقة التالية\n\n# Sliding Window (الأفضل)\nآخر 60 ثانية دائماً — لا حدود مفاجئة\n\n# Token Bucket\nإضافة 1 token/ثانية حتى max=10\nطلب يستهلك token — مرن للنبضات" },
      { h: "الاستجابة الصحيحة للـ Rate Limit", d: "أعد 429 Too Many Requests مع headers تُخبر العميل متى يُعيد المحاولة. لا تُكشف معلومات داخلية في رسالة الخطأ.", c: "HTTP/1.1 429 Too Many Requests\nContent-Type: application/json\nRetry-After: 60\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1735689600\n\n{\n  \"error\": \"Rate limit exceeded\",\n  \"message\": \"Too many requests, please try again in 60 seconds\"\n}" }
    ],
    tools: [
      { n: "express-rate-limit", d: "Simple" },
      { n: "Upstash", d: "Redis serverless" },
      { n: "Cloudflare", d: "Edge limiting" },
      { n: "nginx", d: "Server level" }
    ],
    tip: "طبّق Rate Limiting على مستويين: Cloudflare يصدّ الهجمات الضخمة على مستوى الشبكة قبل أن تصل لسيرفرك، ثم تطبيقك يتحكم بالمنطق التجاري الدقيق.",
    ask: "كيف أطبق rate limiting ذكياً يفرّق بين مستخدم عادي وهجوم آلي؟"
  },
  {
    id: 9,
    title: "Caching & CDN",
    sub: "التخزين المؤقت وتسريع التوصيل",
    color: "#7f77dd",
    bg: "rgba(127,119,221,0.1)",
    steps: [
      { h: "مستويات الـ Caching", d: "Browser Cache: المتصفح يخزّن الأصول الثابتة. CDN: سيرفرات موزّعة تقرّب المحتوى. Application Cache (Redis): نتائج queries. Database Cache: query plans.", c: "# هرم الـ Cache — الأسرع إلى الأبطأ\nL1: Browser cache     → 0ms     (مجاني)\nL2: CDN (Cloudflare)  → 5-20ms  (رخيص)\nL3: Redis cache       → 1-5ms   (متوسط)\nL4: Database query    → 10-100ms\nL5: External API      → 100-500ms\n\n# القاعدة: cache أعلى ما يمكن في الهرم" },
      { h: "Redis للـ Application Cache", d: "خزّن نتائج queries الثقيلة أو المتكررة. حدد TTL مناسباً لكل نوع بيانات. أبطل الـ cache فوراً عند تحديث البيانات.", c: "// Cache-aside pattern\nasync function getUserWithPosts(userId: string) {\n  const cacheKey = `user:${userId}:posts`;\n  \n  // تحقق من الـ cache أولاً\n  const cached = await redis.get(cacheKey);\n  if (cached) return JSON.parse(cached);\n  \n  // اجلب من قاعدة البيانات\n  const data = await prisma.user.findUnique({\n    where: { id: userId }, include: { posts: true }\n  });\n  \n  // خزّن لمدة 5 دقائق\n  await redis.setex(cacheKey, 300, JSON.stringify(data));\n  return data;\n}" },
      { h: "HTTP Cache Headers", d: "تحكّم في كيفية تخزين المتصفح والـ CDN. الأصول الثابتة (JS, CSS, صور): cache طويل مع versioning. البيانات الديناميكية: no-cache أو TTL قصير.", c: "# next.config.js — أصول ثابتة\nasync headers() {\n  return [{\n    source: '/_next/static/:path*',\n    headers: [{\n      key: 'Cache-Control',\n      value: 'public, max-age=31536000, immutable'\n    }]\n  }, {\n    source: '/api/:path*',\n    headers: [{\n      key: 'Cache-Control',\n      value: 'private, max-age=0, must-revalidate'\n    }]\n  }];\n}" },
      { h: "CDN — Cloudflare", d: "Cloudflare يقف أمام خادمك: يخدم الأصول الثابتة من أقرب نقطة للمستخدم، يحمي من DDoS، يضغط الملفات بـ Brotli تلقائياً.", c: "# Cloudflare Workers — Edge Caching\nexport default {\n  async fetch(request, env, ctx) {\n    const cache = caches.default;\n    \n    // تحقق من cache الـ CDN\n    let response = await cache.match(request);\n    if (response) return response;\n    \n    // اجلب من الأصل\n    response = await fetch(request);\n    \n    // خزّن في cache إن كان قابلاً\n    if (response.status === 200) {\n      ctx.waitUntil(cache.put(request, response.clone()));\n    }\n    return response;\n  }\n}" },
      { h: "Cache Invalidation", d: "أصعب مشكلة في الـ Caching. استراتيجيات: TTL (انتهاء تلقائي)، Event-based (أبطل عند التحديث)، Versioning (غيّر URL عند التغيير).", c: "// Cache invalidation عند التحديث\nasync function updateUser(userId: string, data: UpdateUserDto) {\n  // حدّث قاعدة البيانات\n  const user = await prisma.user.update({ where: { id: userId }, data });\n  \n  // أبطل كل keys المرتبطة\n  await Promise.all([\n    redis.del(`user:${userId}`),\n    redis.del(`user:${userId}:posts`),\n    redis.del('users:list')\n  ]);\n  \n  return user;\n}" }
    ],
    tools: [
      { n: "Redis", d: "App cache" },
      { n: "Cloudflare", d: "CDN + DDoS" },
      { n: "Upstash", d: "Serverless Redis" },
      { n: "Varnish", d: "HTTP cache" }
    ],
    tip: "لا تُبالغ في الـ Caching مبكراً — premature optimization. ابدأ بدونه، قِس المشاكل الحقيقية بـ APM tool، ثم أضف الـ Cache حيث الأثر الأكبر.",
    ask: "كيف أنفذ caching strategy فعّال في Next.js مع Redis؟"
  },
  {
    id: 10,
    title: "Load Balancing & Scaling",
    sub: "موازنة الأحمال والتوسع",
    color: "#534ab7",
    bg: "rgba(83,74,183,0.1)",
    steps: [
      { h: "Vertical vs Horizontal Scaling", d: "Vertical (Scale Up): سيرفر أكبر وأقوى — بسيط لكن له حد أقصى وتوقف عند الترقية. Horizontal (Scale Out): سيرفرات أكثر — مرن ولا حد نظرياً لكن أعقد.", c: "# Vertical Scaling\nt3.medium (2 CPU, 4GB) → t3.xlarge (4 CPU, 16GB)\n⚠  توقف مؤقت للترقية\n⚠  تكلفة تتضاعف بسرعة\n⚠  حد أقصى للسيرفر الواحد\n\n# Horizontal Scaling\n1 instance → 5 instances → 20 instances\n✓ بدون توقف\n✓ مرونة كاملة\n✓ fault tolerance" },
      { h: "Nginx Load Balancer", d: "يُوزّع الطلبات على سيرفرات متعددة. خوارزميات: Round Robin (تناوبي متساوٍ)، Least Connections (للأقل ازدحاماً)، IP Hash (نفس المستخدم لنفس السيرفر).", c: "upstream backend {\n  least_conn;  # للأقل اتصالات نشطة\n  \n  server app1:3000 weight=3;  # يستقبل 3x\n  server app2:3000 weight=1;\n  server app3:3000 backup;    # احتياطي فقط\n  \n  keepalive 32;  # اتصالات دائمة\n}\n\nserver {\n  location /api {\n    proxy_pass http://backend;\n    proxy_http_version 1.1;\n  }\n}" },
      { h: "Stateless Architecture", d: "لتوزيع التطبيق على عدة سيرفرات يجب أن يكون stateless: لا تخزّن session أو files على الذاكرة المحلية. استخدم Redis للـ sessions، S3 للملفات.", c: "// خاطئ: session في ذاكرة السيرفر\n// مستخدم قد يصل لسيرفر مختلف في كل طلب!\napp.use(session({ store: new MemoryStore() }));\n\n// صحيح: session مشتركة في Redis\nimport connectRedis from 'connect-redis';\nconst RedisStore = connectRedis(session);\napp.use(session({\n  store:  new RedisStore({ client: redisClient }),\n  secret: process.env.SESSION_SECRET,\n  resave: false, saveUninitialized: false\n}));" },
      { h: "Kubernetes Auto Scaling", d: "Kubernetes يُدير الحاويات ويُضيف أو يُزيل instances تلقائياً حسب الحمل. HPA (Horizontal Pod Autoscaler) يتفاعل مع CPU, memory, أو custom metrics.", c: "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: api-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: api-deployment\n  minReplicas: 2\n  maxReplicas: 20\n  metrics:\n  - type: Resource\n    resource:\n      name: cpu\n      target:\n        type: Utilization\n        averageUtilization: 70" },
      { h: "Database Scaling", d: "Read Replicas: نسخ من قاعدة البيانات للقراءة فقط — يُخفّف 80% من الحمل. pgBouncer لـ Connection Pooling. Sharding للبيانات الضخمة جداً (+100M سجل).", c: "# pgBouncer — Connection Pooling\n[databases]\nmy_db = host=primary-db port=5432\nmy_db_replica = host=replica-db port=5432\n\n[pgbouncer]\npool_mode         = transaction\nmax_client_conn   = 1000\ndefault_pool_size = 25\nmin_pool_size     = 5\n\n# في الكود — قراءة من replica\nconst readDb = prisma.$extends(readReplica({ url: REPLICA_URL }));" }
    ],
    tools: [
      { n: "Nginx", d: "Load balancer" },
      { n: "Kubernetes", d: "Orchestration" },
      { n: "pgBouncer", d: "DB pooling" },
      { n: "AWS ALB", d: "Cloud LB" },
      { n: "Fly.io", d: "Auto scaling" }
    ],
    tip: "ابدأ بسيرفر واحد كبير قبل التوسع الأفقي. Horizontal scaling يُضيف تعقيداً هائلاً (state management, distributed tracing, etc). احتجه فعلاً قبل بنائه.",
    ask: "كيف أجهّز تطبيقي للتوسع الأفقي من البداية بدون تعقيد زائد؟"
  },
  {
    id: 11,
    title: "Error Tracking & Logs",
    sub: "مراقبة الأخطاء وتتبع الأحداث",
    color: "#378add",
    bg: "rgba(55,138,221,0.08)",
    steps: [
      { h: "Sentry لتتبع الأخطاء", d: "Sentry يُسجّل الأخطاء تلقائياً مع stack trace كامل، بيانات المستخدم، breadcrumbs لما حدث قبل الخطأ، وbrowser/OS info. يُنبّهك فوراً عبر Slack أو email.", c: "import * as Sentry from '@sentry/nextjs';\n\nSentry.init({\n  dsn:              process.env.NEXT_PUBLIC_SENTRY_DSN,\n  tracesSampleRate: 0.1,   // 10% من الطلبات للأداء\n  environment:      process.env.NODE_ENV,\n  release:          process.env.VERCEL_GIT_COMMIT_SHA\n});\n\n// إضافة سياق المستخدم\nSentry.setUser({ id: userId, email: userEmail });\n\n// في catch blocks\nSentry.captureException(error, { extra: { endpoint: req.path } });" },
      { h: "Structured Logging مع Pino", d: "لا تستخدم console.log في الإنتاج أبداً. Pino يُخرج JSON منظّماً يُسهّل البحث والتصفية في أنظمة مثل Datadog أو Logtail. أسرع logger في نظام Node.js.", c: "import pino from 'pino';\nconst log = pino({\n  level:  process.env.LOG_LEVEL || 'info',\n  redact: ['password', 'token', 'creditCard'] // إخفاء بيانات حساسة\n});\n\n// في كل request\nlog.info({ userId, action: 'login', ip: req.ip }, 'User authenticated');\n\n// عند خطأ\nlog.error({ err, userId, endpoint: req.path }, 'Database query failed');" },
      { h: "Log Levels — المستوى المناسب", d: "استخدم المستوى الصحيح لكل حالة. في الإنتاج: info وما فوق فقط. Debug يُعطّئ الأداء ويملأ التخزين إن فُعّل في الإنتاج.", c: "log.fatal  → التطبيق يتوقف — تنبيه فوري 24/7\nlog.error  → خطأ حرج: DB فشل، API خارجي معطّل\nlog.warn   → تحذير: rate limit قريب، retry حدث\nlog.info   → حدث مهم: login، signup، payment\nlog.debug  → تشخيص: قيم متغيرات (dev فقط)\nlog.trace  → تفاصيل دقيقة جداً (dev فقط)" },
      { h: "Performance Monitoring", d: "تتبّع زمن الاستجابة لكل endpoint. اكشف slow queries قبل أن تُلاحظها من المستخدمين. Datadog APM يعطيك خريطة كاملة للأداء.", c: "// قياس وتسجيل زمن التنفيذ\nasync function measureQuery(name: string, fn: () => Promise<any>) {\n  const start = performance.now();\n  try {\n    const result = await fn();\n    const ms = Math.round(performance.now() - start);\n    if (ms > 500) log.warn({ ms, query: name }, 'Slow query');\n    else log.info({ ms, query: name }, 'Query completed');\n    return result;\n  } catch (err) {\n    log.error({ err, query: name }, 'Query failed');\n    throw err;\n  }\n}" },
      { h: "Alerts ذكية بدون alert fatigue", d: "تنبيهات على: error rate فوق 1% في 5 دقائق، p99 latency فوق 2 ثانية، memory فوق 85%. لا تنبّه على كل صغيرة — ستتجاهل التنبيهات مع الوقت.", c: "# Datadog Monitor — مثال\nalert:\n  name: High Error Rate\n  query: sum(last_5m):errors / requests > 0.01\n  message: |\n    خطأ! نسبة الأخطاء تجاوزت 1%\n    الـ endpoint: {{error.endpoint}}\n    الأخطاء: {{errors}} / {{requests}}\n  notify: '@slack-alerts @pagerduty-on-call'\n  thresholds:\n    critical: 0.05\n    warning:  0.01" }
    ],
    tools: [
      { n: "Sentry", d: "Error tracking" },
      { n: "Pino", d: "Fast logging" },
      { n: "Datadog", d: "APM" },
      { n: "Logtail", d: "Log mgmt" },
      { n: "Uptime Kuma", d: "Uptime" }
    ],
    tip: "أضف requestId فريد (UUID) لكل طلب HTTP وضعه في كل log line. يُمكّنك تتبع رحلة طلب واحد عبر كل الـ logs حتى لو توزّعت على عشرات الـ services.",
    ask: "كيف أبني نظام logging احترافي في Node.js مع Sentry وPino؟"
  },
  {
    id: 12,
    title: "Availability & Recovery",
    sub: "الاستمرارية والتعافي من الكوارث",
    color: "#e9a20b",
    bg: "rgba(233,162,11,0.08)",
    steps: [
      { h: "حدد RTO و RPO أولاً", d: "RTO (Recovery Time Objective): أقصى وقت مقبول للانقطاع قبل أن يتضرر العمل. RPO (Recovery Point Objective): أقصى كمية بيانات مقبول فقدانها. هما يحددان تكلفة الحل.", c: "# أمثلة واقعية\nBlog/portfolio: RTO=24h   RPO=24h   → رخيص جداً\nSaaS صغير:     RTO=4h    RPO=1h    → متوسط التكلفة\nSaaS عادي:     RTO=1h    RPO=15min → مكلف نسبياً\nFintech/صحة:   RTO=5min  RPO=0min  → مكلف جداً\n\n# كلما قلّ الـ RTO/RPO كلما ارتفعت التكلفة بشكل كبير" },
      { h: "النسخ الاحتياطي الآلي", d: "فعّل automated backups يومياً على الأقل. احفظ في منطقة جغرافية مختلفة عن السيرفر الرئيسي. اختبر الاستعادة فعلياً كل شهر.", c: "#!/bin/bash\n# backup.sh — يعمل كل يوم الساعة 2:00 صباحاً\n0 2 * * * /scripts/backup.sh\n\nDATETIME=$(date +%Y%m%d_%H%M)\nBACKUP_FILE=\"db_$DATETIME.sql.gz\"\n\n# dump وضغط\npg_dump $DATABASE_URL | gzip > /tmp/$BACKUP_FILE\n\n# رفع على S3 في region مختلفة\naws s3 cp /tmp/$BACKUP_FILE \\\n  s3://my-backups/daily/$BACKUP_FILE \\\n  --storage-class STANDARD_IA\n\n# حذف النسخ الأقدم من 30 يوم\nfind /tmp/db_*.sql.gz -mtime +30 -delete" },
      { h: "Health Checks والـ Failover التلقائي", d: "health check endpoint يُعلم load balancer بتوقف سيرفر ليُحوّل الحركة للسيرفر الاحتياطي تلقائياً. Uptime Kuma ينبّهك خلال دقيقة.", c: "// /api/health — يُفحص كل 30 ثانية\napp.get('/health', async (req, res) => {\n  const checks = await Promise.allSettled([\n    prisma.$queryRaw`SELECT 1`,      // DB\n    redis.ping(),                     // Cache\n    fetch(process.env.EXTERNAL_API)   // External\n  ]);\n  \n  const healthy = checks.every(c => c.status === 'fulfilled');\n  res.status(healthy ? 200 : 503).json({\n    status:   healthy ? 'healthy' : 'degraded',\n    checks:   { db: checks[0].status, redis: checks[1].status },\n    uptime:   Math.floor(process.uptime())\n  });\n});" },
      { h: "Multi-region Deployment", d: "للتطبيقات الحساسة: انشر في منطقتين جغرافيتين. إن سقط datacenter كامل، المنطقة الأخرى تستمر. Fly.io يُسهّل هذا مع توجيه تلقائي للأقرب.", c: "# fly.toml — multi-region\napp = 'my-critical-app'\nprimary_region = 'ams'\n\n[[services]]\n  internal_port = 3000\n  \n  [[services.http_checks]]\n    path     = '/health'\n    interval = '30s'\n    timeout  = '10s'\n\n# نشر في منطقتين\nfly scale count 2 --region ams  # Amsterdam\nfly scale count 2 --region sin  # Singapore" },
      { h: "Runbook — دليل الاستجابة للحوادث", d: "وثّق خطوات الاستجابة لكل سيناريو كارثة مسبقاً. الضغط وقت الحوادث يُصعّب التفكير الواضح — الـ Runbook يُنقذك ويُسرّع الاستعادة.", c: "# Runbook: انهيار قاعدة البيانات\n## أعراض\n- أخطاء 500 على كل API endpoints\n- alerts من Sentry: db connection failed\n\n## خطوات الاستجابة\n1. [ ] تحقق Sentry → نوع الخطأ وبداية المشكلة\n2. [ ] تحقق DB logs → disk ممتلئ؟ memory؟\n3. [ ] حاول restart للـ DB service\n4. [ ] إن لم يُفد → انتقل لـ replica\n5. [ ] استعد من آخر backup إن لزم\n6. [ ] أبلغ المستخدمين عبر Status Page\n7. [ ] كتابة Post-mortem خلال 48 ساعة" }
    ],
    tools: [
      { n: "Uptime Kuma", d: "Monitoring" },
      { n: "Fly.io", d: "Multi-region" },
      { n: "PlanetScale", d: "Global DB" },
      { n: "Cronitor", d: "Job monitoring" },
      { n: "StatusPage", d: "User alerts" }
    ],
    tip: "ابدأ بـ Uptime Kuma مجاناً على سيرفر منفصل صغير. ينبّهك خلال دقيقة عند توقف الخدمة. هو أبسط وأرخص استثمار بأكبر عائد في قائمة الـ 13 طبقة.",
    ask: "كيف أبني خطة Disaster Recovery كاملة لتطبيق SaaS؟"
  }
];
