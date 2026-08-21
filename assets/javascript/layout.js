//  ASIDE
////  Collapse
function toggleSidebar()
{
  const sidebar = document.querySelector('aside');
  sidebar.classList.toggle('collapsed');
}

////  Resize
const sidebar = document.querySelector('aside');
const resizer = document.querySelector('aside .handle');
const container = document.querySelector('wc-cosmic-wrap');

resizer.addEventListener('mousedown', (e) =>
{
  e.preventDefault();
  container.classList.add('is-resizing');

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
});
function handleMouseMove(e)
{
  //////  Bind width
  let targetWidth = e.clientX;
  if (targetWidth >= 200 && targetWidth <= 600)
  {
    ////////  dragging ? collapse = verboten : alles gut;
    sidebar.classList.remove('collapsed');
    document.documentElement.style.setProperty('--left-pan-width', `${targetWidth}px`);
  }
}
function handleMouseUp()
{
  container.classList.remove('is-resizing');
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

////  Highlight active section
const navLinks = document.querySelectorAll('aside nav ul li a[data-target]');
const trackedElements = document.querySelectorAll('section[id]');
const observerOptions =
{
  root: null,
  rootMargin: '-10% 0px -70% 0px',
  threshold: 0
};
const observer = new IntersectionObserver
(
  (entries) =>
  {
    entries.forEach
    (
      entry =>
      {
        if (entry.isIntersecting)
        {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(
            link => link.classList.remove('active')
          );
          const activeLink = document.querySelector(`aside nav ul li a[data-target="${id}"]`);
          if (activeLink)
          {
            activeLink.classList.add('active');
          }
        }
      }
    );
  },
  observerOptions
);
trackedElements.forEach(element => observer.observe(element));


//  BODY > NAV (top)
function toggleDropdown(event)
{
  event.stopPropagation();
  const menu = document.querySelector('body > nav .dropdown menu');
  const btn = document.querySelector('body > nav .dropdown button');
  const isOpen = menu.classList.contains('show');
  if (isOpen)
  {
    menu.classList.remove('show');
    btn.setAttribute('aria-expanded', 'false');
  }
  else
  {
    menu.classList.add('show');
    btn.setAttribute('aria-expanded', 'true');
  }
}
////  Close on click (anywhere)
window.addEventListener
(
  'click', () =>
  {
    const menu = document.querySelector('body > nav .dropdown menu');
    const btn = document.querySelector('body > nav .dropdown button');
    if (menu && menu.classList.contains('show'))
    {
      menu.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
    }
  }
);


//  DIAGRAMS
////  Resize + display id
class WcDiagram extends HTMLElement {
  connectedCallback() {
    this.ensureFigcaption();

    if (document.readyState === 'complete') {
      this.adjustDimensions();
    } else {
      window.addEventListener('load', () => this.adjustDimensions(), { once: true });
    }
  }

  ensureFigcaption()
  {
    const id = this.getAttribute('id');
    const figure = this.querySelector('figure');

    if (!id || !figure || figure.querySelector('figcaption')) return;

    const caption = document.createElement('figcaption');
    caption.textContent = `id:\u00A0\u00A0\u00A0#${id}`;
    figure.appendChild(caption);
  }

  adjustDimensions()
  {
    const figure = this.querySelector('figure');
    const svg = this.querySelector('svg');
    if (!figure || !svg) return;

    const rootStyles = getComputedStyle(document.documentElement);
    const scaleFactor = parseFloat(rootStyles.getPropertyValue('--diagram-scale')) || 1.5;

    const rect = svg.getBoundingClientRect();

    const originalWidth = rect.width / scaleFactor;
    const originalHeight = rect.height / scaleFactor;

    const extraWidth = rect.width - originalWidth;
    const extraHeight = rect.height - originalHeight;

    figure.style.paddingRight = `${extraWidth}px`;
    figure.style.paddingBottom = `${extraHeight}px`;
  }
}
if (!customElements.get('wc-diagram'))
{
  customElements.define('wc-diagram', WcDiagram);
}


//  POP-UPs
document.body.addEventListener
(
  'mouseover', (e) =>
  {
    const trigger = e.target.closest('wc-popup');
    if (!trigger) return;
    const popup = trigger.querySelector('.actual-popup');
    if (!popup) return;
    document.body.appendChild(popup);
    const rect = trigger.getBoundingClientRect();
    popup.style.left = `${rect.left + (rect.width * 0.5)}px`;
    popup.style.top = `${rect.top}px`;
    popup.offsetHeight;
    popup.classList.add('is-visible');
    trigger.addEventListener
    (
      'mouseleave', () =>
      {
        popup.classList.remove('is-visible');
        setTimeout
        (
          () =>
            {
              if (!popup.classList.contains('is-visible'))
              {
                trigger.appendChild(popup);
              }
            }, 200
          );
      },
      { once: true }
    );
  }
);