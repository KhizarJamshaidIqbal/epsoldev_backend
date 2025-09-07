import Service from '../models/Service.js';
import SiteSettings from '../models/SiteSettings.js';

const servicesData = [
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    description: "We create stunning, high-performance mobile applications for iOS and Android platforms that help businesses engage with their audiences effectively.",
    shortDescription: "Native iOS and Android applications built with performance and user experience in mind.",
    icon: "faMobileAlt",
    features: [
      "Native app development",
      "Cross-platform solutions", 
      "App modernization",
      "UI/UX design",
      "App maintenance & support"
    ],
    price: 5000,
    priceDisplay: "$5000+",
    showPrice: true,
    category: "development",
    status: "active",
    featured: true,
    order: 1
  },
  {
    title: "Web Development",
    slug: "web-development",
    description: "Our web development services deliver responsive, scalable, and secure websites and web applications that help businesses establish a strong online presence.",
    shortDescription: "Custom websites and web applications that represent your brand and drive business goals.",
    icon: "faLaptopCode",
    features: [
      "Custom website development",
      "E-commerce solutions",
      "CMS development",
      "Progressive web apps",
      "Performance optimization"
    ],
    price: 3000,
    priceDisplay: "$3000+",
    showPrice: true,
    category: "development",
    status: "active",
    featured: true,
    order: 2
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description: "We create intuitive, engaging, and user-centered design solutions that elevate your digital products and deliver exceptional user experiences.",
    shortDescription: "User-centered design that creates intuitive, engaging, and enjoyable digital experiences.",
    icon: "faPalette",
    features: [
      "User research & testing",
      "Wireframing & prototyping",
      "Visual design",
      "Interaction design",
      "Usability testing"
    ],
    price: 2500,
    priceDisplay: "$2500+",
    showPrice: true,
    category: "design",
    status: "active",
    featured: true,
    order: 3
  },
  {
    title: "SEO Services",
    slug: "seo-services",
    description: "Our comprehensive SEO services help improve your online visibility, drive organic traffic, and boost your search engine rankings for sustainable growth.",
    shortDescription: "Improve visibility and organic traffic with data-driven SEO strategies.",
    icon: "faSearch",
    features: [
      "Keyword research & analysis",
      "On-page optimization",
      "Link building",
      "Technical SEO audit",
      "Local SEO"
    ],
    price: 1500,
    priceDisplay: "$1500+",
    showPrice: true,
    category: "marketing",
    status: "active",
    featured: true,
    order: 4
  },
  {
    title: "Custom Software Solutions",
    slug: "custom-software-solutions",
    description: "We develop tailor-made software solutions designed to address your specific business challenges and streamline your operations for maximum efficiency.",
    shortDescription: "Tailor-made software applications designed to solve your specific business challenges.",
    icon: "faCode",
    features: [
      "Custom software development",
      "Legacy system modernization",
      "Enterprise solutions",
      "Cloud-based applications",
      "Software integration"
    ],
    price: 8000,
    priceDisplay: "$8000+",
    showPrice: true,
    category: "development",
    status: "active",
    featured: true,
    order: 5
  },
  {
    title: "API Development & Integration",
    slug: "api-development-integration",
    description: "We build robust APIs that enable seamless connectivity between your systems and third-party applications, enhancing functionality and data exchange.",
    shortDescription: "Connect systems and services with secure, reliable, and scalable APIs.",
    icon: "faPlug",
    features: [
      "REST API development",
      "API integration",
      "Microservices architecture",
      "API documentation",
      "API security & performance"
    ],
    price: 4000,
    priceDisplay: "$4000+",
    showPrice: true,
    category: "development",
    status: "active",
    featured: true,
    order: 6
  }
];

export const seedServices = async () => {
  try {
    console.log('🌱 Seeding services...');
    
    // Clear existing services
    await Service.deleteMany({});
    console.log('✅ Cleared existing services');
    
    // Insert new services
    const createdServices = await Service.insertMany(servicesData);
    console.log(`✅ Created ${createdServices.length} services`);
    
    // Initialize site settings if they don't exist
    await SiteSettings.getSettings();
    console.log('✅ Site settings initialized');
    
    console.log('🎉 Services seeding completed!');
    
    return createdServices;
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    throw error;
  }
};

export const seedServicesIfEmpty = async () => {
  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await seedServices();
    } else {
      console.log(`📊 Services already exist (${serviceCount} found)`);
    }
  } catch (error) {
    console.error('❌ Error checking services:', error);
  }
};
