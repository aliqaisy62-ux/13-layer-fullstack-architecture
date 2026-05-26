// ========================================
// FULL STACK ENGINEERING GUIDE — APP.JS
// ========================================

// ===== CONSTANTS & STATE =====
var cur = 0;
var mermaidReady = false;
var state = {
  bookmarks: JSON.parse(localStorage.getItem('fs_bookmarks') || '[]'),
  visited:   JSON.parse(localStorage.getItem('fs_visited')   || '[]'),
  theme:     localStorage.getItem('fs_theme') || 'dark',
  expandAll: false,
  filter:    'all'
};

// ===== ESCAPE HTML =====
function escHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===== UTILITY =====
function section(label, content) {
  return '<div class="section-block reveal">' +
    '<p class="section-label">' + label + '</p>' +
    content +
    '</div>';
}

function uid() {
  return 'md' + Math.random().toString(36).slice(2, 9);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  applyTheme();
  buildNav();
  buildDots();

  var saved = parseInt(localStorage.getItem('fs_cur') || '0', 10);
  if (saved >= 0 && saved < LAYERS.length) cur = saved;

  renderLayer(cur);
  updateNav(cur);
  updateProgress();
  setupSearch();
  setupEventListeners();
  setupKeyboard();
});

function setupEventListeners() {
  // Mobile menu
  var menuBtn = document.getElementById('menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);

  // Overlay
  var overlay = document.getElementById('overlay');
  if (overlay) overlay.addEventListener('click', function() {
    closeSidebar();
    closeAllPanels();
  });

  // Footer buttons
  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  var bookmarkBtn = document.getElementById('bookmark-btn');
  if (bookmarkBtn) bookmarkBtn.addEventListener('click', function() {
    renderBookmarksList();
    openPanel('bookmarks-panel');
  });

  var shortcutsBtn = document.getElementById('shortcuts-btn');
  if (shortcutsBtn) shortcutsBtn.addEventListener('click', function() {
    openPanel('shortcuts-panel');
  });

  var expandBtn = document.getElementById('expand-btn');
  if (expandBtn) expandBtn.addEventListener('click', toggleExpandAll);

  // Topbar buttons
  var bmCurrentBtn = document.getElementById('bm-current-btn');
  if (bmCurrentBtn) bmCurrentBtn.addEventListener('click', function() {
    toggleBookmark(cur);
  });

  var expandAllBtn = document.getElementById('expand-all-btn');
  if (expandAllBtn) expandAllBtn.addEventListener('click', toggleExpandAll);

  // Filter tags
  document.querySelectorAll('.filter-tag').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-tag').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      filterNav();
    });
  });
}

// ===== NAVIGATION =====
function buildNav() {
  var nav = document.getElementById('nav');
  nav.innerHTML = LAYERS.map(function(l, i) {
    var isVisited = state.visited.indexOf(i) !== -1;
    var isBookmarked = state.bookmarks.indexOf(i) !== -1;
    return '<button class="nav-item' +
      (i === cur ? ' active' : '') +
      (isVisited ? ' visited' : '') +
      '" data-difficulty="' + (l.difficulty || 'intermediate') + '" onclick="goTo(' + i + ')">' +
      '<span class="nav-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="nav-icon">' + (l.icon || '◈') + '</span>' +
      '<span class="nav-text">' + l.title + '</span>' +
      (isVisited ? '<span class="nav-visited-dot"></span>' : '') +
      '</button>';
  }).join('');
}

function buildDots() {
  var dots = document.getElementById('dots');
  dots.innerHTML = LAYERS.map(function(_, i) {
    var isVisited = state.visited.indexOf(i) !== -1;
    return '<span class="dot' +
      (i === cur ? ' active' : '') +
      (isVisited ? ' visited' : '') +
      '" onclick="goTo(' + i + ')" title="' + LAYERS[i].title + '"></span>';
  }).join('');
}

