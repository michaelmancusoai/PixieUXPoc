import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/hooks/useNavigation";

export function HorizontalNavigation() {
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
    <div className="flex flex-col h-full w-full">
      {/* Primary Navigation */}
      <div className="border-b border-neutral-border bg-white w-full">
        <nav className="flex h-12 overflow-x-auto">
          {navigationData.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "nav-link flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 border-b-2 border-transparent whitespace-nowrap transition-colors",
                activeNav === item.href && "active"
              )}
            >
              <item.icon className="h-4 w-4 mr-2" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Secondary Navigation - only show if the current section has subnav items */}
      {hasSubNav && (
        <div className="secondary-nav bg-white border-b border-neutral-border flex p-2 overflow-x-auto">
          {currentSection.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              onClick={() => setActiveSubNav(subItem.href)}
              className={cn(
                "secondary-nav-link flex items-center px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap transition-colors",
                activeSubNav === subItem.href && "active"
              )}
            >
              <subItem.icon className="h-4 w-4 mr-2" />
              <span>{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
