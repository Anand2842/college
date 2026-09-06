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
                No attendees selected for printing.
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
        <div className="badge-print-container w-full">
            {/* Global Print Stylesheet */}
            <style jsx global>{`
                @media print {
                    /* Hide UI chrome */
                    nav, header, aside, .no-print, .admin-sidebar, .admin-header, button {
                        display: none !important;
                    }

                    /* Reset body styles for pure print output */
                    body, html, main {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        color: #000000 !important;
                        width: 100% !important;
                    }

                    @page {
                        size: A4 portrait;
                        margin: 6mm 4mm;
                    }

                    .badge-sheet-page {
                        page-break-after: always !important;
                        break-after: page !important;
                        width: 100% !important;
                        box-sizing: border-box !important;
                        display: grid !important;
                        justify-content: center !important;
                        align-content: start !important;
                    }

                    .badge-sheet-page:last-child {
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }

                    /* Ensure exact color rendering in browser print dialog */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    /* Non-printing production cut guides */
                    .cut-guide {
                        border: none !important;
                        padding: 0 !important;
                    }
                }
            `}</style>

            {layout === "a4-grid" ? (
                // A4 2x2 Grid Pages
                pages.map((pageGroup, pageIndex) => (
                    <div
                        key={pageIndex}
                        className="badge-sheet-page mb-10 print:mb-0 bg-white p-4 sm:p-6 print:p-0 rounded-2xl border border-gray-200 print:border-none shadow-sm print:shadow-none"
                    >
                        <div className="no-print text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center border-b pb-2">
                            Sheet {pageIndex + 1} of {pages.length} &bull; 4 Badges (A4 Format)
                        </div>

                        {/* 2 Columns x 2 Rows Grid with Cut Marks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2 justify-items-center">
                            {pageGroup.map((attendee) => (
                                <div
                                    key={attendee.id}
                                    className="p-1 print:p-0.5 border border-dashed border-gray-300 print:border-gray-400 rounded-3xl relative cut-guide"
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
                            className="badge-sheet-page p-1 border border-dashed border-gray-300 print:border-gray-400 rounded-3xl cut-guide inline-block"
                        >
                            <AttendeeBadge attendee={attendee} settings={settings} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
