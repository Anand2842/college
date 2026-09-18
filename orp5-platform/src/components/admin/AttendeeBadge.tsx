"use client";

import React, { useMemo } from "react";
import QRCode from "react-qr-code";
import { cn } from "@/lib/utils";

export interface AttendeeBadgeData {
    id: string;
    name: string;
    ticketNumber: string;
    category: string;
    group?: "delegate" | "committee" | "speaker" | "volunteer" | "blank";
    subgroup?: string;
    country?: string;
    institution?: string;
    affiliation?: string;
    designation?: string;
    photoUrl?: string;
    mode?: string;
    paymentStatus?: string;
    hasAbstract?: boolean;
    abstractStatus?: 'accepted' | 'pending' | 'rejected' | 'none' | string;
    abstractTitle?: string;
    isBlank?: boolean;
}

export interface BadgeSettings {
    showPhoto: boolean;
    photoSize: "sm" | "md" | "lg";
    photoShape: "circle" | "rounded";
    showCountry: boolean;
    showInstitution: boolean;
    showOrganizers: boolean;
    showSlotGuide: boolean; // Production lanyard slot punch guide (15mm x 4mm)
    qrSize: number;
}

interface AttendeeBadgeProps {
    attendee: AttendeeBadgeData;
    settings?: Partial<BadgeSettings>;
    className?: string;
    onPhotoClick?: () => void;
}

export const DEFAULT_BADGE_SETTINGS: BadgeSettings = {
    showPhoto: false, // Default matches master template (hero QR centered)
    photoSize: "md",
    photoShape: "rounded",
    showCountry: true, // Rule 8: Country is standard on front (🇮🇳 INDIA)
    showInstitution: true, // Enabled by default to show affiliation/institution
    showOrganizers: true, // Rule 12 & 14: Jointly Organised by on footer
    showSlotGuide: true, // Dedicated 11mm top lanyard punch safe zone
    qrSize: 100, // Production QR size (27-28mm with quiet zone)
};

// Map common countries to flag emojis
const COUNTRY_FLAG_MAP: Record<string, string> = {
    INDIA: "🇮🇳",
    IND: "🇮🇳",
    INDONESIA: "🇮🇩",
    IDN: "🇮🇩",
    JAPAN: "🇯🇵",
    JPN: "🇯🇵",
    USA: "🇺🇸",
    "UNITED STATES": "🇺🇸",
    UK: "🇬🇧",
    "UNITED KINGDOM": "🇬🇧",
    BANGLADESH: "🇧🇩",
    NEPAL: "🇳🇵",
    "SRI LANKA": "🇱🇰",
    MALAYSIA: "🇲🇾",
    PHILIPPINES: "🇵🇭",
    VIETNAM: "🇻🇳",
    THAILAND: "🇹🇭",
    KENYA: "🇰🇪",
    NIGERIA: "🇳🇬",
    GERMANY: "🇩🇪",
    FRANCE: "🇫🇷",
    AUSTRALIA: "🇦🇺",
    CANADA: "🇨🇦",
    BRAZIL: "🇧🇷",
    CHINA: "🇨🇳",
    TAIWAN: "🇹🇼",
    "SOUTH KOREA": "🇰🇷",
    KOREA: "🇰🇷",
};

export function getCountryFlag(countryStr?: string): string {
    if (!countryStr) return "🇮🇳";
    const upper = countryStr.trim().toUpperCase();
    return COUNTRY_FLAG_MAP[upper] || "🌐";
}

/**
 * Rule 7: Controlled category values
 * Maps raw database entries into clean conference badge categories.
 * e.g., PG Student/Research Scholar -> RESEARCH SCHOLAR
 */
