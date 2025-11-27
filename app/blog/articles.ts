export type ArticleSection = {
  heading: string;
  body: string[];
  bullets?: string[];
  highlight?: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  audience: string;
  tags: string[];
  heroImage?: string;
  publishedAt: string;
  sections: ArticleSection[];
};

const fallbackImage = '/images/smartlearninglogo.jpeg';
const fallbackDate = new Date().toISOString();
const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

const seedArticles: Article[] = [
  {
    slug: 'online-learning-blueprint',
    title: 'Online Learning Blueprint: Build Momentum in 6 Weeks',
    excerpt:
      'A six-week roadmap with rituals, tools, and checkpoints to turn online classes into steady wins without burning out.',
    readTime: '8 min read',
    audience: 'Students',
    tags: ['study habits', 'productivity', 'momentum'],
    heroImage: fallbackImage,
    publishedAt: fallbackDate,
    sections: [
      {
        heading: 'Week 1-2: Build the Foundation',
        body: [
          'Start with one course and one outcome. Define the grade or mastery level you want, then reverse engineer the weekly milestones.',
          'Set two anchors: a fixed study block on weekdays and a Sunday planning session. Keep them short (45–60 minutes) to reduce friction.'
        ],
        bullets: [
          'Create a distraction checklist (tabs, phone, notifications off).',
          'Use a single notes system (Notion or Google Docs) with one page per course.',
          'End each session with a 3-bullet recap and the next step.'
        ]
      },
      {
        heading: 'Week 3-4: Execute with Tight Feedback',
        body: [
          'Switch to active recall and spaced repetition. Replace rereading with short quizzes and flashcards on the core concepts.',
          'Layer accountability: share your weekly target with a friend or parent and send a 2-minute voice note update twice a week.'
        ],
        bullets: [
          'Ship small: submit drafts early for faster tutor feedback.',
          'Use the “90/20 rule”: 90 minutes of focus, 20 minutes of movement.',
          'Track focus quality (1–5) beside each study block; adjust when scores dip.'
        ],
        highlight: 'Momentum beats intensity. Perfect plans without delivery create zero compounding.'
      },
      {
        heading: 'Week 5-6: Measure and Optimize',
        body: [
          'Audit what worked: time of day, location, and study format. Keep the top two, drop the rest.',
          'Run a mini exam with time limits. Note where you hesitated—those become the next week’s drills.'
        ],
        bullets: [
          'Refine your “win stack”: daily 3 bullets, weekly review, monthly reset.',
          'Automate reminders for due dates and peer check-ins.',
          'Upgrade difficulty: teach one concept per week to a peer or parent.'
        ]
      }
    ]
  },
  {
    slug: 'parent-guide-digital-classroom',
    title: 'Parent Guide: Support Online Learning Without Micromanaging',
    excerpt:
      'A practical playbook for parents to track progress, motivate consistently, and keep learners accountable in digital classrooms.',
    readTime: '7 min read',
    audience: 'Parents',
    tags: ['parent engagement', 'accountability', 'motivation'],
    heroImage: fallbackImage,
    publishedAt: fallbackDate,
    sections: [
      {
        heading: 'Set the Guardrails, Not the Steering Wheel',
        body: [
          'Agree on outcomes with your learner (grades, completed modules, practice tests). Avoid daily nagging—focus on weekly checkpoints.',
          'Create a study-ready environment: clear desk, headphones, printed schedule, and a visible calendar of due dates.'
        ],
        bullets: [
          'Use a single dashboard for grades, attendance, and assignments.',
          'Define “office hours” when you’re available for help—but let them start the work.',
          'Celebrate consistency, not just results (e.g., 4 of 5 planned sessions).'
        ]
      },
      {
        heading: 'Run a Weekly Progress Huddle',
        body: [
          '15 minutes every Sunday: review what was completed, what slipped, and why. Ask your learner to lead the update.',
          'Identify blockers you can remove (tech issues, noisy space, unclear assignment instructions).'
        ],
        bullets: [
          'Look for trends, not single bad days.',
          'Confirm the next week’s top three priorities and deadlines.',
          'Schedule one “teach-back” where they explain a concept to you.'
        ],
        highlight: 'Teaching a concept is the fastest signal of true understanding—and boosts confidence.'
      },
      {
        heading: 'Keep Motivation Steady',
        body: [
          'Swap generic praise for specific wins: “You stuck to the schedule” beats “You’re smart.”',
          'Tie effort to outcomes with mini-rewards (a break, a walk) rather than big, delayed promises.'
        ],
        bullets: [
          'Use a simple scoreboard: sessions planned vs. completed.',
          'Rotate study formats: practice quizzes, short videos, and peer discussions.',
          'Encourage sleep and movement—performance drops fast without them.'
        ]
      }
    ]
  },
  {
    slug: 'tutor-engagement-playbook',
    title: 'Tutor Playbook: Keep Online Students Engaged and Accountable',
    excerpt:
      'Design high-retention sessions with clear outcomes, fast feedback, and rituals that keep students showing up.',
    readTime: '9 min read',
    audience: 'Tutors',
    tags: ['tutoring', 'engagement', 'lesson design'],
    heroImage: fallbackImage,
    publishedAt: fallbackDate,
    sections: [
      {
        heading: 'Open Strong with Outcomes',
        body: [
          'Begin every session with a single measurable outcome: “You will solve quadratic equations with zero guesswork.”',
          'Share a visible agenda with time boxes so students know the path and pacing.'
        ],
        bullets: [
          'Use quick polls to gauge prior knowledge.',
          'Highlight why the topic matters (exam weight, real-world use).',
          'Set a participation norm: cameras optional, chat required.'
        ]
      },
      {
        heading: 'Design for Interaction Every 7 Minutes',
        body: [
          'Alternate between short teaching bursts and activities: breakout discussions, live coding, or whiteboard walkthroughs.',
          'Collect answers in chat or forms to keep quieter students involved.'
        ],
        bullets: [
          'Use checkpoints: “Type the next step in chat.”',
          'Assign micro-roles (timekeeper, summarizer) in group tasks.',
          'Surface wins publicly to reinforce desired behavior.'
        ],
        highlight: 'Engagement is a design choice—plan the interactions, not just the explanations.'
      },
      {
        heading: 'Close with Commitments and Evidence',
        body: [
          'End with a 3-question exit ticket to confirm understanding.',
          'Assign a small deliverable before the next session and schedule when it will be reviewed.'
        ],
        bullets: [
          'Send a 5-bullet recap with links and next steps.',
          'Automate reminders for deliverables and office hours.',
          'Track attendance and completion; follow up when momentum drops.'
        ]
      }
    ]
  }
];

