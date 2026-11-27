(function () {
  // ---- settings ----
  var USER = 'nazaldrax';
  var COUNT = 0;      // how many repositories to show (0 = show all)

  // HIDE LIST: type the repo names you do NOT want to show (exact GitHub name, any case).
  // Example: var HIDE = ['portfolio', 'old-test', 'my-secret-repo'];
  var HIDE = [
    'portfolio',
    'jack'
  ];
  // ------------------

  var box = document.getElementById('githubRepos');
  if (!box) return;

  var css = [
    '.gh-stats{display:flex;gap:14px;flex-wrap:wrap;margin:-12px 0 26px}',
    '.gh-stat{padding:12px 22px;border:1px solid var(--line);border-radius:12px;background:rgba(16,17,27,.8)}',
    '.gh-stat b{display:block;font-size:22px;font-weight:700;line-height:1.2;background:linear-gradient(100deg,var(--blue),var(--purple));-webkit-background-clip:text;background-clip:text;color:transparent}',
    '.gh-stat span{font-size:12.5px;color:var(--mute)}',
    '#githubRepos{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}',
    '.gh-card{display:flex;flex-direction:column;gap:12px;padding:24px;color:inherit;transition:transform .25s,border-color .25s,box-shadow .25s}',
    '.gh-card:hover{transform:translateY(-4px);border-color:rgba(139,92,246,.6);box-shadow:0 14px 40px -18px rgba(139,92,246,.55)}',
    '.gh-top{display:flex;align-items:center;gap:12px}',
    '.gh-ico{flex:none;width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(36,107,253,.25),rgba(139,92,246,.25));color:#b9a5ff}',
    '.gh-ico svg{width:18px;height:18px;fill:currentColor}',
    '.gh-card h3{margin:0;flex:1;font-size:16px;word-break:break-word}',
    '.gh-go{color:var(--mute);font-size:18px;transition:.25s}',
    '.gh-card:hover .gh-go{color:#fff;transform:translate(2px,-2px)}',
    '.gh-desc{flex:1;min-height:60px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}',
    '.gh-desc em{opacity:.6}',
    '.gh-meta{display:flex;align-items:center;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--mute);padding-top:14px;border-top:1px solid var(--line)}',
    '.gh-meta span{display:inline-flex;align-items:center;gap:6px}',
    '.gh-meta i{width:10px;height:10px;border-radius:50%;display:inline-block}',
    '.gh-meta svg{width:14px;height:14px;fill:currentColor}',
    '.gh-up{font-size:12px;color:#6b6b76}',
    '@media(max-width:560px){#githubRepos{grid-template-columns:1fr}}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var COLORS = {
    HTML: '#e34c26', JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', CSS: '#7c5cbf', Lua: '#5a7bff', PHP: '#7a86b8', Pawn: '#dbb284',
    'C#': '#178600', 'C++': '#f34b7d', C: '#9a9a9a', Shell: '#89e051', Go: '#00ADD8'
  };
  var ICON_REPO = '<svg viewBox="0 0 16 16"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.5 2.5 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>';
  var ICON_STAR = '<svg viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>';
  var ICON_FORK = '<svg viewBox="0 0 16 16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>';

  function esc(x) {
    return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function ago(d) {
    var s = (Date.now() - new Date(d).getTime()) / 1000;
    var u = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (var i = 0; i < u.length; i++) {
      var n = Math.floor(s / u[i][1]);
      if (n >= 1) return n + ' ' + u[i][0] + (n > 1 ? 's' : '') + ' ago';
    }
    return 'just now';
  }
  function get(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw 0; return r.json(); });
  }

  Promise.all([
    get('https://api.github.com/users/' + USER),
    get('https://api.github.com/users/' + USER + '/repos?per_page=100&sort=pushed')
  ]).then(function (res) {
    var user = res[0];
    var hidden = HIDE.map(function (n) { return String(n).toLowerCase(); });
    var all = res[1].filter(function (r) { return !r.fork && hidden.indexOf(r.name.toLowerCase()) === -1; });
    var stars = all.reduce(function (a, r) { return a + r.stargazers_count; }, 0);

    var stats = document.createElement('div');
    stats.className = 'gh-stats';
    stats.innerHTML =
      '<div class="gh-stat"><b>' + all.length + '</b><span>Repositories</span></div>' +
      '<div class="gh-stat"><b>' + stars + '</b><span>Stars earned</span></div>' +
      '<div class="gh-stat"><b>' + esc(user.followers) + '</b><span>Followers</span></div>';
    box.parentNode.insertBefore(stats, box);

    if (!all.length) {
      box.innerHTML = '<div class="card"><h3>No public repositories yet</h3><p>Check back soon.</p></div>';
      return;
    }
    box.innerHTML = (COUNT > 0 ? all.slice(0, COUNT) : all).map(function (r) {
      var lang = r.language
        ? '<span><i style="background:' + (COLORS[r.language] || '#8b8b95') + '"></i>' + esc(r.language) + '</span>'
        : '';
      return '<a class="card gh-card" href="' + esc(r.html_url) + '" target="_blank" rel="noopener">' +
        '<div class="gh-top"><span class="gh-ico">' + ICON_REPO + '</span><h3>' + esc(r.name) + '</h3><span class="gh-go" aria-hidden="true">\u2197</span></div>' +
        '<p class="gh-desc">' + (r.description ? esc(r.description) : '<em>No description yet</em>') + '</p>' +
        '<div class="gh-meta">' + lang +
        '<span>' + ICON_STAR + r.stargazers_count + '</span>' +
        '<span>' + ICON_FORK + r.forks_count + '</span></div>' +
        '<div class="gh-up">Updated ' + ago(r.pushed_at || r.updated_at) + '</div></a>';
    }).join('');
  }).catch(function () {
    box.innerHTML = '<div class="card"><h3>Could not load repositories</h3><p>Use the button below to visit GitHub.</p></div>';
  });
})();
