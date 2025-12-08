// TypeScript type definitions for all page data structures
// This eliminates the need for 'any' types throughout the application

// ============================================
// Common Types
// ============================================

export interface HeroSection {
    headline: string;
    subheadline: string;
    backgroundImage?: string;
}

export interface Button {
    label: string;
    link: string;
    variant: 'primary' | 'secondary' | 'outline';
}

// ============================================
// Homepage Types
// ============================================

export interface QuickAccessCard {
    id: string;
    title: string;
    description: string;
    link: string;
    icon: string;
}

export interface Speaker {
    id: string;
    name: string;
    affiliation: string;
    imageUrl: string;
    bio?: string;
    expertise?: string;
}

export interface GalleryImage {
    url: string;
    caption?: string;
}

export interface Partner {
    name: string;
    imageUrl: string;
    website?: string;
}

export interface HomepageData {
    hero: HeroSection & {
        prefix: string;
        highlight: string;
        suffix: string;
        location: string;
        dates: string;
        buttons: Button[];
    };
    quickAccess: QuickAccessCard[];
    speakers: Speaker[];
    gallery: GalleryImage[];
    partners: Partner[];
}

// ============================================
// About Page Types
// ============================================

export interface WhyMatter {
    id: string;
    title: string;
    description: string;
    iconName: string;
}

export interface Organizer {
    id: string;
    name: string;
    description: string;
}

export interface AboutPageData {
    hero: HeroSection;
    intro: {
        title: string;
        description: string;
        atAGlance: string[];
    };
    whyMatters: WhyMatter[];
    objectives: string[];
    organizers: Organizer[];
    partner: {
        imageUrl: string;
    };
}

// ============================================
// Registration Page Types
// ============================================

export interface RegistrationCategory {
    id: string;
    title: string;
    price: string;
    currency: string;
    features: string[];
    popular?: boolean;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface RegistrationPageData {
    hero: HeroSection & {
        statusText?: string;
    };
    categories: RegistrationCategory[];
    faqs: FAQ[];
}

// ============================================
// Submission Page Types
// ============================================

export interface TimelineItem {
    label: string;
    date: string;
}

export interface SubmissionCategory {
    title: string;
    description: string;
}

export interface SubmissionPageData {
    hero: HeroSection & {
        description: string;
    };
    timeline: TimelineItem[];
    categories: SubmissionCategory[];
    thematicAreas: string[];
    infoCards: {
        review: {
            title: string;
            description: string;
        };
        support: {
            title: string;
            description: string;
        };
    };
    cta: {
        headline: string;
        subheadline: string;
        buttons: Button[];
    };
}

// ============================================
// Accommodation Page Types
// ============================================

export interface Hotel {
    id: string;
    name: string;
    stars: number;
    priceRange: string;
    priceUnit: string;
    distance: string;
    amenities: string[];
    image: string;
    bookingLink: string;
    promoCode: string;
}

export interface AccommodationType {
    id: string;
    title: string;
    icon: string;
    features: string[];
}

export interface AccommodationPageData {
    hero: HeroSection;
    infoBar: {
        checkInOut: string;
        shuttle: string;
        contact: string;
    };
    officialHotels: Hotel[];
    nearbyHotels: Array<{
        id: string;
        name: string;
        distance: string;
        price: string;
    }>;
    types: AccommodationType[];
    travelInfo: {
        times: Array<{
            label: string;
            time: string;
            icon: string;
        }>;
        mapImage: string;
    };
    footerCta: {
        headline: string;
        subheadline: string;
        buttonLabel: string;
        buttonLink: string;
    };
}

// ============================================
// Committees Page Types
// ============================================

export interface CommitteeMember {
    id: string;
    name: string;
    affiliation: string;
    country: string;
    imageUrl: string;
}

export interface Committee {
    id: string;
    label: string;
    members: CommitteeMember[];
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
}

export interface CommitteesPageData {
    hero: HeroSection;
    intro: {
        title: string;
        description: string;
    };
    advisory: {
        title: string;
        description: string;
    };
    committees: Committee[];
    contacts: Contact[];
}

// ============================================
// City Page Types
// ============================================

export interface CityHighlight {
    title: string;
    description: string;
    iconName: string;
}

export interface NearbyPlace {
    title: string;
    description: string;
    imageUrl: string;
}

export interface CityPageData {
    hero: HeroSection;
    intro: {
        title: string;
        description: string;
    };
    highlights: CityHighlight[];
    about: {
        location: string;
        weather: string;
        connectivity: string;
    };
    nearbyPlaces: NearbyPlace[];
    travelInfo: {
        times: Array<{
            label: string;
            time: string;
            icon: string;
        }>;
        mapImage: string;
    };
    footerCta: {
        headline: string;
        subheadline: string;
        buttons: Button[];
    };
}

// ============================================
// Additional Page Types
// ============================================

export interface SpeakersPageData {
    hero: HeroSection;
    speakers: Speaker[];
}

export interface GalleryPageData {
    hero: HeroSection;
    categories: Array<{
        id: string;
        title: string;
        items: Array<{
            image: string;
            title: string;
            caption?: string;
        }>;
    }>;
}

export interface ContactPageData {
    hero: HeroSection;
    details: {
        organizer: string;
        address: string;
        email: string;
        phone: string;
    };
    mapUrl: string;
}

// ============================================
// Admin Dashboard Types
// ============================================

export interface AdminStats {
    analytics: Array<{
        label: string;
        value: string | number;
    }>;
    alerts: Array<{
        type: 'warning' | 'success' | 'info';
        message: string;
    }>;
}
