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
  currentRangeMonths: 24, // 24, 12, or 6
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

  setBrand(brandKey) {
    this.selectedBrand = brandKey;
    this.renderRepairTimelineChart();
  },

  setTimeRange(numMonths) {
    this.currentRangeMonths = numMonths;
    this.renderRepairTimelineChart();
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
   * Y-Axis: Number of Repairs (0 - 20)
   */
  renderRepairTimelineChart() {
    const allMonths = window.RepairData.months;
    let sliceCount = allMonths.length;
    if (this.currentRangeMonths !== 'ALL' && typeof this.currentRangeMonths === 'number') {
      sliceCount = Math.min(allMonths.length, this.currentRangeMonths);
    }
    const startIndex = Math.max(0, allMonths.length - sliceCount);
    const months = allMonths.slice(startIndex);

    let series = [];
    let colors = [];
    let titleText = '';
    let isAllBrands = (this.selectedBrand === 'ALL');

    if (isAllBrands) {
      // All 16 Brands View
      titleText = `All 16 Mobile Brands Overview (${months[0]} – ${months[months.length - 1]} • ${months.length} Months)`;
      Object.keys(window.RepairData.brands).forEach(k => {
        const b = window.RepairData.brands[k];
        series.push({
          name: b.name,
          data: (b.monthlyRepairs || []).slice(startIndex)
        });
        colors.push(b.color);
      });
    } else {
      // Clean Single Brand Ruler Curve (Strictly Brand Only, No multiple model lines)
      const b = window.RepairData.brands[this.selectedBrand] || window.RepairData.brands['SAMSUNG'];
      titleText = `${b.name} Monthly Repair Trend (${months[0]} – ${months[months.length - 1]} • ${months.length} Months)`;
      series.push({
        name: `${b.name} Repairs`,
        data: (b.monthlyRepairs || []).slice(startIndex)
      });
      colors.push(b.color);
    }

    // Update chart title in DOM
    const titleEl = document.getElementById('timelineChartTitle');
    if (titleEl) {
      titleEl.textContent = titleText;
    }

    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    const gridBorderColor = isLightMode ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.18)';
    const axisLineColor = isLightMode ? 'rgba(0, 0, 0, 0.22)' : 'rgba(255, 255, 255, 0.22)';
    const labelColor = isLightMode ? '#475569' : '#94a3b8';

    const options = {
      series: series,
      chart: {
        type: isAllBrands ? 'line' : 'area',
        height: this.isChartExpanded ? 560 : 400,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
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
        width: isAllBrands ? 2 : 3.5
      },
      fill: {
        type: isAllBrands ? 'solid' : 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      // Never show cluttered labels on lines; strictly hover
      dataLabels: { enabled: false },
      // Markers: 0 on All Brands to keep uncluttered; small on single ruler
      markers: {
        size: isAllBrands ? 0 : (months.length > 18 ? 3 : 4),
        strokeWidth: 2,
        strokeColors: '#ffffff',
        hover: { size: 6 }
      },
      grid: {
        borderColor: gridBorderColor,
        strokeDashArray: 4,
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
        max: 20,
        tickAmount: 5, // 0, 4, 8, 12, 16, 20
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
        show: !isAllBrands,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '12px',
        labels: { colors: labelColor },
        markers: { radius: 6 }
      },
      tooltip: {
        theme: isLightMode ? 'light' : 'dark',
        shared: isAllBrands ? true : false,
        intersect: false,
        y: {
          formatter: (val) => `${val} Repairs`
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
    const brands = window.RepairData.brands;
    const labels = [];
    const series = [];
    const colors = [];

    Object.keys(brands).forEach(k => {
      const b = brands[k];
      labels.push(b.name);
      const total = b.monthlyRepairs.reduce((acc, v) => acc + v, 0);
      series.push(total);
      colors.push(b.color);
    });

    const options = {
      series: series,
      labels: labels,
      colors: colors,
      chart: {
        type: 'donut',
        height: 340,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        background: 'transparent'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: { show: true, fontSize: '12px', color: '#94a3b8' },
              value: {
                show: true,
                fontSize: '22px',
                fontWeight: 800,
                color: '#ffffff',
                formatter: (val) => `${val} Units`
              },
              total: {
                show: true,
                label: '24-Mo Total',
                fontSize: '12px',
                color: '#94a3b8',
                formatter: (w) => {
                  const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return `${total} Repairs`;
                }
              }
            }
          }
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['#0f172a']
      },
      dataLabels: { enabled: false },
      legend: {
        position: 'bottom',
        fontSize: '11px',
        labels: { colors: '#94a3b8' },
        markers: { radius: 10 }
      },
      tooltip: {
        theme: 'dark',
        y: { formatter: (val) => `${val} Phones repaired` }
      }
    };

    const container = document.querySelector('#brandShareChart');
    if (container) {
      if (this.instances.brandShare) {
        this.instances.brandShare.destroy();
      }
      this.instances.brandShare = new ApexCharts(container, options);
      this.instances.brandShare.render();
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