export function normalizeBadgeCategory(raw?: string): string {
    if (!raw) return "DELEGATE";
    const upper = raw.trim().toUpperCase();
    if (upper.includes("SCHOLAR") || upper.includes("PG STUDENT") || upper.includes("RESEARCH")) {
        return "RESEARCH SCHOLAR";
    }
    if (upper.includes("SCIENTIST") || upper.includes("FACULTY")) {
        return "SCIENTIST";
    }
    if (upper.includes("PROFESSIONAL") || upper.includes("INDUSTRY") || upper.includes("CORPORATE")) {
        return "PROFESSIONAL";
    }
    if (upper.includes("FARMER")) {
        return "INNOVATIVE FARMER";
    }
    if (upper.includes("STUDENT")) {
        return "STUDENT";
    }
    if (upper.includes("COMMITTEE") || upper.includes("SECRETARIAT")) {
        return "ORGANIZING COMMITTEE";
    }
    if (upper.includes("SPEAKER")) {
        return "INVITED SPEAKER";
    }
    if (upper.includes("VOLUNTEER")) {
        return "VOLUNTEER";
    }
    return upper;
}

export interface CategoryBandStyle {
    bg: string;
    border: string;
    textColor: string;
}

export function getCategoryBandStyle(categoryStr?: string, group?: string): CategoryBandStyle {
    const norm = normalizeBadgeCategory(categoryStr);
    
    switch (norm) {
        case "STUDENT":
            return {
                bg: "#1D4ED8", // Vibrant Royal Blue
                border: "#F59E0B",
                textColor: "#FFFFFF",
            };
        case "RESEARCH SCHOLAR":
            return {
                bg: "#4338CA", // Deep Indigo / Iris
                border: "#F59E0B",
                textColor: "#FFFFFF",
            };
        case "SCIENTIST":
            return {
                bg: "#065F46", // Emerald Green
                border: "#d99b26",
                textColor: "#FFFFFF",
            };
        case "INVITED SPEAKER":
            return {
                bg: "#6B21A8", // Regal Royal Purple
                border: "#FBBF24",
                textColor: "#FFFFFF",
            };
        case "ORGANIZING COMMITTEE":
            return {
                bg: "#0F172A", // Executive Midnight Navy
                border: "#F59E0B",
                textColor: "#FFFFFF",
            };
        case "PROFESSIONAL":
            return {
                bg: "#991B1B", // Rich Crimson / Maroon
                border: "#F59E0B",
                textColor: "#FFFFFF",
            };
        case "INNOVATIVE FARMER":
            return {
                bg: "#B45309", // Warm Amber / Ochre
                border: "#FDE68A",
                textColor: "#FFFFFF",
            };
        case "VOLUNTEER":
            return {
                bg: "#C2410C", // Vibrant Tangerine Orange
                border: "#FFEDD5",
                textColor: "#FFFFFF",
            };
        case "ON-SPOT REGISTRATION":
        case "ON-SPOT":
            return {
                bg: "#D97706", // Warm Rich Amber/Gold
                border: "#FDE68A",
                textColor: "#FFFFFF",
            };
        case "VIP":
        case "GUEST OF HONOUR":
            return {
                bg: "#831843", // Imperial Ruby
                border: "#FCD34D",
                textColor: "#FFFFFF",
            };
        case "DELEGATE":
        default:
            if (group === "speaker") {
                return {
                    bg: "#6B21A8",
                    border: "#FBBF24",
                    textColor: "#FFFFFF",
                };
            }
            if (group === "committee") {
                return {
                    bg: "#0F172A",
                    border: "#F59E0B",
                    textColor: "#FFFFFF",
                };
            }
            if (group === "volunteer") {
                return {
                    bg: "#C2410C",
                    border: "#FFEDD5",
                    textColor: "#FFFFFF",
                };
            }
            return {
                bg: "#0C513A", // Classic ORP-5 Master Green
                border: "#d99b26",
                textColor: "#FFFFFF",
            };
    }
}

/**
 * Section 8: Name typography rules (Fixed container 68–70 mm wide x 9 mm high)
 *
 * <= 18 characters   -> 7.5–8 mm (text-[20px] sm:text-[22px])
 * 19–26 characters  -> 6.5–7.5 mm (text-[17px] sm:text-[18px])
 * 27–35 characters  -> 5.8–6.5 mm (text-[14.5px] sm:text-[15.5px])
 * > 35 characters   -> 2 lines max (text-[12px] sm:text-[13px])
 *
 * Never 3 lines. Never use ellipsis. Complete name always visible.
 */
