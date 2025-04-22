import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/hooks/useNavigation";

export function CombinedNavigation() {
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
      {hasSubNav ? (
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
