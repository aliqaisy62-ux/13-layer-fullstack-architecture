const LAYERS = [
  {
    id: 1,
    title: "Frontend",
    badge: "واجهة المستخدم",
    summary: "الطبقة التي يراها المستخدم مباشرة وتتحكم في التجربة البصرية، التفاعل، وإدارة الحالة في المتصفح.",
    focus: ["React / Next.js", "SSR / CSR / SSG", "Accessibility", "Responsive UX"],
    outcome: "بنهاية هذه الطبقة ستفهم كيف تتحول البيانات إلى واجهة قابلة للتفاعل وسريعة الاستجابة.",
    note: "هذه الطبقة تربط التجربة المرئية بكل شيء خلفها، لذلك الأداء والوصولية مهمان جداً.",
    color: "#e7b64c"
  },
  {
    id: 2,
    title: "Backend API",
    badge: "الخدمات الخلفية",
    summary: "هنا يتم تنفيذ المنطق، التحقق، وتنسيق الطلبات قبل الوصول إلى البيانات أو الخدمات الخارجية.",
    focus: ["REST", "GraphQL", "Queues", "WebSockets"],
    outcome: "ستتعلم كيف يبني الـ API حدوداً واضحة بين العميل والبيانات.",
    note: "فصل المسؤوليات هنا يسهّل التوسع والصيانة ويقلل الأخطاء المتشابكة.",
    color: "#63d2ff"
  },
  {
    id: 3,
    title: "Database",
    badge: "قاعدة البيانات",
    summary: "الطبقة المسؤولة عن التخزين، الاسترجاع، الفهارس، والتكرار، مع التركيز على الاتساق والأداء.",
    focus: ["PostgreSQL", "Redis", "Indexing", "Replication"],
    outcome: "ستفهم كيف تصمم تخزيناً قابلاً للتوسع دون التضحية بالسلامة.",
    note: "اختيار نموذج البيانات المناسب يؤثر على كل الطبقات الأعلى.",
    color: "#8c7bff"
  },
  {
    id: 4,
    title: "Auth",
    badge: "المصادقة",
    summary: "التحكم في الهوية والصلاحيات والجلسات، بما في ذلك الرموز المميزة والتفويض.",
    focus: ["JWT", "OAuth 2.0", "RBAC", "Refresh Tokens"],
    outcome: "ستتعلم كيف توازن بين الأمان وسهولة الاستخدام في تدفقات الدخول.",
    note: "الخطأ في هذه الطبقة قد يفتح الباب لتسرب البيانات أو إساءة الاستخدام.",
    color: "#ff8c5b"
  },
  {
    id: 5,
    title: "Hosting",
    badge: "الاستضافة",
    summary: "اختيار طريقة النشر المناسبة بين الحاويات، الخوادم، والأنماط السحابية المختلفة.",
    focus: ["Docker", "Blue-Green", "Canary", "Serverless"],
    outcome: "ستتمكن من اختيار نمط نشر يناسب حجم التطبيق ومخاطره.",
    note: "الاستضافة ليست مجرد تشغيل التطبيق، بل إدارة المخاطر أثناء الإطلاق.",
    color: "#7be495"
  },
  {
    id: 6,
    title: "Cloud",
    badge: "السحابة",
    summary: "البنية التحتية السحابية التي توفر المناطق، الشبكات الخاصة، والتوسع التلقائي.",
    focus: ["AWS", "Kubernetes", "VPC", "Auto Scaling"],
    outcome: "ستفهم كيف توزع الخدمات بين الشبكات والمناطق لتحسين الاعتمادية.",
    note: "القرار السحابي الجيد يقلل التعقيد التشغيلي بدل أن يزيده.",
    color: "#50c5ff"
  },
  {
    id: 7,
    title: "CI/CD",
    badge: "خطوط النشر",
    summary: "أتمتة الاختبار والبناء والنشر عبر خطوط عمل موثوقة وقابلة للتكرار.",
    focus: ["GitHub Actions", "Terraform", "IaC", "Pipelines"],
    outcome: "ستتعلم كيف تجعل النشر قابلاً للتنبؤ ويمكن التراجع عنه بسرعة.",
    note: "كل خطوة يدوية زائدة في النشر هي فرصة لخطأ بشري يمكن تجنبه.",
    color: "#ffd166"
  },
  {
    id: 8,
    title: "Security",
    badge: "الأمان",
    summary: "حماية التطبيق من الثغرات الشائعة مثل XSS وCSRF والتسربات الناتجة عن التهيئة الخاطئة.",
    focus: ["OWASP", "XSS", "CSRF", "Zero Trust"],
    outcome: "ستتعلم كيف تضع طبقات حماية متراكبة بدل الاعتماد على نقطة واحدة.",
    note: "الأمان يبدأ من التصميم وليس بعد إطلاق المنتج.",
    color: "#ff6b6b"
  },
  {
    id: 9,
    title: "Rate Limiting",
    badge: "تحديد المعدلات",
    summary: "التحكم في عدد الطلبات لحماية النظام من الإساءة والضغط غير الطبيعي.",
    focus: ["Token Bucket", "Sliding Window", "Redis", "DDoS"],
    outcome: "ستعرف أين تضع الحاجز وكيف تختار الخوارزمية المناسبة.",
    note: "التحديد الجيد للمعدلات يحمي التجربة لكل المستخدمين، لا يضرها.",
    color: "#34d399"
  },
  {
    id: 10,
    title: "Caching & CDN",
    badge: "التخزين المؤقت",
    summary: "تسريع الوصول للبيانات والمحتوى عبر طبقات التخزين المؤقت والـ edge.",
    focus: ["Browser Cache", "Redis", "CDN", "Invalidation"],
    outcome: "ستتعلم كيف تقلل زمن الاستجابة وحمل الخوادم في الوقت نفسه.",
    note: "إبطال الكاش هو أصعب جزء في هذه الطبقة وغالباً الأكثر أهمية.",
    color: "#60a5fa"
  },
  {
    id: 11,
    title: "Scaling",
    badge: "التوسّع",
    summary: "تصميم مرن يسمح بإضافة الموارد وتوزيع الحمل بدون كسر التطبيق.",
    focus: ["Load Balancing", "HPA", "Stateless Design", "Sharding"],
    outcome: "ستفهم كيف يمنع التصميم عديم الحالة الاختناقات عند زيادة الطلب.",
    note: "الاستعداد للتوسع منذ البداية أقل تكلفة من إعادة البناء لاحقاً.",
    color: "#c084fc"
  },
  {
    id: 12,
    title: "Monitoring",
    badge: "المراقبة",
    summary: "تجميع السجلات والمقاييس والتتبعات والتنبيهات لمعرفة ما يحدث فعلاً في الإنتاج.",
    focus: ["Logs", "Metrics", "Traces", "SLOs"],
    outcome: "ستتعلم كيف تكتشف الأعطال قبل أن يكتشفها المستخدمون.",
    note: "لا يمكن تحسين ما لا تقيسه، ولا إصلاح ما لا تراه.",
    color: "#f59e0b"
  },
  {
    id: 13,
    title: "Recovery",
    badge: "الاستعادة",
    summary: "خطط التعافي من الأعطال، التكرار العالي، والتحمل ضد الكوارث والانقطاعات الكبيرة.",
    focus: ["Failover", "RTO / RPO", "HA", "Chaos Engineering"],
    outcome: "ستعرف كيف تبني نظاماً يستعيد نفسه ويستمر في العمل تحت الضغط.",
    note: "المرونة الحقيقية تظهر عندما يفشل شيء ما في أسوأ وقت ممكن.",
    color: "#f97316"
  }
];

