/**
 * Sawana Mobile Care - Firebase Integration & Firestore Cloud Sync
 * Real-time cloud sync for repair brands, phone models, and monthly items.
 */

// Firebase Configuration from Sawana Project
const firebaseConfig = {
  apiKey: "AIzaSyCKG0MYnRqTx7wyikI9LjxL6outw-yr8Bs",
  authDomain: "sawana-repair-analytics.firebaseapp.com",
  projectId: "sawana-repair-analytics",
  storageBucket: "sawana-repair-analytics.firebasestorage.app",
  messagingSenderId: "291032077443",
  appId: "1:291032077443:web:c01bf24dc91d8712e9f7b6",
  measurementId: "G-5KPXHNPFQR"
};

// Initialize Firebase App
let db = null;
try {
  if (window.firebase) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase Firestore initialized for Sawana Care!");
  }
} catch (err) {
  console.warn("Firebase initialization error:", err);
}

window.SawanaCloud = {
  isCloudReady: () => db !== null,

  /**
   * Save brands and repair items to Firestore Cloud
   */
  async saveToCloud(brandsData) {
    if (!db) {
      console.warn("Firestore not initialized, saving locally only.");
      return false;
    }
    try {
      await db.collection("sawana_analytics").doc("repair_data").set({
        brands: brandsData,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: "Sawana Web Dashboard"
      });
      console.log("Data successfully synced with Firebase Cloud!");
      return true;
    } catch (err) {
      console.error("Error saving to Firestore:", err);
      return false;
    }
  },

  /**
   * Listen for real-time cloud updates across all devices
   */
  subscribeToCloud(onUpdateCallback) {
    if (!db) return;
    try {
      db.collection("sawana_analytics").doc("repair_data")
        .onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data && data.brands) {
              console.log("Real-time cloud update received from Firebase!");
              onUpdateCallback(data.brands);
            }
          }
        }, (error) => {
          console.warn("Firestore subscription error (check rules):", error);
        });
    } catch (err) {
      console.error("Firestore listener setup failed:", err);
    }
  },

  /**
   * Fetch data once from Cloud
   */
  async fetchFromCloud() {
    if (!db) return null;
    try {
      const doc = await db.collection("sawana_analytics").doc("repair_data").get();
      if (doc.exists) {
        return doc.data().brands;
      }
    } catch (err) {
      console.warn("Could not fetch from Firestore:", err);
    }
    return null;
  }
};
