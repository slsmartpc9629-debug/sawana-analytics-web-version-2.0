/**
 * Sawana Mobile Care - Master Datasets
 * Currently tracks August 2025 to August 2026 (13 active months).
 * Enforces a strict Maximum 24-Month Rolling Window (FIFO):
 * When future months are added beyond 24, the earliest month automatically rolls off.
 */

window.RepairData = {
  MAX_MONTHS: 24,

  // Active timeline (Currently Aug 2025 to Aug 2026 • 13 Months)
  months: [
  "Aug 2025",
  "Sep 2025",
  "Oct 2025",
  "Nov 2025",
  "Dec 2025",
  "Jan 2026",
  "Feb 2026",
  "Mar 2026",
  "Apr 2026",
  "May 2026",
  "Jun 2026",
  "Jul 2026",
  "Aug 2026"
],

  // 16 Mobile Brands with current repair data
  brands: {
  "SAMSUNG": {
    "name": "SAMSUNG",
    "color": "#3b82f6",
    "monthlyRepairs": [
      16,
      18,
      15,
      19,
      17,
      18,
      20,
      16,
      17,
      19,
      18,
      20,
      19
    ],
    "models": {
      "Galaxy S24": [
        4,
        5,
        4,
        6,
        5,
        4,
        5,
        4,
        4,
        5,
        5,
        6,
        5
      ],
      "Galaxy A54 5G": [
        5,
        5,
        4,
        5,
        4,
        5,
        6,
        5,
        5,
        5,
        4,
        5,
        5
      ],
      "Galaxy A14": [
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        4,
        4,
        5,
        5,
        5,
        5
      ],
      "Galaxy M14": [
        2,
        3,
        2,
        3,
        2,
        3,
        3,
        2,
        3,
        3,
        3,
        3,
        3
      ],
      "Galaxy Z Flip5": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "Redmi": {
    "name": "Redmi",
    "color": "#ef4444",
    "monthlyRepairs": [
      15,
      14,
      16,
      18,
      17,
      19,
      18,
      17,
      19,
      18,
      19,
      17,
      18
    ],
    "models": {
      "Note 13 Pro": [
        4,
        4,
        5,
        6,
        5,
        6,
        5,
        5,
        6,
        5,
        6,
        5,
        6
      ],
      "Note 12 4G": [
        5,
        4,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ],
      "Redmi 12C": [
        3,
        3,
        3,
        4,
        4,
        4,
        5,
        4,
        4,
        5,
        4,
        4,
        4
      ],
      "Redmi 10A": [
        2,
        2,
        2,
        2,
        2,
        3,
        2,
        2,
        3,
        2,
        3,
        2,
        2
      ],
      "Redmi K60": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "Vivo": {
    "name": "Vivo",
    "color": "#6366f1",
    "monthlyRepairs": [
      12,
      11,
      14,
      15,
      13,
      16,
      15,
      14,
      15,
      16,
      17,
      15,
      16
    ],
    "models": {
      "V30 5G": [
        3,
        3,
        4,
        5,
        4,
        5,
        5,
        4,
        5,
        5,
        5,
        5,
        5
      ],
      "Y27": [
        4,
        4,
        4,
        4,
        4,
        5,
        4,
        4,
        4,
        5,
        5,
        4,
        5
      ],
      "Y17s": [
        3,
        2,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        4,
        3,
        3
      ],
      "V29e": [
        1,
        1,
        2,
        2,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2
      ],
      "T2x 5G": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "Infinix": {
    "name": "Infinix",
    "color": "#10b981",
    "monthlyRepairs": [
      10,
      12,
      11,
      14,
      13,
      15,
      14,
      13,
      16,
      15,
      16,
      14,
      15
    ],
    "models": {
      "Note 40 Pro": [
        3,
        4,
        3,
        5,
        4,
        5,
        4,
        4,
        5,
        5,
        5,
        4,
        5
      ],
      "Hot 40i": [
        3,
        4,
        4,
        4,
        4,
        5,
        5,
        4,
        5,
        5,
        5,
        5,
        5
      ],
      "Smart 8": [
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        3,
        4,
        3,
        4,
        3,
        3
      ],
      "Zero 30": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "GT 10 Pro": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "Honor": {
    "name": "Honor",
    "color": "#06b6d4",
    "monthlyRepairs": [
      9,
      8,
      11,
      12,
      10,
      13,
      12,
      11,
      13,
      14,
      15,
      13,
      14
    ],
    "models": {
      "Magic 6 Pro": [
        2,
        2,
        3,
        3,
        2,
        3,
        3,
        3,
        3,
        4,
        4,
        3,
        4
      ],
      "Honor X9b": [
        3,
        3,
        4,
        4,
        4,
        5,
        4,
        4,
        5,
        5,
        5,
        5,
        5
      ],
      "Honor 90 Lite": [
        2,
        2,
        2,
        3,
        2,
        3,
        3,
        2,
        3,
        3,
        3,
        3,
        3
      ],
      "Honor X8b": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1
      ],
      "Honor 70": [
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "ZTE": {
    "name": "ZTE",
    "color": "#8b5cf6",
    "monthlyRepairs": [
      6,
      7,
      8,
      9,
      8,
      10,
      9,
      8,
      11,
      10,
      12,
      11,
      12
    ],
    "models": {
      "Blade V50": [
        2,
        2,
        3,
        3,
        3,
        4,
        3,
        3,
        4,
        4,
        4,
        4,
        4
      ],
      "Blade A72": [
        2,
        2,
        2,
        3,
        2,
        3,
        3,
        2,
        3,
        3,
        4,
        3,
        4
      ],
      "Nubia Neo 5G": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        2,
        2,
        2
      ],
      "Axon 40": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "Blade A53": [
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "Nokia": {
    "name": "Nokia",
    "color": "#0ea5e9",
    "monthlyRepairs": [
      7,
      8,
      7,
      9,
      8,
      9,
      10,
      9,
      10,
      11,
      11,
      10,
      11
    ],
    "models": {
      "G42 5G": [
        2,
        2,
        2,
        3,
        2,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3
      ],
      "C32": [
        2,
        3,
        2,
        3,
        3,
        3,
        3,
        3,
        3,
        4,
        4,
        3,
        4
      ],
      "G22": [
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        2,
        2,
        2,
        2,
        2
      ],
      "C12": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "X30 5G": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "TCL": {
    "name": "TCL",
    "color": "#f59e0b",
    "monthlyRepairs": [
      5,
      6,
      6,
      7,
      7,
      8,
      8,
      7,
      9,
      8,
      9,
      8,
      9
    ],
    "models": {
      "TCL 40 SE": [
        2,
        2,
        2,
        3,
        2,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3
      ],
      "TCL 30+": [
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        3,
        2,
        3,
        2,
        3
      ],
      "TCL 403": [
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        1,
        2,
        2,
        2,
        2,
        2
      ],
      "TCL 20 Pro": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "ALCATEL": {
    "name": "ALCATEL",
    "color": "#ec4899",
    "monthlyRepairs": [
      4,
      4,
      5,
      6,
      5,
      6,
      6,
      5,
      7,
      6,
      7,
      6,
      7
    ],
    "models": {
      "1B (2022)": [
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        3,
        2,
        3,
        2,
        3
      ],
      "1S (2021)": [
        1,
        1,
        1,
        2,
        1,
        2,
        2,
        1,
        2,
        2,
        2,
        2,
        2
      ],
      "3L": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "1SE": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "Blackview": {
    "name": "Blackview",
    "color": "#94a3b8",
    "monthlyRepairs": [
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      6,
      8,
      7,
      8,
      7,
      8
    ],
    "models": {
      "BV9300 Rugged": [
        1,
        2,
        2,
        2,
        2,
        3,
        3,
        2,
        3,
        3,
        3,
        3,
        3
      ],
      "A52 Pro": [
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2
      ],
      "Oscal C80": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        2,
        1,
        2
      ],
      "Shark 8": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "umidigi": {
    "name": "umidigi",
    "color": "#14b8a6",
    "monthlyRepairs": [
      3,
      4,
      4,
      5,
      5,
      6,
      5,
      5,
      6,
      6,
      7,
      6,
      6
    ],
    "models": {
      "BISON GT2": [
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        3,
        2,
        2
      ],
      "A13 Pro": [
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        2,
        2,
        2,
        2,
        2
      ],
      "Power 7 Max": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "G3 Plus": [
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "greentel": {
    "name": "greentel",
    "color": "#22c55e",
    "monthlyRepairs": [
      3,
      3,
      4,
      5,
      4,
      5,
      5,
      4,
      6,
      5,
      6,
      5,
      6
    ],
    "models": {
      "Max 4G": [
        1,
        1,
        1,
        2,
        1,
        2,
        2,
        1,
        2,
        2,
        2,
        2,
        2
      ],
      "Prime X": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        2,
        1,
        2
      ],
      "Falcon Pro": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "Neon 2": [
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "KXD": {
    "name": "KXD",
    "color": "#eab308",
    "monthlyRepairs": [
      2,
      3,
      3,
      4,
      4,
      5,
      4,
      4,
      5,
      5,
      5,
      4,
      5
    ],
    "models": {
      "A10": [
        1,
        1,
        1,
        2,
        1,
        2,
        2,
        1,
        2,
        2,
        2,
        2,
        2
      ],
      "D68": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "6A": [
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "W50": [
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        1,
        1,
        1,
        1,
        0,
        1
      ]
    }
  },
  "BTS": {
    "name": "BTS",
    "color": "#a855f7",
    "monthlyRepairs": [
      2,
      2,
      3,
      4,
      3,
      4,
      4,
      3,
      5,
      4,
      5,
      4,
      5
    ],
    "models": {
      "Smart One": [
        1,
        1,
        1,
        2,
        1,
        2,
        2,
        1,
        2,
        2,
        2,
        2,
        2
      ],
      "Vibe 4G": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "Spark B1": [
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "Neo Pro": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        1
      ]
    }
  },
  "Pluz": {
    "name": "Pluz",
    "color": "#f97316",
    "monthlyRepairs": [
      2,
      2,
      2,
      3,
      3,
      4,
      3,
      3,
      4,
      4,
      4,
      3,
      4
    ],
    "models": {
      "Pluz P10": [
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        2,
        2,
        2,
        1,
        2
      ],
      "Pluz Note 8": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "Pluz Swift 4G": [
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  "Ajmal": {
    "name": "Ajmal",
    "color": "#d946ef",
    "monthlyRepairs": [
      1,
      2,
      2,
      3,
      2,
      3,
      3,
      3,
      4,
      3,
      4,
      3,
      4
    ],
    "models": {
      "Ajmal Star 5G": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        2,
        1,
        2
      ],
      "Ajmal Bold 4": [
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "Ajmal Prime Pro": [
        0,
        0,
        0,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  }
},

  // Fault Categories
  faultCategories: [
  {
    "label": "Display / Screen Replacement",
    "percentage": 42,
    "count": 910,
    "color": "#3b82f6",
    "icon": "smartphone"
  },
  {
    "label": "Battery Replacement / Swollen",
    "percentage": 25,
    "count": 540,
    "color": "#10b981",
    "icon": "battery-charging"
  },
  {
    "label": "Charging Port & Flex Ribbon",
    "percentage": 16,
    "count": 345,
    "color": "#f59e0b",
    "icon": "zap"
  },
  {
    "label": "Motherboard / Power IC Repair",
    "percentage": 10,
    "count": 215,
    "color": "#ec4899",
    "icon": "cpu"
  },
  {
    "label": "Water Damage & Liquid Cleaning",
    "percentage": 7,
    "count": 152,
    "color": "#06b6d4",
    "icon": "droplets"
  }
],

  /**
   * Helper to calculate the next month label string
   */
  getNextMonthLabel(lastStr) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentLast = lastStr || this.months[this.months.length - 1];
    const [mon, yrStr] = currentLast.split(' ');
    let idx = monthNames.indexOf(mon);
    let year = parseInt(yrStr, 10);
    if (idx === 11) {
      idx = 0;
      year++;
    } else {
      idx++;
    }
    return `${monthNames[idx]} ${year}`;
  },

  /**
   * Add a new month to the timeline (Rolling 24-Month window)
   * Automatically drops the oldest month if length exceeds 24.
   */
  addMonth(newMonthName) {
    const monthToAdd = newMonthName ? newMonthName.trim() : this.getNextMonthLabel();
    
    // Avoid duplicate month
    if (this.months.includes(monthToAdd)) {
      return { success: false, reason: 'Month already exists' };
    }

    // Append new month
    this.months.push(monthToAdd);

    // Append 0 count for all brands and models
    Object.keys(this.brands).forEach(k => {
      const b = this.brands[k];
      if (!Array.isArray(b.monthlyRepairs)) b.monthlyRepairs = [];
      b.monthlyRepairs.push(0);

      if (b.models) {
        Object.keys(b.models).forEach(m => {
          if (!Array.isArray(b.models[m])) b.models[m] = [];
          b.models[m].push(0);
        });
      }
    });

    // Enforce strict Max 24-Month Window (Drop oldest month)
    let droppedMonth = null;
    if (this.months.length > this.MAX_MONTHS) {
      droppedMonth = this.months.shift();
      Object.keys(this.brands).forEach(k => {
        const b = this.brands[k];
        if (b.monthlyRepairs && b.monthlyRepairs.length > this.MAX_MONTHS) {
          b.monthlyRepairs.shift();
        }
        if (b.models) {
          Object.keys(b.models).forEach(m => {
            if (b.models[m] && b.models[m].length > this.MAX_MONTHS) {
              b.models[m].shift();
            }
          });
        }
      });
    }

    return {
      success: true,
      added: monthToAdd,
      dropped: droppedMonth,
      totalMonths: this.months.length
    };
  }
};
