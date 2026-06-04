import { useEffect } from "react";

export function usePWAUpdate() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;

    // Écoute le changement de controller (nouveau SW activé)
    const handleControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    // Vérifie les mises à jour au chargement et toutes les 60 secondes
    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
      } catch (err) {
        console.log("SW update check failed:", err);
      }
    };

    // Check immédiat + intervalle
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 60 * 1000);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
      clearInterval(interval);
    };
  }, []);
}
