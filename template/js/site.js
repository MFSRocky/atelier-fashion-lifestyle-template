/* ==========================================================================
   ATELIER — Core JavaScript & User Interactions
   Version: 1.0.0
   Author: TemplateFlux
   ========================================================================== */

(() => {
  'use strict';

  const cfg = window.SITE_CONFIG || {
    brand: { name: 'ATELIER', tagline: 'For a life\nwell lived.', announcement: 'Complimentary delivery on orders over $250 · A little more room to move' },
    contact: { email: 'hello@atelier.studio', locations: 'Paris · New York · Everywhere' },
    formEndpoint: ''
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const safeRead = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const safeWrite = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage disabled */ } };

  const page = document.body.dataset.page || 'home';
  const navItems = [
    ['Collections', 'collections.html', 'collections'],
    ['Shop', 'shop.html', 'shop'],
    ['Our story', 'about.html', 'about'],
    ['Journal', 'journal.html', 'journal']
  ];
  const currentPage = page === 'product' ? 'shop' : page === 'article' ? 'journal' : page;
  const navLink = ([label, href, key]) => `<a href="${href}"${currentPage === key ? ' aria-current="page"' : ''}>${label}</a>`;

  // Render Accessible Shared Header
  const header = $('#site-header');
  if (header) {
    header.innerHTML = `
      <div class="announcement">${cfg.brand.announcement}</div>
      <header class="site-header">
        <div class="nav-wrap">
          <button class="menu-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-navigation"><span></span></button>
          <nav class="nav-links" aria-label="Main navigation">${navItems.map(navLink).join('')}</nav>
          <a class="wordmark" href="index.html" aria-label="${cfg.brand.name} home">${cfg.brand.name}</a>
          <div class="nav-actions">
            <button class="search-trigger" type="button" aria-label="Open search">Search</button>
            <button class="cart-trigger" type="button" aria-label="Bag 0 — open shopping bag">Bag <span data-cart-count>0</span></button>
          </div>
        </div>
        <nav class="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
          ${navItems.map(navLink).join('')}
          <a href="contact.html">Contact</a>
        </nav>
      </header>
      <div class="header-overlay" data-overlay></div>
      <aside class="drawer" id="search-drawer" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true" tabindex="-1" inert>
        <div class="drawer-header">
          <h2>Find your piece.</h2>
          <button class="drawer-close" aria-label="Close search">×</button>
        </div>
        <form class="search-box" role="search">
          <label class="sr-only" for="site-search">Search products and stories</label>
          <input id="site-search" type="search" placeholder="Try “coat”, “dress”, or “journal”" autocomplete="off">
          <button type="submit" aria-label="Search">↗</button>
        </form>
        <p class="search-hint">A few words are enough.</p>
        <div class="search-results" aria-live="polite"></div>
      </aside>
      <aside class="drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag" aria-hidden="true" tabindex="-1" inert>
        <div class="drawer-header">
          <h2>Your bag <span data-cart-count>(0)</span></h2>
          <button class="drawer-close" aria-label="Close shopping bag">×</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-bottom">
          <div class="cart-total">
            <span>Subtotal</span>
            <strong data-cart-total>$0</strong>
          </div>
          <button type="button" class="button button-dark demo-checkout">Continue <span>↗</span></button>
          <small>Demonstration only — connect your e-commerce platform for live transactions.</small>
        </div>
      </aside>`;
  }

  // Render Accessible Shared Footer
  const footer = $('#site-footer');
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-top">
            <div class="footer-brand-block">
              <a class="footer-brand" href="index.html">${cfg.brand.name}</a>
              <p class="footer-tagline">${cfg.brand.tagline.replace('\\n', '<br>')}</p>
            </div>
            <div class="footer-col">
              <h3>Come explore</h3>
              <a href="shop.html">Shop all</a>
              <a href="collections.html">Collections</a>
              <a href="about.html">Our story</a>
              <a href="journal.html">Field notes</a>
            </div>
            <div class="footer-col">
              <h3>A little help</h3>
              <a href="contact.html">Contact us</a>
              <a href="product.html#size-guide">Size guide</a>
              <a href="contact.html">Delivery & returns</a>
              <a href="contact.html">FAQs</a>
            </div>
            <div class="footer-col">
              <h3>Say hello</h3>
              <a href="mailto:${cfg.contact.email}">${cfg.contact.email}</a>
              <a href="${cfg.social.instagram}" target="_blank" rel="noreferrer">Instagram ↗</a>
              <p>${cfg.contact.locations}</p>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© 2026 ${cfg.brand.name} STUDIO. ALL RIGHTS RESERVED.</span>
            <div>
              <a href="contact.html">Privacy</a>
              <a href="contact.html">Terms</a>
              <span>MADE WITH INTENTION</span>
            </div>
          </div>
        </div>
      </footer>
      <button class="back-top" type="button" aria-label="Back to top">↑</button>`;
  }

  // Drawers and Keyboard Handling
  const overlay = $('[data-overlay]');
  const drawers = $$('.drawer');
  let drawerTrigger = null;

  const closeDrawers = (restoreFocus = true) => {
    drawers.forEach(d => {
      d.classList.remove('open');
      d.setAttribute('aria-hidden', 'true');
      d.inert = true;
    });
    overlay?.classList.remove('open');
    document.body.classList.remove('drawer-active');
    if (restoreFocus && drawerTrigger) drawerTrigger.focus();
    drawerTrigger = null;
  };

  const openDrawer = (id) => {
    const trigger = document.activeElement;
    closeDrawers(false);
    drawerTrigger = trigger;
    const drawer = $(`#${id}`);
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.inert = false;
    overlay?.classList.add('open');
    document.body.classList.add('drawer-active');
    setTimeout(() => (id === 'search-drawer' ? $('#site-search') : $('.drawer-close', drawer))?.focus(), 120);
  };

  $$('.search-trigger').forEach(b => b.addEventListener('click', () => openDrawer('search-drawer')));
  $$('.cart-trigger').forEach(b => b.addEventListener('click', () => { renderCart(); openDrawer('cart-drawer'); }));
  $$('.drawer-close').forEach(b => b.addEventListener('click', () => closeDrawers()));
  overlay?.addEventListener('click', () => closeDrawers());

  document.addEventListener('keydown', e => {
    const activeDrawer = drawers.find(drawer => drawer.classList.contains('open'));
    if (e.key === 'Escape' && activeDrawer) { closeDrawers(); return; }
    if (e.key === 'Tab' && activeDrawer) {
      const focusable = $$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', activeDrawer).filter(el => el.getClientRects().length);
      if (!focusable.length) { e.preventDefault(); activeDrawer.focus(); return; }
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Mobile Navigation
  const menuToggle = $('.menu-toggle');
  const mobileNav = $('.mobile-nav');
  if (mobileNav) { mobileNav.setAttribute('aria-hidden', 'true'); mobileNav.inert = true; }

  const closeMobileNav = () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation menu');
    mobileNav?.classList.remove('open');
    if (mobileNav) { mobileNav.setAttribute('aria-hidden', 'true'); mobileNav.inert = true; }
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    mobileNav?.classList.toggle('open', !isOpen);
    if (mobileNav) {
      mobileNav.setAttribute('aria-hidden', String(isOpen));
      mobileNav.inert = isOpen;
    }
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      closeMobileNav();
      menuToggle.focus();
    }
  });

  // Cart & Wishlist State
  let cart = safeRead('atelier-cart', []);
  let wishlist = safeRead('atelier-wishlist', []);
  const persistCart = () => safeWrite('atelier-cart', cart);

  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    $$('[data-cart-count]').forEach(node => { node.textContent = node.closest('.drawer') ? `(${count})` : count; });
    $$('.cart-trigger').forEach(button => button.setAttribute('aria-label', `Bag ${count} — open shopping bag`));
    const wrap = $('.cart-items');
    if (!wrap) return;
    if (!cart.length) {
      wrap.innerHTML = '<p class="drawer-empty">Your bag is having a quiet moment.</p>';
    } else {
      wrap.innerHTML = cart.map((item, i) => `
        <div class="cart-row">
          <img src="${item.image}" alt="">
          <div>
            <h3>${item.name}</h3>
            <p>${item.size ? `Size ${item.size} · ` : ''}Qty ${item.quantity}</p>
            <button type="button" data-remove-item="${i}">Remove</button>
          </div>
          <strong>$${item.price * item.quantity}</strong>
        </div>`).join('');
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalEl = $('[data-cart-total]');
    if (totalEl) totalEl.textContent = `$${total}`;
  }
  renderCart();

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add-cart]');
    if (add) {
      const name = add.dataset.productName || 'ATELIER piece';
      const price = Number(add.dataset.productPrice) || 0;
      const image = add.dataset.productImage || 'assets/images/product-coat.webp';
      const quantity = Math.max(1, Number($('#product-quantity')?.value || 1));
      const size = $('.size-options button.selected')?.textContent || '';
      const same = cart.find(item => item.name === name && item.size === size);
      if (same) same.quantity += quantity;
      else cart.push({ name, price, image, quantity, size });
      persistCart();
      renderCart();
      add.innerHTML = 'Added to your bag <span>✓</span>';
      setTimeout(() => { add.innerHTML = 'Add to bag <span>↗</span>'; }, 1500);
      setTimeout(() => openDrawer('cart-drawer'), 400);
    }

    const remove = e.target.closest('[data-remove-item]');
    if (remove) {
      cart.splice(Number(remove.dataset.removeItem), 1);
      persistCart();
      renderCart();
    }

    const wish = e.target.closest('[data-wishlist]');
    if (wish) {
      const id = wish.dataset.wishlist;
      const present = wishlist.includes(id);
      wishlist = present ? wishlist.filter(x => x !== id) : [...wishlist, id];
      safeWrite('atelier-wishlist', wishlist);
      wish.classList.toggle('saved', !present);
      wish.setAttribute('aria-pressed', String(!present));
      if (wish.classList.contains('wish-inline')) {
        wish.textContent = present ? '♡ Save to your wishlist' : '♥ Saved to your wishlist';
      }
    }
  });

  $$('[data-wishlist]').forEach(button => {
    const active = wishlist.includes(button.dataset.wishlist);
    button.classList.toggle('saved', active);
    button.setAttribute('aria-pressed', String(active));
    if (button.classList.contains('wish-inline') && active) {
      button.textContent = '♥ Saved to your wishlist';
    } else if (active && button.classList.contains('wish-button')) {
      button.textContent = '♥';
    }
  });

  // Shop Page Filters & Sorting
  const categoryFilter = $('#category-filter');
  const sortSelect = $('#sort-products');
  const catalog = $('#catalog-grid');

  const sortCatalog = () => {
    if (!catalog) return;
    const category = categoryFilter?.value || 'all';
    const mode = sortSelect?.value || 'featured';
    const cards = $$('.product-card[data-category]', catalog);

    cards.sort((a, b) => {
      if (mode === 'low') return +a.dataset.price - +b.dataset.price;
      if (mode === 'high') return +b.dataset.price - +a.dataset.price;
      if (mode === 'az') return a.dataset.name.localeCompare(b.dataset.name);
      return 0;
    });

    cards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      catalog.append(card);
    });

    const visible = cards.filter(card => !card.hidden).length;
    const count = $('#result-count');
    if (count) count.textContent = visible;
    const empty = $('.empty-results');
    if (empty) empty.hidden = visible > 0;
    const status = $('.filter-status');
    if (status) status.textContent = category === 'all' ? '' : `· ${category === 'clothing' ? 'Clothing' : 'Objects & accessories'}`;
  };

  categoryFilter?.addEventListener('change', sortCatalog);
  sortSelect?.addEventListener('change', sortCatalog);

  // Product Detail Gallery & Selectors
  $$('.size-options button').forEach(button => button.addEventListener('click', () => {
    $$('.size-options button').forEach(b => {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('selected');
    button.setAttribute('aria-pressed', 'true');
  }));

  $$('.color-option').forEach(button => button.addEventListener('click', () => {
    $$('.color-option').forEach(b => b.classList.remove('selected'));
    button.classList.add('selected');
    const name = $('.selected-color-name');
    if (name) name.textContent = button.title;
  }));

  let quantity = 1;
  $$('[data-quantity]').forEach(button => button.addEventListener('click', () => {
    quantity = Math.max(1, Math.min(10, quantity + (button.dataset.quantity === 'plus' ? 1 : -1)));
    const output = $('#product-quantity');
    if (output) output.textContent = quantity;
  }));

  const thumbs = $$('.gallery-thumb');
  let galleryIndex = Math.max(0, thumbs.findIndex(t => t.classList.contains('active')));

  function showGallery(index) {
    if (!thumbs.length) return;
    galleryIndex = (index + thumbs.length) % thumbs.length;
    const active = thumbs[galleryIndex];
    const image = $('#gallery-main-image');
    const thumbImage = active.querySelector('img');
    if (image) {
      image.style.opacity = '.35';
      setTimeout(() => {
        image.src = active.dataset.galleryImage;
        if (thumbImage?.getAttribute('srcset')) image.setAttribute('srcset', thumbImage.getAttribute('srcset'));
        if (thumbImage?.getAttribute('sizes')) image.setAttribute('sizes', thumbImage.getAttribute('sizes'));
        image.alt = active.dataset.alt || 'ATELIER product image';
        image.style.opacity = '1';
      }, 120);
    }
    thumbs.forEach((t, i) => t.classList.toggle('active', i === galleryIndex));
    const count = $('#gallery-current');
    if (count) count.textContent = String(galleryIndex + 1).padStart(2, '0');
  }

  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => showGallery(i)));
  $('.gallery-prev')?.addEventListener('click', () => showGallery(galleryIndex - 1));
  $('.gallery-next')?.addEventListener('click', () => showGallery(galleryIndex + 1));

  // Search Interaction
  const searchable = [
    ['The Sunday Coat', 'Warm sand cotton · $480', 'product.html'],
    ['The Solenne Dress', 'Ivory satin · $295', 'product.html'],
    ['The Form No. 2', 'Cognac leather · $360', 'product.html'],
    ['The Sunday Knit', 'Knitwear · $220', 'product.html'],
    ['Collections', 'Explore the three collection chapters', 'collections.html'],
    ['Our story', 'A note on how we make things', 'about.html'],
    ['Field notes', 'Stories from the ATELIER journal', 'journal.html'],
    ['Contact', 'Send a note to our team', 'contact.html']
  ];
  const searchInput = $('#site-search');

  function showSearchResults(term) {
    const result = $('.search-results');
    if (!result) return;
    const q = term.trim().toLowerCase();
    if (!q) { result.innerHTML = ''; return; }
    const hits = searchable.filter(item => item.join(' ').toLowerCase().includes(q));
    result.innerHTML = hits.length
      ? hits.map(item => `<a href="${item[2]}">${item[0]}<span>${item[1]}</span></a>`).join('')
      : '<p class="no-search">No notes on that one. Try “coat”, “dress”, or “story”.</p>';
  }

  searchInput?.addEventListener('input', () => showSearchResults(searchInput.value));
  $('.search-box')?.addEventListener('submit', e => {
    e.preventDefault();
    showSearchResults(searchInput?.value || '');
  });

  // Client-Side Validation & Optional Remote POST Hook
  $$('[data-demo-form]').forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const status = $('.form-status', form);

    if (cfg.formEndpoint) {
      try {
        const formData = new FormData(form);
        const res = await fetch(cfg.formEndpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (status) status.textContent = 'Thank you — your subscription is confirmed.';
          form.reset();
          return;
        }
      } catch (err) {
        // Fallback to local confirmation on network failure
      }
    }

    if (status) status.textContent = 'Thank you — your note is recorded in this demo. Connect your endpoint in site-config.js for live delivery.';
    form.reset();
  }));

  const contactForm = $('[data-contact-form]');
  contactForm?.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;
    $$('[required]', contactForm).forEach(field => {
      const error = field.closest('.field')?.querySelector('.field-error') || (field.type === 'checkbox' ? $('.consent-error', contactForm) : null);
      let message = '';
      if (field.type === 'checkbox' && !field.checked) message = 'Please confirm before sending.';
      else if (!field.checkValidity()) message = field.validity.typeMismatch ? 'Please use a valid email address.' : field.validity.tooShort ? 'Please add a little more detail.' : 'This field is required.';
      if (error) error.textContent = message;
      field.setAttribute('aria-invalid', String(Boolean(message)));
      if (message) valid = false;
    });

    if (!valid) {
      $('[aria-invalid="true"]', contactForm)?.focus();
      return;
    }

    const status = $('.contact-status', contactForm);

    if (cfg.formEndpoint) {
      try {
        const formData = new FormData(contactForm);
        const res = await fetch(cfg.formEndpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (status) status.textContent = 'Thank you for your message. We will be in touch shortly.';
          contactForm.reset();
          $$('[aria-invalid]', contactForm).forEach(f => f.removeAttribute('aria-invalid'));
          return;
        }
      } catch (err) {
        // Fallback
      }
    }

    if (status) status.textContent = 'Thank you for your note. This is a front-end demo; connect your endpoint in site-config.js for live delivery.';
    contactForm.reset();
    $$('[aria-invalid]', contactForm).forEach(f => f.removeAttribute('aria-invalid'));
  });

  $$('input,textarea,select', contactForm || document).forEach(field => field.addEventListener('input', () => {
    const error = field.closest('.field')?.querySelector('.field-error');
    if (error && field.checkValidity()) {
      error.textContent = '';
      field.removeAttribute('aria-invalid');
    }
  }));

  $('.demo-checkout')?.addEventListener('click', () => {
    const note = $('.cart-bottom small');
    if (note) note.textContent = 'This template is a visual storefront concept. Checkout is intentionally ready to integrate with Shopify, Snipcart, Stripe, or WooCommerce.';
  });

  // Journal Filters
  $$('[data-journal-filter]').forEach(button => button.addEventListener('click', () => {
    $$('[data-journal-filter]').forEach(b => b.classList.toggle('active', b === button));
    const filter = button.dataset.journalFilter;
    const cards = $$('[data-journal-category]');
    let shown = 0;
    cards.forEach(card => {
      const visible = filter === 'all' || card.dataset.journalCategory === filter;
      card.hidden = !visible;
      if (visible) shown++;
    });
    const empty = $('.journal-empty');
    if (empty) empty.hidden = shown > 0;
  }));

  $('[data-share]')?.addEventListener('click', async () => {
    const button = $('[data-share]');
    try {
      if (navigator.share) await navigator.share({ title: document.title, url: location.href });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(location.href);
        button.textContent = '✓ Link copied';
      } else {
        button.textContent = 'Copy URL';
      }
    } catch { /* User closed share */ }
  });

  // Back-to-Top and Scroll Reveals
  const backTop = $('.back-top');
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const revealTargets = $$('.section, .collection-feature, .about-statement, .value-item, .journal-feature, .contact-form-wrap');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reveal-ready');
    revealTargets.forEach(el => el.setAttribute('data-reveal', ''));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    revealTargets.forEach(el => observer.observe(el));
  }

  window.addEventListener('scroll', () => backTop?.classList.toggle('visible', window.scrollY > 500), { passive: true });
})();