function updateNav(idx) {
  // Nav items
  document.querySelectorAll('.nav-item').forEach(function(item, i) {
    item.classList.toggle('active', i === idx);
  });

  // Dots
  document.querySelectorAll('.dot').forEach(function(dot, i) {
    dot.classList.toggle('active', i === idx);
  });

  // Pager num
  var pagerNum = document.getElementById('pager-num');
  if (pagerNum) pagerNum.textContent = (idx + 1) + ' / ' + LAYERS.length;

  // Mobile progress
  var mobProg = document.getElementById('mob-prog');
  if (mobProg) mobProg.textContent = (idx + 1) + '/' + LAYERS.length;

  // Prev / Next buttons
  var prevBtn = document.getElementById('prev-btn');
  var nextBtn = document.getElementById('next-btn');
  var prevLabel = document.getElementById('prev-label');
  var nextLabel = document.getElementById('next-label');

  if (prevBtn) prevBtn.disabled = (idx === 0);
  if (nextBtn) nextBtn.disabled = (idx === LAYERS.length - 1);

  if (prevLabel) prevLabel.textContent = idx > 0 ? LAYERS[idx - 1].title : '—';
  if (nextLabel) nextLabel.textContent = idx < LAYERS.length - 1 ? LAYERS[idx + 1].title : '—';

  // Breadcrumb
  var bcCurrent = document.getElementById('bc-current');
  if (bcCurrent) bcCurrent.textContent = LAYERS[idx].title;

  // Mobile title
  var mobileTitle = document.getElementById('mobile-title');
  if (mobileTitle) mobileTitle.textContent = LAYERS[idx].title;

  // Bookmark button state
  updateBookmarkBtnState(idx);
}

function filterNav() {
  document.querySelectorAll('.nav-item').forEach(function(item) {
    if (state.filter === 'all') {
      item.classList.remove('hidden');
    } else {
      var diff = item.dataset.difficulty || 'intermediate';
      item.classList.toggle('hidden', diff !== state.filter);
    }
  });
}

function goTo(idx) {
  if (idx < 0 || idx >= LAYERS.length) return;
  cur = idx;
  localStorage.setItem('fs_cur', String(cur));

  // Mark visited
  if (state.visited.indexOf(idx) === -1) {
    state.visited.push(idx);
    localStorage.setItem('fs_visited', JSON.stringify(state.visited));
  }

  renderLayer(cur);
  updateNav(cur);
  updateProgress();
  buildNav();
  buildDots();
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(postRender, 100);
}

function navigate(dir) {
  goTo(cur + dir);
}

// ===== RENDERING ENGINE =====
function renderLayer(idx) {
  var l = LAYERS[idx];
  var html = '';

  html += renderHeader(l, idx);
  html += renderOverviewSection(l);
  html += renderConceptsSection(l);
  html += renderSubsectionsAccordion(l);
  html += renderLanguagesSection(l);
  html += renderDiagramsSection(l, idx);
  html += renderToolsSection(l);
  html += renderPatternsSection(l);
  html += renderPracticesSection(l);
  html += renderTabsSection(l);
  html += renderInterviewSection(l);
  html += renderResourcesSection(l);

  var content = document.getElementById('content');
  content.innerHTML = html;
  content.scrollTop = 0;
}

// ---- HEADER ----
function renderHeader(l, idx) {
  var tagHtml = (l.tags || []).map(function(t) {
    return '<span class="tag">' + escHtml(t) + '</span>';
  }).join('');

  return '<div class="layer-header">' +
    '<div class="layer-meta">' +
      '<span class="layer-badge" style="background:' + (l.bg || 'transparent') + ';color:' + (l.color || 'var(--accent)') + ';border-color:' + (l.color || 'var(--accent)') + '44">' +
        (l.icon || '◈') + ' Layer ' + String(idx + 1).padStart(2, '0') +
      '</span>' +
      '<span class="difficulty-badge difficulty-' + (l.difficulty || 'intermediate') + '">' + (l.difficulty || 'intermediate') + '</span>' +
      '<div class="layer-tags">' + tagHtml + '</div>' +
    '</div>' +
    '<h1 class="layer-title">' + escHtml(l.title) + '</h1>' +
    '<p class="layer-subtitle">' + escHtml(l.subtitle || l.sub || '') + '</p>' +
    '<button class="claude-btn" onclick="openClaude(' + idx + ')">Ask Claude ↗</button>' +
  '</div>';
}

