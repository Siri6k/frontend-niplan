// src/components/pwa/InstallBanner.jsx
import { usePWA } from "../../hooks/usePWA";
import { Download, X, Share, PlusSquare } from "lucide-react";
import { useState, useEffect } from "react";

const STORAGE_KEY = "niplan_install_banner_dismissed";

function isIOSSafari() {
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) &&
    /WebKit/.test(ua) &&
    !/(CriOS|FxiOS|OPiOS|mercury)/.test(ua)
  );
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export function InstallBanner() {
  const { canInstall, isInstalled, install } = usePWA();
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) || isStandalone()) {
      setDismissed(true);
      return;
    }

    if (isIOSSafari()) {
      setShowIOS(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  if (dismissed || isInstalled) return null;

  // Android / Chrome
  if (canInstall) {
    return (
      <div className="fixed bottom-[88px] left-0 right-0 z-[60] px-4 animate-slide-up">
        <div className="max-w-md mx-auto bg-green-600 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Download size={20} className="shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight truncate">
                Ajouter Niplan à l'accueil
              </p>
              <p className="text-[11px] opacity-90 leading-tight">
                Accès rapide, moins de données
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={install}
              className="bg-white text-green-700 px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-transform"
            >
              Installer
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 opacity-80 hover:opacity-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS Safari
  if (showIOS) {
    return (
      <div className="fixed bottom-[88px] left-0 right-0 z-[60] px-4 animate-slide-up">
        <div className="max-w-md mx-auto bg-slate-900 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <PlusSquare size={20} className="shrink-0 text-green-400" />
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight truncate">
                Installer sur iPhone
              </p>
              <p className="text-[11px] opacity-90 leading-tight flex items-center gap-1">
                <Share size={10} /> puis "Sur l'écran d'accueil"
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 opacity-80 hover:opacity-100 shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
