export interface NavLinkConfig {
    name: string;
    href: string;
}

export interface ServiceItem {
    name: string;
    description: string;
    href: string;
}

export interface ServiceGroup {
    title: string;
    items: ServiceItem[];
}

export const navLinks: NavLinkConfig[] = [
    { name: "Process", href: "/#process" },
    { name: "Case Studies", href: "/portfolio" },
    { name: "About", href: "/#about" },
    { name: "Insights", href: "/insights" },
    { name: "Contact", href: "/#contact" },
];

export const servicesGroups: ServiceGroup[] = [
    {
        title: "Digital Platforms",
        items: [
            {
                name: "Web Experiences",
                description: "High-trust corporate sites and portals.",
                href: "/services",
            },
            {
                name: "Product Platforms",
                description: "Scalable client-facing platforms.",
                href: "/services",
            },
            {
                name: "Commerce Systems",
                description: "Revenue-ready digital storefronts.",
                href: "/services",
            },
        ],
    },
    {
        title: "Intelligent Automation",
        items: [
            {
                name: "AI Operations",
                description: "Automate workflows and decisions.",
                href: "/services",
            },
            {
                name: "Data Intelligence",
                description: "Unify analytics and reporting.",
                href: "/services",
            },
            {
                name: "Process Orchestration",
                description: "Reduce manual handoffs.",
                href: "/services",
            },
        ],
    },
    {
        title: "Growth Systems",
        items: [
            {
                name: "Demand Strategy",
                description: "Positioning and go-to-market.",
                href: "/services",
            },
            {
                name: "Conversion Design",
                description: "Experience-led growth programs.",
                href: "/services",
            },
            {
                name: "Lifecycle Journeys",
                description: "Retention and expansion systems.",
                href: "/services",
            },
        ],
    },
];
