import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useNavigation } from "@/hooks/useNavigation";

export function TabNavigation() {
  const {
    navigationData,
    activeNav,
    activeSubNav,
    currentSection,
    hasSubNav,
    handleNavClick,
    setActiveSubNav
  } = useNavigation();

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
      {hasSubNav && (
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
