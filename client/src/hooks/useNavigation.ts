import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { navigationData, NavSection } from "@/lib/navigation-data";

export function useNavigation() {
  const [location] = useLocation();
  
  // Find the initial active section based on current location with better path matching
  const getCurrentNavSection = () => {
    // Check for direct paths like /statements and /payments first
    const directMatch = navigationData.find(item => {
      for (const subItem of item.items) {
        if (location === subItem.href || (subItem.directPath && location === subItem.directPath)) {
          return true;
        }
      }
      return location === item.href;
    });
    
    if (directMatch) return directMatch;
    
    // Fall back to prefix matching
    return navigationData.find(item => location.startsWith(item.href + "/"));
  };
  
  const initialSection = getCurrentNavSection() || navigationData[0];
  const initialHasSubNav = initialSection.items.length > 0 && initialSection.showSubNav !== false;
  
  // Find a specific subpage if we're on one
  const getInitialSubNav = () => {
    if (initialHasSubNav) {
      const subItem = initialSection.items.find(item => location === item.href);
      return subItem ? subItem.href : initialSection.items[0].href;
    }
    return "";
  };
  
  const [activeNav, setActiveNav] = useState(initialSection.href);
  const [activeSubNav, setActiveSubNav] = useState(getInitialSubNav());
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [initialSection.href]: initialHasSubNav,
  });

  // Update active navigation based on the current location
  useEffect(() => {
    const currentNavSection = getCurrentNavSection();
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
        
        // Expand the current section in expanded state
        setExpandedSections(prev => ({
          ...prev,
          [currentNavSection.href]: true
        }));
      } else {
        // For sections with no subnav, collapse all other sections
        const newExpandedSections: Record<string, boolean> = {};
        navigationData.forEach(section => {
          const hasSubNav = section.items.length > 0 && section.showSubNav !== false;
          newExpandedSections[section.href] = section.href === currentNavSection.href && hasSubNav;
        });
        setExpandedSections(newExpandedSections);
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

  const toggleSection = (href: string) => {
    const section = navigationData.find(item => item.href === href);
    // Only toggle if there are items and section allows subnavigation
    if (section && section.items.length > 0 && section.showSubNav !== false) {
      setExpandedSections((prev) => ({
        ...prev,
        [href]: !prev[href],
      }));
    }
    setActiveNav(href);
  };

  const currentSection = navigationData.find((item) => item.href === activeNav) || navigationData[0];
  const hasSubNav = currentSection.items.length > 0 && currentSection.showSubNav !== false;

  return {
    navigationData,
    activeNav,
    activeSubNav,
    expandedSections,
    currentSection,
    hasSubNav,
    setActiveNav,
    setActiveSubNav,
    handleNavClick,
    toggleSection
  };
}