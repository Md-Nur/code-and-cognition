export interface CaseStudy {
    id: string;
    slug: string;
    title: string;
    industry: string;
    summary: string;
    highlightMetric: string;
    coverImage: string;
    architectureImage?: string;
    clientOverview: string;
    challenge: string;
    approach: string;
    technicalArchitecture: string;
    implementation: string;
    results: string;
    techStack: string[];
    resultStatement: string;
}

export const caseStudies: CaseStudy[] = [
    {
        id: "1",
        slug: "enterprise-ai-automation",
        title: "Enterprise AI Automation for Global Logistics",
        industry: "Logistics",
        summary: "Streamlining complex supply chain operations with a custom AI-driven orchestration layer.",
        highlightMetric: "Reduced cost by 37%",
        coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000",
        resultStatement: "A complete overhaul of manual workflows into a predictive, automated system.",
        clientOverview: "A Fortune 500 logistics provider handling over 1 million shipments monthly across 4 continents. Their primary challenge was manual data entry and fragmented communication between regional hubs.",
        challenge: "The legacy system relied on 40+ manual touchpoints per shipment, leading to a 4.2% error rate and significant operational overhead. Scalability was capped by personnel rather than technology.",
        approach: "We architected a 'Single Source of Truth' platform. Our strategy involved integrating real-time IoT data with a custom LLM-powered orchestration engine to predict bottlenecks before they occurred.",
        technicalArchitecture: "The solution uses a microservices architecture built on Next.js and Go. We implemented a robust event-driven system using Kafka to handle high-velocity data streams from global GPS trackers.",
        implementation: "The rollout was executed in three phases over 6 months. Phase 1 focused on data unification; Phase 2 introduced the AI prediction layer; Phase 3 automated the hub-to-hub communication protocols.",
        results: "Beyond the 37% cost reduction, the client saw a 92% decrease in data entry errors and a 15% improvement in on-time delivery metrics. The system now autonomously handles 65% of routine logistical decisions.",
        techStack: ["Next.js", "Go", "Kafka", "PostgreSQL", "OpenAI API", "AWS"],
    },
    {
        id: "2",
        slug: "fintech-security-overhaul",
        title: "Securing the Future of Digital Payments",
        industry: "Fintech",
        summary: "Modernizing a legacy payment gateway with zero-trust architecture and real-time fraud detection.",
        highlightMetric: "99.99% Fraud Detection Accuracy",
        coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000",
        resultStatement: "Institutional-grade security meeting the highest global compliance standards.",
        clientOverview: "A rapidly growing fintech startup processing $500M in annual transactions. They needed to move from a basic monolithic app to a highly secure, compliant, and scalable infrastructure.",
        challenge: "Increasingly sophisticated fraud attempts were bypassing traditional rule-based systems. Additionally, the existing architecture wasn't compliant with upcoming regulatory changes in the EU market.",
        approach: "We implemented a zero-trust security model from the ground up. This included biometric authentication flows and a machine learning model that analyzes transaction patterns in under 50ms.",
        technicalArchitecture: "A serverless-first approach on AWS using Lambda and DynamoDB for low-latency scaling. We used Terraform for Infrastructure as Code to ensure reproducible and secure environments.",
        implementation: "We performed a 'strangler' migration, gradually replacing segments of the monolith with secure microservices. This ensured zero downtime for existing customers during the transition.",
        results: "The new system achieved 99.99% fraud detection accuracy, saving the client approximately $4.2M in potential losses in the first year. They also cleared PCI-DSS Level 1 certification in record time.",
        techStack: ["React", "AWS Lambda", "DynamoDB", "Terraform", "Python (ML)", "Auth0"],
    },
    {
        id: "3",
        slug: "e-commerce-scalability-engine",
        title: "Scaling a Global Brand for Black Friday",
        industry: "E-Commerce",
        summary: "Transforming a sluggish web store into a high-performance commerce engine capable of 100k+ concurrent users.",
        highlightMetric: "300% Increase in Throughput",
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000",
        resultStatement: "Seamless shopping experiences under extreme traffic conditions.",
        clientOverview: "A high-fashion brand with a global presence. Their web store frequently crashed during seasonal sales and struggled with international performance due to heavy assets.",
        challenge: "The existing platform was built on top of a bloated CMS. Page load times were over 5 seconds in Asian markets, leading to a 35% cart abandonment rate due to performance issues.",
        approach: "We moved to a Headless Commerce architecture. By decoupling the frontend from the backend, we were able to use Next.js for SSR and edge caching to deliver sub-second load times worldwide.",
        technicalArchitecture: "Using Shopify Hydrogen and Oxygen for the commerce core, combined with Sanity.io for content management. We utilized Vercel's Global Edge Network for static and dynamic delivery.",
        implementation: "The project started with a comprehensive performance audit, followed by a ground-up rebuild of the frontend components using a custom React design system for maximum efficiency.",
        results: "The brand experienced its most successful Black Friday ever, with zero downtime and a 300% increase in concurrent user throughput. Conversion rates improved by 22% across all regions.",
        techStack: ["Next.js", "Shopify", "Sanity CMS", "Tailwind CSS", "Vercel", "Redis"],
    }
];