// ---- OVERVIEW ----
function renderOverviewSection(l) {
  if (!l.overview && !l.purpose) return '';
  return section('OVERVIEW',
    '<div class="overview-grid">' +
      '<div class="overview-card">' +
        '<div class="ov-label">Overview</div>' +
        '<p>' + escHtml(l.overview || '') + '</p>' +
      '</div>' +
      '<div class="overview-card purpose-card">' +
        '<div class="ov-label">Why It Matters</div>' +
        '<p>' + escHtml(l.purpose || '') + '</p>' +
      '</div>' +
    '</div>'
  );
}

// ---- CONCEPTS ----
function renderConceptsSection(l) {
  if (!l.concepts || !l.concepts.length) return '';
  var cols = l.concepts.map(function(c) {
    var items = (c.items || []).map(function(item) {
      return '<li>' + escHtml(item) + '</li>';
    }).join('');
    return '<div class="concept-col">' +
      '<div class="concept-level" style="color:' + c.color + ';border-color:' + c.color + '">' + escHtml(c.level) + '</div>' +
      '<ul>' + items + '</ul>' +
    '</div>';
  }).join('');
  return section('LEARNING PATH', '<div class="concepts-grid">' + cols + '</div>');
}

// ---- SUBSECTIONS ACCORDION ----
function renderSubsectionsAccordion(l) {
  if (!l.subsections || !l.subsections.length) return '';
  var items = l.subsections.map(function(s, i) {
    var codeHtml = '';
    if (s.code) {
      codeHtml = '<div class="code-header">' +
        '<span class="code-lang">' + escHtml(s.code.lang || 'code') + '</span>' +
        '<span class="code-title-text">' + escHtml(s.code.title || '') + '</span>' +
      '</div>' +
      '<pre class="code-block"><code>' + escHtml(s.code.code || '') + '</code></pre>';
    }
    return '<div class="accordion-item' + (i === 0 ? ' open' : '') + '">' +
      '<button class="accordion-trigger">' +
        '<span class="acc-icon">+</span>' +
        '<span>' + escHtml(s.title) + '</span>' +
      '</button>' +
      '<div class="accordion-body"' + (i === 0 ? ' style="max-height:2000px"' : '') + '>' +
        '<div class="accordion-body-inner">' +
          '<p>' + escHtml(s.content) + '</p>' +
          codeHtml +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  return section('IN DEPTH', '<div class="accordion-list">' + items + '</div>');
}

// ---- LANGUAGES ----
function renderLanguagesSection(l) {
  if (!l.languages || !l.languages.length) return '';
  var cards = l.languages.map(function(lang) {
    var prosHtml = (lang.pros || []).map(function(p) {
      return '<div class="pc-item">✓ ' + escHtml(p) + '</div>';
    }).join('');
    var consHtml = (lang.cons || []).map(function(c) {
      return '<div class="pc-item">✗ ' + escHtml(c) + '</div>';
    }).join('');
    var snippetHtml = lang.snippet ?
      '<pre class="code-block mini"><code>' + escHtml(lang.snippet) + '</code></pre>' : '';
    return '<div class="lang-card">' +
      '<div class="lang-header">' +
        '<span class="lang-badge">' + escHtml(lang.badge || lang.name.slice(0,2).toUpperCase()) + '</span>' +
        '<span class="lang-name">' + escHtml(lang.name) + '</span>' +
        '<span class="lang-purpose">' + escHtml(lang.purpose || '') + '</span>' +
      '</div>' +
      '<div class="lang-body">' +
        '<p class="lang-why">' + escHtml(lang.why || '') + '</p>' +
        (prosHtml || consHtml ? '<div class="lang-pros-cons">' +
          '<div class="pros-col">' + prosHtml + '</div>' +
          '<div class="cons-col">' + consHtml + '</div>' +
        '</div>' : '') +
        snippetHtml +
      '</div>' +
    '</div>';
  }).join('');
  return section('LANGUAGES & TOOLS', '<div class="lang-grid">' + cards + '</div>');
}

// ---- DIAGRAMS ----
function renderDiagramsSection(l, idx) {
  if (!l.diagrams || !l.diagrams.length) return '';
  var boxes = l.diagrams.map(function(d) {
    var id = uid();
    return '<div class="diagram-box">' +
      '<div class="diagram-header">' +
        escHtml(d.title) +
        '<span class="diagram-type-badge">' + escHtml(d.type || 'mermaid') + '</span>' +
      '</div>' +
      (d.description ? '<div class="diagram-desc">' + escHtml(d.description) + '</div>' : '') +
      '<div class="mermaid-output">' +
        '<pre class="mermaid-src" data-id="' + id + '">' + escHtml(d.code) + '</pre>' +
        '<div class="mermaid-render" id="render-' + id + '"><span class="diagram-loading">Loading diagram...</span></div>' +
      '</div>' +
    '</div>';
  }).join('');
  return section('ARCHITECTURE DIAGRAMS', boxes);
}

// ---- TOOLS ----
function renderToolsSection(l) {
  if (!l.tools || !l.tools.length) return '';
  var cards = l.tools.map(function(t) {
    return '<div class="tool-card">' +
      '<div class="tool-top">' +
        '<span class="tool-name">' + escHtml(t.name || t.n || '') + '</span>' +
        (t.category ? '<span class="tool-category">' + escHtml(t.category) + '</span>' : '') +
      '</div>' +
      '<div class="tool-desc">' + escHtml(t.desc || t.d || '') + '</div>' +
    '</div>';
  }).join('');
  return section('TOOLS & ECOSYSTEM', '<div class="tools-grid">' + cards + '</div>');
}

// ---- PATTERNS ----
function renderPatternsSection(l) {
  if (!l.patterns || !l.patterns.length) return '';
  var cards = l.patterns.map(function(p) {
    return '<div class="pattern-card">' +
      '<div class="pattern-name">' + escHtml(p.name) + '</div>' +
      '<div class="pattern-desc">' + escHtml(p.desc) + '</div>' +
    '</div>';
  }).join('');
  return section('PATTERNS', '<div class="patterns-grid">' + cards + '</div>');
}

// ---- PRACTICES ----
function renderPracticesSection(l) {
  if ((!l.bestPractices || !l.bestPractices.length) && (!l.mistakes || !l.mistakes.length)) return '';
  var bpHtml = (l.bestPractices || []).map(function(bp) {
    return '<div class="practice-item"><strong>' + escHtml(bp.title) + '</strong><p>' + escHtml(bp.desc) + '</p></div>';
  }).join('');
  var mkHtml = (l.mistakes || []).map(function(m) {
    return '<div class="practice-item"><strong>' + escHtml(m.title) + '</strong><p>' + escHtml(m.desc) + '</p></div>';
  }).join('');
  return section('BEST PRACTICES & PITFALLS',
    '<div class="practices-grid">' +
      '<div class="practices-col">' +
        '<div class="practices-header green">✓ Best Practices</div>' +
        '<div class="practice-items">' + bpHtml + '</div>' +
      '</div>' +
      '<div class="practices-col">' +
        '<div class="practices-header red">✗ Common Mistakes</div>' +
        '<div class="practice-items">' + mkHtml + '</div>' +
      '</div>' +
    '</div>'
  );
}

// ---- TABS (Security / Performance / Scalability) ----
function renderTabsSection(l) {
  var hasSec  = l.security     && l.security.length;
  var hasPerf = l.performance  && l.performance.length;
  var hasSca  = l.scalability  && l.scalability.length;
  if (!hasSec && !hasPerf && !hasSca) return '';

  function renderTabItems(items, showSeverity) {
    if (!items || !items.length) return '<p style="padding:16px;color:var(--text3);font-size:13px;">No items for this layer.</p>';
    return '<div class="tab-items">' + items.map(function(item) {
      return '<div class="tab-item">' +
        '<div class="tab-item-header">' +
          '<span class="tab-item-title">' + escHtml(item.title) + '</span>' +
          (showSeverity && item.severity ? '<span class="severity-badge severity-' + item.severity + '">' + item.severity + '</span>' : '') +
        '</div>' +
        '<div class="tab-item-desc">' + escHtml(item.desc) + '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  return section('SECURITY / PERFORMANCE / SCALABILITY',
    '<div class="tabs-wrap">' +
      '<div class="tabs-nav">' +
        '<button class="tab-btn active" data-tab="security">Security</button>' +
        '<button class="tab-btn" data-tab="performance">Performance</button>' +
        '<button class="tab-btn" data-tab="scalability">Scalability</button>' +
      '</div>' +
      '<div class="tab-panel active" data-panel="security">' + renderTabItems(l.security, true) + '</div>' +
      '<div class="tab-panel" data-panel="performance">' + renderTabItems(l.performance, false) + '</div>' +
      '<div class="tab-panel" data-panel="scalability">' + renderTabItems(l.scalability, false) + '</div>' +
    '</div>'
  );
}

// ---- INTERVIEW QUESTIONS ----
function renderInterviewSection(l) {
  if (!l.interviewQs || !l.interviewQs.length) return '';
  var items = l.interviewQs.map(function(q) {
    return '<div class="accordion-item iq-item">' +
      '<button class="accordion-trigger">' +
        '<span class="iq-difficulty ' + (q.difficulty || 'intermediate') + '">' + (q.difficulty || 'mid') + '</span>' +
        '<span class="iq-q-text">' + escHtml(q.q) + '</span>' +
        '<span class="acc-icon">+</span>' +
      '</button>' +
      '<div class="accordion-body">' +
        '<div class="accordion-body-inner iq-body">' +
          '<p class="iq-category">Category: ' + escHtml(q.category || '') + '</p>' +
          '<div class="iq-hint">Consider: ' + escHtml(q.hint || 'Think about the fundamentals, trade-offs, and real-world applications.') + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  return section('INTERVIEW QUESTIONS', '<div class="accordion-list">' + items + '</div>');
}

// ---- RESOURCES ----
function renderResourcesSection(l) {
  if (!l.resources || !l.resources.length) return '';
  var typeIcons = { docs:'◉', course:'▶', guide:'◈', book:'◇', article:'◎', video:'▷', tool:'⬡' };
  var items = l.resources.map(function(r) {
    var icon = typeIcons[r.type] || '◉';
    return '<div class="resource-item">' +
      '<span class="res-icon">' + icon + '</span>' +
      '<div class="res-info">' +
        '<div class="res-title">' + escHtml(r.title) + '</div>' +
        '<div class="res-meta">' +
          '<span class="res-type">' + escHtml(r.type || 'docs') + '</span>' +
          (r.free ? '<span class="res-free">Free</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  return section('RESOURCES', '<div class="resources-list">' + items + '</div>');
}

// ===== POST-RENDER SETUP =====
function postRender() {
  initAccordions();
  initTabs();
  initReveal();
  initMermaid();
}

// ---- MERMAID ----
function initMermaid() {
  var theme = state.theme === 'light' ? 'default' : 'dark';
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme,
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
      themeVariables: {
        fontSize: '13px'
      }
    });
  } catch(e) { /* mermaid may already be initialized */ }

  var srcs = document.querySelectorAll('.mermaid-src');
  srcs.forEach(function(el) {
    var id = el.dataset.id;
    var code = el.textContent || el.innerText;
    // Unescape HTML entities from the code
    code = code.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    var renderDiv = document.getElementById('render-' + id);
    if (!renderDiv) return;
    try {
      var renderId = 'mermaid-' + id;
      mermaid.render(renderId, code).then(function(result) {
        renderDiv.innerHTML = result.svg || result;
      }).catch(function(err) {
        renderDiv.innerHTML = '<span class="diagram-loading" style="color:var(--text4)">Diagram unavailable</span>';
      });
    } catch(e) {
      renderDiv.innerHTML = '<span class="diagram-loading" style="color:var(--text4)">Diagram unavailable</span>';
    }
  });
}

// ---- ACCORDIONS ----
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.parentElement;
      var body = item.querySelector('.accordion-body');
      if (!body) return;

      if (item.classList.contains('open')) {
        item.classList.remove('open');
        body.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        // Expand properly after content is revealed
        setTimeout(function() {
          body.style.maxHeight = body.scrollHeight + 2000 + 'px';
        }, 10);
      }
    });
  });
}

// ---- TABS ----
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var tabsWrap = btn.closest('.tabs-wrap');
      if (!tabsWrap) return;
      var panelId = btn.dataset.tab;

      tabsWrap.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      tabsWrap.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });

      btn.classList.add('active');
      var panel = tabsWrap.querySelector('[data-panel="' + panelId + '"]');
      if (panel) panel.classList.add('active');
    });
  });
}

