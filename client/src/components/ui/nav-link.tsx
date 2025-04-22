import * as React from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  onClick?: () => void;
  className?: string;
  activeClassName?: string;
  isActive?: boolean;
  children: React.ReactNode;
};

/**
 * NavLink Component
 * A standardized navigation link component that can be styled differently when active
 * 
 * @param href - The destination URL
 * @param onClick - Optional click handler
 * @param className - Base styling classes
 * @param activeClassName - Classes to apply when link is active
 * @param isActive - Whether the link is active
 * @param children - Content to display inside the link
 */
export function NavLink({
  href,
  onClick,
  className,
  activeClassName,
  isActive,
  children,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  );
}

/**
 * Primary Nav Link
 * Styled for main navigation items
 */
export function PrimaryNavLink({
  href,
  onClick,
  isActive,
  children,
  className,
}: Omit<NavLinkProps, "activeClassName"> & { className?: string }) {
  return (
    <NavLink
      href={href}
      onClick={onClick}
      isActive={isActive}
      className={cn(
        "nav-link flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 border-b-2 border-transparent whitespace-nowrap transition-colors",
        className
      )}
      activeClassName="active"
    >
      {children}
    </NavLink>
  );
}

/**
 * Secondary Nav Link
 * Styled for sub-navigation items
 */
export function SecondaryNavLink({
  href,
  onClick,
  isActive,
  children,
  className,
}: Omit<NavLinkProps, "activeClassName"> & { className?: string }) {
  return (
    <NavLink
      href={href}
      onClick={onClick}
      isActive={isActive}
      className={cn(
        "secondary-nav-link flex items-center px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap transition-colors",
        className
      )}
      activeClassName="active"
    >
      {children}
    </NavLink>
  );
}