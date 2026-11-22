// burger menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});

nav.addEventListener('click', (e) => {
  if (e.target.closest('a') && nav.classList.contains('open')) {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  }
});

// price tabs
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

function activateTab(tab) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((p) => {
    const active = p.id === tab.getAttribute('aria-controls');
    p.classList.toggle('active', active);
    p.hidden = !active;
  });
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = e.key === 'ArrowRight'
        ? (i + 1) % tabs.length
        : (i - 1 + tabs.length) % tabs.length;
      tabs[next].focus();
      activateTab(tabs[next]);
    }
  });
});

// booking form validation
const form = document.getElementById('bookingForm');
const fields = {
  name: document.getElementById('fName'),
  phone: document.getElementById('fPhone'),
  pet: document.getElementById('fPet'),
  service: document.getElementById('fService'),
};

const validators = {
  name: (v) => v.trim().length >= 2,
  phone: (v) => /^[+]?[\d\s()\-]{10,16}$/.test(v.trim()),
  pet: (v) => v !== '',
  service: (v) => v !== '',
};

function validateField(key) {
  const input = fields[key];
  const ok = validators[key](input.value);
  input.closest('.field').classList.toggle('invalid', !ok);
  return ok;
}

Object.keys(fields).forEach((key) => {
  const input = fields[key];
  input.addEventListener('input', () => {
    if (input.closest('.field').classList.contains('invalid')) validateField(key);
  });
  input.addEventListener('blur', () => {
    if (input.value !== '') validateField(key);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const results = Object.keys(fields).map(validateField);
  if (results.every(Boolean)) {
    document.getElementById('formFields').style.display = 'none';
    const success = document.getElementById('formSuccess');
    success.style.display = 'flex';
    success.querySelector('h3').setAttribute('tabindex', '-1');
    success.querySelector('h3').focus();
  } else {
    const firstInvalid = form.querySelector('.field.invalid input, .field.invalid select');
    if (firstInvalid) firstInvalid.focus();
  }
});

// marquee: duplicate content for seamless loop
const track = document.getElementById('marqueeTrack');
track.innerHTML += track.innerHTML;

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}
