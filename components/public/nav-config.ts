export interface NavLinkConfig {
    name: string;
    href: string;
}

export const navLinks: NavLinkConfig[] = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Insights", href: "/insights" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];
