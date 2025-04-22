import { useState } from "react";
import { cn } from "@/lib/utils";
import { navigationData, activeSection, activeSubSection } from "@/lib/navigation-data";
import { Link } from "wouter";

export function TabNavigation() {
  const [activeNav, setActiveNav] = useState(activeSection.href);
  const [activeSubNav, setActiveSubNav] = useState(activeSubSection?.href || "");

  const handleNavClick = (href: string) => {
    setActiveNav(href);
    // Set first subnav item as active when changing main nav
    const section = navigationData.find(item => item.href === href);
    if (section && section.items.length > 0 && section.showSubNav !== false) {
      setActiveSubNav(section.items[0].href);
    }
  };

  const currentSection = navigationData.find((item) => item.href === activeNav);
  const showSubNav = currentSection && currentSection.items.length > 0 && currentSection.showSubNav !== false;

  return (
    <div className="flex flex-col h-full">
      {/* Top tab navigation */}
      <div className="bg-white border-b border-neutral-border">
        <div className="flex">
          {navigationData.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
            >
              <button
                className={cn(
                  "py-4 px-6 font-medium hover:text-gray-800 relative",
                  activeNav === item.href
                    ? "text-primary"
                    : "text-gray-600"
                )}
              >
                {item.title}
                {activeNav === item.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </button>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Secondary tab navigation - only show if section has subnav items */}
      {showSubNav && (
        <div className="bg-white border-b border-neutral-border overflow-x-auto">
          <div className="flex px-6">
            {currentSection.items.slice(0, 8) // Limit the number of visible tabs
              .map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  onClick={() => setActiveSubNav(subItem.href)}
                >
                  <button
                    className={cn(
                      "py-3 px-4 text-sm font-medium hover:text-gray-800 relative whitespace-nowrap",
                      activeSubNav === subItem.href
                        ? "text-primary"
                        : "text-gray-600"
                    )}
                  >
                    {subItem.title}
                    {activeSubNav === subItem.href && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                    )}
                  </button>
                </Link>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
