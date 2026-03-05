// ===========================
// 平滑滚动导航
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===========================
// 导航栏滚动阴影 + 当前节点高亮
// ===========================
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  // 导航栏滚动阴影
  if (window.scrollY > 10) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // 当前节点高亮
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ===========================
// 滚动进场动画 (Intersection Observer)
// ===========================
const fadeElements = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  }
);
fadeElements.forEach(el => fadeObserver.observe(el));

// ===========================
// 弹窗逻辑
// ===========================
function setupModal(btnId, modalId) {
  const modal = document.getElementById(modalId);
  const btn = document.getElementById(btnId);
  const span = modal.querySelector('.close-modal');

  if (btn && modal && span) {
    btn.onclick = function () {
      modal.style.display = 'block';
    };
    span.onclick = function () {
      modal.style.display = 'none';
    };
  }
}

setupModal('qqBtn', 'qrModal');
setupModal('wechatBtn', 'wechatModal');
setupModal('emailBtn', 'emailModal');

// 点击弹窗外部关闭弹窗
window.addEventListener('click', function (event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
});

// ESC 键关闭弹窗
window.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }
});

// ===========================
// 复制邮箱功能
// ===========================
function copyEmail() {
  const emailText = document.getElementById('emailText').innerText;
  navigator.clipboard
    .writeText(emailText)
    .then(() => {
      const msg = document.getElementById('copyMsg');
      msg.style.opacity = '1';
      setTimeout(() => {
        msg.style.opacity = '0';
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      alert('复制失败，请手动复制');
    });
}

// ===========================
// 证书预览功能
// ===========================
const overlay = document.createElement('div');
overlay.className = 'certificate-overlay';
document.body.appendChild(overlay);

document.querySelectorAll('.certificate-badge').forEach(badge => {
  const certPath = badge.getAttribute('data-cert');
  const img = document.createElement('img');
  img.src = certPath;
  img.className = 'certificate-preview';
  img.alt = '证书预览';
  document.body.appendChild(img);

  badge.addEventListener('mouseenter', () => {
    overlay.classList.add('active');
    img.style.opacity = '1';
    img.style.visibility = 'visible';
    img.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  badge.addEventListener('mouseleave', () => {
    overlay.classList.remove('active');
    img.style.opacity = '0';
    img.style.visibility = 'hidden';
    img.style.transform = 'translate(-50%, -50%) scale(0)';
  });
});

// ===========================
// 数据数字动画
// ===========================
function animateNumbers() {
  const numberElements = document.querySelectorAll('.data-number');

  numberElements.forEach(element => {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用缓动函数使动画更自然
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeProgress);

      // 格式化大数字（加千位分隔符）
      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(updateNumber);
  });
}

// 使用 Intersection Observer 来检测数据区域进入视口
const dataObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumbers();
        dataObserver.disconnect();
      }
    });
  },
  {
    threshold: 0.3,
  }
);

const dataHighlights = document.querySelector('.data-highlights');
if (dataHighlights) {
  dataObserver.observe(dataHighlights);
}