const codingChallenges = [
  {
    id: "ch-frontend-normalize",
    linkedLayer: 1,
    title: "توحيد أسماء الصفحات",
    problemStatement: "لديك قائمة بأسماء صفحات الواجهة. اكتب دالة `solve(input)` تعيد نفس الأسماء بعد تحويلها إلى `kebab-case` وترتيبها أبجدياً. تجاهل المسافات الزائدة.",
    difficulty: "Easy",
    challengeType: "algorithm",
    starterCode: `function solve(input) {
  // input is an array of page names
  return [];
}`,
    testCases: [
      { input: ["Home Page", "About   Us", "Contact"], expected: ["about-us", "contact", "home-page"] },
      { input: ["  Product List", "Cart View"], expected: ["cart-view", "product-list"] }
    ],
    hint: "استخدم trim ثم replace مع regex لتحويل الفراغات إلى شرطات."
  },
  {
    id: "ch-backend-debug",
    linkedLayer: 2,
    title: "إصلاح تجميع الطلبات",
    problemStatement: "الكود الحالي لا يجمع القيم بشكل صحيح. أصلح الدالة بحيث تعيد مجموع القيم الرقمية في المصفوفة حتى لو كانت بعض العناصر نصوصاً تمثل أرقاماً.",
    difficulty: "Easy",
    challengeType: "debug",
    starterCode: `function solve(input) {
  let total = 0;
  for (let i = 0; i <= input.length; i++) {
    total += input[i];
  }
  return total;
}`,
    testCases: [
      { input: [1, "2", 3], expected: 6 },
      { input: [10, "5", "7"], expected: 22 }
    ],
    hint: "انتبه إلى حدود الحلقة وتحويل القيم النصية إلى أرقام."
  },
  {
    id: "ch-database-keys",
    linkedLayer: 3,
    title: "إزالة مفاتيح الكاش المكررة",
    problemStatement: "استقبل قائمة مفاتيح cache وقد تحتوي على تكرارات. أعد مصفوفة جديدة تحتوي على المفاتيح الفريدة فقط مع الحفاظ على أول ظهور لكل مفتاح.",
    difficulty: "Easy",
    challengeType: "algorithm",
    starterCode: `function solve(input) {
  return input;
}`,
    testCases: [
      { input: ["user:1", "user:2", "user:1", "user:3"], expected: ["user:1", "user:2", "user:3"] },
      { input: ["post:5", "post:5", "post:8"], expected: ["post:5", "post:8"] }
    ],
    hint: "Set مفيد هنا، لكن تأكد من الحفاظ على ترتيب الظهور."
  },
  {
    id: "ch-auth-decision",
    linkedLayer: 4,
    title: "أين توضع طبقة المصادقة؟",
    problemStatement: "اختر الموضع الأنسب لطبقة التحقق من الهوية قبل وصول الطلب إلى الخدمات الداخلية.",
    difficulty: "Medium",
    challengeType: "decision",
    options: ["داخل قاعدة البيانات", "في API Gateway أو Middleware", "داخل CSS فقط"],
    correctAnswer: "في API Gateway أو Middleware",
    starterCode: `// Pick the correct option from the buttons on the right.`,
    testCases: [
      { input: "في API Gateway أو Middleware", expected: "في API Gateway أو Middleware" }
    ],
    hint: "فكر في تقليل انتشار الطلبات غير المصرح بها."
  },
  {
    id: "ch-hosting-rollback",
    linkedLayer: 5,
    title: "اختيار نسخة النشر",
    problemStatement: "أمامك نسختان: النسخة الحالية والنسخة الجديدة. اكتب دالة تختار النسخة الآمنة للنشر وفق قاعدة بسيطة: إذا كان عدد الأخطاء في الجديدة أكبر من الحالية، استمر على الحالية.",
    difficulty: "Medium",
    challengeType: "algorithm",
    starterCode: `function solve(input) {
  // input = { currentErrors: number, newErrors: number }
  return '';
}`,
    testCases: [
      { input: { currentErrors: 2, newErrors: 5 }, expected: "current" },
      { input: { currentErrors: 7, newErrors: 1 }, expected: "new" }
    ],
    hint: "هذه مسألة مقارنة بسيطة، لكن القرار مهم تشغيلياً."
  },
  {
    id: "ch-cloud-zone",
    linkedLayer: 6,
    title: "توزيع المناطق السحابية",
    problemStatement: "اكتب دالة تعيد قائمة المناطق السحابية مرتبة من الأقرب إلى الأبعد بناءً على درجة الأهمية، مع إعطاء الأولوية للأقل تكلفة.",
    difficulty: "Medium",
    challengeType: "algorithm",
    starterCode: `function solve(input) {
  // input = [{ name, priority, cost }]
  return [];
}`,
    testCases: [
      { input: [{ name: "eu-west", priority: 2, cost: 4 }, { name: "me-south", priority: 1, cost: 2 }, { name: "us-east", priority: 1, cost: 5 }], expected: ["me-south", "us-east", "eu-west"] }
    ],
    hint: "رتب أولاً حسب priority ثم cost."
  },
  {
    id: "ch-cicd-decision",
    linkedLayer: 7,
    title: "كيف تقلل مخاطر النشر؟",
    problemStatement: "اختر النمط الأنسب لإطلاق نسخة جديدة تدريجياً مع إمكانية إيقافها بسرعة إذا ظهرت مشكلة.",
    difficulty: "Medium",
    challengeType: "decision",
    options: ["Big Bang Deploy", "Canary Deployment", "Delete production"],
    correctAnswer: "Canary Deployment",
    starterCode: `// Select the safest release strategy.`,
    testCases: [
      { input: "Canary Deployment", expected: "Canary Deployment" }
    ],
    hint: "ابحث عن النمط الذي يرسل جزءاً صغيراً من الحركة أولاً."
  },
  {
    id: "ch-security-fix",
    linkedLayer: 8,
    title: "منع إدخال HTML الخبيث",
    problemStatement: "أصلح الدالة بحيث تزيل الوسوم HTML من النص قبل عرضه للمستخدم.",
    difficulty: "Hard",
    challengeType: "debug",
    starterCode: `function solve(input) {
  return input.replace(/<.*>/g, '');
}`,
    testCases: [
      { input: "<b>Hello</b>", expected: "Hello" },
      { input: "<script>alert(1)</script>Safe", expected: "alert(1)Safe" }
    ],
    hint: "تأكد من أن التعبير النمطي لا يلتهم أكثر مما يجب."
  },
  {
    id: "ch-rate-limit",
    linkedLayer: 9,
    title: "عدّ الطلبات خلال النافذة",
    problemStatement: "اكتب دالة تحسب عدد الطلبات التي وقعت داخل نافذة زمنية محددة بالثواني.",
    difficulty: "Hard",
    challengeType: "algorithm",
    starterCode: `function solve(input) {
  // input = { timestamps: number[], window: number, currentTime: number }
  return 0;
}`,
    testCases: [
      { input: { timestamps: [1, 3, 4, 10, 12], window: 5, currentTime: 12 }, expected: 2 },
      { input: { timestamps: [2, 6, 7, 8], window: 4, currentTime: 8 }, expected: 3 }
    ],
    hint: "احسب الفرق بين currentTime وكل timestamp."
  },
  {
    id: "ch-cache-decision",
    linkedLayer: 10,
    title: "أين يفضّل وضع الكاش؟",
    problemStatement: "اختر الطبقة الأنسب لتخزين نسخة سريعة من المحتوى الثابت قبل الرجوع إلى الخادم الأصلي.",
    difficulty: "Medium",
    challengeType: "decision",
    options: ["Edge CDN", "Main database only", "UI button component"],
    correctAnswer: "Edge CDN",
    starterCode: `// Decide where static content should be cached first.`,
    testCases: [
      { input: "Edge CDN", expected: "Edge CDN" }
    ],
    hint: "فكر في تقليل زمن الوصول للمستخدمين البعيدين."
  },
  {
    id: "ch-scaling-requests",
    linkedLayer: 11,
    title: "توزيع الحمل على الخوادم",
    problemStatement: "لديك قائمة من الطلبات وقائمة من الخوادم. وزّع الطلبات بالتساوي باستخدام أسلوب round-robin وأعد مصفوفة أسماء الخوادم التي استلمت كل طلب.",
    difficulty: "Hard",
    challengeType: "algorithm",
    starterCode: `function solve(input) {
  // input = { requests: string[], servers: string[] }
  return [];
}`,
    testCases: [
      { input: { requests: ["r1", "r2", "r3", "r4"], servers: ["a", "b"] }, expected: ["a", "b", "a", "b"] }
    ],
    hint: "استعمل باقي القسمة على عدد الخوادم."
  },
  {
    id: "ch-monitoring-alert",
    linkedLayer: 12,
    title: "إطلاق تنبيه عند فشل الخدمات",
    problemStatement: "أصلح الدالة بحيث تعيد `true` إذا تجاوز عدد الأخطاء الحد المسموح به، وإلا تعيد `false`.",
    difficulty: "Easy",
    challengeType: "debug",
    starterCode: `function solve(input) {
  return input.errors > input.limit;
}`,
    testCases: [
      { input: { errors: 4, limit: 3 }, expected: true },
      { input: { errors: 2, limit: 5 }, expected: false }
    ],
    hint: "المطلوب بسيط، لكن القراءة الدقيقة للشرط مهمة."
  },
  {
    id: "ch-recovery-choice",
    linkedLayer: 13,
    title: "قرار الاستعادة",
    problemStatement: "اختر الخطة الأفضل عندما تتعرض الخدمة لانقطاع كامل وتحتاج إلى العودة للعمل خلال وقت قصير.",
    difficulty: "Medium",
    challengeType: "decision",
    options: ["Failover to a healthy region", "Ignore the outage", "Disable backups"],
    correctAnswer: "Failover to a healthy region",
    starterCode: `// Pick the recovery strategy that preserves availability.`,
    testCases: [
      { input: "Failover to a healthy region", expected: "Failover to a healthy region" }
    ],
    hint: "الاستعادة الجيدة تقلل RTO وRPO."
  }
];
