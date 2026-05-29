import api from "../api";

export const trackAnalyticsEvent = async (payload) => {
  try {
    await api.post("/analytics/events/", payload);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Analytics tracking failed", error);
    }
  }
};