// ---- REVEAL ----
function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!window.IntersectionObserver) {
    els.forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  els.forEach(function(el) { observer.observe(el); });
}

// ===== SEARCH =====
function setupSearch() {
  var input = document.getElementById('search-input');
  var dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', function() {
    var q = input.value.trim();
    if (q.length < 2) {
      dropdown.classList.remove('open');
      return;
    }
    var results = performSearch(q);
    renderSearchResults(results, q);
  });

  input.addEventListener('blur', function() {
    setTimeout(function() { dropdown.classList.remove('open'); }, 200);
  });

  input.addEventListener('focus', function() {
    if (input.value.trim().length >= 2) dropdown.classList.add('open');
  });
}

function performSearch(q) {
  var ql = q.toLowerCase();
  var results = [];

  LAYERS.forEach(function(l, i) {
    // Title match
    if (l.title && l.title.toLowerCase().indexOf(ql) !== -1) {
      results.push({ idx: i, type: 'title', text: l.title, match: l.title });
    }
    // Tags
    (l.tags || []).forEach(function(t) {
      if (t.toLowerCase().indexOf(ql) !== -1) {
        results.push({ idx: i, type: 'tag', text: l.title, match: '#' + t });
      }
    });
    // Tool names
    (l.tools || []).forEach(function(t) {
      var name = t.name || t.n || '';
      if (name.toLowerCase().indexOf(ql) !== -1) {
        results.push({ idx: i, type: 'tool', text: l.title, match: name + ' (' + (t.desc || t.d || '') + ')' });
      }
    });
    // Concepts
    (l.concepts || []).forEach(function(c) {
      (c.items || []).forEach(function(item) {
        if (item.toLowerCase().indexOf(ql) !== -1) {
          results.push({ idx: i, type: 'concept', text: l.title, match: item });
        }
      });
    });
    // Subsection titles
    (l.subsections || []).forEach(function(s) {
      if (s.title && s.title.toLowerCase().indexOf(ql) !== -1) {
        results.push({ idx: i, type: 'section', text: l.title, match: s.title });
      }
    });
  });

  // Deduplicate by idx + match
  var seen = {};
  results = results.filter(function(r) {
    var key = r.idx + '|' + r.match;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });

  return results.slice(0, 8);
}

