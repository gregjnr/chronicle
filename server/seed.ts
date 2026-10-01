import { dbStore } from './services/dbStore.js';

export async function seedDatabase() {
  if (dbStore.isInitialized) return;

  try {
    // 1. Seed Authors
    const demoUser = await dbStore.createUser({
      name: 'Alex Rivera',
      email: 'demo@chronicle.io',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Staff Product Architect & Open-Source Contributor. Obsessed with elegant systems and glassmorphic UI design.',
    });

    const elenaUser = await dbStore.createUser({
      name: 'Elena Rostova',
      email: 'elena@chronicle.io',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: 'Principal UX Engineer & Design Technologist exploring spatial computing, fluid typography, and micro-interactions.',
    });

    const marcusUser = await dbStore.createUser({
      name: 'Marcus K. Wright',
      email: 'marcus@chronicle.io',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Distributed Systems Tech Lead & Cloud Native enthusiast. Writing about Node.js microservices and scalability.',
    });

    const sophiaUser = await dbStore.createUser({
      name: 'Dr. Sophia Nguyen',
      email: 'sophia@chronicle.io',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'AI Research Scientist specializing in multimodal reasoning models and neural alignment.',
    });

    // 2. Seed Posts
    const post1 = await dbStore.createPost({
      title: 'Architecting for the Next Decade: Why Glassmorphism and Spatial Interfaces Rule 2026',
      excerpt: 'Beyond flat minimalism and skeuomorphic nostalgia lies glassmorphism—a sensory bridge where depth, light refraction, and subtle translucency redefine user immersion.',
      content: `The interface landscape is undergoing its most profound transformation since the dawn of capacitive multitouch. For nearly a decade, digital design was flattened into stark minimalism—two-dimensional rectangles, monochromatic grids, and sterile cards. 

While flat design solved bandwidth issues and mobile legibility in the early 2010s, it stripped digital experiences of human spatial intuition.

### The Physics of Perceptual Depth

Human visual cognition relies on optical layers:
- **Refraction and Dispersion**: When light passes through translucent medium, objects underneath take on soft optical blurs.
- **Hierarchy through Luminance**: In dark interfaces, a 15% opacity white overlay with back-blur acts as an elevated glass shelf, visually separating secondary context from primary content.
- **Micro-elevation & Glows**: Instead of heavy drop shadows, translucent materials emit soft ambient glows when activated by hover states.

\`\`\`css
/* The Glass Matrix */
.glass-surface {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  border-radius: 16px;
}
\`\`\`

When constructing modern full-stack web applications, maintaining contrast ratios is paramount. Contrast testing between 0.08 alpha white cards and deep solid navy backgrounds guarantees WCAG AAA compliance for text legibility while providing an unforgettable visual signature.`,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      category: 'Design',
      tags: ['Glassmorphism', 'UI/UX', 'Design Systems', 'CSS'],
      authorId: elenaUser._id,
    });

    const post2 = await dbStore.createPost({
      title: 'Demystifying JWT Authentication: Secure Tokens, Refresh Strategies, and Node.js Hardening',
      excerpt: 'A comprehensive engineering guide to structuring stateless JWT authentication in Express, implementing password salting with bcrypt, and avoiding critical security pitfalls.',
      content: `Stateless authentication using JSON Web Tokens (JWT) remains the gold standard for decoupled full-stack architectures. However, developer misconceptions regarding token payloads and lifecycle management often expose backends to replay attacks and leaked authorizations.

### Anatomy of a Secure Authorization Flow

1. **Credentials Ingestion**: When a user registers or logs in, raw passwords must NEVER touch persistent storage unhashed. Utilizing \`bcrypt.hash()\` with an adaptive cost factor of 10 to 12 ensures resistant key derivation against brute-force hashing rigs.
2. **Payload Restraint**: Only embed non-sensitive identifiers in the JWT payload (e.g., user ID, token version, role). Never store passwords, tokens, or PII.
3. **Strict Expiration**: Enforce reasonable time-to-live intervals (such as 7 days or shorter with refresh token rotation).

\`\`\`typescript
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};
\`\`\`

### Authorization Enforcement
Authorization is not just a UI state. Even if the client-side "Delete Post" button is hidden, the Express backend middleware must verify ownership against the database record:

\`\`\`typescript
if (post.author.toString() !== req.user.id) {
  return res.status(403).json({ error: 'You are not authorized to modify this post' });
}
\`\`\`

This dual-layer defense guarantees complete integrity across all endpoints.`,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      category: 'Technology',
      tags: ['Node.js', 'Security', 'JWT', 'Express', 'Backend'],
      authorId: marcusUser._id,
    });

    const post3 = await dbStore.createPost({
      title: 'Full-Stack React & Vite in 2026: The Express Middleware Pattern Explained',
      excerpt: 'Discover why mounting Vite dev middlewares within an Express server gives developers the ultimate unified DX: instant hot reloading, unified port configuration, and effortless proxying.',
      content: `For years, developers wrestling with full-stack setups suffered through fragmented tooling: running a React dev server on port 5173, an Express server on port 5000, and debugging stubborn CORS headers or proxy rules.

By utilizing Vite's programmatic \`createServer\` API in middleware mode, we can unify the entire developer workflow under a single Node process:

\`\`\`typescript
import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();
// API routes first
app.use('/api/posts', postRoutes);

// Vite middleware for frontend assets
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa'
});
app.use(vite.middlewares);
\`\`\`

### Key Benefits:
- **No CORS Overhead**: Both API and client assets share the exact same origin and port.
- **Atomic Container Deployment**: Single Docker container or Cloud Run service serves both static assets and API routes without secondary reverse proxies.
- **Deterministic Routing**: Express manages API 404s while letting React Router handle client-side route transitions seamlessly.`,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
      category: 'Development',
      tags: ['React', 'Vite', 'Express', 'FullStack', 'JavaScript'],
      authorId: demoUser._id,
    });

    const post4 = await dbStore.createPost({
      title: 'Multimodal AI & Neural Interfaces: Moving from Prompts to Ambient Intelligence',
      excerpt: 'Large foundation models are evolving from chat interfaces into ubiquitous ambient agents. Here is how software engineers should prepare for contextual computing.',
      content: `The era of typing sentences into a chat prompt box is rapidly coming to an end. The next paradigm in human-computer interaction is ambient intelligence—systems that sense, anticipate, and synthesize knowledge in real time across vision, audio, and structured events.

### The Shift from Reactive to Proactive Context

Traditional software requires users to formulate exact intent through query fields or menu hierarchies. Ambient agents continuously observe workflows to construct persistent semantic context.

Key architectural considerations for builders:
- **Context Windows as Working Memory**: High-capacity token windows allow entire codebases and design systems to be ingested as immediate reference.
- **Structured Tool Calling**: Transforming natural language intents into verifiable API schemas ensures deterministic execution and safety.
- **Zero-Latency Micro-Agents**: Specialized lightweight models handling localized intent classification before routing to larger reasoning engines.`,
      coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
      category: 'AI & ML',
      tags: ['AI', 'Machine Learning', 'Future Tech', 'Deep Learning'],
      authorId: sophiaUser._id,
    });

    const post5 = await dbStore.createPost({
      title: 'Crafting High-Conversion Engineering Portfolios and Technical Blogs',
      excerpt: 'Stand out in a competitive tech job market by writing authentic technical chronicles that demonstrate architectural trade-offs, debugging grit, and domain depth.',
      content: `Every engineer has a GitHub profile filled with half-finished repository forks and tutorial clones. But the engineers who command the greatest career leverage aren't just coders—they are clear technical communicators.

Writing about code forces you to understand your code at a fundamental level. When you write a technical article, you aren't just presenting a solution; you are documenting the trade-offs, the dead ends, and the reasoning behind your architectural choices.

### What Makes a Blog Post Stand Out?

1. **Show the Problem First**: Don't start with the code. Start with the production bottleneck, the memory leak, or the user frustration that catalyzed the investigation.
2. **Include Visual Diagrams and Flowcharts**: Visual representations anchor complex distributed states and state machines far better than wall-of-text explanations.
3. **Share Honest Failure Modes**: What broke along the way? The debugging story is often 10x more valuable to readers than the final happy path.`,
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      category: 'Career',
      tags: ['Career', 'Writing', 'Productivity', 'Blogging'],
      authorId: demoUser._id,
    });

    const post6 = await dbStore.createPost({
      title: 'The Art of Mindful Code: Building Sustainable Developer Habits',
      excerpt: 'How leading engineering teams cultivate flow state, eliminate notification fatigue, and protect mental bandwidth in high-velocity tech environments.',
      content: `The modern developer workspace has become an assault on attention. Slack pings, CI alerts, Jira notifications, and constant tab-switching fragment cognitive endurance.

Studies in software engineering psychology demonstrate that re-entering flow state after an interruption takes an average of 23 minutes. If an engineer is interrupted 3 times an hour, they spend virtually zero minutes in deep architectural problem-solving.

### Strategies for Cognitive Sovereignty
- **Batch Processing Pull Requests**: Dedicate specific time blocks morning and afternoon for code review rather than reactive reviewing.
- **The 90-Minute Focus Sprint**: Deep work sessions structured around ultradian rhythms.
- **Analog Brainstorming**: Before typing code, sketch system diagrams and edge cases with pen and paper.`,
      coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      category: 'Lifestyle',
      tags: ['Mindfulness', 'Productivity', 'Wellness', 'Flow State'],
      authorId: elenaUser._id,
    });

    // 3. Seed Comments
    await dbStore.addComment({
      content: 'This glassmorphism design guide is brilliant! The breakdown of blur radii and border highlights really clarified why my previous attempts felt flat.',
      postId: post1._id,
      authorId: demoUser._id,
    });

    await dbStore.addComment({
      content: 'Completely agree on optical hierarchy. The subtle border stroke with 0.15 alpha makes all the difference against dark backgrounds!',
      postId: post1._id,
      authorId: marcusUser._id,
    });

    await dbStore.addComment({
      content: 'Crucial point regarding backend authorization. Too many junior developers just hide the delete button in React and forget to verify the JWT subject in Express.',
      postId: post2._id,
      authorId: elenaUser._id,
    });

    await dbStore.addComment({
      content: 'The unified Vite middleware pattern changed our entire local Docker setup. No more complex nginx reverse proxies on localhost.',
      postId: post3._id,
      authorId: sophiaUser._id,
    });

    // Increment some views for popularity
    await dbStore.incrementPostViews(post1._id);
    await dbStore.incrementPostViews(post1._id);
    await dbStore.incrementPostViews(post1._id);
    await dbStore.incrementPostViews(post2._id);
    await dbStore.incrementPostViews(post2._id);
    await dbStore.incrementPostViews(post3._id);

    dbStore.isInitialized = true;
    console.log('Database successfully seeded with authors, rich articles, and comments!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
