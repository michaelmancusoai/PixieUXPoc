import { Dashboard } from "@/components/Dashboard";
import { useState } from "react";
import { Header } from "@/components/Header";
import { HorizontalNavigation } from "@/components/HorizontalNavigation";
import { VerticalNavigation } from "@/components/VerticalNavigation";
import { CombinedNavigation } from "@/components/CombinedNavigation";
import { TabNavigation } from "@/components/TabNavigation";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [navStyle, setNavStyle] = useState(1);

  const renderNavigation = () => {
    switch (navStyle) {
      case 1:
        return <HorizontalNavigation />;
      case 2:
        return <VerticalNavigation />;
      case 3:
        return <CombinedNavigation />;
      case 4:
        return <TabNavigation />;
      default:
        return <HorizontalNavigation />;
    }
  };

  const isVerticalOrCombined = navStyle === 2 || navStyle === 3;

  return (
    <div className="flex flex-col h-screen">
      <Header currentNavStyle={navStyle} onChangeNavStyle={setNavStyle} />

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`nav-container-${navStyle}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={isVerticalOrCombined ? "flex" : "flex flex-col w-full"}
          >
            {renderNavigation()}
          </motion.div>
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-6 bg-[#F5F7FA]">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}