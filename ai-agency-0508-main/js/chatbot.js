(function() {
  // Locate UI elements if present
  const openBtn = document.querySelector('.chatbot-button');
  const windowEl = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const inputEl = document.getElementById('chatbot-text');
  const messagesEl = document.getElementById('chatbot-messages');

  if (!openBtn || !windowEl || !messagesEl) return;

  // Utility: message helpers
  function addMessage(sender, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function addMultiLine(sender, text) {
    // Split on double newlines to create readable chunks
    const parts = (text || '').split(/\n\n+/).filter(Boolean);
    if (!parts.length) { addMessage(sender, text); return; }
    parts.forEach((p, idx) => {
      setTimeout(() => addMessage(sender, p), idx * 40);
    });
  }

  let typingEl = null;
  function showTyping() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'typing';
    typingEl.textContent = 'Typing';
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function hideTyping() {
    if (!typingEl) return;
    typingEl.remove();
    typingEl = null;
  }

  // Open/close behavior
  openBtn.addEventListener('click', () => {
    const isOpen = windowEl.style.display === 'flex';
    windowEl.style.display = isOpen ? 'none' : 'flex';
    windowEl.style.flexDirection = 'column';
    if (!isOpen && inputEl) setTimeout(() => inputEl.focus(), 10);
  });
  if (closeBtn) closeBtn.addEventListener('click', () => (windowEl.style.display = 'none'));

  // NLP intents
  const INTENTS = {
    services: [
      'service','services','solution','solutions','offer','capability','capabilities'
    ],
    pricing: [
      'price','pricing','cost','budget','quote','fees','charges','how much','$','₹','usd','inr'
    ],
    support: [
      'support','help','issue','problem','bug','error','contact','phone','email','assist'
    ],
    timeline: [
      'how long','timeline','duration','delivery','deadline','turnaround'
    ],
    integration: [
      'integrate','integration','connect','crm','whatsapp','api','website','web','embed'
    ],
    appointment: [
      'book','appointment','schedule','call','meeting','demo','consultation'
    ],
    careers: [
      'job','career','hiring','work with you','apply','vacancy'
    ],
    caseStudies: [
      'case study','case studies','examples','portfolio','results','roi','success story'
    ],
    // New expanded domains
    digitalMarketing: [
      'digital marketing','seo','sem','ads','google ads','meta ads','facebook ads','instagram ads','ppc','performance marketing','content marketing','email marketing','social media','smm','inbound','lead gen','lead generation','remarketing','retargeting','campaign','funnels'
    ],
    webDevelopment: [
      'website development','web development','website redesign','landing page','wordpress','shopify','webflow','frontend','backend','full stack','responsive','performance','lighthouse','core web vitals'
    ],
    webApplications: [
      'web app','web application','saas','portal','dashboard','multi-tenant','authentication','role-based access','react','nextjs','node','express','django','flask','spring','api design'
    ],
    aiAutomation: [
      'ai automation','automation','chatbot','agent','ai agent','workflow automation','rpa','nlp','intent','knowledge base','vector db','embedding','openai','llm','gpt'
    ]
  };

  function scoreIntent(messageLower) {
    const scores = {};
    for (const key in INTENTS) {
      scores[key] = 0;
      for (const term of INTENTS[key]) {
        if (messageLower.includes(term)) scores[key] += term.length >= 4 ? 2 : 1;
      }
    }
    if (/\bhow\b|\bwhat\b|\bwhen\b|\bwhere\b|\bwhy\b|\bwhich\b|\bwho\b/.test(messageLower)) {
      for (const key in scores) scores[key] += 0.5;
    }
    let best = 'other';
    let bestScore = 0;
    for (const key in scores) {
      if (scores[key] > bestScore) { best = key; bestScore = scores[key]; }
    }
    return best;
  }

  // Knowledge and templates
  const KNOWLEDGE = {
    marketing: {
      strategies: [
        'SEO (technical + content + authority building)',
        'Performance Ads (Google/Meta) with conversion tracking',
        'Content Marketing (blogs, guides, lead magnets)',
        'Email Automations (welcome, nurture, reactivation)',
        'Social Media (organic + paid, audience growth)',
        'Conversion Rate Optimization (CRO: A/B tests, funnels)'
      ],
      implementation: [
        'Audit current channels and analytics; define ICP and goals.',
        'Keyword + audience research; build messaging and offers.',
        'Set up tracking (GA4, GTM, pixels, events, server-side if needed).',
        'Launch iterative campaigns; weekly sprints for creatives/landing pages.',
        'Report on KPIs; scale winners, cut underperformers.'
      ],
      benefits: [
        'Predictable pipeline growth and lower CAC over time.',
        'Compounding organic traffic from SEO + content.',
        'Clear attribution with end-to-end tracking and dashboards.'
      ],
      kpis: ['SQLs/MQLs','CAC/LTV','ROAS','CTR/CVR','Organic traffic','Lead quality']
    },
    webdev: {
      strategies: [
        'Modern stack (Next.js/React) or CMS (WordPress/Webflow/Shopify) per use-case.',
        'Design system + component library for speed and consistency.',
        'Accessibility (WCAG 2.1 AA) and Core Web Vitals focus.'
      ],
      implementation: [
        'Discovery: sitemap, user-flows, wireframes, content inventory.',
        'Build: responsive components, CMS schema, SEO metadata.',
        'Perf: image optimization, code-splitting, caching, CDN.',
        'QA: cross-browser/device testing, accessibility audits.',
        'Deploy: CI/CD, backups, uptime monitoring.'
      ],
      benefits: [
        'Faster load times and better conversions.',
        'Scalable content management and easy iteration.',
        'Improved SEO and accessibility compliance.'
      ],
      kpis: ['Load time','CWV (LCP/CLS/INP)','Bounce rate','Form completion','Revenue/lead lift']
    },
    webapps: {
      strategies: [
        'Modular architecture, API-first design, RBAC security.',
        'Cloud-native deployment (Docker, CI/CD) and observability.'
      ],
      implementation: [
        'Tech selection: React/Next + Node/Express/Nest or Python/Django.',
        'Data model + API design; auth (JWT/SSO).',
        'Automated tests (unit/integration/e2e); feature flags.',
        'Scalability: caching, pagination, background jobs, queues.'
      ],
      benefits: [
        'Maintainable codebase with faster feature delivery.',
        'Secure, scalable platform ready for growth.'
      ],
      kpis: ['Release frequency','Error rate','Latency','DAU/WAU/MAU','Churn','NPS']
    },
    ai: {
      strategies: [
        'Task-specific bots (FAQ, lead qual, support triage).',
        'Automation with Zapier/Make and custom webhooks.',
        'Knowledge grounding via embeddings + vector DB.',
        'Guardrails: intent checks, fallbacks, human handoff.'
      ],
      implementation: [
        'Define intents and success criteria; map workflows.',
        'Connect data sources (CMS, CRM, docs) and create embeddings.',
        'Implement orchestration (tools/functions) for actions.',
        'Test for accuracy, safety, latency; add analytics.'
      ],
      benefits: [
        'Lower support load and faster response times.',
        '24/7 qualified lead capture and routing.',
        'Operational efficiency via automation.'
      ],
      kpis: ['Deflection rate','FRT/ART','CSAT','Leads qualified','Tasks automated']
    }
  };

  // Handlers with structured, chunked replies
  function handleDigitalMarketing() {
    return [
      '**Digital Marketing Overview**\n\nStrategies:\n- ' + KNOWLEDGE.marketing.strategies.join('\n- '),
      'Implementation:\n- ' + KNOWLEDGE.marketing.implementation.join('\n- '),
      'Benefits:\n- ' + KNOWLEDGE.marketing.benefits.join('\n- '),
      'KPIs:\n- ' + KNOWLEDGE.marketing.kpis.join('\n- '),
      'Share your goals, target audience, monthly budget, and timeline for a tailored plan.'
    ].join('\n\n');
  }

  function handleWebDevelopment() {
    return [
      '**Website Development**\n\nStrategies:\n- ' + KNOWLEDGE.webdev.strategies.join('\n- '),
      'Implementation:\n- ' + KNOWLEDGE.webdev.implementation.join('\n- '),
      'Benefits:\n- ' + KNOWLEDGE.webdev.benefits.join('\n- '),
      'KPIs:\n- ' + KNOWLEDGE.webdev.kpis.join('\n- '),
      'Preferences (stack/CMS), pages, and integrations will help estimate timeline and cost.'
    ].join('\n\n');
  }

  function handleWebApps() {
    return [
      '**Web Applications / SaaS**\n\nStrategies:\n- ' + KNOWLEDGE.webapps.strategies.join('\n- '),
      'Implementation:\n- ' + KNOWLEDGE.webapps.implementation.join('\n- '),
      'Benefits:\n- ' + KNOWLEDGE.webapps.benefits.join('\n- '),
      'KPIs:\n- ' + KNOWLEDGE.webapps.kpis.join('\n- '),
      'Share key features, user roles, data sources, and scale expectations for scoping.'
    ].join('\n\n');
  }

  function handleAIAutomation() {
    return [
      '**AI Automation & Chatbots**\n\nStrategies:\n- ' + KNOWLEDGE.ai.strategies.join('\n- '),
      'Implementation:\n- ' + KNOWLEDGE.ai.implementation.join('\n- '),
      'Benefits:\n- ' + KNOWLEDGE.ai.benefits.join('\n- '),
      'KPIs:\n- ' + KNOWLEDGE.ai.kpis.join('\n- '),
      'Tell me your volume (tickets/leads), channels, and systems to integrate for a proposal.'
    ].join('\n\n');
  }

  function formatGreeting() {
    return [
      'Thanks for reaching out! I can help with digital marketing, websites, web apps, AI automation, pricing, timelines, and more.',
      'How can I help today?'
    ].join('\n');
  }

  function handleServices() {
    return [
      'Here are our core solutions:',
      '• Digital Marketing (SEO/SEM/Content/Email/Social/CRO)',
      '• Website Development (Next.js/React or CMS like WordPress/Webflow/Shopify)',
      '• Web Applications (SaaS/Portals/Dashboards with secure APIs)',
      '• AI Automation & Chatbots (grounded answers, workflows, integrations)',
      '',
      'Tell me your goals and constraints for a tailored plan.'
    ].join('\n');
  }

  function handlePricing(messageLower) {
    const budgetMatch = messageLower.match(/(\$|usd|inr|₹)?\s*([0-9][0-9.,]{1,})(k|\s*000)?/);
    const budgetLine = budgetMatch ? `I noticed a budget around ${budgetMatch[0]}. I can align a plan with that range.` : '';
    return [
      'Pricing depends on scope and usage. Typical starting points:',
      '• Digital Marketing retainers: from $1k–$5k/mo based on channels and goals.',
      '• Websites: from $2k (marketing site) to $15k+ (custom, multi-language).',
      '• Web Apps: from $8k+ depending on features, roles, and integrations.',
      '• AI Automation/Chatbots: from $299/mo for standard; custom solutions vary.',
      budgetLine,
      '',
      'Share your goals, timeline, and constraints for a precise quote.'
    ].join('\n');
  }

  function handleSupport() {
    return [
      'I can help troubleshoot and guide you here.',
      'For direct assistance: support@youragency.com or +91-9876543210.',
      'Please include the issue, steps to reproduce, and screenshots/logs if any.'
    ].join('\n');
  }

  function handleTimeline() {
    return [
      'Typical delivery windows:',
      '• Marketing kick-off: 1–2 weeks setup, then ongoing sprints.',
      '• Websites: 2–6 weeks depending on scope and content readiness.',
      '• Web apps: 4–12+ weeks based on features and integrations.',
      '• AI Automation: 1–3 weeks for scoped workflows; complex cases 4–6 weeks.',
      '',
      'Share your deadline and scope for a tailored plan.'
    ].join('\n');
  }

  function handleIntegration() {
    return [
      'We integrate with websites, WhatsApp, CRMs, and tools via APIs, Zapier/Make, or custom webhooks.',
      'Share your stack (CMS/CRM/helpdesk/ads) and target workflows; I’ll map the integration path.'
    ].join('\n');
  }

  function handleAppointment() { return 'Book a meeting: https://calendly.com/youragency/meeting. What time zone works?'; }
  function handleCareers() { return 'We’re always hiring—email your CV to hr@youragency.com with your focus area.'; }
  function handleCaseStudies() { return 'See case-study.html. Tell me your industry + target metric; I’ll share the closest match.'; }

  function handleOther(messageLower) {
    if (/hello|hi|hey|good\s*(morning|evening|afternoon)/.test(messageLower)) return formatGreeting();
    if (/\bhow\b|\bwhat\b|\bwhy\b|\bwhen\b|\bwhere\b/.test(messageLower)) {
      return [
        'To help best, please share:',
        '• Goal (traffic/leads/revenue/support deflection/etc.)',
        '• Channel/stack (site, CRM, ads, WhatsApp)',
        '• Timeline and budget range'
      ].join('\n');
    }
    return [
      'I can assist with digital marketing, websites, web apps, AI automation, pricing, timelines, and integrations.',
      'Tell me a bit more about your use-case and constraints.'
    ].join('\n');
  }

  function generateReply(message) {
    const msg = message.toLowerCase().trim();
    const intent = scoreIntent(msg);
    switch (intent) {
      case 'digitalMarketing': return handleDigitalMarketing();
      case 'webDevelopment': return handleWebDevelopment();
      case 'webApplications': return handleWebApps();
      case 'aiAutomation': return handleAIAutomation();
      case 'services': return handleServices();
      case 'pricing': return handlePricing(msg);
      case 'support': return handleSupport(msg);
      case 'timeline': return handleTimeline(msg);
      case 'integration': return handleIntegration(msg);
      case 'appointment': return handleAppointment(msg);
      case 'careers': return handleCareers(msg);
      case 'caseStudies': return handleCaseStudies(msg);
      default: return handleOther(msg);
    }
  }

  function sendMessage() {
    if (!inputEl) return;
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage('user', text);
    inputEl.value = '';
    showTyping();
    setTimeout(() => {
      const reply = generateReply(text);
      hideTyping();
      addMultiLine('bot', reply);
    }, 280);
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (inputEl) inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
})();
