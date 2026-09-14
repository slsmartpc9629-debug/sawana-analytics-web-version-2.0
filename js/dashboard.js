/**
 * Mobile Phone Repair Analytics Dashboard - Master Controller
 * Features:
 * - Interactive Brand Search Dropdown with automatic brand listing & single-ruler focus.
 * - Month-by-month phone model item breakdown for the selected brand.
 * - In-System Repair Data Editor Modal (Add/edit models or direct brand totals, localStorage persistence).
 */

// Application Build Release Version (Strictly codebase controlled)
const APP_RELEASE_VERSION = '1.6';

document.addEventListener('DOMContentLoaded', () => {
  // Load any previously saved custom data from localStorage
  loadPersistedData();

  // Helper to render icons using Lucide or fallback SVG engine
  function renderAppIcons(root = document) {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons({ root });
      } catch (e) {
        console.warn('Lucide icon notice:', e);
      }
    }
    if (window.SawanaIcons && typeof window.SawanaIcons.render === 'function') {
      try {
        window.SawanaIcons.render(root);
      } catch (e) {
        console.warn('SawanaIcons notice:', e);
      }
    }
  }

  // Initialize Icons across entire page
  renderAppIcons();

  // Initialize Notification & Versioning System
  initNotificationSystem();

  // Initialize Charts
  window.RepairCharts.init();

  // Initialize UI components
  initBrandSearchDropdown();
  renderBrandModelsPanel(window.RepairCharts.selectedBrand);
  renderBrandMonthlyItemsTable(window.RepairCharts.selectedBrand);
  setupDashboardEvents();
  initDataEditor();
  initBrandsManager();
  initBrandMultiFilter();
  initA4LandscapePdfPrint();
  initNavigationTabs();
  initSettingsTab();
  initKpiCardsToggle();
  initTheme();

  function getAppVersion() {
    return APP_RELEASE_VERSION;
  }

  function updateVersionBadges(ver = APP_RELEASE_VERSION) {
    const headerPill = document.getElementById('appVersionText');
    if (headerPill) headerPill.textContent = `v${ver}`;
    const dropdownPill = document.getElementById('notifDropdownVersionPill');
    if (dropdownPill) dropdownPill.textContent = `v${ver}`;
    const settingsBadge = document.getElementById('settingsVersionBadge');
    if (settingsBadge) settingsBadge.textContent = `v${ver}`;
  }

  function logSystemUpdate(title, details) {
    const currentV = getAppVersion();
    updateVersionBadges(currentV);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotif = {
      id: Date.now(),
      version: `v${currentV}`,
      title: title,
      details: details || '',
      time: timeStr,
      timestamp: Date.now()
    };

    let notifications = [];
    try {
      const saved = localStorage.getItem('sawana_app_notifications');
      if (saved) notifications = JSON.parse(saved);
    } catch (e) {
      notifications = [];
    }

    notifications.unshift(newNotif);
    if (notifications.length > 50) notifications = notifications.slice(0, 50);

    try {
      localStorage.setItem('sawana_app_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Could not save notifications', e);
    }

    renderNotificationsList();

    // Show unread indicator dot
    const badge = document.querySelector('#notificationBtn .notification-badge');
    if (badge) badge.style.display = 'block';

    showToast(`🔔 Update Logged (${newNotif.version}): ${title}`, 'success');
  }

  function renderNotificationsList() {
    const container = document.getElementById('notificationsListContainer');
    if (!container) return;

    let notifications = [];
    try {
      const saved = localStorage.getItem('sawana_app_notifications');
      if (saved) notifications = JSON.parse(saved);
    } catch (e) {
      notifications = [];
    }

    if (!notifications || notifications.length === 0) {
      const curV = getAppVersion();
      notifications = [
        {
          id: 1,
          version: `v${curV}`,
          title: 'Sawana Analytics Initialized',
          details: 'Aug 2025 – Aug 2026 active timeline with 24M rolling FIFO.',
          time: 'Ready'
        }
      ];
      localStorage.setItem('sawana_app_notifications', JSON.stringify(notifications));
    }

    container.innerHTML = notifications.map(n => `
      <div class="notification-item">
        <div class="notification-header-line">
          <span class="notification-item-ver">${n.version || 'v1.5'}</span>
          <span class="notification-time">${n.time || ''}</span>
        </div>
        <div class="notification-title">${n.title}</div>
        ${n.details ? `<div class="notification-desc">${n.details}</div>` : ''}
      </div>
    `).join('');
  }

  function initNotificationSystem() {
    const curV = getAppVersion();
    updateVersionBadges(curV);
    renderNotificationsList();

    const notifBtn = document.getElementById('notificationBtn');
    const notifDropdown = document.getElementById('notificationsDropdown');
    const closeBtn = document.getElementById('closeNotifDropdownBtn');
    const clearBtn = document.getElementById('clearNotificationsBtn');

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cur = getAppVersion();
        const initialList = [
          {
            id: Date.now(),
            version: `v${cur}`,
            title: 'Activity Log Cleared',
            details: 'History reset. Future actions will continue incrementing from v' + cur + '.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
        localStorage.setItem('sawana_app_notifications', JSON.stringify(initialList));
        renderNotificationsList();
        showToast('Notifications cleared', 'info');
      });
    }

    if (closeBtn && notifDropdown) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.remove('show');
      });
    }

    if (notifBtn) {
      notifBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const badge = notifBtn.querySelector('.notification-badge');
        if (badge) badge.style.display = 'none';

        // Load latest update to display as animated UI widget from icon
        let notifications = [];
        try {
          const saved = localStorage.getItem('sawana_app_notifications');
          if (saved) notifications = JSON.parse(saved);
        } catch (err) {}

        const latest = (notifications && notifications.length > 0)
          ? notifications[0]
          : { title: 'Sawana Care Updates', details: 'All repair metrics, charts & models synced and operational.' };

        showToast(`${latest.title}${latest.details ? ' — ' + latest.details : ''}`, 'info');
      });
    }
  }

  /**
   * Helper to persist months & brands to localStorage and Cloud
   */
  function persistAllData() {
    try {
      localStorage.setItem('phonecare_custom_months', JSON.stringify(window.RepairData.months));
      localStorage.setItem('phonecare_custom_brands', JSON.stringify(window.RepairData.brands));
    } catch (err) {
      console.warn('Could not save to localStorage', err);
    }

    // Cloud Firestore Sync
    if (window.SawanaCloud && window.SawanaCloud.isCloudReady()) {
      window.SawanaCloud.saveToCloud({
        months: window.RepairData.months,
        brands: window.RepairData.brands
      });
    }
  }

  /**
   * Dynamically update timeline headers, subtitles, and badges based on current months
   */
  function updateDashboardTimelineBadges() {
    const months = window.RepairData.months;
    const firstM = months[0] || 'Aug 2025';
    const lastM = months[months.length - 1] || 'Aug 2026';
    const total = months.length;

    // Header badge (clean date range only, no Max 24 text)
    const headerBadge = document.getElementById('timelineHeaderBadge');
    if (headerBadge) {
      headerBadge.textContent = `${firstM} – ${lastM}`;
    }

    // Settings tab timeline info badge
    const settingsTimelineInfo = document.getElementById('settingsTimelineInfo');
    if (settingsTimelineInfo) {
      settingsTimelineInfo.textContent = `${firstM} – ${lastM} (${total} / 24 Months)`;
    }

    // Range button "All"
    const rangeAllBtn = document.getElementById('rangeBtnAll');
    if (rangeAllBtn) {
      rangeAllBtn.textContent = 'All';
    }



    const gridLabel = document.getElementById('editorMonthsGridLabel');
    if (gridLabel) {
      gridLabel.textContent = `Monthly Repair Counts`;
    }
  }

  /**
   * Load custom data from localStorage if user previously edited it
   */
  function loadPersistedData() {
    try {
      // 1. Load saved months array if any
      const savedMonths = localStorage.getItem('phonecare_custom_months');
      if (savedMonths) {
        const parsedMonths = JSON.parse(savedMonths);
        if (Array.isArray(parsedMonths) && parsedMonths.length >= 1) {
          window.RepairData.months = parsedMonths.slice(-24); // enforce max 24
        }
      }

      // Explicitly remove "Sep 2026" from saved timeline if present
      const sepIdx = window.RepairData.months.indexOf("Sep 2026");
      if (sepIdx !== -1) {
        window.RepairData.months.splice(sepIdx, 1);
        localStorage.setItem('phonecare_custom_months', JSON.stringify(window.RepairData.months));
      }

      // 2. Load saved brands
      const saved = localStorage.getItem('phonecare_custom_brands');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const currentLen = window.RepairData.months.length;
          Object.keys(parsed).forEach(k => {
            if (window.RepairData.brands[k]) {
              const customBrand = parsed[k];
              if (Array.isArray(customBrand.monthlyRepairs)) {
                if (customBrand.monthlyRepairs.length !== currentLen) {
                  customBrand.monthlyRepairs = customBrand.monthlyRepairs.slice(-currentLen);
                  while (customBrand.monthlyRepairs.length < currentLen) {
                    customBrand.monthlyRepairs.unshift(0);
                  }
                }
              }
              if (customBrand.models) {
                Object.keys(customBrand.models).forEach(mKey => {
                  if (Array.isArray(customBrand.models[mKey])) {
                    if (customBrand.models[mKey].length !== currentLen) {
                      customBrand.models[mKey] = customBrand.models[mKey].slice(-currentLen);
                      while (customBrand.models[mKey].length < currentLen) {
                        customBrand.models[mKey].unshift(0);
                      }
                    }
                  }
                });
              }
              window.RepairData.brands[k] = customBrand;
            }
          });
        }
      }
    } catch (e) {
      console.warn('Could not load custom repair data from localStorage', e);
    }

    // Subscribe to Sawana Cloud Firestore for multi-device real-time sync
    if (window.SawanaCloud && window.SawanaCloud.isCloudReady()) {
      window.SawanaCloud.subscribeToCloud((cloudData) => {
        if (cloudData && typeof cloudData === 'object') {
          if (cloudData.months && Array.isArray(cloudData.months)) {
            window.RepairData.months = cloudData.months.slice(-24);
          }
          const brandsMap = cloudData.brands || cloudData;
          if (brandsMap && typeof brandsMap === 'object') {
            Object.keys(brandsMap).forEach(k => {
              if (window.RepairData.brands[k]) {
                window.RepairData.brands[k] = brandsMap[k];
              }
            });
          }
          updateDashboardTimelineBadges();
          window.RepairCharts.renderRepairTimelineChart();
          window.RepairCharts.renderBrandShareDonut();
          renderBrandMonthlyItemsTable(window.RepairCharts.selectedBrand);
          showToast('☁️ Sawana Cloud: Live sync updated from cloud database', 'info');
        }
      });
    }
  }

  /**
   * Interactive Brand Search Dropdown
   * Clicking/focusing automatically shows the brands list.
   * Selecting a brand plots only that brand's ruler/curve and displays its monthly item breakdown.
   */
  function initBrandSearchDropdown() {
    const input = document.getElementById('brandSearchInput');
    const dropdown = document.getElementById('brandDropdownMenu');
    const clearBtn = document.getElementById('brandSearchClearBtn');
    const activeBrandIndicator = document.getElementById('activeBrandBadge');
    if (!input || !dropdown) return;

    const brands = window.RepairData.brands;

    // Helper to render dropdown list items
    function populateList(query = '') {
      const q = query.toLowerCase().trim();
      const keys = Object.keys(brands).filter(k => 
        k.toLowerCase().includes(q) || brands[k].name.toLowerCase().includes(q)
      );

      let html = '';

      if (keys.length === 0) {
        html += `<div style="padding: 0.8rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">No brand found matching "${query}"</div>`;
      } else {
        keys.forEach(k => {
          const b = brands[k];
          const isSelected = window.RepairCharts.selectedBrand === k;
          const totalRepairs = b.monthlyRepairs.reduce((a, v) => a + v, 0);
          const modelCount = Object.keys(b.models || {}).length;

          html += `
            <div class="brand-dropdown-item ${isSelected ? 'active' : ''}" data-brand="${k}">
              <span class="dropdown-item-left">
                <span class="chip-dot" style="background: ${b.color}; box-shadow: 0 0 10px ${b.color};"></span>
                <span class="dropdown-brand-name">${b.name}</span>
                <span style="font-size: 0.72rem; color: var(--text-muted);">${modelCount > 0 ? `(${modelCount} models)` : '(Direct Brand)'}</span>
              </span>
              <span class="dropdown-badge" style="background: ${b.color}22; color: ${b.color}; border: 1px solid ${b.color}44;">
                ${totalRepairs} Repairs
              </span>
            </div>
          `;
        });
      }

      dropdown.innerHTML = html;

      // Attach click handlers to dropdown items
      dropdown.querySelectorAll('.brand-dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const selected = item.getAttribute('data-brand');
          selectBrand(selected);
          closeDropdown();
        });
      });
    }

    // Select a brand action
    function selectBrand(brandKey) {
      window.RepairCharts.setBrand(brandKey);
      
      if (brandKey === 'ALL') {
        input.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        if (activeBrandIndicator) {
          activeBrandIndicator.textContent = 'All 16 Brands Overview';
          activeBrandIndicator.style.background = 'rgba(99, 102, 241, 0.2)';
          activeBrandIndicator.style.color = '#818cf8';
        }
        renderBrandMonthlyItemsTable('SAMSUNG');
        renderBrandModelsPanel('ALL');
        showToast('Timeline: All 16 brands overview', 'info');
      } else {
        const b = brands[brandKey];
        if (!b) return;
        input.value = b.name;
        if (clearBtn) clearBtn.style.display = 'inline-flex';
        if (activeBrandIndicator) {
          activeBrandIndicator.textContent = `${b.name} Focused`;
          activeBrandIndicator.style.background = `${b.color}25`;
          activeBrandIndicator.style.color = b.color;
        }
        renderBrandMonthlyItemsTable(brandKey);
        renderBrandModelsPanel(brandKey);
        const mList = window.RepairData.months;
        showToast(`Timeline focused: ${b.name} repair ruler (${mList[0]} – ${mList[mList.length - 1]})`, 'success');
      }

      populateList('');
    }

    // Open dropdown on click / focus
    function openDropdown() {
      populateList(input.value.trim());
      dropdown.classList.add('show');
    }

    function closeDropdown() {
      dropdown.classList.remove('show');
    }

    input.addEventListener('focus', openDropdown);
    input.addEventListener('click', openDropdown);

    // Live search filter inside dropdown
    input.addEventListener('input', (e) => {
      openDropdown();
      populateList(e.target.value);
      if (e.target.value.trim() === '') {
        if (clearBtn) clearBtn.style.display = 'none';
        if (window.RepairCharts.selectedBrand !== 'ALL') {
          selectBrand('ALL');
        }
      } else {
        if (clearBtn) clearBtn.style.display = 'inline-flex';
      }
    });

    // Clear icon button (x) click resets to ALL
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        input.value = '';
        selectBrand('ALL');
        closeDropdown();
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target) && (!clearBtn || !clearBtn.contains(e.target))) {
        closeDropdown();
      }
    });

    // Set initial default value to ALL (Clean input, empty so placeholder shows, clear button hidden)
    window.RepairCharts.selectedBrand = 'ALL';
    input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    if (activeBrandIndicator) {
      activeBrandIndicator.textContent = 'All 16 Brands Overview';
      activeBrandIndicator.style.background = 'rgba(99, 102, 241, 0.2)';
      activeBrandIndicator.style.color = '#818cf8';
    }
    populateList('');
  }

  /**
   * Multi-Brand Filter Dropdown Popover
   * Allows selecting any subset of brands (e.g. 1, 3, or all 16) to compare on the timeline chart.
   */
  function initBrandMultiFilter() {
    const wrap = document.getElementById('brandFilterDropdownWrap');
    const toggleBtn = document.getElementById('brandFilterDropdownBtn');
    const popover = document.getElementById('brandFilterPopover');
    const list = document.getElementById('brandFilterCheckboxList');
    const countBadge = document.getElementById('filterSelectedCountBadge');
    const btnText = document.getElementById('brandFilterBtnText');
    const searchInput = document.getElementById('brandFilterSearchInput');
    const selectAllBtn = document.getElementById('filterSelectAllBtn');
    const clearAllBtn = document.getElementById('filterClearAllBtn');

    if (!toggleBtn || !popover || !list) return;

    function getSelectedKeys() {
      if (!window.RepairCharts.selectedBrands || window.RepairCharts.selectedBrands.length === 0) {
        if (window.RepairCharts.selectedBrand && window.RepairCharts.selectedBrand !== 'ALL') {
          return [window.RepairCharts.selectedBrand];
        }
        return Object.keys(window.RepairData.brands);
      }
      return window.RepairCharts.selectedBrands;
    }

    function renderList(query = '') {
      const brands = window.RepairData.brands;
      const allKeys = Object.keys(brands);
      const selected = getSelectedKeys();
      const q = query.toLowerCase().trim();

      const filteredKeys = allKeys.filter(k => 
        k.toLowerCase().includes(q) || brands[k].name.toLowerCase().includes(q)
      );

      if (filteredKeys.length === 0) {
        list.innerHTML = `<div style="padding: 0.8rem; text-align: center; color: var(--text-muted); font-size: 0.78rem;">No brand matches "${query}"</div>`;
        return;
      }

      let html = '';
      filteredKeys.forEach(k => {
        const b = brands[k];
        const isChecked = selected.includes(k);
        const total = (b.monthlyRepairs || []).reduce((acc, v) => acc + (v || 0), 0);
        html += `
          <label class="filter-brand-item" data-key="${k}">
            <input type="checkbox" value="${k}" class="brand-filter-check" ${isChecked ? 'checked' : ''} />
            <span class="brand-dot" style="background: ${b.color};"></span>
            <span class="brand-name-text">${b.name}</span>
            <span class="brand-units-badge">${total}U</span>
          </label>
        `;
      });

      list.innerHTML = html;

      // Checkbox change handlers
      list.querySelectorAll('.brand-filter-check').forEach(chk => {
        chk.addEventListener('change', () => {
          const currentlySelected = Array.from(list.querySelectorAll('.brand-filter-check:checked')).map(c => c.value);
          const currentVisibleKeys = filteredKeys;
          const previouslySelectedOtherKeys = selected.filter(k => !currentVisibleKeys.includes(k));
          const finalSelected = Array.from(new Set([...previouslySelectedOtherKeys, ...currentlySelected]));

          window.RepairCharts.setSelectedBrands(finalSelected);
          syncUI();
        });
      });
    }

    function syncUI() {
      const allKeys = Object.keys(window.RepairData.brands);
      const selected = getSelectedKeys();

      // Update button text (No brand count numbers)
      if (selected.length === allKeys.length) {
        btnText.textContent = 'All Brands';
      } else if (selected.length === 1) {
        const bName = window.RepairData.brands[selected[0]]?.name || selected[0];
        btnText.textContent = bName;
      } else {
        btnText.textContent = 'Filter Brands';
      }
      if (countBadge) {
        countBadge.style.display = 'none';
      }

      // Checkboxes in list
      list.querySelectorAll('.brand-filter-check').forEach(chk => {
        chk.checked = selected.includes(chk.value);
      });
    }
    window.SawanaSyncBrandFilterUI = syncUI;

    // Toggle popover
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = popover.classList.contains('show');
      if (isOpen) {
        popover.classList.remove('show');
      } else {
        renderList(searchInput ? searchInput.value : '');
        syncUI();
        popover.classList.add('show');
        renderAppIcons(popover);
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (wrap && !wrap.contains(e.target)) {
        popover.classList.remove('show');
      }
    });

    // Search filter input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderList(e.target.value);
      });
    }

    // Select All
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const allKeys = Object.keys(window.RepairData.brands);
        window.RepairCharts.setSelectedBrands(allKeys);
        syncUI();
      });
    }

    // Clear All
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.RepairCharts.setSelectedBrands([]);
        syncUI();
      });
    }

    // Initial render & sync
    renderList();
    syncUI();
  }
  /**
   * Generates a high-precision, vector-perfect A4 Landscape SVG chart report
   * strictly matching the user's reference design with exact proportions, crisp grid,
   * smooth spline curves, and centered bottom legend.
   */
  function buildA4LandscapeReportSvg(activeMonths, selectedKeys, brands) {
    const width = 1120;
    const height = 750;

    // Boundaries
    const titleY = 55;
    const subTitleY = 85;

    const chartLeft = 70;
    const chartRight = 1070;
    const chartTop = 130;
    const chartBottom = 600;
    const chartWidth = chartRight - chartLeft;
    const chartHeight = chartBottom - chartTop;

    // Calculate maximum value across all selected brands
    let maxVal = 0;
    selectedKeys.forEach(k => {
      const b = brands[k];
      if (!b) return;
      const data = (b.monthlyRepairs || []).slice(-activeMonths.length);
      data.forEach(v => {
        const num = Number(v);
        if (!isNaN(num) && num > maxVal) maxVal = num;
      });
    });

    // Dynamic Y-axis steps: 5, 10, or clean multiples
    let yStep = 5;
    if (maxVal <= 10) yStep = 2;
    else if (maxVal <= 25) yStep = 5;
    else if (maxVal <= 50) yStep = 10;
    else yStep = Math.ceil(maxVal / 5);

    const yMax = Math.max(yStep, Math.ceil((maxVal + 1) / yStep) * yStep);
    const yTicks = [];
    for (let val = 0; val <= yMax; val += yStep) {
      yTicks.push(val);
    }

    const getX = (index) => {
      if (activeMonths.length <= 1) return chartLeft + chartWidth / 2;
      return chartLeft + (index / (activeMonths.length - 1)) * chartWidth;
    };

    const getY = (val) => {
      const clampedVal = Math.max(0, Math.min(yMax, val));
      return chartBottom - (clampedVal / yMax) * chartHeight;
    };

    // Cubic Bezier Catmull-Rom Spline generator
    const getSplinePath = (pts) => {
      if (!pts || pts.length === 0) return '';
      if (pts.length === 1) return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];

        let cp1x = p1.x + (p2.x - p0.x) / 5.2;
        let cp1y = p1.y + (p2.y - p0.y) / 5.2;
        let cp2x = p2.x - (p3.x - p1.x) / 5.2;
        let cp2y = p2.y - (p3.y - p1.y) / 5.2;

        // Clamp so spline doesn't wobble below the 0 axis line
        if (p1.y >= chartBottom - 0.5 && p2.y >= chartBottom - 0.5) {
          cp1y = chartBottom;
          cp2y = chartBottom;
        } else {
          if (cp1y > chartBottom) cp1y = chartBottom;
          if (cp2y > chartBottom) cp2y = chartBottom;
        }

        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
      return d;
    };

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background:#ffffff; font-family:'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">\n`;

    svg += `  <defs>
    <style>
      .grid-line { stroke: #cbd5e1; stroke-dasharray: 4 4; stroke-width: 0.9; }
      .axis-line { stroke: #94a3b8; stroke-width: 1.2; }
      .axis-label { font-size: 11px; fill: #334155; font-weight: 500; font-family: 'Outfit', sans-serif; }
      .y-title { font-size: 12px; font-weight: 700; fill: #0f172a; font-family: 'Outfit', sans-serif; }
      .brand-line { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    </style>
  </defs>\n`;

    // Title & Date Subtitle
    const isSingle = (selectedKeys.length === 1);
    const isAll = (selectedKeys.length === Object.keys(brands).length);
    let titleText = 'Mobile Brands Overview';
    if (isSingle) {
      const b = brands[selectedKeys[0]];
      titleText = `${b ? b.name : selectedKeys[0]} Monthly Repair Trend`;
    } else if (!isAll) {
      titleText = 'Mobile Repair Brands Comparison';
    }

    const dateRangeText = (activeMonths.length > 0)
      ? `${activeMonths[0]} – ${activeMonths[activeMonths.length - 1]}`
      : 'Aug 2025 – Aug 2026';

    svg += `  <!-- Header -->
  <text x="${width / 2}" y="${titleY}" text-anchor="middle" font-size="32" font-weight="800" fill="#000000" letter-spacing="-0.5">${titleText}</text>
  <text x="${width / 2}" y="${subTitleY}" text-anchor="middle" font-size="16" font-weight="700" fill="#0f172a">${dateRangeText}</text>\n`;

    // Y-Axis Horizontal Dashed Grid & Tick Labels
    svg += `  <!-- Y-Axis Grid & Labels -->\n`;
    yTicks.forEach(val => {
      const y = getY(val);
      svg += `  <line x1="${chartLeft}" y1="${y.toFixed(1)}" x2="${chartRight}" y2="${y.toFixed(1)}" class="grid-line" />\n`;
      svg += `  <text x="${chartLeft - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="axis-label">${val}</text>\n`;
    });

    // Y-Axis Title: "Number of Repairs"
    svg += `  <text x="${chartLeft - 42}" y="${(chartTop + chartBottom) / 2}" text-anchor="middle" transform="rotate(-90 ${chartLeft - 42} ${(chartTop + chartBottom) / 2})" class="y-title">Number of Repairs</text>\n`;

    // X-Axis Vertical Dashed Grid & Month Labels
    svg += `  <!-- X-Axis Grid & Labels -->\n`;
    activeMonths.forEach((m, idx) => {
      const x = getX(idx);
      svg += `  <line x1="${x.toFixed(1)}" y1="${chartTop}" x2="${x.toFixed(1)}" y2="${chartBottom}" class="grid-line" />\n`;
      svg += `  <line x1="${x.toFixed(1)}" y1="${chartBottom}" x2="${x.toFixed(1)}" y2="${chartBottom + 6}" class="axis-line" />\n`;
      svg += `  <text x="${x.toFixed(1)}" y="${chartBottom + 18}" text-anchor="end" transform="rotate(-45 ${x.toFixed(1)} ${chartBottom + 18})" class="axis-label">${m}</text>\n`;
    });

    // Outer Axis Lines (Left Y and Bottom X)
    svg += `  <!-- Axes Borders -->
  <line x1="${chartLeft}" y1="${chartTop}" x2="${chartLeft}" y2="${chartBottom}" class="axis-line" />
  <line x1="${chartLeft}" y1="${chartBottom}" x2="${chartRight}" y2="${chartBottom}" class="axis-line" />\n`;

    // Brand Spline Curves
    svg += `  <!-- Brand Spline Curves -->\n`;
    selectedKeys.forEach(k => {
      const b = brands[k];
      if (!b) return;
      const data = (b.monthlyRepairs || []).slice(-activeMonths.length);
      const pts = [];
      activeMonths.forEach((m, idx) => {
        const val = (data[idx] !== undefined) ? Number(data[idx]) : 0;
        pts.push({ x: getX(idx), y: getY(val) });
      });

      const d = getSplinePath(pts);
      const strokeWidth = selectedKeys.length > 8 ? 2.2 : (isSingle ? 3.2 : 2.8);
      svg += `  <path d="${d}" class="brand-line" stroke="${b.color}" stroke-width="${strokeWidth}" />\n`;
    });

    // Bottom Centered Legend
    svg += `  <!-- Bottom Legend -->\n`;
    const legendItems = selectedKeys.map(k => brands[k]).filter(Boolean);
    const itemWidths = legendItems.map(item => 14 + item.name.length * 7.5 + 16);
    const totalLegendWidth = itemWidths.reduce((a, b) => a + b, 0);

    if (totalLegendWidth <= chartWidth + 40) {
      let curX = (width - totalLegendWidth) / 2;
      const legY = height - 40;
      legendItems.forEach((item, i) => {
        const dotX = curX + 5;
        const textX = dotX + 11;
        svg += `  <circle cx="${dotX.toFixed(1)}" cy="${(legY - 4).toFixed(1)}" r="4.5" fill="${item.color}" />\n`;
        svg += `  <text x="${textX.toFixed(1)}" y="${legY.toFixed(1)}" font-size="11.5" font-weight="600" fill="#0f172a">${item.name}</text>\n`;
        curX += itemWidths[i];
      });
    } else {
      const half = Math.ceil(legendItems.length / 2);
      const row1 = legendItems.slice(0, half);
      const row2 = legendItems.slice(half);

      const r1Width = row1.map(item => 14 + item.name.length * 7.5 + 16).reduce((a, b) => a + b, 0);
      const r2Width = row2.map(item => 14 + item.name.length * 7.5 + 16).reduce((a, b) => a + b, 0);

      let curX1 = (width - r1Width) / 2;
      const legY1 = height - 48;
      row1.forEach((item) => {
        const w = 14 + item.name.length * 7.5 + 16;
        svg += `  <circle cx="${(curX1 + 5).toFixed(1)}" cy="${(legY1 - 4).toFixed(1)}" r="4.5" fill="${item.color}" />\n`;
        svg += `  <text x="${(curX1 + 16).toFixed(1)}" y="${legY1.toFixed(1)}" font-size="11.5" font-weight="600" fill="#0f172a">${item.name}</text>\n`;
        curX1 += w;
      });

      let curX2 = (width - r2Width) / 2;
      const legY2 = height - 26;
      row2.forEach((item) => {
        const w = 14 + item.name.length * 7.5 + 16;
        svg += `  <circle cx="${(curX2 + 5).toFixed(1)}" cy="${(legY2 - 4).toFixed(1)}" r="4.5" fill="${item.color}" />\n`;
        svg += `  <text x="${(curX2 + 16).toFixed(1)}" y="${legY2.toFixed(1)}" font-size="11.5" font-weight="600" fill="#0f172a">${item.name}</text>\n`;
        curX2 += w;
      });
    }

    svg += `</svg>`;
    return svg;
  }

  /**
   * Trigger clean isolated A4 landscape print via dedicated hidden iframe
   * Completely eliminates blank preview issues in Chrome/Edge browsers.
   */
  function triggerCleanA4Print(svgHtml) {
    let iframe = document.getElementById('sawanaPrintIframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'sawanaPrintIframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sawana Care — Mobile Repair Analytics</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 4mm 6mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      width: 100%;
      height: 100%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif;
    }
    svg {
      width: 100%;
      height: 100%;
      max-width: 285mm;
      max-height: 202mm;
      display: block;
    }
  </style>
</head>
<body>
  ${svgHtml}
</body>
</html>`);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 280);
  }

  /**
   * Direct A4 Landscape PDF Download using jsPDF + high-res canvas rasterization
   */
  function triggerDownloadReportPdf(svgHtml, fileName = 'Sawana_Care_Repair_Analytics.pdf') {
    showToast('Generating A4 Landscape PDF...', 'info');
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      showToast('Loading PDF generator, please retry in a moment...', 'warning');
      return;
    }

    const svgBlob = new Blob([svgHtml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      // 2376 x 1680 delivers crisp high-resolution 200+ DPI on standard A4 landscape
      const canvas = document.createElement('canvas');
      canvas.width = 2376;
      canvas.height = 1680;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      pdf.save(fileName);
      showToast('A4 Landscape PDF downloaded successfully!', 'success');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      showToast('Failed to rasterize PDF preview image', 'error');
    };

    img.src = url;
  }

  /**
   * A4 Landscape Print & PDF Export Engine
   * Formats the report strictly for 297mm x 210mm Landscape with high-contrast vector fidelity.
   */
  function initA4LandscapePdfPrint() {
    const printButtons = document.querySelectorAll('.btn-print-a4-pdf, #printTimelinePdfBtn, #printTimelinePdfChartBtn');
    const downloadButtons = document.querySelectorAll('#downloadTimelinePdfBtn');

    function getReportSvg() {
      const months = window.RepairData.months;
      let sliceCount = months.length;
      if (window.RepairCharts.currentRangeMonths !== 'ALL' && typeof window.RepairCharts.currentRangeMonths === 'number') {
        sliceCount = Math.min(months.length, window.RepairCharts.currentRangeMonths);
      }
      const startIndex = Math.max(0, months.length - sliceCount);
      const activeMonths = months.slice(startIndex);

      const allBrandKeys = Object.keys(window.RepairData.brands);
      let selectedKeys = window.RepairCharts.selectedBrands;
      if (!selectedKeys || selectedKeys.length === 0) {
        selectedKeys = (window.RepairCharts.selectedBrand && window.RepairCharts.selectedBrand !== 'ALL')
          ? [window.RepairCharts.selectedBrand]
          : allBrandKeys;
      }
      return buildA4LandscapeReportSvg(activeMonths, selectedKeys, window.RepairData.brands);
    }

    const handlePrint = () => {
      const svgHtml = getReportSvg();
      // Keep DOM container updated as well
      const printContainer = document.getElementById('printReportContainer');
      if (printContainer) {
        printContainer.innerHTML = svgHtml;
      }
      showToast('Opening A4 Landscape Print Preview...', 'info');
      triggerCleanA4Print(svgHtml);
    };

    const handleDownload = () => {
      const svgHtml = getReportSvg();
      const brandKey = window.RepairCharts.selectedBrand;
      const brandName = (brandKey && brandKey !== 'ALL' && brandKey !== 'MULTI' && window.RepairData.brands[brandKey])
        ? window.RepairData.brands[brandKey].name.replace(/\s+/g, '_')
        : 'All_Brands';
      const fileName = `Sawana_Care_${brandName}_Repair_Analytics_${Date.now()}.pdf`;
      triggerDownloadReportPdf(svgHtml, fileName);
    };

    printButtons.forEach(btn => {
      btn.addEventListener('click', handlePrint);
    });

    downloadButtons.forEach(btn => {
      btn.addEventListener('click', handleDownload);
    });
  }

  /**
   * Render Monthly Items / Repaired Phone Models Table for Selected Brand
   * Shows all 24 months (Oct 2024 - Sep 2026) with exact repaired item counts per model
   */
  function renderBrandMonthlyItemsTable(brandKey) {
    const brand = window.RepairData.brands[brandKey] || window.RepairData.brands['SAMSUNG'];
    const months = window.RepairData.months;

    // Update Title & Subtitle
    const titleEl = document.getElementById('brandMonthlyTableTitle');
    const subtitleEl = document.getElementById('brandMonthlyTableSubtitle');
    const brandBadgeEl = document.getElementById('tableBrandBadge');

    if (titleEl) {
      titleEl.textContent = `${brand.name} — Monthly Repaired Items Breakdown`;
    }
    if (subtitleEl) {
      subtitleEl.textContent = `Month-by-month repair item counts and model distribution for ${brand.name} (${months[0]} – ${months[months.length - 1]} • ${months.length} Months).`;
    }
    if (brandBadgeEl) {
      brandBadgeEl.textContent = `${brand.name}`;
      brandBadgeEl.style.background = `${brand.color}22`;
      brandBadgeEl.style.color = brand.color;
      brandBadgeEl.style.border = `1px solid ${brand.color}55`;
    }

    // Render Model Summary Cards Row
    const modelsSummaryContainer = document.getElementById('brandModelsSummaryRow');
    if (modelsSummaryContainer) {
      const modelNames = Object.keys(brand.models || {});
      if (modelNames.length > 0) {
        modelsSummaryContainer.style.display = 'grid';
        modelsSummaryContainer.innerHTML = modelNames.map(model => {
          const totalUnits = brand.models[model].reduce((acc, count) => acc + count, 0);
          const avgUnits = (totalUnits / months.length).toFixed(1);
          return `
            <div class="model-summary-card">
              <div class="model-card-header">
                <span class="model-name">${model}</span>
                <span class="model-badge" style="background: ${brand.color}18; color: ${brand.color};">
                  ${totalUnits} Units
                </span>
              </div>
              <div class="model-card-stats">
                <span>Avg: <strong>${avgUnits}/mo</strong></span>
                <span>${months.length}-Mo Total</span>
              </div>
            </div>
          `;
        }).join('');
      } else {
        // Direct brand without models
        const totalUnits = brand.monthlyRepairs.reduce((a, v) => a + v, 0);
        const avgUnits = (totalUnits / months.length).toFixed(1);
        modelsSummaryContainer.style.display = 'grid';
        modelsSummaryContainer.innerHTML = `
          <div class="model-summary-card" style="grid-column: 1 / -1;">
            <div class="model-card-header">
              <span class="model-name">${brand.name} (Direct Brand Total)</span>
              <span class="model-badge" style="background: ${brand.color}18; color: ${brand.color};">${totalUnits} Units Total</span>
            </div>
            <div class="model-card-stats">
              <span>Avg: <strong>${avgUnits} Units/mo</strong> across ${months.length} months</span>
              <span>Direct Items Log</span>
            </div>
          </div>
        `;
      }
    }

    // Render Table Rows (24 Months)
    const tbody = document.getElementById('brandMonthlyTableBody');
    if (!tbody) return;

    let previousMonthTotal = null;

    tbody.innerHTML = months.map((monthStr, idx) => {
      const totalRepairs = brand.monthlyRepairs[idx] || 0;
      
      // Calculate growth vs previous month
      let growthBadge = `<span style="color: var(--text-muted); font-size: 0.78rem;">-</span>`;
      if (previousMonthTotal !== null) {
        const diff = totalRepairs - previousMonthTotal;
        if (diff > 0) {
          growthBadge = `<span class="growth-pill positive"><i data-lucide="trending-up" style="width: 12px; height: 12px;"></i> +${diff}</span>`;
        } else if (diff < 0) {
          growthBadge = `<span class="growth-pill negative"><i data-lucide="trending-down" style="width: 12px; height: 12px;"></i> ${diff}</span>`;
        } else {
          growthBadge = `<span class="growth-pill neutral">0</span>`;
        }
      }
      previousMonthTotal = totalRepairs;

      // Extract model item count for this specific month
      const modelNames = Object.keys(brand.models || {});
      let modelPills = '';
      let topModelThisMonth = '-';

      if (modelNames.length > 0) {
        modelPills = modelNames.map(modelName => {
          const count = brand.models[modelName][idx] || 0;
          return `
            <span class="model-item-tag">
              <strong>${modelName}:</strong>
              <span class="model-count-num">${count}</span>
            </span>
          `;
        }).join('');

        let maxCount = -1;
        modelNames.forEach(m => {
          const c = brand.models[m][idx] || 0;
          if (c > maxCount) {
            maxCount = c;
            topModelThisMonth = `${m} (${c})`;
          }
        });
      } else {
        modelPills = `<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Brand Total Only (${totalRepairs} units)</span>`;
        topModelThisMonth = `${brand.name} (${totalRepairs})`;
      }

      return `
        <tr>
          <td>
            <span class="month-pill">
              <i data-lucide="calendar" style="width: 13px; height: 13px; color: ${brand.color};"></i>
              ${monthStr}
            </span>
          </td>
          <td>
            <span class="total-repairs-count" style="color: ${brand.color};">
              ${totalRepairs} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Units</span>
            </span>
          </td>
          <td>
            <div class="models-item-flex">
              ${modelPills}
            </div>
          </td>
          <td>
            <span style="font-weight: 600; font-size: 0.82rem; color: var(--text-primary);">
              ${topModelThisMonth}
            </span>
          </td>
          <td>
            ${growthBadge}
          </td>
        </tr>
      `;
    }).join('');

    renderAppIcons(tbody);
  }

  /**
   * IN-SYSTEM DATA EDITOR MODAL
   * Allows adding/editing models or direct brand totals.
   * If NO model is selected (default), it loads and saves the General Monthly Total for that Brand.
   */
  function initDataEditor() {
    const modal = document.getElementById('dataEditorModal');
    const openBtn = document.getElementById('openDataEditorBtn');
    const closeBtn = document.getElementById('closeDataEditorBtn');
    const cancelBtn = document.getElementById('cancelDataEditorBtn');
    const saveBtn = document.getElementById('saveDataEditorBtn');
    const resetBtn = document.getElementById('resetDataDefaultsBtn');

    const brandSelect = document.getElementById('editorBrandSelect');
    const modelSelect = document.getElementById('editorModelSelect');
    const inputsGrid = document.getElementById('editorMonthsGrid');
    const totalPreview = document.getElementById('editorTotalPreview');

    if (!modal) return;

    // Render Month Input Fields inside Modal with Inline + Tile and Trash Icon
    function buildMonthsInputs() {
      if (!inputsGrid) return;
      const months = window.RepairData.months;

      // Group months by year
      const yearGroups = {};
      months.forEach((m, idx) => {
        const parts = m.split(' ');
        const yr = parts[1] || 'Timeline';
        if (!yearGroups[yr]) yearGroups[yr] = [];
        yearGroups[yr].push({ monthLabel: m, idx, isLast: (idx === months.length - 1) });
      });

      const nextM = window.RepairData.getNextMonthLabel();
      const yearKeys = Object.keys(yearGroups);
      let html = '';

      yearKeys.forEach((yr, yIdx) => {
        const group = yearGroups[yr];
        const isLatestYear = (yIdx === yearKeys.length - 1);
        html += `
          <div class="editor-year-section">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; padding-bottom: 0.35rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <div style="display: flex; align-items: center; gap: 0.55rem;">
                <span class="editor-year-pill">${yr}</span>
                <span style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted);">${group.length} Months Logged</span>
              </div>
            </div>
            <div class="editor-year-grid">
              ${group.map(item => `
                <div class="month-input-field">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                    <label style="margin: 0; white-space: nowrap; font-size: 0.74rem;">${item.monthLabel}</label>
                    ${item.isLast && months.length > 1 ? `
                      <button type="button" class="btn-delete-last-month" id="deleteLastMonthBtn" title="Remove latest month (${item.monthLabel})" aria-label="Remove month">
                        <i data-lucide="x" style="width: 12px; height: 12px;"></i>
                      </button>
                    ` : ''}
                  </div>
                  <input type="number" min="0" max="999" class="editor-month-val" data-idx="${item.idx}" value="0" />
                </div>
              `).join('')}
              ${isLatestYear ? `
                <button type="button" class="month-add-tile" id="tileAddNextMonthBtn" title="Add Next Month (${nextM})">
                  <i data-lucide="plus" style="width: 18px; height: 18px; color: var(--color-cyan);"></i>
                  <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-cyan);">+ Next</span>
                </button>
              ` : ''}
            </div>
          </div>
        `;
      });

      inputsGrid.innerHTML = html;
      renderAppIcons(inputsGrid);

      inputsGrid.querySelectorAll('.editor-month-val').forEach(input => {
        input.addEventListener('input', updateRunningTotal);
      });

      // Bind '+' tile
      const addTile = document.getElementById('tileAddNextMonthBtn');
      if (addTile) {
        addTile.addEventListener('click', (e) => {
          e.preventDefault();
          const res = window.RepairData.addMonth();
          if (res.success) {
            persistAllData();
            buildMonthsInputs();
            loadCurrentSelectionIntoInputs();
            if (window.RepairCharts) window.RepairCharts.renderRepairTimelineChart();
            renderBrandMonthlyItemsTable(brandSelect.value);
            renderBrandModelsPanel(brandSelect.value);
            updateDashboardTimelineBadges();
            showToast(`Added ${res.added} to timeline`, 'success');
          } else {
            showToast(res.reason || 'Could not add month', 'info');
          }
        });
      }

      // Bind delete last month button
      const delBtn = document.getElementById('deleteLastMonthBtn');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const lastM = months[months.length - 1];
          if (confirm(`Are you sure you want to delete the latest month (${lastM})?`)) {
            const res = window.RepairData.deleteLastMonth();
            if (res.success) {
              persistAllData();
              buildMonthsInputs();
              loadCurrentSelectionIntoInputs();
              if (window.RepairCharts) window.RepairCharts.renderRepairTimelineChart();
              renderBrandMonthlyItemsTable(brandSelect.value);
              renderBrandModelsPanel(brandSelect.value);
              updateDashboardTimelineBadges();
              showToast(`Deleted ${res.removed} from timeline`, 'info');
            } else {
              showToast(res.reason || 'Could not delete month', 'warning');
            }
          }
        });
      }

      updateDashboardTimelineBadges();
    }

    function updateRunningTotal() {
      let sum = 0;
      inputsGrid.querySelectorAll('.editor-month-val').forEach(input => {
        sum += parseInt(input.value || 0, 10);
      });
      if (totalPreview) {
        totalPreview.textContent = `${sum} Units Total (${window.RepairData.months.length} Months)`;
      }
    }

    // Populate Brands in Editor Dropdown
    function populateEditorBrands() {
      if (!brandSelect) return;
      const brands = window.RepairData.brands;
      brandSelect.innerHTML = Object.keys(brands).map(k => `
        <option value="${k}">${brands[k].name}</option>
      `).join('');
    }

    // Populate Models for Selected Brand in Editor
    // Default option is always General Brand Total (No Model Selected)
    function populateEditorModels(brandKey) {
      if (!modelSelect) return;
      const b = window.RepairData.brands[brandKey];
      if (!b) return;

      const modelNames = Object.keys(b.models || {});
      
      let optionsHtml = `
        <option value="" style="color: var(--text-muted); font-style: italic; opacity: 0.75;">-- General Brand Total (No Model Selected) --</option>
      `;

      if (modelNames.length > 0) {
        optionsHtml += modelNames.map(m => `
          <option value="${m}">${m}</option>
        `).join('');
      }

      modelSelect.innerHTML = optionsHtml;
      modelSelect.value = ""; // Default to no model (General Brand Total)
    }

    // Load data into inputs according to current selections
    function loadCurrentSelectionIntoInputs() {
      const brandKey = brandSelect.value;
      const b = window.RepairData.brands[brandKey];
      if (!b) return;

      const modelName = modelSelect.value;
      const inputs = inputsGrid.querySelectorAll('.editor-month-val');

      if (!modelName) {
        // NO model selected: General Brand Monthly Total
        const vals = b.monthlyRepairs || [];
        inputs.forEach((inp, idx) => {
          inp.value = vals[idx] !== undefined ? vals[idx] : 0;
        });
      } else {
        // Model Selected: Specific model breakdown
        const vals = (b.models && b.models[modelName]) ? b.models[modelName] : [];
        inputs.forEach((inp, idx) => {
          inp.value = vals[idx] !== undefined ? vals[idx] : 0;
        });
      }

      updateRunningTotal();
    }

    // Open Modal
    function openDataEditorModal(preselectedBrandKey = null) {
      populateEditorBrands();
      const active = preselectedBrandKey || (window.RepairCharts.selectedBrand !== 'ALL' ? window.RepairCharts.selectedBrand : 'SAMSUNG');
      if (active && window.RepairData.brands[active]) {
        brandSelect.value = active;
      }

      const b = window.RepairData.brands[brandSelect.value];
      const activeBadge = document.getElementById('editorActiveBrandBadge');
      if (activeBadge && b) {
        activeBadge.innerHTML = `
          <span style="width: 8px; height: 8px; border-radius: 50%; background: ${b.color || 'var(--color-cyan)'}; display: inline-block;"></span>
          ${b.name}
        `;
      }

      populateEditorModels(brandSelect.value);
      buildMonthsInputs();
      loadCurrentSelectionIntoInputs();
      modal.classList.add('show');
    }
    window.SawanaOpenDataEditor = openDataEditorModal;

    if (openBtn) {
      openBtn.addEventListener('click', () => openDataEditorModal());
    }

    // Close Modal
    function closeModal() {
      modal.classList.remove('show');
    }
    closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Event: Change Brand in Editor
    brandSelect.addEventListener('change', () => {
      populateEditorModels(brandSelect.value);
      loadCurrentSelectionIntoInputs();
    });

    // Event: Change Model
    modelSelect.addEventListener('change', loadCurrentSelectionIntoInputs);

    // Event: Add Next Month (Rolling 24-Month Window)
    const addMonthBtn = document.getElementById('editorAddMonthBtn');
    if (addMonthBtn) {
      addMonthBtn.addEventListener('click', () => {
        const res = window.RepairData.addMonth();
        if (res.success) {
          persistAllData();
          buildMonthsInputs();
          loadCurrentSelectionIntoInputs();
          window.RepairCharts.renderRepairTimelineChart();
          renderBrandMonthlyItemsTable(brandSelect.value);
          renderBrandModelsPanel(brandSelect.value);
          updateDashboardTimelineBadges();
          if (res.dropped) {
            logSystemUpdate(`Timeline Extended: ${res.added}`, `Rolling FIFO: Oldest month "${res.dropped}" removed to maintain 24-month ceiling.`);
          } else {
            logSystemUpdate(`Timeline Extended: ${res.added}`, `Added next month (${res.totalMonths}/24 Months capacity).`);
          }
        } else {
          showToast(res.reason || 'Could not add month', 'info');
        }
      });
    }



    // Save Changes Action
    saveBtn.addEventListener('click', () => {
      const brandKey = brandSelect.value;
      const b = window.RepairData.brands[brandKey];
      if (!b) return;

      const modelName = modelSelect.value;
      const inputs = inputsGrid.querySelectorAll('.editor-month-val');
      const newValues = Array.from(inputs).map(inp => parseInt(inp.value || 0, 10));

      if (!modelName) {
        // NO model selected: Saves General Monthly Repairs for the Brand!
        b.monthlyRepairs = newValues;
        logSystemUpdate(`Repair Data Updated: ${b.name}`, `Direct monthly repairs updated across active timeline.`);
      } else {
        // Model selected: Saves Model Data & recalculates brand monthly totals
        if (!b.models) b.models = {};
        b.models[modelName] = newValues;

        // Auto-recalculate brand's total monthly repairs from sum of its models
        const totalMonths = window.RepairData.months.length;
        const brandMonthlySums = new Array(totalMonths).fill(0);
        Object.keys(b.models).forEach(mName => {
          b.models[mName].forEach((val, mIdx) => {
            brandMonthlySums[mIdx] += (val || 0);
          });
        });
        b.monthlyRepairs = brandMonthlySums;
        logSystemUpdate(`Repair Data Updated: ${modelName} (${b.name})`, `Model monthly items saved and rolled up to brand total.`);
      }

      // Persist to localStorage and Cloud
      persistAllData();

      // Update charts, tables, brand models panel & brand manager
      window.RepairCharts.renderRepairTimelineChart();
      window.RepairCharts.renderBrandShareDonut();
      renderBrandMonthlyItemsTable(brandKey);
      renderBrandModelsPanel(brandKey);
      if (typeof renderBrandsManager === 'function') {
        const sInp = document.getElementById('brandManagerSearchInput');
        renderBrandsManager(sInp ? sInp.value : '');
      }

      closeModal();
    });

    // Reset to defaults
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your custom data and reset to system defaults (Aug 2025 – Aug 2026)?')) {
          localStorage.removeItem('phonecare_custom_brands');
          localStorage.removeItem('phonecare_custom_months');
          location.reload();
        }
      });
    }
  }

  /**
   * Navigation Tabs Management (Overview vs Brands & Models)
   */
  function initNavigationTabs() {
    const navOverview = document.getElementById('navOverview');
    const navBrands = document.getElementById('navBrands');
    const navSettings = document.getElementById('navSettings');
    const viewOverview = document.getElementById('viewOverview');
    const viewBrands = document.getElementById('viewBrands');
    const viewSettings = document.getElementById('viewSettings');

    function switchTab(tabId) {
      // Reset all nav active states
      [navOverview, navBrands, navSettings].forEach(n => n && n.classList.remove('active'));
      // Hide all tab views
      [viewOverview, viewBrands, viewSettings].forEach(v => v && (v.style.display = 'none'));

      if (tabId === 'brands') {
        if (navBrands) navBrands.classList.add('active');
        if (viewBrands) viewBrands.style.display = 'flex';
        renderBrandsManager();
        showToast('Viewing Brands & Models Management Hub', 'info');
      } else if (tabId === 'settings') {
        if (navSettings) navSettings.classList.add('active');
        if (viewSettings) viewSettings.style.display = 'block';
        updateSettingsInfo();
        showToast('Viewing Settings & Workshop Preferences', 'info');
      } else {
        if (navOverview) navOverview.classList.add('active');
        if (viewOverview) viewOverview.style.display = 'flex';
        // Trigger ApexCharts render to ensure proper responsive dimensions
        setTimeout(() => {
          if (window.RepairCharts && typeof window.RepairCharts.renderRepairTimelineChart === 'function') {
            window.RepairCharts.renderRepairTimelineChart();
          }
        }, 50);
      }
    }

    if (navOverview) {
      navOverview.addEventListener('click', (e) => {
        e.preventDefault();
        history.replaceState(null, null, '#overview');
        switchTab('overview');
      });
    }

    if (navBrands) {
      navBrands.addEventListener('click', (e) => {
        e.preventDefault();
        history.replaceState(null, null, '#brands');
        switchTab('brands');
      });
    }

    if (navSettings) {
      navSettings.addEventListener('click', (e) => {
        e.preventDefault();
        history.replaceState(null, null, '#settings');
        switchTab('settings');
      });
    }

    // Check hash on load & hashchange
    function checkCurrentHash() {
      const hash = window.location.hash;
      if (hash === '#brands') {
        switchTab('brands');
      } else if (hash === '#settings') {
        switchTab('settings');
      } else {
        switchTab('overview');
      }
    }

    checkCurrentHash();
    window.addEventListener('hashchange', checkCurrentHash);

    window.SawanaAppSwitchTab = switchTab;
  }

  /**
   * Brands & Models Hub Management
   */
  function initBrandsManager() {
    const searchInput = document.getElementById('brandManagerSearchInput');
    const addBrandModal = document.getElementById('addBrandModal');
    const openAddBrandBtn = document.getElementById('openAddBrandModalBtn');
    const closeAddBrandBtn = document.getElementById('closeAddBrandModalBtn');
    const cancelNewBrandBtn = document.getElementById('cancelNewBrandBtn');
    const saveNewBrandBtn = document.getElementById('saveNewBrandBtn');
    const newBrandNameInput = document.getElementById('newBrandNameInput');
    const newBrandColorInput = document.getElementById('newBrandColorInput');
    const newBrandColorHex = document.getElementById('newBrandColorHex');
    const openEditorFromBrandsBtn = document.getElementById('openEditorFromBrandsBtn');

    if (openEditorFromBrandsBtn) {
      openEditorFromBrandsBtn.addEventListener('click', () => {
        if (typeof window.SawanaOpenDataEditor === 'function') {
          window.SawanaOpenDataEditor();
        }
      });
    }

    // Color picker hex display sync
    if (newBrandColorInput && newBrandColorHex) {
      newBrandColorInput.addEventListener('input', (e) => {
        newBrandColorHex.textContent = e.target.value;
      });
    }

    // Generate a random color that is visually distinct from all existing brand colors
    function getUniqueRandomColor() {
      const existingColors = Object.values(window.RepairData.brands).map(b => b.color || '#000000');

      function hexToHsl(hex) {
        let r = parseInt(hex.slice(1,3),16)/255;
        let g = parseInt(hex.slice(3,5),16)/255;
        let b = parseInt(hex.slice(5,7),16)/255;
        const max = Math.max(r,g,b), min = Math.min(r,g,b);
        let h, s, l = (max+min)/2;
        if (max === min) { h = s = 0; }
        else {
          const d = max - min;
          s = l > 0.5 ? d/(2-max-min) : d/(max+min);
          switch(max) {
            case r: h = ((g-b)/d + (g<b?6:0))/6; break;
            case g: h = ((b-r)/d + 2)/6; break;
            case b: h = ((r-g)/d + 4)/6; break;
          }
        }
        return [h*360, s*100, l*100];
      }

      function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        const k = n => (n + h/30) % 12;
        const a = s * Math.min(l, 1-l);
        const f = n => l - a * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n), 1)));
        const toH = x => Math.round(x*255).toString(16).padStart(2,'0');
        return `#${toH(f(0))}${toH(f(8))}${toH(f(4))}`;
      }

      function hueDiff(h1, h2) {
        const d = Math.abs(h1 - h2);
        return Math.min(d, 360 - d);
      }

      const existingHues = existingColors.map(c => hexToHsl(c)[0]);
      let bestColor = null, bestDiff = -1;

      for (let attempt = 0; attempt < 40; attempt++) {
        const h = Math.random() * 360;
        const s = 55 + Math.random() * 30; // 55–85%
        const l = 48 + Math.random() * 12; // 48–60%
        const minDiff = existingHues.reduce((acc, eh) => Math.min(acc, hueDiff(h, eh)), 360);
        if (minDiff > bestDiff) { bestDiff = minDiff; bestColor = hslToHex(h, s, l); }
        if (minDiff > 30) break; // good enough
      }
      return bestColor || '#6366f1';
    }

    // Open/Close Add Brand Modal
    function openAddBrandModal() {
      if (newBrandNameInput) newBrandNameInput.value = '';
      const randomColor = getUniqueRandomColor();
      if (newBrandColorInput) newBrandColorInput.value = randomColor;
      if (newBrandColorHex) newBrandColorHex.textContent = randomColor;
      if (addBrandModal) addBrandModal.classList.add('show');
    }

    function closeAddBrandModal() {
      if (addBrandModal) addBrandModal.classList.remove('show');
    }

    if (openAddBrandBtn) openAddBrandBtn.addEventListener('click', openAddBrandModal);
    if (closeAddBrandBtn) closeAddBrandBtn.addEventListener('click', closeAddBrandModal);
    if (cancelNewBrandBtn) cancelNewBrandBtn.addEventListener('click', closeAddBrandModal);

    // Save New Brand
    if (saveNewBrandBtn) {
      saveNewBrandBtn.addEventListener('click', () => {
        const brandName = (newBrandNameInput ? newBrandNameInput.value.trim() : '');
        if (!brandName) {
          showToast('Please enter a Brand Name', 'info');
          return;
        }

        const brandKey = brandName.toUpperCase().replace(/\s+/g, '_');
        if (window.RepairData.brands[brandKey]) {
          showToast(`Brand "${brandName}" already exists!`, 'info');
          return;
        }

        const brandColor = newBrandColorInput ? newBrandColorInput.value : '#6366f1';
        const monthsCount = window.RepairData.months.length;

        const newBrandObj = {
          name: brandName,
          color: brandColor,
          monthlyRepairs: new Array(monthsCount).fill(0),
          models: {}
        };

        window.RepairData.brands[brandKey] = newBrandObj;
        persistAllData();
        closeAddBrandModal();

        // Refresh UI
        renderBrandsManager(searchInput ? searchInput.value : '');
        initBrandSearchDropdown(); // refresh top brand search dropdown
        window.RepairCharts.renderBrandShareDonut();
        logSystemUpdate(`Brand Created: ${brandName}`, `New mobile brand registered with active timeline.`);
      });
    }

    // =========================================================================
    // Edit Mobile Brand Modal (Name & Color Customization)
    // =========================================================================
    const editBrandModal = document.getElementById('editBrandModal');
    const closeEditBrandBtn = document.getElementById('closeEditBrandModalBtn');
    const cancelEditBrandBtn = document.getElementById('cancelEditBrandBtn');
    const saveEditBrandBtn = document.getElementById('saveEditBrandBtn');
    const editBrandKeyInput = document.getElementById('editBrandKeyInput');
    const editBrandNameInput = document.getElementById('editBrandNameInput');
    const editBrandColorInput = document.getElementById('editBrandColorInput');
    const editBrandColorHex = document.getElementById('editBrandColorHex');

    if (editBrandColorInput && editBrandColorHex) {
      editBrandColorInput.addEventListener('input', (e) => {
        editBrandColorHex.textContent = e.target.value;
      });
    }

    window.openEditBrandModal = function(brandKey) {
      const b = window.RepairData.brands[brandKey];
      if (!b || !editBrandModal) return;
      if (editBrandKeyInput) editBrandKeyInput.value = brandKey;
      if (editBrandNameInput) editBrandNameInput.value = b.name;
      const brandColor = b.color || '#6366f1';
      if (editBrandColorInput) editBrandColorInput.value = brandColor;
      if (editBrandColorHex) editBrandColorHex.textContent = brandColor;
      editBrandModal.classList.add('show');
      if (editBrandNameInput) {
        setTimeout(() => editBrandNameInput.focus(), 60);
      }
    };

    function closeEditBrandModal() {
      if (editBrandModal) editBrandModal.classList.remove('show');
    }

    if (closeEditBrandBtn) closeEditBrandBtn.addEventListener('click', closeEditBrandModal);
    if (cancelEditBrandBtn) cancelEditBrandBtn.addEventListener('click', closeEditBrandModal);
    if (editBrandModal) {
      editBrandModal.addEventListener('click', (e) => {
        if (e.target === editBrandModal) closeEditBrandModal();
      });
    }

    if (saveEditBrandBtn) {
      saveEditBrandBtn.addEventListener('click', () => {
        const brandKey = editBrandKeyInput ? editBrandKeyInput.value : '';
        const b = window.RepairData.brands[brandKey];
        if (!b) {
          closeEditBrandModal();
          return;
        }

        const newName = editBrandNameInput ? editBrandNameInput.value.trim() : '';
        if (!newName) {
          showToast('Please enter a Brand Name', 'warning');
          return;
        }

        const newColor = editBrandColorInput ? editBrandColorInput.value : b.color;
        const oldName = b.name;
        const oldColor = b.color;

        b.name = newName;
        b.color = newColor;

        persistAllData();
        logSystemUpdate(`Brand Updated: ${b.name}`, `Renamed to "${b.name}" and updated color to ${newColor}.`);
        closeEditBrandModal();

        // Refresh UI components
        renderBrandsManager(searchInput ? searchInput.value : '');
        initBrandSearchDropdown();
        if (typeof window.SawanaSyncBrandFilterUI === 'function') {
          window.SawanaSyncBrandFilterUI();
        }
        window.RepairCharts.renderBrandShareDonut();
        window.RepairCharts.renderRepairTimelineChart();
        renderBrandModelsPanel(window.RepairCharts.selectedBrand || 'ALL');

        showToast(`Brand updated: ${b.name}`, 'success');
      });
    }

    // Live search filter in Brands Manager
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderBrandsManager(e.target.value);
      });
    }

    // Initial render of brands grid
    renderBrandsManager();
  }

  /**
   * Render All Brand Cards in Brands & Models Hub
   */
  function renderBrandsManager(query = '') {
    const grid = document.getElementById('brandsManagerGrid');
    if (!grid) return;

    const q = query.trim().toLowerCase();
    const brands = window.RepairData.brands;
    const months = window.RepairData.months;
    const brandKeys = Object.keys(brands);

    let totalModelsCount = 0;
    let totalBrandsCount = brandKeys.length;

    brandKeys.forEach(k => {
      const b = brands[k];
      totalModelsCount += Object.keys(b.models || {}).length;
    });

    // Update badge in header
    const hubBadge = document.getElementById('brandsHubCountBadge');
    if (hubBadge) {
      hubBadge.textContent = `${totalBrandsCount} Brands • ${totalModelsCount} Models`;
    }

    // Filter brands
    const filteredKeys = brandKeys.filter(k => {
      const b = brands[k];
      if (!q) return true;
      if (b.name.toLowerCase().includes(q)) return true;
      const modelNames = Object.keys(b.models || {});
      return modelNames.some(m => m.toLowerCase().includes(q));
    });

    if (filteredKeys.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i data-lucide="search-x" style="width: 36px; height: 36px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">No brands or models match "${query}"</p>
        </div>
      `;
      renderAppIcons(grid);
      return;
    }

    grid.innerHTML = filteredKeys.map(k => {
      const b = brands[k];
      const models = b.models || {};
      const modelNames = Object.keys(models);
      const totalRepairs = (b.monthlyRepairs || []).reduce((acc, v) => acc + (v || 0), 0);
      const totalModels = modelNames.length;

      // Model pills HTML
      let modelsHtml = '';
      if (totalModels > 0) {
        modelsHtml = modelNames.map(mName => {
          const modelTotal = (models[mName] || []).reduce((acc, v) => acc + (v || 0), 0);
          return `
            <span class="mgmt-model-pill" title="${mName}: ${modelTotal} total repairs">
              <span>${mName}</span>
              <span class="mgmt-model-count" style="background: ${b.color}22; color: ${b.color};">
                ${modelTotal}
              </span>
              <button type="button" class="mgmt-model-del-btn" data-brand="${k}" data-model="${mName}" title="Delete ${mName}">
                <i data-lucide="x" style="width: 12px; height: 12px;"></i>
              </button>
            </span>
          `;
        }).join('');
      } else {
        modelsHtml = `
          <span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.25rem 0;">
            No models created yet (Tracking General Brand Total).
          </span>
        `;
      }

      const isRenameAllowed = localStorage.getItem('sawana_setting_brand_rename') === 'true';
      const brandActionsHtml = isRenameAllowed ? `
        <button type="button" class="brand-rename-btn" data-brand="${k}" title="Edit ${b.name} Name & Color">
          <i data-lucide="pencil" style="width: 13px; height: 13px;"></i>
        </button>
        <button type="button" class="brand-delete-btn" data-brand="${k}" title="Permanently Delete ${b.name}">
          <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
        </button>
      ` : '';

      return `
        <div class="brand-mgmt-card" data-brand-key="${k}">
          <div class="brand-mgmt-header">
            <div class="brand-mgmt-title-wrap">
              <span class="brand-mgmt-color-dot" style="background: ${b.color}; color: ${b.color};"></span>
              <span class="brand-mgmt-name">${b.name}</span>
              ${brandActionsHtml}
            </div>
            <span class="brand-mgmt-total-badge" style="background: ${b.color}15; color: ${b.color}; border-color: ${b.color}35;">
              ${totalRepairs} Total Units
            </span>
          </div>

          <div>
            <div class="brand-mgmt-models-container">
              ${modelsHtml}
            </div>
          </div>

          <!-- Inline Quick Add Model Form -->
          <form class="brand-mgmt-add-form" data-brand-key="${k}">
            <input 
              type="text" 
              class="brand-mgmt-add-input" 
              placeholder="+ Add Model..." 
              autocomplete="off"
            />
            <button type="submit" class="brand-mgmt-add-btn">
              <i data-lucide="plus" style="width: 13px; height: 13px;"></i>
              <span>Add</span>
            </button>
          </form>

          <div class="brand-mgmt-card-actions">
            <button type="button" class="brand-mgmt-action-btn primary-action" data-action="edit-data" data-brand="${k}">
              <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
              <span>Enter Monthly Data</span>
            </button>
            <button type="button" class="brand-mgmt-action-btn" data-action="view-ruler" data-brand="${k}">
              <i data-lucide="trending-up" style="width: 14px; height: 14px;"></i>
              <span>View Ruler</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    renderAppIcons(grid);

    // Attach Event Handlers:
    // 1. Quick Add Model submit
    grid.querySelectorAll('.brand-mgmt-add-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const brandKey = form.getAttribute('data-brand-key');
        const input = form.querySelector('.brand-mgmt-add-input');
        const modelName = input ? input.value.trim() : '';

        if (!modelName) {
          showToast('Please type a model name (e.g. Note 13 Pro)', 'info');
          return;
        }

        const b = window.RepairData.brands[brandKey];
        if (!b) return;
        if (!b.models) b.models = {};

        if (b.models[modelName]) {
          showToast(`Model "${modelName}" already exists for ${b.name}!`, 'info');
          return;
        }

        // Initialize with 0s for active months
        b.models[modelName] = new Array(window.RepairData.months.length).fill(0);
        persistAllData();
        renderBrandsManager(query);
        renderBrandModelsPanel(brandKey);
        renderBrandMonthlyItemsTable(brandKey);
        logSystemUpdate(`Model Added: ${modelName}`, `Added phone model under ${b.name}.`);
      });
    });

    // 2. Delete model button
    grid.querySelectorAll('.mgmt-model-del-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const brandKey = btn.getAttribute('data-brand');
        const modelName = btn.getAttribute('data-model');
        const b = window.RepairData.brands[brandKey];
        if (!b || !b.models || !b.models[modelName]) return;

        if (confirm(`Remove phone model "${modelName}" from ${b.name}?`)) {
          delete b.models[modelName];

          // Recalculate brand monthly sums from remaining models if any exist
          const modelKeys = Object.keys(b.models);
          if (modelKeys.length > 0) {
            const brandMonthlySums = new Array(window.RepairData.months.length).fill(0);
            modelKeys.forEach(m => {
              b.models[m].forEach((val, mIdx) => {
                brandMonthlySums[mIdx] += (val || 0);
              });
            });
            b.monthlyRepairs = brandMonthlySums;
          }

          persistAllData();
          renderBrandsManager(query);
          renderBrandModelsPanel(brandKey);
          window.RepairCharts.renderRepairTimelineChart();
          renderBrandMonthlyItemsTable(brandKey);
          logSystemUpdate(`Model Removed: ${modelName}`, `Deleted phone model from ${b.name}.`);
        }
      });
    });

    // 3. Card action buttons
    grid.querySelectorAll('.brand-mgmt-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const brandKey = btn.getAttribute('data-brand');

        if (action === 'edit-data') {
          // Open Edit Repair Data modal pre-selected to this brand
          if (typeof window.SawanaOpenDataEditor === 'function') {
            window.SawanaOpenDataEditor(brandKey);
          }
        } else if (action === 'view-ruler') {
          // Switch to overview tab and focus this brand
          if (window.SawanaAppSwitchTab) {
            window.SawanaAppSwitchTab('overview');
          }
          window.RepairCharts.setBrand(brandKey);
          const brandSearchInput = document.getElementById('brandSearchInput');
          const brandSearchClearBtn = document.getElementById('brandSearchClearBtn');
          if (brandSearchInput && window.RepairData.brands[brandKey]) {
            brandSearchInput.value = window.RepairData.brands[brandKey].name;
            if (brandSearchClearBtn) brandSearchClearBtn.style.display = 'inline-flex';
          }
          renderBrandMonthlyItemsTable(brandKey);
          renderBrandModelsPanel(brandKey);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // 4. Brand edit button (name & color customization modal)
    grid.querySelectorAll('.brand-rename-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const brandKey = btn.getAttribute('data-brand');
        if (typeof window.openEditBrandModal === 'function') {
          window.openEditBrandModal(brandKey);
        }
      });
    });

    // 5. Brand permanent delete button
    grid.querySelectorAll('.brand-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const brandKey = btn.getAttribute('data-brand');
        const b = window.RepairData.brands[brandKey];
        if (!b) return;

        const totalRepairs = (b.monthlyRepairs || []).reduce((acc, v) => acc + (v || 0), 0);
        const confirmMsg = `Are you sure you want to permanently delete "${b.name}" (${totalRepairs} logged repairs)?\n\nThis will completely remove the brand and all its models from the system. This action cannot be undone.`;
        if (!window.confirm(confirmMsg)) return;

        const brandName = b.name;
        delete window.RepairData.brands[brandKey];

        if (window.RepairCharts.selectedBrands) {
          window.RepairCharts.selectedBrands = window.RepairCharts.selectedBrands.filter(k => k !== brandKey);
          if (window.RepairCharts.selectedBrands.length === 0) {
            window.RepairCharts.selectedBrands = Object.keys(window.RepairData.brands);
          }
        }
        if (window.RepairCharts.selectedBrand === brandKey) {
          window.RepairCharts.selectedBrand = 'ALL';
        }
        if (window.RepairCharts.highlightedDonutBrand === brandKey) {
          window.RepairCharts.highlightedDonutBrand = null;
        }

        persistAllData();
        logSystemUpdate(`Brand Deleted: ${brandName}`, `Permanently deleted brand "${brandName}" and all associated repair records.`);

        renderBrandsManager(query);
        initBrandSearchDropdown();
        if (typeof window.SawanaSyncBrandFilterUI === 'function') {
          window.SawanaSyncBrandFilterUI();
        }
        window.RepairCharts.renderBrandShareDonut();
        window.RepairCharts.renderRepairTimelineChart();
        renderBrandModelsPanel(window.RepairCharts.selectedBrand || 'ALL');

        showToast(`Brand "${brandName}" permanently deleted`, 'warning');
      });
    });
  }

  /**
   * Render Selected Brand Phone Models Breakdown Panel (Replaces Fault Category Diagnostics)
   * Supports:
   * 1. Dynamic calculation across active filtered timeframe ([startIndex, endIndex])
   * 2. All Brands mode: descending ranking of brands by repair volume
   * 3. Specific Brand mode: descending ranking of phone models for that brand
   * 4. Real-time hover preview from Donut chart slices & interactive legend
   */
  function renderBrandModelsPanel(brandKey, isHoverPreview = false) {
    const container = document.getElementById('brandModelsList');
    if (!container) return;

    const titleEl = document.getElementById('brandModelsPanelTitle');
    const badgeEl = document.getElementById('brandModelsPanelBadge');
    const subtitleEl = document.getElementById('brandModelsPanelSubtitle');

    const isAll = (!brandKey || brandKey === 'ALL');

    // Slicing strictly within the active time range (3M, 6M, 12M, Custom, or ALL)
    const { startIndex, endIndex } = (window.RepairCharts && typeof window.RepairCharts.getActiveTimeRangeIndices === 'function')
      ? window.RepairCharts.getActiveTimeRangeIndices()
      : { startIndex: 0, endIndex: (window.RepairData.months || []).length };
    const allMonths = window.RepairData.months || [];
    const activeMonths = allMonths.slice(startIndex, endIndex);
    const timeframeLabel = activeMonths.length > 0
      ? (activeMonths.length === allMonths.length ? `All Months (${activeMonths.length}M)` : `${activeMonths[0]} – ${activeMonths[activeMonths.length - 1]}`)
      : 'Active Timeline';

    if (isAll) {
      // MODE A: All Brands Active -> Display Brands ranked from highest to lowest repair sales strictly across filtered timeframe
      if (titleEl) {
        titleEl.textContent = 'Phone Brands Repair Ranking';
      }
      if (badgeEl) {
        badgeEl.textContent = 'ALL BRANDS';
        badgeEl.style.background = 'rgba(99, 102, 241, 0.18)';
        badgeEl.style.color = '#818cf8';
        badgeEl.style.border = '1px solid rgba(129, 140, 248, 0.4)';
      }

      // Collect all registered brands and calculate total units in active timeframe
      const brandRanking = Object.keys(window.RepairData.brands).map(bKey => {
        const b = window.RepairData.brands[bKey];
        const sliced = (b.monthlyRepairs || []).slice(startIndex, endIndex);
        const total = sliced.reduce((acc, v) => acc + (v || 0), 0);
        const modelCount = Object.keys(b.models || {}).length;
        return {
          key: bKey,
          name: b.name,
          color: b.color,
          total: total,
          modelCount: modelCount
        };
      }).sort((a, b) => b.total - a.total);

      const grandTotal = brandRanking.reduce((acc, b) => acc + b.total, 0) || 1;
      const highestTotal = brandRanking.length > 0 ? (brandRanking[0].total || 1) : 1;

      if (subtitleEl) {
        subtitleEl.textContent = `Ranking of ${brandRanking.length} mobile brands by repair sales across ${timeframeLabel} (${grandTotal} total units).`;
      }

      container.innerHTML = brandRanking.map((b, idx) => {
        const pct = ((b.total / grandTotal) * 100).toFixed(1);
        const barWidth = Math.min(100, Math.max(Math.round((b.total / highestTotal) * 100), 4));
        return `
          <div class="brand-model-item" style="cursor: pointer;" onclick="window.SawanaSelectBrandFromDonut && window.SawanaSelectBrandFromDonut('${b.key}')" title="Click to view ${b.name} phone models">
            <div class="brand-model-row">
              <div class="brand-model-title-wrap">
                <span style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted); width: 18px; text-align: left;">#${idx + 1}</span>
                <span style="width: 9px; height: 9px; border-radius: 50%; background: ${b.color}; flex-shrink: 0; box-shadow: 0 0 6px ${b.color}80;"></span>
                <span class="brand-model-name">${b.name}</span>
                <span style="font-size: 0.69rem; font-weight: 600; color: var(--text-muted); margin-left: 4px;">
                  ${b.modelCount > 0 ? `(${b.modelCount} models)` : '(Direct Brand)'}
                </span>
              </div>
              <span class="brand-model-units-badge" style="background: ${b.color}18; color: ${b.color}; border: 1px solid ${b.color}35;">
                ${b.total} Units
              </span>
            </div>
            <div class="brand-model-bar-wrap">
              <div class="brand-model-progress-bg">
                <div class="brand-model-progress-fill" style="width: ${barWidth}%; background: ${b.color};"></div>
              </div>
              <span class="brand-model-pct">${pct}%</span>
            </div>
          </div>
        `;
      }).join('');

      renderAppIcons(container);
      return;
    }

    // MODE B: Specific Brand Selected / Hover Preview
    const brand = window.RepairData.brands[brandKey];
    if (!brand) return;

    if (titleEl) {
      titleEl.textContent = `${brand.name} Phone Models`;
    }
    if (badgeEl) {
      badgeEl.textContent = isHoverPreview ? `${brand.name} (Hover Preview)` : brand.name;
      badgeEl.style.background = `${brand.color}22`;
      badgeEl.style.color = brand.color;
      badgeEl.style.border = `1px solid ${brand.color}55`;
    }

    const models = brand.models || {};
    const modelNames = Object.keys(models);
    const slicedBrandRepairs = (brand.monthlyRepairs || []).slice(startIndex, endIndex);
    const totalBrandRepairs = slicedBrandRepairs.reduce((acc, v) => acc + (v || 0), 0);

    if (subtitleEl) {
      subtitleEl.textContent = `${modelNames.length} Models registered under ${brand.name} • ${totalBrandRepairs} Total brand units across ${timeframeLabel}.`;
    }

    if (modelNames.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2.2rem 1rem; color: var(--text-muted);">
          <i data-lucide="smartphone" style="width: 32px; height: 32px; margin-bottom: 0.5rem; opacity: 0.45;"></i>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">
            All repairs are tracked under General Brand Total (${totalBrandRepairs} Units). Models can be created and managed in the Brands & Models hub.
          </p>
        </div>
      `;
      renderAppIcons(container);
      return;
    }

    // Sort strictly this brand's models by repaired units in filtered timeframe descending
    const sortedModels = modelNames.map(mName => {
      const slicedUnits = (models[mName] || []).slice(startIndex, endIndex);
      const units = slicedUnits.reduce((acc, v) => acc + (v || 0), 0);
      const pct = totalBrandRepairs > 0 ? ((units / totalBrandRepairs) * 100).toFixed(1) : 0;
      return { name: mName, units, pct };
    }).sort((a, b) => b.units - a.units);

    const highestModelUnits = sortedModels.length > 0 ? (sortedModels[0].units || 1) : 1;

    container.innerHTML = sortedModels.map(m => {
      const barWidth = Math.min(100, Math.max(Math.round((m.units / highestModelUnits) * 100), 3));
      return `
        <div class="brand-model-item">
          <div class="brand-model-row">
            <div class="brand-model-title-wrap">
              <i data-lucide="smartphone" style="width: 15px; height: 15px; color: ${brand.color};"></i>
              <span class="brand-model-name">${m.name}</span>
            </div>
            <span class="brand-model-units-badge" style="background: ${brand.color}18; color: ${brand.color}; border: 1px solid ${brand.color}35;">
              ${m.units} Units
            </span>
          </div>
          <div class="brand-model-bar-wrap">
            <div class="brand-model-progress-bg">
              <div class="brand-model-progress-fill" style="width: ${barWidth}%; background: ${brand.color};"></div>
            </div>
            <span class="brand-model-pct">${m.pct}%</span>
          </div>
        </div>
      `;
    }).join('');

    renderAppIcons(container);
  }

  window.SawanaPreviewBrandModels = function(brandKey) {
    if (!brandKey || !window.RepairData.brands[brandKey]) return;
    renderBrandModelsPanel(brandKey, true);
  };

  window.SawanaRestoreBrandModels = function() {
    const pinnedBrand = window.RepairCharts?.highlightedDonutBrand;
    if (pinnedBrand && window.RepairData.brands[pinnedBrand]) {
      renderBrandModelsPanel(pinnedBrand, false);
      return;
    }
    const selBrand = window.RepairCharts?.selectedBrand;
    if (selBrand && selBrand !== 'ALL' && selBrand !== 'MULTI' && window.RepairData.brands[selBrand]) {
      renderBrandModelsPanel(selBrand, false);
      return;
    }
    renderBrandModelsPanel('ALL', false);
  };

  window.SawanaRenderBrandModelsPanel = function(brandKey) {
    renderBrandModelsPanel(brandKey || 'ALL', false);
  };

  window.SawanaSelectBrandFromDonut = function(brandKey) {
    if (!brandKey) {
      // Toggled OFF: restore models panel to filter selected brand or All Brands
      const defaultBrand = (window.RepairCharts && window.RepairCharts.selectedBrand)
        ? window.RepairCharts.selectedBrand
        : 'ALL';
      renderBrandModelsPanel(defaultBrand);
      const card = document.getElementById('brandModelsBreakdownCard');
      if (card) {
        card.classList.remove('card-focus-pulse');
      }
      showToast('Cleared brand highlight', 'info');
      return;
    }
    if (!window.RepairData.brands[brandKey]) return;
    renderBrandModelsPanel(brandKey);
    const card = document.getElementById('brandModelsBreakdownCard');
    if (card) {
      card.classList.remove('card-focus-pulse');
      void card.offsetWidth; // trigger reflow
      card.classList.add('card-focus-pulse');
    }
    showToast(`Viewing ${window.RepairData.brands[brandKey].name} Phone Models`, 'info');
  };

  /**
   * Helper to prompt and add model under selected brand
   */
  function promptAndAddModel(brandKey) {
    const brand = window.RepairData.brands[brandKey];
    if (!brand) return;
    const modelName = prompt(`Enter new phone model for ${brand.name}:`);
    if (!modelName || !modelName.trim()) return;
    const trimmed = modelName.trim();
    if (!brand.models) brand.models = {};
    if (brand.models[trimmed]) {
      showToast(`Model "${trimmed}" already exists for ${brand.name}!`, 'info');
      return;
    }
    brand.models[trimmed] = new Array(window.RepairData.months.length).fill(0);
    persistAllData();
    logSystemUpdate(`Model Added: ${trimmed}`, `Added phone model under ${brand.name}.`);
    renderBrandModelsPanel(brandKey);
    renderBrandsManager();
    renderBrandMonthlyItemsTable(brandKey);
  }

  /**
   * Setup Event Listeners
   */
  function setupDashboardEvents() {
    // Time Horizon Switcher: All Months, 12M, 6M, 3M, Custom
    const rangeBtns = [
      document.getElementById('rangeBtnAll'),
      document.getElementById('rangeBtn12'),
      document.getElementById('rangeBtn6'),
      document.getElementById('rangeBtn3')
    ].filter(Boolean);

    const customBtn = document.getElementById('rangeBtnCustom');
    const customPopover = document.getElementById('customRangePopover');
    const customStartSel = document.getElementById('customRangeStartSelect');
    const customEndSel = document.getElementById('customRangeEndSelect');
    const applyCustomBtn = document.getElementById('applyCustomRangeBtn');
    const resetCustomBtn = document.getElementById('resetCustomRangeBtn');
    const closeCustomBtn = document.getElementById('closeCustomRangeBtn');
    const customBtnText = document.getElementById('rangeBtnCustomText');

    function populateCustomRangeDropdowns() {
      if (!customStartSel || !customEndSel) return;
      const months = window.RepairData.months;
      const opts = months.map((m, idx) => `<option value="${idx}">${m}</option>`).join('');
      customStartSel.innerHTML = opts;
      customEndSel.innerHTML = opts;
      customStartSel.value = "0";
      customEndSel.value = String(months.length - 1);
    }
    populateCustomRangeDropdowns();

    rangeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        rangeBtns.forEach(b => b.classList.remove('active'));
        if (customBtn) customBtn.classList.remove('active');
        if (customPopover) customPopover.classList.remove('show');
        if (customBtnText) customBtnText.textContent = 'Custom';
        btn.classList.add('active');
        const raw = btn.getAttribute('data-range') || 'ALL';
        const count = raw === 'ALL' ? 'ALL' : parseInt(raw, 10);
        window.RepairCharts.setTimeRange(count);
        showToast(`Timeline timeframe: ${count === 'ALL' ? `All Months (${window.RepairData.months.length}M)` : `Last ${count} Months`}`, 'info');
      });
    });

    if (customBtn && customPopover) {
      customBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        populateCustomRangeDropdowns();
        customPopover.classList.toggle('show');
      });

      if (closeCustomBtn) {
        closeCustomBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          customPopover.classList.remove('show');
        });
      }

      customPopover.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      document.addEventListener('click', (e) => {
        if (!customPopover.contains(e.target) && !customBtn.contains(e.target)) {
          customPopover.classList.remove('show');
        }
      });
    }

    if (applyCustomBtn) {
      applyCustomBtn.addEventListener('click', () => {
        const months = window.RepairData.months;
        const sIdx = parseInt(customStartSel.value || 0, 10);
        const eIdx = parseInt(customEndSel.value || (months.length - 1), 10);
        let startIdx = Math.min(sIdx, eIdx);
        let endIdx = Math.max(sIdx, eIdx);
        let count = endIdx - startIdx + 1;

        // Enforce maximum 24-month horizon limit
        if (count > 24) {
          showToast('Custom range clamped: Maximum allowable time horizon is 24 months.', 'warning');
          startIdx = Math.max(0, endIdx - 23);
          count = endIdx - startIdx + 1;
          customStartSel.value = String(startIdx);
        }

        const startM = months[startIdx];
        const endM = months[endIdx];

        rangeBtns.forEach(b => b.classList.remove('active'));
        if (customBtn) customBtn.classList.add('active');
        if (customBtnText) customBtnText.textContent = `${startM} – ${endM}`;
        if (customPopover) customPopover.classList.remove('show');

        window.RepairCharts.setCustomTimeRange(startIdx, endIdx);
        showToast(`Custom timeframe: ${startM} – ${endM} (${count} Months)`, 'success');
      });
    }

    if (resetCustomBtn) {
      resetCustomBtn.addEventListener('click', () => {
        if (customBtnText) customBtnText.textContent = 'Custom';
        if (customPopover) customPopover.classList.remove('show');
        const allBtn = document.getElementById('rangeBtnAll');
        if (allBtn) allBtn.click();
      });
    }

    // Quick Add Model from Phone Models Breakdown Panel
    const panelQuickAddBtn = document.getElementById('panelQuickAddModelBtn');
    if (panelQuickAddBtn) {
      panelQuickAddBtn.addEventListener('click', () => {
        const activeBrand = window.RepairCharts.selectedBrand === 'ALL' ? 'SAMSUNG' : window.RepairCharts.selectedBrand;
        promptAndAddModel(activeBrand);
      });
    }

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Sidebar Auto-Collapse on Mouse Leave (smooth lightweight reflow)
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseSidebarBtn');

    let chartResizeTimer = null;
    function triggerSmoothChartResize() {
      if (chartResizeTimer) clearTimeout(chartResizeTimer);
      chartResizeTimer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        chartResizeTimer = null;
      }, 410);
    }

    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) {
      mainWrapper.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'margin-left') {
          window.dispatchEvent(new Event('resize'));
        }
      });
    }

    if (sidebar) {
      sidebar.addEventListener('mouseenter', () => {
        sidebar.classList.remove('collapsed');
        triggerSmoothChartResize();
      });
      sidebar.addEventListener('mouseleave', () => {
        sidebar.classList.add('collapsed');
        triggerSmoothChartResize();
      });
    }

    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        triggerSmoothChartResize();
      });
    }

    // Export Monthly Items CSV
    const exportBtn = document.getElementById('exportReportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportMonthlyItemsCSV);
    }
  }

  /**
   * Export Monthly Items for selected brand to CSV
   */
  function exportMonthlyItemsCSV() {
    const brandKey = window.RepairCharts.selectedBrand === 'ALL' ? 'SAMSUNG' : window.RepairCharts.selectedBrand;
    const brand = window.RepairData.brands[brandKey];
    const months = window.RepairData.months;
    const modelNames = Object.keys(brand.models || {});

    let csv = '';
    if (modelNames.length > 0) {
      csv = `Month,Brand,Total Repairs,${modelNames.join(',')}\n`;
      months.forEach((m, idx) => {
        const total = brand.monthlyRepairs[idx] || 0;
        const modelCounts = modelNames.map(name => brand.models[name][idx] || 0).join(',');
        csv += `"${m}","${brand.name}",${total},${modelCounts}\n`;
      });
    } else {
      csv = `Month,Brand,Total Repairs\n`;
      months.forEach((m, idx) => {
        const total = brand.monthlyRepairs[idx] || 0;
        csv += `"${m}","${brand.name}",${total}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${brand.name}_monthly_repaired_items_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`${brand.name} Monthly Repair Items exported as CSV!`, 'success');
  }

  /**
   * Theme Management
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('repair_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('repair_theme', next);
    updateThemeIcon(next);
    if (window.RepairCharts) {
      if (typeof window.RepairCharts.renderRepairTimelineChart === 'function') {
        window.RepairCharts.renderRepairTimelineChart();
      }
      if (typeof window.RepairCharts.renderBrandShareDonut === 'function') {
        window.RepairCharts.renderBrandShareDonut();
      }
      if (typeof window.RepairCharts.renderFaultCategoryChart === 'function') {
        window.RepairCharts.renderFaultCategoryChart();
      }
    }
    showToast(`Switched to ${next === 'dark' ? 'Dark Mode' : 'Light Mode'}`, 'info');
  }

  function updateThemeIcon(theme) {
    const iconEl = document.getElementById('themeToggleIcon');
    const labelEl = document.getElementById('themeToggleLabelText');
    if (iconEl) {
      iconEl.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    }
    if (labelEl) {
      labelEl.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }
    renderAppIcons(iconEl ? (iconEl.parentElement || document) : document);
  }

  /**
   * Settings Tab & Preferences Management
   */
  function updateSettingsInfo() {
    const verBadge = document.getElementById('settingsVersionBadge');
    if (verBadge) {
      verBadge.textContent = `v${getAppVersion()}`;
    }
    const timelineInfo = document.getElementById('settingsTimelineInfo');
    if (timelineInfo) {
      const months = window.RepairData.months;
      timelineInfo.textContent = `${months[0]} – ${months[months.length - 1]} (${months.length} / 24 Months)`;
    }
  }

  function initSettingsTab() {
    const renameSwitch = document.getElementById('settingAllowBrandRename');
    if (renameSwitch) {
      const savedPref = localStorage.getItem('sawana_setting_brand_rename') === 'true';
      renameSwitch.checked = savedPref;
      renameSwitch.addEventListener('change', () => {
        localStorage.setItem('sawana_setting_brand_rename', renameSwitch.checked);
        renderBrandsManager();
        showToast(renameSwitch.checked ? 'Brand renaming enabled (pencil icons visible)' : 'Brand renaming disabled', 'info');
      });
    }

    const kpiSettingSwitch = document.getElementById('settingShowKpiCards');
    if (kpiSettingSwitch) {
      const savedKpi = localStorage.getItem('sawana_show_kpi_cards');
      const isKpiVisible = (savedKpi === null || savedKpi === 'true');
      kpiSettingSwitch.checked = isKpiVisible;
      kpiSettingSwitch.addEventListener('change', () => {
        if (typeof window.SawanaSetKpiVisibility === 'function') {
          window.SawanaSetKpiVisibility(kpiSettingSwitch.checked);
        }
      });
    }

    updateSettingsInfo();
  }

  /**
   * Overview KPI Metric Cards Toggle
   * When turned OFF, hides the 4 metric cards and enlarges the Brands Overview Timeline Chart
   */
  function initKpiCardsToggle() {
    const overviewSwitch = document.getElementById('toggleKpiCardsSwitch');
    const settingsSwitch = document.getElementById('settingShowKpiCards');
    const kpiGrid = document.getElementById('overviewKpiGrid');
    const timelineCard = document.getElementById('primaryTimelineChartCard');

    function applyKpiVisibility(show) {
      if (kpiGrid) {
        kpiGrid.style.display = show ? 'grid' : 'none';
      }
      if (timelineCard) {
        timelineCard.classList.toggle('chart-card-expanded', !show);
      }
      if (window.RepairCharts && typeof window.RepairCharts.setChartExpanded === 'function') {
        window.RepairCharts.setChartExpanded(!show);
      }
      if (overviewSwitch) overviewSwitch.checked = show;
      if (settingsSwitch) settingsSwitch.checked = show;
      localStorage.setItem('sawana_show_kpi_cards', show ? 'true' : 'false');
    }

    window.SawanaSetKpiVisibility = applyKpiVisibility;

    // Load saved preference (Default: false / OFF as requested)
    const saved = localStorage.getItem('sawana_show_kpi_cards');
    const isVisible = (saved === 'true'); // Default is FALSE (OFF)!
    applyKpiVisibility(isVisible);

    if (overviewSwitch) {
      overviewSwitch.addEventListener('change', () => {
        applyKpiVisibility(overviewSwitch.checked);
        showToast(overviewSwitch.checked ? 'Metric KPI cards enabled' : 'Metric KPI cards hidden (Expanded chart view)', 'info');
      });
    }
  }

  /**
   * Toast System (Right-Hand Screen Origin, Max 3 Notifications Stack)
   */
  function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Limit to maximum 3 notifications: when a new one arrives, dismiss the oldest (top one)
    const existingToasts = container.querySelectorAll('.toast:not(.toast-dismissing)');
    if (existingToasts.length >= 3) {
      const oldest = existingToasts[0];
      oldest.classList.add('toast-dismissing');
      oldest.style.transition = 'opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.28s ease, margin 0.28s ease';
      oldest.style.opacity = '0';
      oldest.style.transform = 'translateX(40px) scale(0.85)';
      oldest.style.maxHeight = '0';
      oldest.style.marginBottom = '0';
      oldest.style.paddingTop = '0';
      oldest.style.paddingBottom = '0';
      setTimeout(() => {
        if (oldest.parentNode) oldest.remove();
      }, 280);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-info'}`;
    const iconName = type === 'success' ? 'check-circle-2' : 'bell';
    toast.innerHTML = `
      <i data-lucide="${iconName}" style="width: 16px; height: 16px; flex-shrink: 0; color: ${type === 'success' ? 'var(--color-emerald)' : 'var(--color-cyan)'};"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    renderAppIcons(toast);

    setTimeout(() => {
      if (toast.parentNode && !toast.classList.contains('toast-dismissing')) {
        toast.classList.add('toast-dismissing');
        toast.style.transition = 'opacity 0.32s cubic-bezier(0.4, 0, 0.2, 1), transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px) scale(0.85)';
        setTimeout(() => {
          if (toast.parentNode) toast.remove();
        }, 320);
      }
    }, 3800);
  }

  window.showToast = showToast;

  /**
   * PWA INSTALLATION & SERVICE WORKER REGISTRATION (Windows & macOS)
   */
  initPwaInstaller();

  function initPwaInstaller() {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('[PWA] Service Worker registered successfully:', reg.scope))
          .catch(err => console.warn('[PWA] Service Worker registration failed:', err));
      });
    }

    // 2. Handle Native Install Prompt
    let deferredPrompt = null;
    const installBtn = document.getElementById('installPwaBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
      }
    });

    if (installBtn) {
      // By default display the button so desktop users know they can install it
      installBtn.style.display = 'inline-flex';

      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            showToast('Installing Sawana Care Desktop App...', 'success');
          }
          deferredPrompt = null;
          installBtn.style.display = 'none';
        } else {
          // If browser already has native install icon or is Safari/Edge
          showToast('Click the "Install" or "App" icon in your browser URL bar to install Sawana Care on your PC or Mac! 💻', 'info');
        }
      });
    }

    window.addEventListener('appinstalled', () => {
      if (installBtn) installBtn.style.display = 'none';
      showToast('🎉 Sawana Care Desktop App installed successfully!', 'success');
    });
  }
});

