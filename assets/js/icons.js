// FunLab — icons.js
// Pustaka icon SVG inline (pengganti emoji). Tanpa library & tanpa file luar,
// jadi tetap jalan saat index.html dibuka langsung dari folder (file://).
//
// Pemakaian di HTML:   <i data-icon="heart"></i>
// Pemakaian di JS:     el.innerHTML = FunIcon.svg('heart');
// Icon otomatis ikut warna teks (currentColor) dan ukuran font (1em).

(function () {
  var P = {
    // ---- Umum ----
    'home': '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    'gamepad': '<path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z"/>',
    'grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
    'arrow-left': '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    'image': '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    'calendar': '<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',

    // ---- Tema game ----
    'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    'sparkles': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/>',
    'smile': '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    'dice': '<rect width="18" height="18" x="3" y="3" rx="3"/><path d="M8 8h.01M16 8h.01M8 16h.01M16 16h.01M12 12h.01"/>',
    'hash': '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
    'eye': '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    'paw': '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
    'wand': '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3M5 6v4M19 14v4M10 2v2M7 8H3M21 16h-4M11 3H9"/>',
    'calculator': '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
    'delete': '<path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/><path d="m18 9-6 6M12 9l6 6"/>',
    'flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    'leaf': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    'wind': '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
    'droplet': '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    'mountain': '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',

    // ---- Kategori uang, karier, sosial, dll ----
    'wallet': '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    'briefcase': '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'message': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',

    // ---- Simbol zodiak (digambar sebagai SVG, bukan karakter emoji) ----
    'z-aries': '<path d="M12 21V9"/><path d="M12 9C12 5 9.5 3.5 7.5 3.5 5.5 3.5 4 5 4 7s1.5 3.5 3 3.5"/><path d="M12 9c0-4 2.5-5.5 4.5-5.5S20 5 20 7s-1.5 3.5-3 3.5"/>',
    'z-taurus': '<circle cx="12" cy="15" r="5"/><path d="M5 3a7 7 0 0 0 14 0"/>',
    'z-gemini': '<path d="M7 5v14M17 5v14"/><path d="M4 4c5 2 11 2 16 0M4 20c5-2 11-2 16 0"/>',
    'z-cancer': '<circle cx="7" cy="10" r="2.5"/><circle cx="17" cy="14" r="2.5"/><path d="M9.5 10C9.5 6.5 12 5 15 5c2.5 0 4.5 1 6 3"/><path d="M14.5 14c0 3.5-2.5 5-5.5 5-2.5 0-4.5-1-6-3"/>',
    'z-leo': '<circle cx="8" cy="16" r="3"/><path d="M11 16C11 9 11 4 15 4s5.500 4 3 9c-1 2-1.500 4-1 5.500s2 2 3.500.500"/>',
    'z-virgo': '<path d="M3 6v12"/><path d="M3 9c0-4 6-4 6 0v9"/><path d="M9 9c0-4 6-4 6 0v9"/><path d="M15 9c0-4 5-4 5 0v6c0 3-2 5-5 5"/>',
    'z-libra': '<path d="M4 20h16"/><path d="M4 16h5.500a6 6 0 1 1 5 0H20"/>',
    'z-scorpio': '<path d="M3 6v12"/><path d="M3 9c0-4 5-4 5 0v9"/><path d="M8 9c0-4 5-4 5 0v9"/><path d="M13 9c0-4 5-4 5 0v9c0 1.500 1.500 2 3 2"/><path d="m18.500 17.500 2.500 2.500-2.500 2"/>',
    'z-sagittarius': '<path d="M5 19 19 5"/><path d="M9 5h10v10"/><path d="m8 12 4 4"/>',
    'z-capricorn': '<path d="M4 6c3 0 3 3 3 6v5"/><path d="M7 9c0-3 3-4 5-2s2 6 4 10"/><path d="M16 17a3 3 0 1 1 3 3"/>',
    'z-aquarius': '<path d="M3 9l3-3 3 3 3-3 3 3 3-3 3 3"/><path d="M3 17l3-3 3 3 3-3 3 3 3-3 3 3"/>',
    'z-pisces': '<path d="M6 3c4 4 4 14 0 18"/><path d="M18 3c-4 4-4 14 0 18"/><path d="M4 12h16"/>'
  };

  var NS = 'http://www.w3.org/2000/svg';

  function svg(name, extraClass) {
    var body = P[name];
    if (!body) return '';
    return '<svg class="fl-icon' + (extraClass ? ' ' + extraClass : '') + '" xmlns="' + NS +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      body + '</svg>';
  }

  function render(root) {
    var scope = root || document;
    var list = scope.querySelectorAll('[data-icon]');
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      var html = svg(el.getAttribute('data-icon'));
      if (html) el.innerHTML = html;
    }
  }

  window.FunIcon = { svg: svg, render: render, has: function (n) { return !!P[n]; }, names: Object.keys(P) };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { render(); });
  } else {
    render();
  }
})();
