import { useEffect, useState } from "react";
import LandingPage from "./LandingPage";
import RoutingDashboard from "./RoutingDashboard";

export type AppView = "landing" | "app";

export default function App() {
  const [view, setView] = useState<AppView>(() => {
    if (
      typeof window !== "undefined" &&
      (window.location.hash === "#app" || window.location.hash === "#optimizer")
    ) {
      return "app";
    }
    return "landing";
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#app" || window.location.hash === "#optimizer") {
        setView("app");
      } else if (window.location.hash === "#overview" || window.location.hash === "") {
        setView("landing");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLaunch = () => {
    setView("app");
    window.location.hash = "optimizer";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setView("landing");
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-[100dvh]">
      {view === "landing" ? (
        <LandingPage onLaunch={handleLaunch} />
      ) : (
        <RoutingDashboard onBack={handleBack} />
      )}
    </div>
  );
}
