"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Loader2, Calendar, CheckCircle, Upload, FileText } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SubmissionPageData } from "@/types/pages";
import { fetchJSON } from "@/lib/fetchWrapper";
import Link from 'next/link';

export default function SubmissionClient() {
    const [data, setData] = useState<SubmissionPageData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formState, setFormState] = useState({
        fullName: "",
        email: "",
        phone: "",
        institution: "",
        category: "",
        theme: "",
        title: "",
        abstract: "",
        file: null as File | null
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [registrationId] = useState(() => `ABS-${Math.floor(Math.random() * 10000)}`);

    useEffect(() => {
        async function loadData() {
            const { data: jsonData, error: fetchError } = await fetchJSON<SubmissionPageData>("/api/content/submission");
            if (fetchError) {
                setError(fetchError);
            } else {
                setData(jsonData);
            }
        }
        loadData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormState({ ...formState, file: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            let fileUrl = null;

            // 1. Upload File if present
            if (formState.file) {
                const formData = new FormData();
                formData.append('file', formState.file);

                const uploadReq = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadReq.ok) {
                    const err = await uploadReq.json();
                    throw new Error(err.error || 'File upload failed');
                }

                const uploadRes = await uploadReq.json();
                fileUrl = uploadRes.url;
            }

            // 2. Submit Abstract Data
            const payload = {
                title: formState.title,
                abstract: formState.abstract,
                category: formState.category,
                theme: formState.theme,
                fileUrl: fileUrl,
                // Extra fields can be added to DB if needed, currently schema supports these core ones
                fullName: formState.fullName, // Optionally store in JSONB if schema expanded, but strictly schema only has core columns.
                // For now we map form to strict schema. Table columns: title, topic (theme), category, abstract_text, file_url.
            };

            const submitReq = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (submitReq.status === 401) {
                window.location.href = '/login?redirect=/submission';
                return;
            }

            if (!submitReq.ok) {
                const err = await submitReq.json();
                throw new Error(err.error || 'Submission failed');
            }

            const submitRes = await submitReq.json();
            // setRegistrationId(submitRes.submission.id); // If we want to show real ID
            setSubmitting(false);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred. Please try again.");
            setSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (error) return (
        <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
            <div className="text-center max-w-md">
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-earth-green hover:underline">
                    Try Again
                </button>
            </div>
        </div>
    );

    if (!data) return <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center"><Loader2 className="animate-spin text-earth-green" size={40} /></div>;

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal">
                <Navbar />
                <div className="container mx-auto px-6 py-32 text-center max-w-2xl">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-earth-green" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-earth-green mb-4">Submission Received!</h1>
                    <p className="text-xl text-gray-600 mb-8">Thank you, <strong>{formState.fullName}</strong>. Your abstract "{formState.title}" has been successfully submitted for review.</p>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-left mb-8">
                        <p className="text-sm text-gray-500 mb-2">Registration ID</p>
                        <p className="font-mono font-bold text-lg mb-4">{registrationId}</p>
                        <p className="text-sm text-gray-500">We have sent a confirmation email to {formState.email}.</p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <Link href="/">
                            <Button variant="outline">Return Home</Button>
                        </Link>
                        <button onClick={() => setSubmitted(false)} className="text-earth-green hover:underline">Submit Another</button>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#FDFCF8] font-sans text-charcoal">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-[#FDFCF8] pt-32 pb-20 text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="flex justify-center items-center gap-2 text-earth-green/60 text-sm font-semibold mb-4 uppercase tracking-widest">
                        <Link href="/" className="hover:text-earth-green transition-colors">Home</Link> / Abstract Submission
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-tight text-charcoal">{data.hero.headline}</h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-12">{data.hero.subheadline}</p>
                    <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">{data.hero.description}</p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-5xl pb-20">

                {/* Timeline */}
                <div className="mb-24">
                    <h2 className="text-2xl font-bold text-center mb-12">Important Dates</h2>
                    <div className="flex flex-col md:flex-row justify-between items-center relative gap-8">
                        {/* Line */}
                        <div className="hidden md:block absolute top-[11px] left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>

                        {data.timeline.map((item: any, i: number) => (
                            <div key={i} className="flex flex-col items-center bg-[#FDFCF8] px-4 z-10">
                                <div className="w-6 h-6 rounded-full bg-[#24C535] border-4 border-[#FDFCF8] shadow-sm mb-4"></div>
                                <h4 className="font-bold text-sm text-gray-900 mb-1">{item.label}</h4>
                                <p className="text-xs text-gray-500">{item.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-24">
                    <h2 className="text-2xl font-bold text-center mb-12">Submission Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.categories.map((cat: any, i: number) => (
                            <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
                                <h3 className="font-bold text-lg mb-3">{cat.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Thematic Areas */}
                <div className="mb-24 bg-[#F8FAF9] rounded-2xl p-10">
                    <h2 className="text-2xl font-bold text-center mb-12">Thematic Areas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 max-w-3xl mx-auto">
                        {data.thematicAreas.map((area: string, i: number) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="bg-[#24C535] rounded-full p-0.5"><CheckCircle size={12} className="text-white" /></div>
                                <span className="text-gray-700 text-sm font-medium">{area}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submission Form */}
                <div id="form" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 max-w-4xl mx-auto mb-20 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-center mb-10">Submission Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Full Name</label>
                                <input required name="fullName" value={formState.fullName} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Email Address</label>
                                <input required name="email" value={formState.email} onChange={handleInputChange} type="email" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Phone</label>
                                <input required name="phone" value={formState.phone} onChange={handleInputChange} type="tel" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Institution / Affiliation</label>
                                <input required name="institution" value={formState.institution} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Presentation Category</label>
                                <select required name="category" value={formState.category} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20 bg-white">
                                    <option value="">Select Category</option>
                                    {data.categories.map((c: any, i: number) => <option key={i} value={c.title}>{c.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Thematic Area</label>
                                <select required name="theme" value={formState.theme} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20 bg-white">
                                    <option value="">Select Theme</option>
                                    {data.thematicAreas.map((t: string, i: number) => <option key={i} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Abstract Title</label>
                            <input required name="title" value={formState.title} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20" />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Abstract</label>
                            <textarea required name="abstract" value={formState.abstract} onChange={handleInputChange} rows={6} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green/20 text-sm" placeholder="Paste your abstract text here..." />
                            <p className="text-xs text-gray-400 mt-2">300 words limit. Alternatively you can upload a DOCX file below.</p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Upload Abstract (DOCX)</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                {formState.file ? (
                                    <>
                                        <FileText size={40} className="text-earth-green mb-3" />
                                        <p className="font-bold text-gray-900">{formState.file.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{(formState.file.size / 1024).toFixed(1)} KB</p>
                                        <p className="text-xs text-red-500 mt-3 font-medium hover:underline" onClick={(e) => { e.stopPropagation(); setFormState({ ...formState, file: null }); }}>Remove File</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-gray-100 p-3 rounded-full mb-3 text-gray-400">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-600"><span className="text-earth-green font-bold">Upload a file</span> or drag and drop</p>
                                        <p className="text-xs text-gray-400 mt-1">DOCX up to 10MB</p>
                                    </>
                                )}
                                <input ref={fileInputRef} type="file" accept=".docx,.doc,.pdf" className="hidden" onChange={handleFileChange} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6">
                            <Button type="button" variant="outline" className="px-8 font-bold">Save Draft</Button>
                            <Button type="submit" className="bg-[#24C535] hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full min-w-[160px]" disabled={submitting}>
                                {submitting ? <><Loader2 className="animate-spin mr-2" /> Submitting...</> : "Submit Abstract"}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Info & Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">{data.infoCards.review.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{data.infoCards.review.description}</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">{data.infoCards.support.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{data.infoCards.support.description}</p>
                    </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="bg-[#E6F6EA] rounded-3xl py-16 text-center">
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">{data.cta.headline}</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">{data.cta.subheadline}</p>
                    <div className="flex justify-center gap-4">
                        {data.cta.buttons.map((btn: any, i: number) => (
                            <a key={i} href={btn.link}>
                                <Button
                                    className={btn.variant === "primary" ? "bg-[#24C535] hover:bg-green-600 text-white font-bold px-6 border-none" : "bg-transparent border border-[#24C535] text-[#1E992A] hover:bg-[#24C535]/10 px-6 font-bold"}
                                >
                                    {btn.label}
                                </Button>
                            </a>
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
