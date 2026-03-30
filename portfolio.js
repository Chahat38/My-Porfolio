 
/* ══ 1. ANIMATED NETWORK CANVAS BACKGROUND ══ */
const canvas = document.getElementById('netCanvas');
const ctx    = canvas.getContext('2d');
let W, H, nodes = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function Node() {
  this.x  = Math.random() * W;
  this.y  = Math.random() * H;
  this.vx = (Math.random() - .5) * .4;
  this.vy = (Math.random() - .5) * .4;
  this.r  = Math.random() * 2 + 1;
}
for (let i = 0; i < 80; i++) nodes.push(new Node());

function drawNet() {
  ctx.clearRect(0, 0, W, H);

  // Draw nodes
  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,212,255,.6)';
    ctx.fill();
  });

  // Draw connecting lines
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 140) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${.18 * (1 - d / 140)})`;
        ctx.lineWidth   = .8;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawNet);
}
drawNet();


/* ══ 2. TYPED TEXT EFFECT ══ */
const phrases = ['Frontend Developer', 'UI/UX Designer', 'Bootstrap Expert', 'Creative Coder', 'IT Student'];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const phrase = phrases[pi];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) {
      deleting = true;
      setTimeout(type, 1900);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 52 : 105);
}
type();


/* ══ 3. SCROLL REVEAL + SKILL BAR ANIMATION ══ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
      // Animate skill bar fills when they come into view
      entry.target.querySelectorAll('.sk-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.rv, .rvl, .rvr').forEach(el => revealObserver.observe(el));


/* ══ 4. ACTIVE RIGHT-SIDE NAV HIGHLIGHT ══ */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.sidenav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});


/* ══ 5. SKILL FILTER TABS ══ */
document.querySelectorAll('#filterTabs .ftab').forEach(tab => {
  tab.addEventListener('click', function () {
    // Set active tab
    document.querySelectorAll('#filterTabs .ftab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    const filter = this.dataset.filter;

    document.querySelectorAll('#skillsGrid .sk-item').forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.style.display = show ? 'block' : 'none';

      // Re-animate bars for visible items
      if (show) {
        item.querySelectorAll('.sk-fill').forEach(bar => {
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 50);
        });
      }
    });
  });
});