function normalizeArticle(raw: any): Article | null {
  if (!raw) return null;

  const slug = raw.slug ?? raw._id ?? raw.id;
  const title = raw.title ?? raw.heading;
  const excerpt = raw.excerpt ?? raw.summary ?? raw.description;

  if (!slug || !title || !excerpt) {
    return null;
  }

  const sections: ArticleSection[] = Array.isArray(raw.sections)
    ? raw.sections.map((section: any) => ({
        heading: section.heading ?? section.title ?? 'Key Insight',
        body: Array.isArray(section.body)
          ? section.body.map(String)
          : section.body
            ? [String(section.body)]
            : raw.content
              ? [String(raw.content)]
              : [String(excerpt)],
        bullets: Array.isArray(section.bullets) ? section.bullets.map(String) : undefined,
        highlight: section.highlight
      }))
    : raw.content
      ? [
          {
            heading: 'What Matters',
            body: [String(raw.content)]
          }
        ]
      : [];

  return {
    slug: String(slug),
    title: String(title),
    excerpt: String(excerpt),
    readTime: String(raw.readTime ?? raw.read_time ?? '6 min read'),
    audience: String(raw.audience ?? 'Students & Parents'),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    heroImage: raw.heroImage ?? raw.image ?? fallbackImage,
    publishedAt: raw.publishedAt ?? raw.createdAt ?? fallbackDate,
    sections: sections.length ? sections : seedArticles[0].sections
  };
}

export async function fetchArticles(): Promise<Article[]> {
  if (!apiBase) return seedArticles;

  try {
    const response = await fetch(`${apiBase}/blog-posts`, {
      next: { revalidate: 120 }
    });

    if (!response.ok) throw new Error('Failed to fetch articles');

    const payload = await response.json();
    const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    const normalized = items
      .map((item) => normalizeArticle(item))
      .filter((item): item is Article => Boolean(item));

    return normalized.length ? normalized : seedArticles;
  } catch (error) {
    console.error('Error fetching articles', error);
    return seedArticles;
  }
}

export async function fetchArticle(slug: string): Promise<Article | undefined> {
  const articles = await fetchArticles();
  return articles.find((article) => article.slug === slug);
}
