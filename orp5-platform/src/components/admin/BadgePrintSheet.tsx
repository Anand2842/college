"use client";

import React from "react";
import { AttendeeBadge, AttendeeBadgeData, BadgeSettings } from "./AttendeeBadge";

interface BadgePrintSheetProps {
    attendees: AttendeeBadgeData[];
    layout?: "a4-grid" | "single";
    settings?: Partial<BadgeSettings>;
}

export function BadgePrintSheet({ attendees, layout = "a4-grid", settings }: BadgePrintSheetProps) {
    if (!attendees || attendees.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                No attendees selected for printing. Please select at least one badge.
            </div>
        );
    }

    // Chunk attendees into groups of 4 for A4 2x2 grid
    const chunkSize = layout === "a4-grid" ? 4 : 1;
    const pages: AttendeeBadgeData[][] = [];
    for (let i = 0; i < attendees.length; i += chunkSize) {
        pages.push(attendees.slice(i, i + chunkSize));
    }

    return (
        <div className="badge-print-root w-full">
            {/* Global Print Stylesheet for Flawless A4 Imposition */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    /* 1. Hide all non-print chrome, sidebars, headers, and buttons */
                    nav, header, aside, .no-print, .admin-sidebar, .admin-header, button, [role="navigation"] {
                        display: none !important;
                    }

                    /* 2. Reset page & body layout */
                    html, body, #__next, main {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        color: #000000 !important;
                        width: 100% !important;
                        min-height: 100% !important;
                    }

                    /* 3. A4 Page Dimensions (210mm x 297mm) */
                    @page {
                        size: 210mm 297mm;
                        margin: 0mm !important;
                    }

                    /* 4. Sheet Container - Exact A4 Page Box */
                    .badge-sheet-page {
                        width: 210mm !important;
                        height: 297mm !important;
                        max-height: 297mm !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        page-break-after: always !important;
                        break-after: page !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                        box-sizing: border-box !important;
                        padding: 0 !important;
                        margin: 0 auto !important;
                        background: #ffffff !important;
                        overflow: hidden !important;
                    }

                    .badge-sheet-page:last-child {
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }

                    /* 5. 2x2 A4 Grid (2 cols x 90mm = 180mm, 2 rows x 135mm = 270mm) */
                    .badge-grid-container {
                        display: grid !important;
                        grid-template-columns: 90mm 90mm !important;
                        grid-template-rows: 135mm 135mm !important;
                        gap: 6mm 10mm !important;
                        width: 190mm !important;
                        height: 276mm !important;
                        justify-content: center !important;
                        align-content: center !important;
                        box-sizing: border-box !important;
                        margin: auto !important;
                    }

                    /* Single card print layout */
                    .badge-single-container {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        width: 100% !important;
                        height: 100% !important;
                    }

                    /* 6. Card container cut guide for scissors/guillotine */
                    .cut-guide {
                        border: 0.5px dashed #cbd5e1 !important;
                        border-radius: 8px !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        box-sizing: border-box !important;
                        width: 90mm !important;
                        height: 135mm !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }

                    /* 7. Ensure rich color printing (Green, Gold, Borders, QR) */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}} />

            {layout === "a4-grid" ? (
                // A4 2x2 Grid Pages
                pages.map((pageGroup, pageIndex) => (
                    <div
                        key={pageIndex}
                        className="badge-sheet-page mb-10 print:mb-0 bg-white p-4 sm:p-8 print:p-0 rounded-3xl border border-gray-200 print:border-none shadow-sm print:shadow-none"
                    >
                        <div className="no-print text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center border-b pb-2 flex items-center justify-between">
                            <span className="font-mono text-emerald-800">ORP-5 MASTER PRINT SHEET</span>
                            <span>Page {pageIndex + 1} of {pages.length} &bull; {pageGroup.length} Badges (A4 Sheet)</span>
                            <span className="text-gray-400">90 × 135 mm Master Standard</span>
                        </div>

                        {/* 2 Columns x 2 Rows Grid with Cut Marks */}
                        <div className="badge-grid-container grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-0 justify-items-center">
                            {pageGroup.map((attendee) => (
                                <div
                                    key={attendee.id}
                                    className="p-1 print:p-0 border border-dashed border-gray-300 print:border-gray-400 rounded-3xl relative cut-guide"
                                >
                                    <AttendeeBadge attendee={attendee} settings={settings} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                // Single Card Layout
                <div className="flex flex-wrap gap-6 justify-center">
                    {attendees.map((attendee) => (
                        <div
                            key={attendee.id}
                            className="badge-sheet-page p-2 border border-dashed border-gray-300 print:border-none rounded-3xl cut-guide inline-block mb-6 print:mb-0"
                        >
                            <div className="badge-single-container">
                                <AttendeeBadge attendee={attendee} settings={settings} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
