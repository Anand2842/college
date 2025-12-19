"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Check, CheckCircle2, ChevronRight, Download, Calendar, User, Globe, CreditCard, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

// --- FEE LOGIC EXCTRACTED FROM PAGE CONTENT ---
const FEE_STRUCTURE = {
    physical: {
        indian: {
            "UG/PG Student": { member: 2500, nonMember: 3000 },
            "Research Scholar/SRF/RA": { member: 3500, nonMember: 4000 },
            "Scientist/Professional": { member: 6000, nonMember: 7000 },
            "Innovative Farmer": { member: 1000, nonMember: 1500 },
            "Accompanied Person": { member: 2000, nonMember: 2000 },
            "Corporate/Industry": { member: 10000, nonMember: 10000 },
        },
        foreign: {
            "Student": 100,
            "Scientist/Professional": 200,
            "Accompanied Person": 100
        }
    },
    virtual: {
        indian: {
            "UG/PG Student": { member: 1000, nonMember: 1500 },
            "Research Scholar/SRF/RA": { member: 1500, nonMember: 2000 },
            "Scientist/Professional": { member: 3000, nonMember: 4000 },
            "Innovative Farmer": { member: 500, nonMember: 1000 },
            "Corporate/Industry": { member: 5000, nonMember: 5000 },
        },
        foreign: {
            "Student": 50,
            "Scientist/Professional": 100
        }
    }
} as const;

