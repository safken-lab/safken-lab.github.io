const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
const mobile = matchMedia('(max-width: 790px)');

function syncNavigation(open = false) {
  menu.hidden = !mobile.matches;
  menu.setAttribute('aria-expanded', String(mobile.matches && open));
  navigation.hidden = mobile.matches && !open;
}
menu.addEventListener('click', () => syncNavigation(menu.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || !mobile.matches) return;
  syncNavigation();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    syncNavigation();
    menu.focus();
  }
});
mobile.addEventListener('change', () => syncNavigation());
syncNavigation();

for (const portrait of document.querySelectorAll('.member-avatar img')) {
  portrait.addEventListener('error', () => { portrait.hidden = true; });
  if (portrait.complete && portrait.naturalWidth === 0) portrait.hidden = true;
}

if (location.pathname === '/' && /^#(publications|people|software|teaching|contact)$/.test(location.hash)) {
  location.replace(location.hash.slice(1) + '/');
}
