import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { navigationData, activeSection, activeSubSection } from "@/lib/navigation-data";

export function CombinedNavigation() {
  const [location] = useLocation();
  const [activeNav, setActiveNav] = useState(activeSection.href);
  const [activeSubNav, setActiveSubNav] = useState(activeSubSection?.href || "");

  // Update active navigation based on the current location
  useEffect(() => {
    const currentNavSection = navigationData.find(item => location === item.href || location.startsWith(item.href + "/"));
    if (currentNavSection) {
      setActiveNav(currentNavSection.href);
      
      // If the current section has subnav and it's enabled, set the first subnav item as active
      if (currentNavSection.items.length > 0 && currentNavSection.showSubNav !== false) {
        // Find if we're on a specific subpage
        const subItem = currentNavSection.items.find(item => location === item.href);
        if (subItem) {
          setActiveSubNav(subItem.href);
        } else {
          setActiveSubNav(currentNavSection.items[0].href);
        }
      }
    }
  }, [location]);

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
      {/* Top primary navigation */}
      <nav className="flex h-12 bg-primary text-white">
        {navigationData.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => handleNavClick(item.href)}
            className={cn(
              "nav-link flex items-center px-6 py-3 hover:bg-primary-dark border-b-2 border-transparent",
              activeNav === item.href && "border-white"
            )}
          >
            <item.icon className="h-4 w-4 mr-2" />
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>
      
      {/* Left sidebar for secondary navigation - only show if the section has subnav items */}
      {showSubNav ? (
        <div className="w-56 bg-white border-r border-neutral-border h-full overflow-y-auto">
          <div className="p-4 border-b border-neutral-border">
            <h3 className="font-semibold text-gray-800">
              {currentSection.title}
            </h3>
          </div>
          <nav className="pt-2">
            {currentSection.items.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                onClick={() => setActiveSubNav(subItem.href)}
                className={cn(
                  "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100",
                  activeSubNav === subItem.href && "text-primary bg-primary/5"
                )}
              >
                <subItem.icon className="h-4 w-4 mr-3" />
                <span>{subItem.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      ) : (
        // No sub navigation, display a spacer
        <div className="w-2 bg-white border-r border-neutral-border h-full"></div>
      )}
    </div>
  );
}