export function RegistrationForm({ selectedCategory: initialCategory }: { selectedCategory: string }) {
    const router = useRouter();
    // Steps: 0 = Mode/Nat, 1 = Personal, 2 = Category/Fee, 3 = Payment, 4 = Success
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [ticketData, setTicketData] = useState<any>(null);

    const [formData, setFormData] = useState({
        // Basic
        fullName: "",
        email: "",
        phone: "",
        institution: "",
        designation: "",
        country: "India", // Default

        // CRM Fields
        mode: "physical" as "physical" | "virtual",
        nationality: "indian" as "indian" | "foreign",
        category: initialCategory || "",
        membershipType: "Non-Member", // 'AIASA Member', 'Non-Member'

        // Fee
        feeAmount: 0,
        currency: "INR"
    });

    // Auto-calculate fee whenever relevant fields change
    useEffect(() => {
        let fee = 0;
        let currency = formData.nationality === "indian" ? "INR" : "USD";

        const modeData = FEE_STRUCTURE[formData.mode];
        if (formData.nationality === "indian") {
            const natData = modeData.indian as any;
            const catData = natData[formData.category];
            if (catData) {
                // If it's a flat rate (like Accompanied Person sometimes handled as object with same val), 
                // Checks if it has member/nonMember distinction
                if (typeof catData === 'object') {
                    if (formData.membershipType === "AIASA Member") fee = catData.member;
                    else fee = catData.nonMember;
                } else {
                    fee = catData;
                }
            }
        } else {
            const natData = modeData.foreign as any;
            fee = natData[formData.category] || 0;
        }

        setFormData(prev => ({ ...prev, feeAmount: fee, currency }));
    }, [formData.mode, formData.nationality, formData.category, formData.membershipType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e?: React.FormEvent) => {
        e?.preventDefault();
        // Validation logic could go here
        if (step < 3) setStep(step + 1);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            if (res.ok && data.ticketId) {
                // Emulate success state internally for now
                setTicketData({
                    id: data.ticketId, // ORP5IC-IND-XXXX
                    name: formData.fullName,
                    category: formData.category,
                    fee: `${formData.currency} ${formData.feeAmount}`
                });
                setStep(4);
            } else {
                alert("Registration failed. Please try again.");
            }
        } catch (_e) {
            alert("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- Success / Ticket View ---
    if (step === 4 && ticketData) {
        return (
            <div className="bg-charcoal text-white p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto border border-white/10 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center text-center mb-8">
                    <CheckCircle2 size={64} className="text-earth-green mb-4" />
                    <h2 className="text-3xl font-serif font-bold mb-2">Registration Confirmed!</h2>
                    <p className="text-gray-400">Your registration ID is generated. Please save this.</p>
                </div>

                <div className="bg-[#2A2A2A] rounded-xl p-6 flex items-center justify-between border border-white/5 relative overflow-hidden mb-8">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-charcoal rounded-full" />
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-charcoal rounded-full" />

                    <div className="text-left w-full">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs text-earth-green font-bold uppercase tracking-wider mb-1">Delegate Name</p>
                                <h3 className="text-xl font-bold">{ticketData.name}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-earth-green font-bold uppercase tracking-wider mb-1">Fee Paid</p>
                                <h3 className="text-xl font-bold">{ticketData.fee}</h3>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                            <div>
                                <p className="text-xs text-earth-green font-bold uppercase tracking-wider mb-1">Registration ID</p>
                                <p className="font-mono text-2xl text-white tracking-widest">{ticketData.id}</p>
                            </div>
                            <div className="bg-white p-1 rounded">
                                <div className="w-12 h-12 bg-gray-900 flex items-center justify-center text-[8px] text-center font-bold text-white leading-none">
                                    QR<br />CODE
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button className="bg-earth-green hover:bg-earth-green/90 text-white gap-2 w-full">
                        <Download size={18} /> Download Ticket
                    </Button>
                </div>
            </div>
        );
    }

    // --- Form Wizard ---
    return (
        <form id="registration-form" onSubmit={step === 3 ? handleSubmit : handleNext} className="bg-white rounded-3xl p-8 shadow-large border border-gray-100 max-w-4xl mx-auto relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-1.5 bg-gray-100 w-full">
                <div
                    className="h-full bg-earth-green transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Steps Sidebar (Desktop) */}
                <div className="hidden md:flex flex-col gap-6 w-48 shrink-0 pt-6 border-r border-gray-100 pr-6">
                    {["Mode & Origin", "Personal Info", "Category & Fee", "Payment"].map((label, idx) => (
                        <div key={idx} className={cn("flex items-center gap-3 transition-colors", step === idx ? "text-earth-green font-bold" : step > idx ? "text-charcoal font-medium" : "text-gray-300")}>
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs border-2", step === idx ? "border-earth-green bg-earth-green/10" : step > idx ? "border-earth-green bg-earth-green text-white" : "border-gray-200")}>
                                {step > idx ? <Check size={14} /> : idx + 1}
                            </div>
                            <span className="text-sm">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 pt-6">
                    <h3 className="text-2xl font-serif font-bold text-charcoal mb-6">
                        {step === 0 && "Select Mode & Origin"}
                        {step === 1 && "Personal Details"}
                        {step === 2 && "Confirm Category & Fee"}
                        {step === 3 && "Secure Payment"}
                    </h3>

                    {/* STEP 0: Mode & Nationality */}
                    {step === 0 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700">Participation Mode</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={cn("cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-all", formData.mode === "physical" ? "border-earth-green bg-green-50/30 text-earth-green" : "border-gray-100 text-gray-500")}>
                                        <input type="radio" name="mode" value="physical" checked={formData.mode === "physical"} onChange={handleChange} className="hidden" />
                                        <User size={24} />
                                        <span className="font-bold">Physical</span>
                                    </label>
                                    <label className={cn("cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-all", formData.mode === "virtual" ? "border-earth-green bg-green-50/30 text-earth-green" : "border-gray-100 text-gray-500")}>
                                        <input type="radio" name="mode" value="virtual" checked={formData.mode === "virtual"} onChange={handleChange} className="hidden" />
                                        <Monitor size={24} />
                                        <span className="font-bold">Virtual</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700">Nationality</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={cn("cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-all", formData.nationality === "indian" ? "border-earth-green bg-green-50/30 text-earth-green" : "border-gray-100 text-gray-500")}>
                                        <input type="radio" name="nationality" value="indian" checked={formData.nationality === "indian"} onChange={handleChange} className="hidden" />
                                        <span className="text-2xl">🇮🇳</span>
                                        <span className="font-bold">Indian Delegate</span>
                                    </label>
                                    <label className={cn("cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-all", formData.nationality === "foreign" ? "border-earth-green bg-green-50/30 text-earth-green" : "border-gray-100 text-gray-500")}>
                                        <input type="radio" name="nationality" value="foreign" checked={formData.nationality === "foreign"} onChange={handleChange} className="hidden" />
                                        <span className="text-2xl">🌍</span>
                                        <span className="font-bold">Foreign Delegate</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: Personal Info */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-sm font-bold text-gray-700">Full Name</label>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 outline-none" placeholder="Dr. John Doe" required />
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-sm font-bold text-gray-700">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 outline-none" placeholder="john@university.edu" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Phone / WhatsApp</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 outline-none" placeholder="+91 98765 43210" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Country</label>
                                <input name="country" value={formData.country} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 outline-none" required />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-bold text-gray-700">Institution / Organization</label>
                                <input name="institution" value={formData.institution} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 outline-none" placeholder="University of Agriculture, New Delhi" required />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-bold text-gray-700">Designation</label>
                                <input name="designation" value={formData.designation} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 outline-none" placeholder="Professor / Student / Scientist" required />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Category & Fee */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700">Select Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 outline-none" required>
                                    <option value="">-- Select Category --</option>
                                    {Object.keys(formData.nationality === "indian" ? FEE_STRUCTURE[formData.mode].indian : FEE_STRUCTURE[formData.mode].foreign).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.nationality === "indian" && (
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Membership Status</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={cn("cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all", formData.membershipType === "Non-Member" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200")}>
                                            <input type="radio" name="membershipType" value="Non-Member" checked={formData.membershipType === "Non-Member"} onChange={handleChange} className="hidden" />
                                            Non-Member
                                        </label>
                                        <label className={cn("cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all", formData.membershipType === "AIASA Member" ? "bg-earth-green text-white border-earth-green" : "bg-white text-gray-600 border-gray-200")}>
                                            <input type="radio" name="membershipType" value="AIASA Member" checked={formData.membershipType === "AIASA Member"} onChange={handleChange} className="hidden" />
                                            AIASA Member
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">Members get a discount on registration fees.</p>
                                </div>
                            )}

                            {/* Fee Preview */}
                            <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 mt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Registration Fee ({formData.currency})</span>
                                    <span className="text-2xl font-bold text-charcoal">{formData.feeAmount}</span>
                                </div>
                                <div className="text-xs text-gray-400 text-right">
                                    Auto-calculated based on your category & mode
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Payment */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="p-6 bg-green-50/50 border border-green-100 rounded-xl mb-6">
                                <h4 className="font-bold text-lg text-earth-green mb-1">Registration Summary</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex justify-between"><span>Delegate:</span> <span className="font-bold">{formData.fullName}</span></li>
                                    <li className="flex justify-between"><span>Category:</span> <span>{formData.category} ({formData.nationality})</span></li>
                                    <li className="flex justify-between"><span>Mode:</span> <span className="uppercase">{formData.mode}</span></li>
                                    <li className="flex justify-between pt-2 border-t border-green-200 mt-2 text-base"><span>Total Fee:</span> <span className="font-bold text-earth-green">{formData.currency} {formData.feeAmount}</span></li>
                                </ul>
                            </div>

                            <div className="space-y-4 opacity-75">
                                <div className="flex items-center gap-2 text-charcoal font-bold">
                                    <CreditCard size={20} /> Payment Method
                                </div>
                                {/* Mock Fake Card */}
                                <div className="space-y-2 filter grayscale pointer-events-none">
                                    <input disabled value="0000 0000 0000 0000" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input disabled value="MM/YY" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50" />
                                        <input disabled value="CVC" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50" />
                                    </div>
                                </div>
                                <p className="text-xs text-center text-gray-400 mt-2 italic">
                                    * Payment Gateway Integration Pending. This is a simulation.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-50">
                        {step > 0 && (
                            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
                        )}
                        {step < 3 ? (
                            <Button type="submit" onClick={handleNext} className="bg-earth-green text-white hover:bg-earth-green/90 px-8">
                                Next Step <ChevronRight size={16} className="ml-2" />
                            </Button>
                        ) : (
                            <Button type="submit" disabled={loading} className="bg-rice-gold text-charcoal hover:bg-rice-gold/90 font-bold px-8 min-w-[200px]">
                                {loading ? "Processing..." : `Pay ${formData.currency} ${formData.feeAmount}`}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
