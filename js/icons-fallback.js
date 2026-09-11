/**
 * Sawana Mobile Care - Embedded Vector Icon Engine (Zero-Dependency Fallback)
 * Renders crisp SVG icons instantly even if external CDNs are completely offline.
 */
(function() {
  const iconDefs = {
  "smartphone": [
    [
      "rect",
      {
        "width": "14",
        "height": "20",
        "x": "5",
        "y": "2",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "path",
      {
        "d": "M12 18h.01"
      }
    ]
  ],
  "chevron-left": [
    [
      "path",
      {
        "d": "m15 18-6-6 6-6"
      }
    ]
  ],
  "chevron-down": [
    [
      "path",
      {
        "d": "m6 9 6 6 6-6"
      }
    ]
  ],
  "layout-dashboard": [
    [
      "rect",
      {
        "width": "7",
        "height": "9",
        "x": "3",
        "y": "3",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "width": "7",
        "height": "5",
        "x": "14",
        "y": "3",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "width": "7",
        "height": "9",
        "x": "14",
        "y": "12",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "width": "7",
        "height": "5",
        "x": "3",
        "y": "16",
        "rx": "1"
      }
    ]
  ],
  "cpu": [
    [
      "path",
      {
        "d": "M12 20v2"
      }
    ],
    [
      "path",
      {
        "d": "M12 2v2"
      }
    ],
    [
      "path",
      {
        "d": "M17 20v2"
      }
    ],
    [
      "path",
      {
        "d": "M17 2v2"
      }
    ],
    [
      "path",
      {
        "d": "M2 12h2"
      }
    ],
    [
      "path",
      {
        "d": "M2 17h2"
      }
    ],
    [
      "path",
      {
        "d": "M2 7h2"
      }
    ],
    [
      "path",
      {
        "d": "M20 12h2"
      }
    ],
    [
      "path",
      {
        "d": "M20 17h2"
      }
    ],
    [
      "path",
      {
        "d": "M20 7h2"
      }
    ],
    [
      "path",
      {
        "d": "M7 20v2"
      }
    ],
    [
      "path",
      {
        "d": "M7 2v2"
      }
    ],
    [
      "rect",
      {
        "x": "4",
        "y": "4",
        "width": "16",
        "height": "16",
        "rx": "2"
      }
    ],
    [
      "rect",
      {
        "x": "8",
        "y": "8",
        "width": "8",
        "height": "8",
        "rx": "1"
      }
    ]
  ],
  "package-check": [
    [
      "path",
      {
        "d": "M12 22V12"
      }
    ],
    [
      "path",
      {
        "d": "m16 17 2 2 4-4"
      }
    ],
    [
      "path",
      {
        "d": "M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753"
      }
    ],
    [
      "path",
      {
        "d": "M3.29 7 12 12l8.71-5"
      }
    ],
    [
      "path",
      {
        "d": "m7.5 4.27 8.997 5.148"
      }
    ]
  ],
  "users": [
    [
      "path",
      {
        "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      }
    ],
    [
      "path",
      {
        "d": "M16 3.128a4 4 0 0 1 0 7.744"
      }
    ],
    [
      "path",
      {
        "d": "M22 21v-2a4 4 0 0 0-3-3.87"
      }
    ],
    [
      "circle",
      {
        "cx": "9",
        "cy": "7",
        "r": "4"
      }
    ]
  ],
  "file-bar-chart": [
    [
      "path",
      {
        "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
      }
    ],
    [
      "path",
      {
        "d": "M14 2v5a1 1 0 0 0 1 1h5"
      }
    ],
    [
      "path",
      {
        "d": "M8 18v-2"
      }
    ],
    [
      "path",
      {
        "d": "M12 18v-4"
      }
    ],
    [
      "path",
      {
        "d": "M16 18v-6"
      }
    ]
  ],
  "settings": [
    [
      "path",
      {
        "d": "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
      }
    ],
    [
      "circle",
      {
        "cx": "12",
        "cy": "12",
        "r": "3"
      }
    ]
  ],
  "search": [
    [
      "path",
      {
        "d": "m21 21-4.34-4.34"
      }
    ],
    [
      "circle",
      {
        "cx": "11",
        "cy": "11",
        "r": "8"
      }
    ]
  ],
  "moon": [
    [
      "path",
      {
        "d": "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      }
    ]
  ],
  "sun": [
    [
      "circle",
      {
        "cx": "12",
        "cy": "12",
        "r": "4"
      }
    ],
    [
      "path",
      {
        "d": "M12 2v2"
      }
    ],
    [
      "path",
      {
        "d": "M12 20v2"
      }
    ],
    [
      "path",
      {
        "d": "m4.93 4.93 1.41 1.41"
      }
    ],
    [
      "path",
      {
        "d": "m17.66 17.66 1.41 1.41"
      }
    ],
    [
      "path",
      {
        "d": "M2 12h2"
      }
    ],
    [
      "path",
      {
        "d": "M20 12h2"
      }
    ],
    [
      "path",
      {
        "d": "m6.34 17.66-1.41 1.41"
      }
    ],
    [
      "path",
      {
        "d": "m19.07 4.93-1.41 1.41"
      }
    ]
  ],
  "bell": [
    [
      "path",
      {
        "d": "M10.268 21a2 2 0 0 0 3.464 0"
      }
    ],
    [
      "path",
      {
        "d": "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
      }
    ]
  ],
  "wrench": [
    [
      "path",
      {
        "d": "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"
      }
    ]
  ],
  "award": [
    [
      "path",
      {
        "d": "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
      }
    ],
    [
      "circle",
      {
        "cx": "12",
        "cy": "8",
        "r": "6"
      }
    ]
  ],
  "activity": [
    [
      "path",
      {
        "d": "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
      }
    ]
  ],
  "shield-check": [
    [
      "path",
      {
        "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
      }
    ],
    [
      "path",
      {
        "d": "m9 12 2 2 4-4"
      }
    ]
  ],
  "check": [
    [
      "path",
      {
        "d": "M20 6 9 17l-5-5"
      }
    ]
  ],
  "trending-up": [
    [
      "path",
      {
        "d": "M16 7h6v6"
      }
    ],
    [
      "path",
      {
        "d": "m22 7-8.5 8.5-5-5L2 17"
      }
    ]
  ],
  "trending-down": [
    [
      "path",
      {
        "d": "M16 17h6v-6"
      }
    ],
    [
      "path",
      {
        "d": "m22 17-8.5-8.5-5 5L2 7"
      }
    ]
  ],
  "download": [
    [
      "path",
      {
        "d": "M12 15V3"
      }
    ],
    [
      "path",
      {
        "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      }
    ],
    [
      "path",
      {
        "d": "m7 10 5 5 5-5"
      }
    ]
  ],
  "download-cloud": [
    [
      "path",
      {
        "d": "M12 13v8l-4-4"
      }
    ],
    [
      "path",
      {
        "d": "m12 21 4-4"
      }
    ],
    [
      "path",
      {
        "d": "M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"
      }
    ]
  ],
  "edit-3": [
    [
      "path",
      {
        "d": "M13 21h8"
      }
    ],
    [
      "path",
      {
        "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ]
  ],
  "plus": [
    [
      "path",
      {
        "d": "M5 12h14"
      }
    ],
    [
      "path",
      {
        "d": "M12 5v14"
      }
    ]
  ],
  "plus-circle": [
    [
      "circle",
      {
        "cx": "12",
        "cy": "12",
        "r": "10"
      }
    ],
    [
      "path",
      {
        "d": "M8 12h8"
      }
    ],
    [
      "path",
      {
        "d": "M12 8v8"
      }
    ]
  ],
  "database": [
    [
      "ellipse",
      {
        "cx": "12",
        "cy": "5",
        "rx": "9",
        "ry": "3"
      }
    ],
    [
      "path",
      {
        "d": "M3 5V19A9 3 0 0 0 21 19V5"
      }
    ],
    [
      "path",
      {
        "d": "M3 12A9 3 0 0 0 21 12"
      }
    ]
  ],
  "x": [
    [
      "path",
      {
        "d": "M18 6 6 18"
      }
    ],
    [
      "path",
      {
        "d": "m6 6 12 12"
      }
    ]
  ],
  "info": [
    [
      "circle",
      {
        "cx": "12",
        "cy": "12",
        "r": "10"
      }
    ],
    [
      "path",
      {
        "d": "M12 16v-4"
      }
    ],
    [
      "path",
      {
        "d": "M12 8h.01"
      }
    ]
  ],
  "check-circle-2": [
    [
      "circle",
      {
        "cx": "12",
        "cy": "12",
        "r": "10"
      }
    ],
    [
      "path",
      {
        "d": "m16 9-5.5 5.5L8 12"
      }
    ]
  ],
  "calendar": [
    [
      "path",
      {
        "d": "M8 2v3"
      }
    ],
    [
      "path",
      {
        "d": "M16 2v3"
      }
    ],
    [
      "rect",
      {
        "x": "3",
        "y": "3",
        "width": "18",
        "height": "18",
        "rx": "2"
      }
    ],
    [
      "path",
      {
        "d": "M3 9h18"
      }
    ]
  ],
  "battery-charging": [
    [
      "path",
      {
        "d": "m11 7-3 5h4l-3 5"
      }
    ],
    [
      "path",
      {
        "d": "M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935"
      }
    ],
    [
      "path",
      {
        "d": "M22 14v-4"
      }
    ],
    [
      "path",
      {
        "d": "M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936"
      }
    ]
  ],
  "zap": [
    [
      "path",
      {
        "d": "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"
      }
    ]
  ],
  "droplets": [
    [
      "path",
      {
        "d": "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"
      }
    ],
    [
      "path",
      {
        "d": "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"
      }
    ]
  ],
  "layers": [
    [
      "path",
      {
        "d": "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
      }
    ],
    [
      "path",
      {
        "d": "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
      }
    ],
    [
      "path",
      {
        "d": "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
      }
    ]
  ]
};

  function renderIconElement(el) {
    const iconName = el.getAttribute('data-lucide') || el.getAttribute('data-icon');
    if (!iconName) return;
    const def = iconDefs[iconName];
    if (!def) return;

    // Determine width/height from style, classes, or attributes
    let width = el.getAttribute('width') || el.style.width || '20px';
    let height = el.getAttribute('height') || el.style.height || '20px';

    // Strip 'px' if present for svg attribute
    const numW = width.replace('px', '').trim() || '20';
    const numH = height.replace('px', '').trim() || '20';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', numW);
    svg.setAttribute('height', numH);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    // Copy classes
    const existingClass = el.getAttribute('class');
    svg.setAttribute('class', ('lucide lucide-' + iconName + ' ' + (existingClass || '')).trim());

    // Copy inline styles if any
    if (el.getAttribute('style')) {
      svg.setAttribute('style', el.getAttribute('style'));
    }

    // Build child nodes
    def.forEach(([tag, attrs]) => {
      const child = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attrs).forEach(([k, v]) => child.setAttribute(k, v));
      svg.appendChild(child);
    });

    el.replaceWith(svg);
  }

  function renderAllIcons(root) {
    const context = root || document;
    // Query both 'i[data-lucide]' and already created elements
    const elements = context.querySelectorAll('i[data-lucide], [data-icon]');
    elements.forEach(renderIconElement);
  }

  window.SawanaIcons = {
    render: renderAllIcons,
    renderIcon: renderIconElement
  };

  // Auto-run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => renderAllIcons());
  } else {
    renderAllIcons();
  }

  // Also run on window load to catch late elements
  window.addEventListener('load', () => renderAllIcons());
})();