function renderSearchResults(results, q) {
  var dropdown = document.getElementById('search-dropdown');
  if (!dropdown) return;

  if (!results.length) {
    dropdown.innerHTML = '<div class="search-empty">No results for "' + escHtml(q) + '"</div>';
    dropdown.classList.add('open');
    return;
  }

  function highlight(text, q) {
    var idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return escHtml(text);
    return escHtml(text.slice(0, idx)) +
      '<span class="sr-highlight">' + escHtml(text.slice(idx, idx + q.length)) + '</span>' +
      escHtml(text.slice(idx + q.length));
  }

  dropdown.innerHTML = results.map(function(r) {
    return '<div class="search-result" onclick="goTo(' + r.idx + ');document.getElementById(\'search-input\').value=\'\';">' +
      '<div class="sr-layer">Layer ' + String(r.idx + 1).padStart(2, '0') + ' — ' + escHtml(LAYERS[r.idx].title) + '</div>' +
      '<div class="sr-title">' + highlight(r.match, q) + '</div>' +
      '<div class="sr-match">' + escHtml(r.type) + '</div>' +
    '</div>';
  }).join('');

  dropdown.classList.add('open');
}

// ===== FEATURES =====
function toggleBookmark(idx) {
  var pos = state.bookmarks.indexOf(idx);
  if (pos === -1) {
    state.bookmarks.push(idx);
    showToast('Bookmarked: ' + LAYERS[idx].title, 'success');
  } else {
    state.bookmarks.splice(pos, 1);
    showToast('Removed bookmark: ' + LAYERS[idx].title, 'info');
  }
  localStorage.setItem('fs_bookmarks', JSON.stringify(state.bookmarks));
  updateBookmarkBtnState(idx);
  buildNav();
}

