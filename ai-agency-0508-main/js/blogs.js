(function() {
  const featuredEl = document.getElementById('featured-post');
  const categoryListEl = document.getElementById('category-list');
  const tagCloudEl = document.getElementById('tag-cloud');
  const gridEl = document.getElementById('blog-posts-grid');

  if (!categoryListEl || !gridEl) return;

  const POSTS = [];

  const categories = [
    { key: 'ai', label: 'AI' },
    { key: 'nocode', label: 'No-code / Low-code' },
    { key: 'marketing', label: 'Digital Marketing' }
  ];

  function slugify(title) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  }

  function makeAI(i) {
    const title = [
      'AI Agents in Production: Orchestration, Guardrails, and ROI',
      'Grounded Generation: Vector DBs, Retrieval, and Hallucination Control',
      'Prompt Engineering to Tooling: Building Reliable AI Workflows',
      'Latency, Cost, and Accuracy: Optimizing LLM Systems at Scale',
      'From Chatbots to Copilots: Designing Human-in-the-loop Systems',
      'Enterprise AI Governance: Privacy, Compliance, and Security',
      'Analytics on LLMs: Evaluations, Traces, and Continuous Tuning',
      'Multimodal AI: Vision, Speech, and Context Fusion for UX',
      'Fine-tuning vs RAG: When to Choose Which for Your Data',
      'AI Roadmaps: Pilot to Production with Measurable Milestones'
    ][i];
    const slug = slugify(title);
    const content = [
      'Overview:\nAI adoption is shifting from prototypes to production-grade agents. This article covers orchestration, guardrails, and ROI frameworks.',
      'Key Concepts:\n- Orchestration (state, tools, retries)\n- Guardrails (intent checks, PII/SOC2, safety)\n- Observability (traces, evals, metrics)\n- ROI (deflection, time-to-resolution, lead qual)\n',
      'Trending Keywords: AI agents, RAG, vector database, embeddings, observability, guardrails, prompt engineering, latency, cost, accuracy'
    ].join('\n\n');
    return { id: `ai-${i+1}`, category: 'ai', title, slug, excerpt: 'Production-ready AI agents with orchestration and guardrails.', content };
  }
  function makeNC(i) {
    const title = [
      'No-code Automations: From Zapier to Advanced Workflows',
      'Low-code Apps: Shipping Internal Tools in Days, Not Months',
      'Scaling No-code: Governance, Security, and Maintainability',
      'APIs + No-code: Bridging Systems with Webhooks and Adapters',
      'Rapid Prototyping: Validate Ideas with No-code MVPs',
      'Data Pipelines with No-code: ETL, Syncs, and Quality',
      'No-code Chatbots: Forms to AI Assistants without Heavy Dev',
      'Low-code UX: Components, Theming, and Accessibility',
      'From Siloed Tools to Unified Workflows with No-code',
      'Choosing No-code vs Custom Dev: A Practical Framework'
    ][i];
    const slug = slugify(title);
    const content = [
      'Overview:\nNo-code/low-code accelerates delivery while reducing engineering load. Learn how to design reliable, maintainable automations.',
      'Implementation:\n- Trigger design, retries, idempotency\n- Error handling, alerts, rollbacks\n- Secrets management and access control\n- Documentation and handover\n',
      'Trending Keywords: no-code, low-code, Zapier, Make, webhooks, governance, internal tools, automation, MVP, ETL'
    ].join('\n\n');
    return { id: `nocode-${i+1}`, category: 'nocode', title, slug, excerpt: 'Ship faster with robust no-code/low-code workflows.', content };
  }
  function makeMK(i) {
    const title = [
      'SEO in 2025: E-E-A-T, Topical Authority, and AI Content',
      'Performance Marketing: Full-funnel Measurement and ROAS',
      'Content Strategy: Pillars, Clusters, and Conversion Paths',
      'Email Automation: Welcome, Nurture, and Reactivation Flows',
      'Social Ads: Creative Iteration Loops and UGC at Scale',
      'CRO: Hypothesis-Driven A/B Tests and UX Heuristics',
      'Attribution: GA4, Server-side Tracking, and Privacy',
      'Local SEO: GBP, Reviews, and Intent-packed Pages',
      'B2B Demand Gen: LinkedIn, Webinars, and Lead Scoring',
      'Analytics: Dashboards, North-star Metrics, and QA'
    ][i];
    const slug = slugify(title);
    const content = [
      'Overview:\nModern marketing balances organic and paid channels with strong analytics. We cover strategies that actually compound.',
      'Tactics:\n- SEO content architecture and internal links\n- Creative testing for paid social and search\n- Lifecycle email with segmentation\n- CRO experiments on key templates\n',
      'Trending Keywords: SEO trends, E-E-A-T, topical authority, ROAS, CRO, GA4, server-side tracking, UGC, demand gen'
    ].join('\n\n');
    return { id: `marketing-${i+1}`, category: 'marketing', title, slug, excerpt: 'Modern SEO, ads, content, and CRO with reliable analytics.', content };
  }

  for (let i = 0; i < 10; i++) POSTS.push(makeAI(i));
  for (let i = 0; i < 10; i++) POSTS.push(makeNC(i));
  for (let i = 0; i < 10; i++) POSTS.push(makeMK(i));

  function setRoute(slug) { location.hash = `#/blog/${slug}`; }
  function getRouteSlug() {
    const m = location.hash.match(/^#\/blog\/([a-z0-9-]+)/);
    return m ? m[1] : '';
  }

  function categoryLabel(key) { return ({ ai: 'AI', nocode: 'No-code / Low-code', marketing: 'Digital Marketing' }[key]) || key; }

  function formatContentToHTML(text) {
    const blocks = (text || '').split(/\n\n+/);
    const html = [];
    blocks.forEach(block => {
      const lines = block.split(/\n/);
      if (!lines.length) return;
      const first = lines[0];
      const rest = lines.slice(1);
      if (/^\w[\w\s/&-]*:\s*$/.test(first)) {
        const heading = first.replace(/:\s*$/, '').trim();
        html.push(`<h4>${heading}</h4>`);
        const listItems = rest.filter(l => /^-\s+/.test(l)).map(l => `<li>${l.replace(/^-\s+/, '')}</li>`);
        const paragraphs = rest.filter(l => !/^-\s+/.test(l) && l.trim().length > 0);
        if (listItems.length) html.push(`<ul>${listItems.join('')}</ul>`);
        if (paragraphs.length) html.push(`<p>${paragraphs.join(' ')}</p>`);
      } else if (/^-\s+/.test(first)) {
        const allItems = lines.map(l => `<li>${l.replace(/^-\s+/, '')}</li>`).join('');
        html.push(`<ul>${allItems}</ul>`);
      } else {
        html.push(`<p>${lines.join(' ')}</p>`);
      }
    });
    return html.join('');
  }

  function renderCategories(active) {
    categoryListEl.innerHTML = '';
    const all = document.createElement('li');
    all.innerHTML = `<a href="#" class="${active==='all'?'active':''}">All Posts (30)</a>`;
    all.querySelector('a').addEventListener('click', (e)=>{ e.preventDefault(); renderGrid('all'); });
    categoryListEl.appendChild(all);
    categories.forEach(cat => {
      const count = POSTS.filter(p=>p.category===cat.key).length;
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" class="${active===cat.key?'active':''}">${categoryLabel(cat.key)} (${count})</a>`;
      li.querySelector('a').addEventListener('click', (e)=>{ e.preventDefault(); renderGrid(cat.key); });
      categoryListEl.appendChild(li);
    });
  }

  function renderTags() {
    const tagCloudEl = document.getElementById('tag-cloud');
    if (!tagCloudEl) return;
    const tags = ['AI agents','RAG','Vector DB','No-code','Low-code','Zapier','GA4','SEO','CRO','ROAS'];
    tagCloudEl.innerHTML = '';
    tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tagCloudEl.appendChild(span);
    });
  }

  function renderGrid(filter) {
    renderCategories(filter||'all');
    renderTags();
    gridEl.innerHTML = '';
    const list = (filter && filter!=='all') ? POSTS.filter(p=>p.category===filter) : POSTS;
    list.forEach(post => gridEl.appendChild(card(post)));
  }

  function card(post) {
    const art = document.createElement('article');
    art.className = 'blog-post-card';
    art.innerHTML = `
      <div class="post-content">
        <div class="post-meta">
          <span class="post-category-badge">${categoryLabel(post.category)}</span>
          <span class="post-date">${new Date().toLocaleDateString()}</span>
          <span class="read-time">6 min read</span>
        </div>
        <h3><a href="#/blog/${post.slug}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
        <div class="post-author-mini">
          <span>By Editorial Team</span>
        </div>
        <button class="read-more" aria-expanded="false">Read More →</button>
        <div class="post-full" style="display:none; margin-top:8px;">${formatContentToHTML(post.content)}</div>
      </div>
    `;
    const btn = art.querySelector('.read-more');
    const full = art.querySelector('.post-full');
    btn.addEventListener('click', () => {
      const isOpen = full.style.display === 'block';
      full.style.display = isOpen ? 'none' : 'block';
      btn.textContent = isOpen ? 'Read More →' : 'Show Less ↑';
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) history.replaceState({}, '', `#/blog/${post.slug}`);
    });
    return art;
  }

  function route() {
    const slug = getRouteSlug();
    renderGrid('all');
    if (!slug) return;
    const link = gridEl.querySelector(`a[href="#/blog/${slug}"]`);
    if (link) {
      link.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const cardEl = link.closest('.blog-post-card');
      if (cardEl) {
        const btn = cardEl.querySelector('.read-more');
        const full = cardEl.querySelector('.post-full');
        if (btn && full) { full.style.display = 'block'; btn.textContent = 'Show Less ↑'; btn.setAttribute('aria-expanded','true'); }
      }
    }
  }

  window.addEventListener('hashchange', route);
  route();
})();
