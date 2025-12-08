"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Check, CheckCircle2, ChevronRight, Download, Calendar } from "lucide-react";

export function RegistrationForm({ selectedCategory }: { selectedCategory: string }) {
    const router = useRouter();
    // Steps: 0 = Info, 1 = Preferences, 2 = Payment, 3 = Confirmation
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [ticketData, setTicketData] = useState<any>(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        affiliation: "",
        country: "",
        designation: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e?: React.FormEvent) => {
        e?.preventDefault(); // Prevent default form submission if triggered by enter key
        if (step < 2) setStep(step + 1);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({
                    category: selectedCategory || "General Delegate",
                    ...formData
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            if (res.ok && data.ticketId) {
                // Redirect to success page with registration ID
                router.push(`/registration/success?id=${data.ticketId}`);
            } else {
                // Fallback to inline confirmation if redirect unavailable
                setTicketData({
                    id: data.ticketId,
                    name: formData.fullName,
                    category: selectedCategory || "General Delegate"
                });
                setStep(3);
            }
        } catch (_e) {
            alert("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- Success / Ticket View ---
    if (step === 3 && ticketData) {
        return (
            <div className="bg-charcoal text-white p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto border border-white/10 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center text-center mb-8">
                    <CheckCircle2 size={64} className="text-earth-green mb-4" />
                    <h2 className="text-3xl font-serif font-bold mb-2">Registration Confirmed!</h2>
                    <p className="text-gray-400">Your receipt and QR code for check-in are below.</p>
                </div>

                <div className="bg-[#2A2A2A] rounded-xl p-6 flex items-center justify-between border border-white/5 relative overflow-hidden">
                    {/* Decorative circle */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-charcoal rounded-full" />
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-charcoal rounded-full" />

                    <div className="text-left">
                        <p className="text-xs text-earth-green font-bold uppercase tracking-wider mb-1">Delegate Name</p>
                        <h3 className="text-2xl font-bold mb-4">{ticketData.name}</h3>
                        <p className="text-xs text-earth-green font-bold uppercase tracking-wider mb-1">Registration ID</p>
                        <p className="font-mono text-gray-300">{ticketData.id}</p>
                    </div>

                    <div className="bg-white p-2 rounded-lg">
                        {/* Placeholder QR */}
                        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                            <span className="text-charcoal font-bold text-xs">QR CODE</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-8 justify-center">
                    <Button className="bg-earth-green hover:bg-earth-green/90 text-white gap-2">
                        <Download size={18} /> Download Receipt
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
                        <Calendar size={18} /> Add to Calendar
                    </Button>
                </div>
            </div>
        );
    }

    // --- Form Wizard ---
    return (
        <form id="registration-form" onSubmit={step === 2 ? handleSubmit : handleNext} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 max-w-3xl mx-auto">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-100 -z-0"></div>
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s - 1 ? "bg-earth-green text-white" : "bg-white border-2 border-gray-200 text-gray-400"}`}>
                        {s}
                    </div>
                ))}
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-bold text-charcoal mb-6">
                    {step === 0 && "Personal Information"}
                    {step === 1 && "Preferences & Details"}
                    {step === 2 && "Payment Information"}
                </h3>

                {step === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Full Name</label>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none" placeholder="john@example.com" required />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700">Affiliation / Institution</label>
                            <input name="affiliation" value={formData.affiliation} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none" placeholder="University of Agriculture" required />
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Mobile Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none" placeholder="+1234 567 890" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Designation</label>
                            <input name="designation" value={formData.designation} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none" placeholder="Professor, Student, etc." required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Country</label>
                            <select name="country" value={formData.country} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-earth-green/20 focus:outline-none" required>
                                <option value="">Select Country</option>
                                <option value="IN">India</option>
                                <option value="US">USA</option>
                                <option value="UK">UK</option>
                                <option value="JP">Japan</option>
                            </select>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-6">
                            <p className="text-sm text-gray-500 mb-2">Category Selected:</p>
                            <h4 className="font-bold text-lg text-earth-green">{selectedCategory || "General Delegate"}</h4>
                            <p className="text-xs text-gray-400 mt-1">Mock Payment Gateway - Card not required</p>
                        </div>
                        <div className="space-y-4 opacity-50 pointer-events-none filter grayscale">
                            {/* Fake Card Fields */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Card Number</label>
                                <input disabled value="0000 0000 0000 0000" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Expiry</label>
                                    <input disabled value="MM/YY" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">CVC</label>
                                    <input disabled value="123" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100" />
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-4 italic">
                            * This is a demo. Clicking &quot;Process Registration&quot; will clear the payment instantly.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3">
                {step > 0 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
                )}
                {step < 2 ? (
                    <Button type="submit" onClick={handleNext} className="bg-earth-green text-white">
                        Next Step <ChevronRight size={16} />
                    </Button>
                ) : (
                    <Button type="submit" disabled={loading} className="bg-rice-gold text-charcoal font-bold min-w-[200px]">
                        {loading ? "Processing..." : "Process Registration"}
                    </Button>
                )}
            </div>
        </form>
    );
}