function updateBookmarkBtnState(idx) {
  var btn = document.getElementById('bm-current-btn');
  if (!btn) return;
  var isBookmarked = state.bookmarks.indexOf(idx) !== -1;
  if (isBookmarked) {
    btn.classList.add('bookmarked');
    btn.textContent = '◆ Bookmarked';
  } else {
    btn.classList.remove('bookmarked');
    btn.textContent = '◇ Bookmark';
  }
}

function renderBookmarksList() {
  var list = document.getElementById('bookmarks-list');
  if (!list) return;

  if (!state.bookmarks.length) {
    list.innerHTML = '<p class="panel-empty">No bookmarks yet.<br>Press B to bookmark a layer.</p>';
    return;
  }

  list.innerHTML = state.bookmarks.map(function(idx) {
    var l = LAYERS[idx];
    if (!l) return '';
    return '<div class="bookmark-item" onclick="goTo(' + idx + ');closePanel(\'bookmarks-panel\')">' +
      '<span class="bm-icon" style="color:' + (l.color || 'var(--accent)') + '">' + (l.icon || '◈') + '</span>' +
      '<div class="bm-info">' +
        '<div class="bm-title">' + escHtml(l.title) + '</div>' +
        '<div class="bm-num">Layer ' + String(idx + 1).padStart(2, '0') + '</div>' +
      '</div>' +
      '<button class="bm-remove" onclick="event.stopPropagation();removeBookmark(' + idx + ')">✕</button>' +
    '</div>';
  }).join('');
}

