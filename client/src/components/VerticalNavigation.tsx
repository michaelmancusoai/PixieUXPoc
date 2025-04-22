import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationData, activeSection, activeSubSection } from "@/lib/navigation-data";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function VerticalNavigation() {
  const [activeNav, setActiveNav] = useState(activeSection.href);
  const [activeSubNav, setActiveSubNav] = useState(activeSubSection.href);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [activeSection.href]: true,
  });

  const toggleSection = (href: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
    setActiveNav(href);
  };

  return (
    <div className="w-64 bg-white border-r border-neutral-border flex-shrink-0 h-full overflow-y-auto">
      <div className="p-3">
        <div className="flex items-center py-2 px-3 rounded-md bg-gray-50 border border-neutral-border">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <Input
            type="text"
            placeholder="Search..."
            className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 shadow-none"
          />
        </div>
      </div>
      
      <nav className="mt-2">
        {navigationData.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              onClick={() => toggleSection(item.href)}
              className={cn(
                "flex items-center justify-between px-3 py-3 text-gray-700 hover:bg-gray-100 border-l-4 border-transparent",
                activeNav === item.href && "text-primary bg-primary/5 border-l-4 border-primary"
              )}
            >
              <div className="flex items-center">
                <item.icon className="h-4 w-4 ml-2 mr-3" />
                <span className="font-medium">{item.title}</span>
              </div>
              {expandedSections[item.href] ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
            </Link>
            
            <AnimatePresence>
              {expandedSections[item.href] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 pl-5 border-l border-gray-200 overflow-hidden"
                >
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      onClick={() => setActiveSubNav(subItem.href)}
                      className={cn(
                        "flex items-center py-2 text-sm text-gray-600 hover:text-primary",
                        activeSubNav === subItem.href && "text-primary"
                      )}
                    >
                      <subItem.icon className="h-3.5 w-3.5 mr-2" />
                      <span>{subItem.title}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </div>
  );
}
