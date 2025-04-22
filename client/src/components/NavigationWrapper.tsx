import { useState } from "react";
import { Header } from "./Header";
import { HorizontalNavigation } from "./HorizontalNavigation";
import { VerticalNavigation } from "./VerticalNavigation";
import { CombinedNavigation } from "./CombinedNavigation";
import { TabNavigation } from "./TabNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "./Calendar";
import { motion, AnimatePresence } from "framer-motion";

export function NavigationWrapper() {
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
          <div className="mx-auto max-w-6xl">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Navigation Variations</h2>
                <p className="mb-4 text-gray-600">
                  Click on the buttons below to toggle between different navigation styles:
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={navStyle === 1 ? "default" : "outline"}
                    onClick={() => setNavStyle(1)}
                  >
                    Horizontal Navigation
                  </Button>
                  <Button
                    variant={navStyle === 2 ? "default" : "outline"}
                    onClick={() => setNavStyle(2)}
                  >
                    Vertical Sidebar
                  </Button>
                  <Button
                    variant={navStyle === 3 ? "default" : "outline"}
                    onClick={() => setNavStyle(3)}
                  >
                    Combined Navigation
                  </Button>
                  <Button
                    variant={navStyle === 4 ? "default" : "outline"}
                    onClick={() => setNavStyle(4)}
                  >
                    Tab-based Navigation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