function getNameTypographyStyles(name: string): {
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
} {
    const len = name.trim().length;

    if (len <= 18) {
        return {
            fontSize: "clamp(19px, 2.1vw, 21.5px)",
            lineHeight: "1.15",
            letterSpacing: "0.015em",
        };
    } else if (len <= 26) {
        return {
            fontSize: "clamp(16px, 1.7vw, 17.5px)",
            lineHeight: "1.18",
            letterSpacing: "0.01em",
        };
    } else if (len <= 35) {
        return {
            fontSize: "clamp(13px, 1.4vw, 14.5px)",
            lineHeight: "1.18",
            letterSpacing: "0.005em",
        };
    } else {
        // >35 characters: wraps onto 2 lines cleanly
        return {
            fontSize: "clamp(11.5px, 1.2vw, 12.5px)",
            lineHeight: "1.15",
            letterSpacing: "-0.01em",
        };
    }
}

export function AttendeeBadge({
    attendee,
    settings = {},
    className,
    onPhotoClick,
}: AttendeeBadgeProps) {
    const config: BadgeSettings = { ...DEFAULT_BADGE_SETTINGS, ...settings };

    const name = (attendee.name || "Delegate Name").trim();
    const ticketId = attendee.ticketNumber || attendee.id || "ORP5IC-IND-20548";
    const category = normalizeBadgeCategory(attendee.category);
    const country = (attendee.country || "INDIA").toUpperCase();
    const institution = (attendee.institution || attendee.affiliation || "").trim();
    const photoUrl = attendee.photoUrl || "";

    const flagEmoji = getCountryFlag(country);
    const nameStyles = useMemo(() => getNameTypographyStyles(name), [name]);
    const bandStyle = useMemo(() => getCategoryBandStyle(attendee.category, attendee.group), [attendee.category, attendee.group]);

    // Optional photo dimension
    const photoDimension = config.photoSize === "sm" ? 64 : config.photoSize === "lg" ? 84 : 74;

    // Side strip font size & tracking (-5% reduced for optimal balance)
    const sideCategoryClass = category.length > 16 
        ? "text-[10.5px] sm:text-[11px] tracking-[0.12em]" 
        : "text-[12px] sm:text-[12.5px] tracking-[0.18em]";

    return (
        <div
            className={cn(
                "attendee-badge-card bg-white text-gray-900 border border-gray-300 rounded-[28px] overflow-hidden flex flex-row shadow-xl relative select-none",
                // Master production dimensions: 90 mm wide × 135 mm high (Ratio 2:3)
                // Screen: 360px × 540px. Print: 90mm × 135mm.
                "w-[360px] h-[540px] max-w-full",
                "print:shadow-none print:border-gray-400 print:w-[90mm] print:h-[135mm]",
                className
            )}
            style={{
                pageBreakInside: "avoid",
                breakInside: "avoid",
            }}
        >
            {/* ============================================================ */}
            {/* LANYARD SLOT PUNCH GUIDE (Centered on entire 90mm badge)     */}
            {/* 14 mm × 3.5 mm guide centered at exact 50% (45mm) width      */}
            {/* ============================================================ */}
            {config.showSlotGuide && (
                <div
                    className="absolute top-1.5 print:top-[2mm] left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-center"
                    title="Lanyard Slot Punch Target (14mm x 3.5mm)"
                >
                    <div className="w-[54px] h-[12px] print:w-[14mm] print:h-[3.5mm] rounded-full border border-dashed border-gray-400 bg-white/90 shadow-2xs flex items-center justify-center print:border-gray-400/80 print:bg-transparent">
                        <span className="no-print text-[5px] font-black text-gray-400 uppercase tracking-widest leading-none select-none">
                            SLOT PUNCH
                        </span>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* 1. LEFT CATEGORY COLOR BAND (Section 2: Exactly 15 mm wide)  */}
            {/* Width: 15 mm (60px on screen, print:w-[15mm]). Full 135mm ht.*/}
            {/* Role-specific color + accent divider line                    */}
            {/* ============================================================ */}
            <div
                className="w-[60px] print:w-[15mm] border-r-[1.5px] flex items-center justify-center relative select-none shrink-0 overflow-hidden"
                style={{
                    backgroundColor: bandStyle.bg,
                    borderColor: bandStyle.border,
                }}
            >
                <div
                    className={cn(
                        "font-black uppercase whitespace-nowrap",
                        sideCategoryClass
                    )}
                    style={{
                        color: bandStyle.textColor,
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                    }}
                >
                    {category}
                </div>
            </div>

            {/* ============================================================ */}
            {/* 2. MAIN WHITE CONTENT AREA (75 mm wide / 135 mm high)        */}
            {/* Master Template: Tight vertical rhythm, zero floating voids  */}
            {/* ============================================================ */}
            <div className="flex-1 print:w-[75mm] h-full flex flex-col justify-between bg-white px-3 pt-1.5 pb-3.5 overflow-hidden relative">
                
                {/* ------------------------------------------------------------ */}
                {/* TOP MARGIN / LANYARD CLEARANCE SPACER                        */}
                {/* ------------------------------------------------------------ */}
                <div className="w-full h-3 print:h-[3.5mm] shrink-0" />

                {/* ------------------------------------------------------------ */}
                {/* SECTION 2: Conference Branding Header                        */}
                {/* ORP Emblem (Enlarged: 54px / 13.5mm), sharp divider          */}
                {/* ------------------------------------------------------------ */}
                <div className="w-full flex flex-col justify-center shrink-0">
                    <div className="flex items-center w-full justify-start gap-2.5">
                        {/* ORP-5 Logo Emblem (Enlarged: 54px / 13.5mm) */}
                        <div className="w-[54px] h-[54px] print:w-[13.5mm] print:h-[13.5mm] shrink-0 flex items-center justify-center">
                            <img
                                src="/orp5-logo.png"
                                alt="ORP-5 Logo"
                                className="w-full h-full object-contain"
                                onError={(e: any) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>

                        {/* Gold / Green divider */}
                        <div className="w-[1.5px] h-[34px] bg-[#063F2B]/30 shrink-0" />

                        {/* Title block */}
                        <div className="flex-1 flex flex-col justify-center leading-tight min-w-0">
                            <div className="text-[23px] font-black tracking-tight leading-none text-[#063F2B]">
                                <span>ORP-</span>
                                <span className="text-[#d99b26]">5</span>
                            </div>
                            <div className="text-[7.5px] text-gray-600 font-medium leading-tight mt-0.5 whitespace-nowrap">
                                The 5th International Conference on
                            </div>
                            <div className="text-[9px] font-black text-[#063F2B] leading-tight whitespace-nowrap">
                                Organic and Natural Rice
                            </div>
                            <div className="text-[9px] font-black text-[#063F2B] leading-tight whitespace-nowrap">
                                Production Systems
                            </div>
                        </div>
                    </div>

                    {/* Date & Venue Bar */}
                    <div className="text-[7px] font-medium text-gray-500 text-center tracking-tight mt-1 w-full">
                        21 – 25 September 2026 &nbsp;|&nbsp; PHD Chamber of Commerce & Industry, New Delhi
                    </div>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* SECTION 3: Entry Pass & QR Credential                        */}
                {/* Subtle containment card + 28–30mm QR + restored ORP ID label */}
                {/* ------------------------------------------------------------ */}
                <div className="w-full flex flex-col items-center justify-center shrink-0">
                    <div className="w-full max-w-[276px] bg-[#F8FAF8] border border-[#e2eae3] rounded-2xl pt-1.5 pb-1 px-3 flex flex-col items-center justify-center shadow-2xs">
                        {/* ENTRY PASS Label */}
                        <div className="w-full flex items-center justify-center gap-2 mb-1">
                            <div className="h-[1px] bg-[#d99b26]/60 flex-1 max-w-[36px]" />
                            <span className="text-[8px] font-black text-[#c4891e] uppercase tracking-[0.22em] whitespace-nowrap">
                                ENTRY PASS
                            </span>
                            <div className="h-[1px] bg-[#d99b26]/60 flex-1 max-w-[36px]" />
                        </div>

                        {/* QR Code / Photo Container */}
                        {config.showPhoto ? (
                            <div className="flex items-center justify-center gap-2.5 my-0.5">
                                {/* Optional Photo */}
                                <div
                                    onClick={onPhotoClick}
                                    className={cn(
                                        "border-2 border-[#d99b26] bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center cursor-pointer hover:opacity-90 transition",
                                        config.photoShape === "circle" ? "rounded-full" : "rounded-xl"
                                    )}
                                    style={{ width: `${photoDimension - 12}px`, height: `${photoDimension - 12}px` }}
                                    title="Click to adjust photo"
                                >
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt={name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-1">
                                            <div className="text-gray-400 font-bold text-[8px] uppercase">Photo</div>
                                        </div>
                                    )}
                                </div>

                                {/* QR Box */}
                                <div className="bg-white p-1 rounded-xl border border-gray-200/90 shadow-2xs">
                                    <QRCode
                                        value={ticketId}
                                        size={72}
                                        style={{ height: "auto", maxWidth: "100%", width: "72px" }}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                            </div>
                        ) : (
                            /* Master Production: ~28–30 mm QR (size 92) inside white cushion */
                            <div className="bg-white p-1.5 rounded-xl border border-gray-200/90 shadow-2xs my-0.5 flex items-center justify-center">
                                <QRCode
                                    value={ticketId}
                                    size={92}
                                    style={{ height: "auto", maxWidth: "100%", width: "92px" }}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        )}

                        {/* Restored ORP ID Section */}
                        <div className="w-full flex flex-col items-center mt-1">
                            <div className="flex items-center justify-center gap-1.5 mb-0.5">
                                <div className="h-[1px] bg-[#d99b26]/50 w-5" />
                                <span className="text-[7px] font-black text-[#c4891e] uppercase tracking-[0.2em] whitespace-nowrap">
                                    ORP ID
                                </span>
                                <div className="h-[1px] bg-[#d99b26]/50 w-5" />
                            </div>
                            <div className="font-mono font-bold text-[10.5px] leading-tight tracking-wider text-[#063F2B]">
                                {ticketId}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* SECTION 4: Attendee Identity (Shifted ~8–12mm Upward)        */}
                {/* Tightened rhythm: Hero Name -> Gold Category -> Country Flag */}
                {/* ------------------------------------------------------------ */}
                {attendee.isBlank || attendee.group === "blank" ? (
                    <div className="w-full max-w-[276px] flex flex-col justify-center space-y-1.5 py-1.5 px-2.5 border border-dashed border-gray-400/90 rounded-xl bg-gray-50/70 shrink-0">
                        {/* Name Line */}
                        <div className="flex items-baseline gap-1.5 w-full">
                            <span className="text-[8px] font-black uppercase text-[#063F2B] tracking-wider shrink-0">
                                NAME:
                            </span>
                            <div className="flex-1 border-b-[1.5px] border-gray-400 border-dashed h-3" />
                        </div>

                        {/* Institution Line */}
                        <div className="flex items-baseline gap-1.5 w-full">
                            <span className="text-[8px] font-black uppercase text-[#063F2B] tracking-wider shrink-0">
                                INST:
                            </span>
                            <div className="flex-1 border-b-[1.5px] border-gray-400 border-dashed h-3" />
                        </div>

                        {/* Category Line & Country */}
                        <div className="flex items-center justify-between gap-1.5 pt-0.5">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[7.5px] font-bold uppercase text-gray-500 tracking-wider shrink-0">
                                    ROLE:
                                </span>
                                <span className="text-[8.5px] font-black text-[#c4891e] uppercase tracking-wide">
                                    ON-SPOT DELEGATE
                                </span>
                            </div>
                            <div className="text-[8.5px] font-bold text-gray-700 flex items-center gap-1">
                                <span>🇮🇳</span>
                                <span>INDIA</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center justify-center text-center shrink-0">
                        {/* Attendee Name (Fixed-zone, max 2 lines, no ellipsis) */}
                        <div className="w-full max-w-[272px] min-h-[36px] flex items-center justify-center">
                            <h2
                                className="font-black uppercase text-[#063F2B] text-center w-full break-words tracking-tight"
                                style={{
                                    fontSize: nameStyles.fontSize,
                                    lineHeight: nameStyles.lineHeight,
                                    letterSpacing: nameStyles.letterSpacing,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "visible",
                                }}
                                title={name}
                            >
                                {name}
                            </h2>
                        </div>

                        {/* Category: Standardized Gold for all categories */}
                        <div className="text-[11px] sm:text-[11.5px] font-black uppercase tracking-[0.14em] text-[#c4891e] mt-1 leading-none">
                            {category}
                        </div>

                        {/* Country & National Flag */}
                        {config.showCountry && (
                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-700 tracking-wider mt-1.5 leading-none">
                                <span className="text-xs leading-none">{flagEmoji}</span>
                                <span>{country}</span>
                            </div>
                        )}

                        {/* Optional Institution / Affiliation */}
                        {config.showInstitution && institution && (
                            <div className="text-[8.5px] text-gray-600 font-medium max-w-[270px] text-center line-clamp-2 mt-1 leading-tight px-1">
                                {institution}
                            </div>
                        )}
                    </div>
                )}

                {/* ------------------------------------------------------------ */}
                {/* SECTION 5: Organisers Footer (Shifted ~3–5mm Upward)         */}
                {/* Structured lockup: +10-15% enlarged logos with dividers      */}
                {/* ------------------------------------------------------------ */}
                {config.showOrganizers && (
                    <div className="w-full flex flex-col items-center justify-end shrink-0">
                        {/* "JOINTLY ORGANISED BY" */}
                        <div className="w-full flex items-center justify-center gap-2 mb-1.5">
                            <div className="h-[1px] bg-gray-300 flex-1 max-w-[45px]" />
                            <span className="text-[7.5px] font-bold text-gray-500 uppercase tracking-widest px-1 whitespace-nowrap">
                                Jointly Organised by
                            </span>
                            <div className="h-[1px] bg-gray-300 flex-1 max-w-[45px]" />
                        </div>

                        {/* Clean Three-Logo Lockup with Labels (AIASA, UAS Raichur, IPB University) */}
                        <div className="grid grid-cols-3 gap-1.5 w-full max-w-[276px] px-1">
                            {/* Logo 1: AIASA */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="h-[44px] flex items-center justify-center">
                                    <img
                                        src="/images/partners/aiasa-logo.png"
                                        alt="AIASA"
                                        className="max-h-[44px] max-w-[62px] object-contain"
                                    />
                                </div>
                                <span className="text-[8.5px] font-bold text-gray-900 tracking-tight mt-1 text-center leading-none whitespace-nowrap">
                                    AIASA
                                </span>
                            </div>

                            {/* Logo 2: UAS Raichur */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="h-[44px] flex items-center justify-center">
                                    <img
                                        src="/images/partners/uas-raichur-logo.png"
                                        alt="UAS Raichur"
                                        className="max-h-[44px] max-w-[62px] object-contain"
                                    />
                                </div>
                                <span className="text-[8.5px] font-bold text-gray-900 tracking-tight mt-1 text-center leading-none whitespace-nowrap">
                                    UAS Raichur
                                </span>
                            </div>

                            {/* Logo 3: IPB University */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="h-[44px] flex items-center justify-center">
                                    <img
                                        src="/images/partners/ipb-university.png"
                                        alt="IPB University"
                                        className="max-h-[44px] max-w-[62px] object-contain"
                                    />
                                </div>
                                <span className="text-[8.5px] font-bold text-gray-900 tracking-tight mt-1 text-center leading-none whitespace-nowrap">
                                    IPB University
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