function removeBookmark(idx) {
  var pos = state.bookmarks.indexOf(idx);
  if (pos !== -1) state.bookmarks.splice(pos, 1);
  localStorage.setItem('fs_bookmarks', JSON.stringify(state.bookmarks));
  renderBookmarksList();
  updateBookmarkBtnState(cur);
  buildNav();
}

function updateProgress() {
  var count = state.visited.length;
  var total = LAYERS.length;
  var pct = Math.round((count / total) * 100);

  var progressText = document.getElementById('progress-text');
  var progressPct  = document.getElementById('progress-pct');
  var progressFill = document.getElementById('progress-fill');

  if (progressText) progressText.textContent = count + ' / ' + total + ' visited';
  if (progressPct)  progressPct.textContent  = pct + '%';
  if (progressFill) progressFill.style.width = pct + '%';
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.textContent = state.theme === 'dark' ? '◑' : '◐';
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('fs_theme', state.theme);
  applyTheme();
  // Re-render diagrams with new theme
  var srcs = document.querySelectorAll('.mermaid-src');
  if (srcs.length) {
    setTimeout(initMermaid, 100);
  }
  showToast('Switched to ' + state.theme + ' mode', 'info');
}

function showToast(msg, type) {
  type = type || 'info';
  var container = document.getElementById('toast-container');
  if (!container) return;

  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(function() {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 3000);
}

function toggleExpandAll() {
  state.expandAll = !state.expandAll;
  var btn = document.getElementById('expand-btn');
  var topBtn = document.getElementById('expand-all-btn');

  if (state.expandAll) {
    document.querySelectorAll('.accordion-item').forEach(function(item) {
      var body = item.querySelector('.accordion-body');
      if (body) {
        item.classList.add('open');
        body.style.maxHeight = '5000px';
      }
    });
    if (btn) { btn.textContent = '⊟'; btn.classList.add('active'); }
    if (topBtn) topBtn.textContent = '⊟ Collapse All';
    showToast('All sections expanded', 'info');
  } else {
    var first = true;
    document.querySelectorAll('.accordion-item').forEach(function(item) {
      var body = item.querySelector('.accordion-body');
      if (body) {
        if (first) {
          first = false;
        } else {
          item.classList.remove('open');
          body.style.maxHeight = '0';
        }
      }
    });
    if (btn) { btn.textContent = '⊞'; btn.classList.remove('active'); }
    if (topBtn) topBtn.textContent = '⊞ Expand All';
    showToast('Sections collapsed', 'info');
  }
}

// ===== PANELS =====
function openPanel(id) {
  closeAllPanels();
  var panel = document.getElementById(id);
  if (panel) panel.classList.add('open');
  var overlay = document.getElementById('overlay');
  if (overlay) overlay.classList.add('open');
}

function closePanel(id) {
  var panel = document.getElementById(id);
  if (panel) panel.classList.remove('open');
  var overlay = document.getElementById('overlay');
  if (overlay) overlay.classList.remove('open');
}

function closeAllPanels() {
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('open'); });
  var overlay = document.getElementById('overlay');
  if (overlay) overlay.classList.remove('open');
}

