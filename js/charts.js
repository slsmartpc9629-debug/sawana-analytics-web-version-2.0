/**
 * Sawana Mobile Care - ApexCharts Logic
 * Primary Timeline Focus: Most recent 24 Months (Oct 2024 to Sep 2026)
 * Supports clean Single Brand Ruler or Model Breakdown.
 * All Brands view is strictly uncluttered (numbers only on hover).
 */

window.RepairCharts = {
  instances: {},
  currentViewMode: 'single-brand', // 'single-brand', 'models'
  selectedBrand: 'ALL',
  currentRangeMonths: 24, // 24, 12, 6, 3, or 'CUSTOM'
  customRange: null, // { startIdx, endIdx }
  isChartExpanded: false,

  init() {
    if (typeof ApexCharts === 'undefined') {
      console.warn('ApexCharts not yet defined, waiting...');
      setTimeout(() => this.init(), 60);
      return;
    }
    this.renderRepairTimelineChart();
    this.renderBrandShareDonut();
    this.renderFaultCategoryChart();
    this.renderKpiSparklines();
  },

  selectedBrands: null,
  highlightedDonutBrand: null,

  toggleBrandHighlight(brandKey, fromSliceClick = false) {
    if (!brandKey || this.highlightedDonutBrand === brandKey) {
      // Toggle OFF
      this.highlightedDonutBrand = null;
      if (!fromSliceClick) {
        this.syncDonutSliceSeparation(null);
      }
      if (typeof window.SawanaSelectBrandFromDonut === 'function') {
        window.SawanaSelectBrandFromDonut(null);
      }
    } else {
      // Toggle ON
      this.highlightedDonutBrand = brandKey;
      if (!fromSliceClick) {
        this.syncDonutSliceSeparation(brandKey);
      }
      if (typeof window.SawanaSelectBrandFromDonut === 'function') {
        window.SawanaSelectBrandFromDonut(brandKey);
      }
    }
    this.updateLegendHighlightStyles();
  },

  syncDonutSliceSeparation(brandKey) {
    const chart = this.instances.brandShare;
    if (!chart || !chart.w || !chart.w.globals) return;
    const labels = chart.w.globals.labels || [];

    let targetIdx = -1;
    if (brandKey && window.RepairData.brands[brandKey]) {
      const bName = window.RepairData.brands[brandKey].name;
      targetIdx = labels.indexOf(bName);
    }

    const slices = document.querySelectorAll('#brandShareChart path.apexcharts-pie-area');
    slices.forEach((slice, idx) => {
      const isClicked = slice.getAttribute('data:pieClicked') === 'true';
      if (idx === targetIdx) {
        if (!isClicked && chart.pie && typeof chart.pie.pieClicked === 'function') {
          chart.pie.pieClicked(idx);
        }
      } else {
        if (isClicked && chart.pie && typeof chart.pie.pieClicked === 'function') {
          chart.pie.pieClicked(idx);
        }
      }
    });
  },

  updateLegendHighlightStyles() {
    const items = document.querySelectorAll('#brandShareLegend .brand-share-legend-item');
    items.forEach(el => {
      const k = el.getAttribute('data-brand-key');
      if (this.highlightedDonutBrand && k === this.highlightedDonutBrand) {
        el.classList.add('active-highlight');
      } else {
        el.classList.remove('active-highlight');
      }
    });
  },

  setBrand(brandKey) {
    this.selectedBrand = brandKey;
    this.highlightedDonutBrand = null;
    if (brandKey === 'ALL') {
      this.selectedBrands = Object.keys(window.RepairData.brands);
    } else {
      this.selectedBrands = [brandKey];
    }
    this.renderRepairTimelineChart();
    this.renderBrandShareDonut();
    if (typeof window.SawanaSyncBrandFilterUI === 'function') {
      window.SawanaSyncBrandFilterUI();
    }
  },

  setSelectedBrands(brandsArray) {
    const allKeys = Object.keys(window.RepairData.brands);
    this.highlightedDonutBrand = null;
    if (!brandsArray) {
      this.selectedBrands = allKeys;
      this.selectedBrand = 'ALL';
    } else if (brandsArray.length === 0) {
      this.selectedBrands = [];
      this.selectedBrand = 'NONE';
    } else if (brandsArray.length === allKeys.length) {
      this.selectedBrands = allKeys;
      this.selectedBrand = 'ALL';
    } else if (brandsArray.length === 1) {
      this.selectedBrands = brandsArray;
      this.selectedBrand = brandsArray[0];
    } else {
      this.selectedBrands = brandsArray;
      this.selectedBrand = 'MULTI';
    }
    this.renderRepairTimelineChart();
    this.renderBrandShareDonut();
    if (typeof window.SawanaSyncBrandFilterUI === 'function') {
      window.SawanaSyncBrandFilterUI();
    }
  },

  getActiveTimeRangeIndices() {
    const allMonths = window.RepairData.months || [];
    let startIndex = 0;
    let endIndex = allMonths.length;

    if (this.currentRangeMonths === 'CUSTOM' && this.customRange) {
      startIndex = Math.max(0, this.customRange.startIdx);
      endIndex = Math.min(allMonths.length, this.customRange.endIdx + 1);
    } else if (this.currentRangeMonths !== 'ALL' && typeof this.currentRangeMonths === 'number') {
      const sliceCount = Math.min(allMonths.length, this.currentRangeMonths);
      startIndex = Math.max(0, allMonths.length - sliceCount);
      endIndex = allMonths.length;
    } else if (this.currentRangeMonths === 'ALL') {
      // If dataset contains more than 24 months, chart defaults to the latest 24 months
      if (allMonths.length > 24) {
        startIndex = Math.max(0, allMonths.length - 24);
        endIndex = allMonths.length;
      }
    }
    return { startIndex, endIndex };
  },

  setTimeRange(numMonths) {
    this.currentRangeMonths = numMonths;
    this.customRange = null;
    this.highlightedDonutBrand = null;
    this.renderRepairTimelineChart();
    this.renderBrandShareDonut();
    if (typeof window.SawanaRenderBrandModelsPanel === 'function') {
      window.SawanaRenderBrandModelsPanel(this.selectedBrand || 'ALL');
    }
  },

  setCustomTimeRange(startIdx, endIdx) {
    this.currentRangeMonths = 'CUSTOM';
    this.customRange = {
      startIdx: Math.min(startIdx, endIdx),
      endIdx: Math.max(startIdx, endIdx)
    };
    this.highlightedDonutBrand = null;
    this.renderRepairTimelineChart();
    this.renderBrandShareDonut();
    if (typeof window.SawanaRenderBrandModelsPanel === 'function') {
      window.SawanaRenderBrandModelsPanel(this.selectedBrand || 'ALL');
    }
  },

  setChartExpanded(isExpanded) {
    this.isChartExpanded = !!isExpanded;
    const targetHeight = this.isChartExpanded ? 560 : 400;
    if (this.instances.timeline) {
      this.instances.timeline.updateOptions({
        chart: {
          height: targetHeight
        }
      });
    }
  },

  /**
   * Primary Time-Series Chart (Rolling Window: Aug 2025 – Aug 2026 • Max 24 Months)
   * Supports Single Brand Ruler, Multi-Brand Comparison, or All 16 Brands
   */
  renderRepairTimelineChart() {
    const allMonths = window.RepairData.months;
    const { startIndex, endIndex } = this.getActiveTimeRangeIndices();
    const months = allMonths.slice(startIndex, endIndex);

    const allBrandKeys = Object.keys(window.RepairData.brands);
    let activeBrandKeys = this.selectedBrands;
    if (activeBrandKeys === undefined || activeBrandKeys === null) {
      if (this.selectedBrand && this.selectedBrand !== 'ALL' && window.RepairData.brands[this.selectedBrand]) {
        activeBrandKeys = [this.selectedBrand];
      } else {
        activeBrandKeys = allBrandKeys;
      }
    }

    const isNone = (activeBrandKeys && activeBrandKeys.length === 0);
    const isAll = (!isNone && activeBrandKeys.length === allBrandKeys.length);
    const isSingle = (!isNone && activeBrandKeys.length === 1);

    let series = [];
    let colors = [];
    let titleText = '';

    if (isNone) {
      titleText = 'Repair Trend Comparison';
      series.push({
        name: 'No Brands Selected',
        data: months.map(() => 0)
      });
      colors.push('#64748b');
    } else if (isAll) {
      // All Brands View
      titleText = `Mobile Repair Brands Overview`;
      activeBrandKeys.forEach(k => {
        const b = window.RepairData.brands[k];
        if (!b) return;
        series.push({
          name: b.name,
          data: (b.monthlyRepairs || []).slice(startIndex, endIndex)
        });
        colors.push(b.color);
      });
    } else if (isSingle) {
      // Clean Single Brand Ruler Curve
      const b = window.RepairData.brands[activeBrandKeys[0]] || window.RepairData.brands['SAMSUNG'];
      titleText = `${b.name} Monthly Repair Trend`;
      series.push({
        name: `${b.name} Repairs`,
        data: (b.monthlyRepairs || []).slice(startIndex, endIndex)
      });
      colors.push(b.color);
    } else {
      // Multi-Brand Comparison (No brand counts in title)
      titleText = `Repair Trend Comparison`;
      activeBrandKeys.forEach(k => {
        const b = window.RepairData.brands[k];
        if (!b) return;
        series.push({
          name: b.name,
          data: (b.monthlyRepairs || []).slice(startIndex, endIndex)
        });
        colors.push(b.color);
      });
    }

    // Update chart title in DOM
    const titleEl = document.getElementById('timelineChartTitle');
    if (titleEl) {
      titleEl.textContent = titleText;
    }

    // Update active brand badge (No brand counts)
    const badgeEl = document.getElementById('activeBrandBadge');
    if (badgeEl) {
      if (isNone) {
        badgeEl.textContent = 'None Selected';
        badgeEl.style.background = 'rgba(100, 116, 139, 0.2)';
        badgeEl.style.color = '#94a3b8';
      } else if (isAll) {
        badgeEl.textContent = 'All Brands';
        badgeEl.style.background = 'rgba(6, 182, 212, 0.15)';
        badgeEl.style.color = 'var(--color-cyan)';
      } else if (isSingle) {
        const b = window.RepairData.brands[activeBrandKeys[0]];
        badgeEl.textContent = `${b ? b.name : activeBrandKeys[0]} Focused`;
        badgeEl.style.background = b ? `${b.color}25` : 'rgba(59, 130, 246, 0.2)';
        badgeEl.style.color = b ? b.color : '#3b82f6';
      } else {
        badgeEl.textContent = 'Comparison View';
        badgeEl.style.background = 'rgba(168, 85, 247, 0.2)';
        badgeEl.style.color = '#c084fc';
      }
    }

    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    const gridBorderColor = isLightMode ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.18)';
    const axisLineColor = isLightMode ? 'rgba(0, 0, 0, 0.22)' : 'rgba(255, 255, 255, 0.22)';
    const labelColor = isLightMode ? '#475569' : '#94a3b8';

    // Calculate auto-optimized Y-axis max and tick intervals (maxVal + 2, steps of 2)
    let maxVal = 0;
    series.forEach(s => {
      (s.data || []).forEach(v => {
        const num = Number(v);
        if (!isNaN(num) && num > maxVal) maxVal = num;
      });
    });
    let yMax = maxVal + 2;
    if (yMax % 2 !== 0) yMax += 1;
    if (yMax < 6) yMax = 6;
    let tickAmount = yMax / 2;
    if (tickAmount > 20) {
      yMax = Math.ceil((maxVal + 2) / 5) * 5;
      tickAmount = yMax / 5;
    }

    const options = {
      series: series,
      chart: {
        type: isSingle ? 'area' : 'line',
        height: this.isChartExpanded ? 560 : 400,
        toolbar: {
          show: false
        },
        selection: {
          enabled: false
        },
        zoom: {
          enabled: false
        },
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 400
        }
      },
      colors: colors,
      stroke: {
        curve: 'smooth',
        width: isSingle ? 3.5 : (isAll ? 2 : 2.6)
      },
      fill: {
        type: isSingle ? 'gradient' : 'solid',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      // Never show cluttered labels on lines; strictly hover
      dataLabels: { enabled: false },
      // Markers: 0 on All Brands to keep uncluttered; small on single/multi
      markers: {
        size: isAll ? 0 : (months.length > 18 ? 3 : 4),
        strokeWidth: 2,
        strokeColors: '#ffffff',
        hover: { size: 6 }
      },
      grid: {
        borderColor: gridBorderColor,
        strokeDashArray: 3,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: true } }
      },
      xaxis: {
        categories: months,
        axisBorder: { show: true, color: axisLineColor },
        axisTicks: { show: true, color: axisLineColor },
        labels: {
          rotate: -45,
          rotateAlways: true,
          style: {
            colors: labelColor,
            fontSize: months.length > 18 ? '10px' : '11px',
            fontWeight: 500
          }
        }
      },
      yaxis: {
        min: 0,
        max: yMax,
        tickAmount: tickAmount,
        forceNiceScale: false,
        axisBorder: { show: true, color: axisLineColor },
        axisTicks: { show: true, color: axisLineColor },
        title: {
          text: 'Number of Repairs',
          style: {
            color: labelColor,
            fontSize: '13px',
            fontWeight: 600
          }
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px'
          },
          formatter: (val) => Math.round(val)
        }
      },
      legend: {
        show: !isSingle,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '12px',
        labels: { colors: labelColor },
        markers: { radius: 6 }
      },
      tooltip: {
        theme: isLightMode ? 'light' : 'dark',
        shared: true,
        intersect: false,
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          const month = (w.globals.categoryLabels && w.globals.categoryLabels[dataPointIndex]) ||
                        (w.globals.labels && w.globals.labels[dataPointIndex]) || '';
          const isLight = document.documentElement.getAttribute('data-theme') === 'light';

          let monthTotal = 0;
          const brandRows = [];
          if (w.globals.seriesNames && series) {
            w.globals.seriesNames.forEach((name, sIdx) => {
              const val = (series[sIdx] && series[sIdx][dataPointIndex] !== undefined) ? series[sIdx][dataPointIndex] : 0;
              const color = (w.globals.colors && w.globals.colors[sIdx]) || '#6366f1';
              monthTotal += (val || 0);
              brandRows.push({ name, val: val || 0, color });
            });
          }

          brandRows.sort((a, b) => b.val - a.val);
          const isMultiCol = brandRows.length > 5;

          return `
            <div class="sawana-timeline-tooltip" style="
              background: ${isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.98)'};
              backdrop-filter: blur(16px);
              border: 1px solid ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)'};
              box-shadow: 0 20px 45px rgba(0, 0, 0, ${isLight ? '0.18' : '0.6'}), 0 0 0 1px ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'};
              border-radius: 10px;
              padding: 10px 14px;
              color: ${isLight ? '#0f172a' : '#f8fafc'};
              font-family: 'Plus Jakarta Sans', sans-serif;
              min-width: ${isMultiCol ? '330px' : '210px'};
              max-width: 460px;
              max-height: calc(85vh - 40px);
              overflow-y: auto;
              pointer-events: none;
              z-index: 999999;
            ">
              <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}; padding-bottom:6px; margin-bottom:8px;">
                <span style="font-weight:800; font-size:0.84rem; letter-spacing:0.02em;">${month}</span>
                <span style="font-size:0.75rem; font-weight:700; color:${isLight ? '#6366f1' : '#a855f7'}; background:${isLight ? 'rgba(99,102,241,0.1)' : 'rgba(168,85,247,0.2)'}; padding:2px 8px; border-radius:99px;">
                  ${monthTotal} Total Units
                </span>
              </div>
              <div style="display:grid; grid-template-columns:${isMultiCol ? 'repeat(2, 1fr)' : '1fr'}; gap:5px 12px;">
                ${brandRows.map(b => `
                  <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:2px 4px; border-radius:4px;">
                    <div style="display:flex; align-items:center; gap:6px; min-width:0;">
                      <span style="width:7px; height:7px; border-radius:50%; background:${b.color}; flex-shrink:0; box-shadow:0 0 4px ${b.color}80;"></span>
                      <span style="font-size:0.75rem; font-weight:600; color:${isLight ? '#334155' : '#cbd5e1'}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${b.name}</span>
                    </div>
                    <span style="font-size:0.74rem; font-weight:700; color:${b.color};">${b.val}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }
    };

    const container = document.querySelector('#repairTimelineChart');
    if (container) {
      if (this.instances.timeline) {
        this.instances.timeline.destroy();
      }
      this.instances.timeline = new ApexCharts(container, options);
      this.instances.timeline.render();
    }
  },

  renderBrandShareDonut() {
    const allMonths = window.RepairData.months;
    const { startIndex, endIndex } = this.getActiveTimeRangeIndices();
    const activeMonths = allMonths.slice(startIndex, endIndex);
    const rangeLabel = `${activeMonths.length} Months`;

    const brands = window.RepairData.brands;
    const allBrandKeys = Object.keys(brands);
    let activeBrandKeys = this.selectedBrands;
    if (activeBrandKeys === undefined || activeBrandKeys === null) {
      if (this.selectedBrand && this.selectedBrand !== 'ALL' && window.RepairData.brands[this.selectedBrand]) {
        activeBrandKeys = [this.selectedBrand];
      } else {
        activeBrandKeys = allBrandKeys;
      }
    }

    const labels = [];
    const series = [];
    const colors = [];
    const brandEntries = []; // for custom legend

    if (activeBrandKeys.length === 0) {
      labels.push('No Brands Selected');
      series.push(1);
      colors.push('#64748b');
    } else {
      activeBrandKeys.forEach(k => {
        const b = brands[k];
        if (!b) return;
        const sliced = (b.monthlyRepairs || []).slice(startIndex, endIndex);
        const total = sliced.reduce((acc, v) => acc + (v || 0), 0);
        labels.push(b.name);
        series.push(total);
        colors.push(b.color);
        brandEntries.push({ key: k, name: b.name, color: b.color, total });
      });
    }

    const grandTotal = series.reduce((a, b) => a + b, 0) || 1;
    // Sort for legend: highest first
    brandEntries.sort((a, b) => b.total - a.total);

    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    const legendColor = isLightMode ? '#334155' : '#94a3b8';
    const centerColor = isLightMode ? '#0f172a' : '#ffffff';
    const brandNameColor = isLightMode ? '#0f172a' : '#f8fafc';
    const legendBg = isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
    const legendBgHover = isLightMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';

    const options = {
      series: series,
      labels: labels,
      colors: colors,
      chart: {
        type: 'donut',
        height: 300,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        background: 'transparent',
        toolbar: { show: false },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const idx = config.dataPointIndex;
            if (idx >= 0 && labels[idx]) {
              const clickedName = labels[idx];
              const foundKey = Object.keys(brands).find(k => brands[k].name === clickedName);
              if (foundKey) {
                this.toggleBrandHighlight(foundKey, true);
              }
            }
          },
          dataPointMouseEnter: (event, chartContext, config) => {
            const idx = config.dataPointIndex;
            if (idx >= 0 && labels[idx]) {
              const hoveredName = labels[idx];
              const foundKey = Object.keys(brands).find(k => brands[k].name === hoveredName);
              if (foundKey && typeof window.SawanaPreviewBrandModels === 'function') {
                window.SawanaPreviewBrandModels(foundKey);
              }
            }
          },
          dataPointMouseLeave: (event, chartContext, config) => {
            if (typeof window.SawanaRestoreBrandModels === 'function') {
              window.SawanaRestoreBrandModels();
            }
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 600,
          animateGradually: { enabled: true, delay: 80 },
          dynamicAnimation: { enabled: true, speed: 400 }
        }
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
          donut: {
            size: '68%',
            labels: {
              show: true,
              name: { show: true, fontSize: '11px', color: legendColor, offsetY: -4 },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: 800,
                color: centerColor,
                offsetY: 6,
                formatter: (val) => `${val}`
              },
              total: {
                show: true,
                label: rangeLabel,
                fontSize: '10px',
                color: legendColor,
                formatter: (w) => {
                  const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return `${total} Units`;
                }
              }
            }
          }
        }
      },
      stroke: {
        show: false,
        width: 0,
        colors: []
      },
      dataLabels: { enabled: false },
      legend: { show: false }, // Hidden — we use custom right-panel legend
      tooltip: {
        theme: isLightMode ? 'light' : 'dark',
        y: { formatter: (val) => {
          const pct = ((val / grandTotal) * 100).toFixed(1);
          return `${val} Repairs (${pct}%)`;
        }}
      }
    };

    const container = document.querySelector('#brandShareChart');
    if (container) {
      if (this.instances.brandShare) {
        this.instances.brandShare.destroy();
      }
      this.instances.brandShare = new ApexCharts(container, options);
      this.instances.brandShare.render().then(() => {
        if (this.highlightedDonutBrand) {
          setTimeout(() => this.syncDonutSliceSeparation(this.highlightedDonutBrand), 150);
        }
      });
    }

    // ── Custom two-column aligned interactive legend (no scrollbar) ───────────
    const legendEl = document.getElementById('brandShareLegend');
    if (legendEl) {
      legendEl.innerHTML = brandEntries.map(e => {
        const pct = ((e.total / grandTotal) * 100).toFixed(1);
        const isActive = this.highlightedDonutBrand === e.key;
        return `
          <div class="brand-share-legend-item ${isActive ? 'active-highlight' : ''}"
            data-brand-key="${e.key}"
            style="
              display:flex; align-items:center; justify-content:space-between; gap:6px;
              padding: 5px 8px; border-radius: 7px;
              background: ${legendBg};
              transition: all 0.18s ease;
              cursor: pointer;
              --item-brand-color: ${e.color};
            "
            onclick="window.RepairCharts.toggleBrandHighlight('${e.key}')"
            onmouseenter="if (!this.classList.contains('active-highlight')) this.style.background='${legendBgHover}'; if (typeof window.SawanaPreviewBrandModels === 'function') window.SawanaPreviewBrandModels('${e.key}');"
            onmouseleave="if (!this.classList.contains('active-highlight')) this.style.background='${legendBg}'; if (typeof window.SawanaRestoreBrandModels === 'function') window.SawanaRestoreBrandModels();"
            title="Click to highlight ${e.name} models (click again to deselect)"
          >
            <div style="display:flex; align-items:center; gap:6px; min-width:0;">
              <span style="width:8px; height:8px; border-radius:50%; background:${e.color}; flex-shrink:0; box-shadow:0 0 5px ${e.color}70;"></span>
              <span style="font-size:0.75rem; font-weight:700; color:${brandNameColor}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${e.name}</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px; flex-shrink:0;">
              <span style="font-size:0.72rem; font-weight:700; color:${e.color}; white-space:nowrap;">${e.total}</span>
              <span style="font-size:0.67rem; font-weight:500; color:${legendColor}; white-space:nowrap;">(${pct}%)</span>
            </div>
          </div>
        `;
      }).join('');
    }
  },


  renderFaultCategoryChart() {
    const faults = window.RepairData.faultCategories;

    const options = {
      series: [{
        name: 'Repair Count',
        data: faults.map(f => f.count)
      }],
      chart: {
        type: 'bar',
        height: 290,
        toolbar: { show: false },
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        background: 'transparent'
      },
      colors: faults.map(f => f.color),
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '45%',
          distributed: true
        }
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        strokeDashArray: 4
      },
      xaxis: {
        categories: faults.map(f => f.label),
        labels: {
          style: { colors: '#94a3b8', fontSize: '11px' },
          formatter: (val) => val.length > 15 ? val.substring(0, 15) + '...' : val
        }
      },
      yaxis: {
        labels: {
          style: { colors: '#94a3b8', fontSize: '12px' },
          formatter: (val) => `${val}`
        }
      },
      legend: { show: false },
      tooltip: {
        theme: 'dark',
        y: { formatter: (val) => `${val} Repairs Logged` }
      }
    };

    const container = document.querySelector('#faultCategoryChart');
    if (container) {
      if (this.instances.faultChart) {
        this.instances.faultChart.destroy();
      }
      this.instances.faultChart = new ApexCharts(container, options);
      this.instances.faultChart.render();
    }
  },

  renderKpiSparklines() {
    const sparklines = [
      { id: '#sparklineTotal', color: '#3b82f6', data: [90, 105, 118, 122, 135, 140, 138, 145, 150, 135, 152, 160, 155, 168, 172, 185, 190, 178, 182, 195, 188, 198, 192, 202] },
      { id: '#sparklineTopBrand', color: '#ef4444', data: [11, 13, 14, 12, 14, 15, 13, 15, 16, 14, 16, 18, 15, 19, 17, 18, 20, 16, 17, 19, 18, 20, 19, 20] },
      { id: '#sparklineWorkshop', color: '#10b981', data: [8, 10, 12, 11, 14, 15, 13, 16, 14, 12, 15, 17, 14, 16, 15, 18, 17, 15, 16, 18, 16, 19, 15, 14] },
      { id: '#sparklineRate', color: '#06b6d4', data: [94, 94, 95, 95, 95, 96, 96, 96, 97, 96, 96, 97, 96, 97, 96, 97, 98, 97, 98, 98, 98, 99, 98, 99] }
    ];

    sparklines.forEach(conf => {
      const el = document.querySelector(conf.id);
      if (!el) return;

      const opts = {
        chart: { type: 'area', height: 38, sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.05 } },
        series: [{ data: conf.data }],
        colors: [conf.color],
        tooltip: { enabled: false }
      };

      const chart = new ApexCharts(el, opts);
      chart.render();
    });
  }
};