// ===== SIDEBAR =====
function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

function closeSidebar() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

// ===== CLAUDE =====
function openClaude(idx) {
  var l = LAYERS[idx];
  var prompt = l.claudePrompt || ('Tell me about ' + l.title + ' in full stack engineering');
  var url = 'https://claude.ai/new?q=' + encodeURIComponent(prompt);
  window.open(url, '_blank');
}

// ===== KEYBOARD =====
function setupKeyboard() {
  document.addEventListener('keydown', function(e) {
    var tag = document.activeElement && document.activeElement.tagName;
    var isInput = tag === 'INPUT' || tag === 'TEXTAREA';

    // ⌘K / Ctrl+K — focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      var searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.focus();
      return;
    }

    if (isInput) return;

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        navigate(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        navigate(1);
        break;
      case 'e': case 'E':
        state.expandAll = false; // will flip in toggleExpandAll
        toggleExpandAll();
        break;
      case 'c': case 'C':
        if (state.expandAll) toggleExpandAll();
        break;
      case 'b': case 'B':
        toggleBookmark(cur);
        break;
      case 't': case 'T':
        toggleTheme();
        break;
      case '?':
        openPanel('shortcuts-panel');
        break;
      case 'Escape':
        closeAllPanels();
        closeSidebar();
        var dd = document.getElementById('search-dropdown');
        if (dd) dd.classList.remove('open');
        break;
      default:
        // 1-9 keys
        if (e.key >= '1' && e.key <= '9') {
          var idx = parseInt(e.key, 10) - 1;
          if (idx < LAYERS.length) goTo(idx);
        }
    }
  });
}
