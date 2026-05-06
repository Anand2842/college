"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";
import { Button } from "@/components/atoms/Button";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { User, Monitor, Clock, Gift, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegistrationContent() {
    const { openModal } = useRegistrationModal();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#FFFDF7] pt-20">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-earth-green via-earth-green to-earth-green/90 text-white py-16 md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-serif font-bold mb-4"
                        >
                            Conference Registration
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/80 max-w-2xl mx-auto"
                        >
                            Join us at ORP5 International Conference on Organic Rice Production
                        </motion.p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12 max-w-6xl">
                    {/* Participation Modes */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Participation</h2>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <p className="text-gray-700 mb-6">
                                The conference will be organized in both <strong>offline and online modes</strong>.
                                Participants who wish to attend or present through online/video mode may register
                                under the online participation category.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <User className="text-earth-green" size={32} />
                                    <div>
                                        <h3 className="font-bold text-charcoal">Physical Mode</h3>
                                        <p className="text-sm text-gray-600">Attend in-person at the venue with full conference kit</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <Monitor className="text-blue-600" size={32} />
                                    <div>
                                        <h3 className="font-bold text-charcoal">Virtual/Online Mode</h3>
                                        <p className="text-sm text-gray-600">Participate remotely via live streaming</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Registration Fee Tables */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Registration Fee</h2>

                        {/* Indian Delegates */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-charcoal mb-3 flex items-center gap-2">
                                <span className="text-2xl">🇮🇳</span> For Indian Delegates
                            </h3>

                            {/* Physical Mode - Indian */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
                                <div className="bg-earth-green text-white px-6 py-3 font-bold flex items-center gap-2">
                                    <User size={20} /> PHYSICAL MODE
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px]">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                                                <th className="text-center p-4 font-semibold text-gray-700">AIASA Members</th>
                                                <th className="text-center p-4 font-semibold text-gray-700">Non-Members</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr>
                                                <td className="p-4">UG Students (AIASA Members)</td>
                                                <td className="p-4 text-center font-bold text-earth-green">₹2,500</td>
                                                <td className="p-4 text-center font-bold">₹3,500</td>
                                            </tr>
                                            <tr className="bg-gray-50/50">
                                                <td className="p-4">PG Students/Research Scholars</td>
                                                <td className="p-4 text-center font-bold text-earth-green">₹3,000</td>
                                                <td className="p-4 text-center font-bold">₹4,000</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4">Scientists/Professionals</td>
                                                <td className="p-4 text-center font-bold text-earth-green">₹8,000</td>
                                                <td className="p-4 text-center font-bold">₹10,000</td>
                                            </tr>
                                            <tr className="bg-gray-50/50">
                                                <td className="p-4">Innovative Farmers (KKM/AIASA Members)</td>
                                                <td className="p-4 text-center font-bold text-earth-green">₹2,700</td>
                                                <td className="p-4 text-center font-bold">₹3,700</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Virtual Mode - Indian */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                <div className="bg-blue-600 text-white px-6 py-3 font-bold flex items-center gap-2">
                                    <Monitor size={20} /> VIRTUAL/ONLINE MODE
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px]">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                                                <th className="text-center p-4 font-semibold text-gray-700">AIASA Members</th>
                                                <th className="text-center p-4 font-semibold text-gray-700">Non-Members</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr>
                                                <td className="p-4">UG Students</td>
                                                <td className="p-4 text-center font-bold text-blue-600">₹1,000</td>
                                                <td className="p-4 text-center font-bold">₹1,300</td>
                                            </tr>
                                            <tr className="bg-gray-50/50">
                                                <td className="p-4">PG Students/Research Scholars</td>
                                                <td className="p-4 text-center font-bold text-blue-600">₹1,500</td>
                                                <td className="p-4 text-center font-bold">₹1,700</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4">Scientists/Professionals</td>
                                                <td className="p-4 text-center font-bold text-blue-600">₹2,800</td>
                                                <td className="p-4 text-center font-bold">₹3,600</td>
                                            </tr>
                                            <tr className="bg-gray-50/50">
                                                <td className="p-4">Innovative Farmers (KKM/AIASA Members)</td>
                                                <td className="p-4 text-center font-bold text-blue-600">₹900</td>
                                                <td className="p-4 text-center font-bold">₹1,300</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Foreign Delegates */}
                        <div>
                            <h3 className="text-lg font-bold text-charcoal mb-3 flex items-center gap-2">
                                <span className="text-2xl">🌍</span> For Foreign Delegates
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Physical Mode - Foreign */}
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                    <div className="bg-earth-green text-white px-6 py-3 font-bold flex items-center gap-2">
                                        <User size={20} /> PHYSICAL MODE
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span>UG Students</span>
                                            <span className="font-bold text-earth-green">US$ 250</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span>PG Students/Research Scholars</span>
                                            <span className="font-bold text-earth-green">US$ 300</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span>Scientists/Professionals</span>
                                            <span className="font-bold text-earth-green">US$ 500</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Virtual Mode - Foreign */}
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                    <div className="bg-blue-600 text-white px-6 py-3 font-bold flex items-center gap-2">
                                        <Monitor size={20} /> VIRTUAL/ONLINE MODE
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span>UG Students</span>
                                            <span className="font-bold text-blue-600">US$ 25</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span>PG Students/Research Scholars</span>
                                            <span className="font-bold text-blue-600">US$ 35</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span>Scientists/Professionals</span>
                                            <span className="font-bold text-blue-600">US$ 50</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Notes Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-12"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Registration Kit Info */}
                            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100">
                                <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                                    <Gift className="text-earth-green" /> Registration Kit Includes
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="text-earth-green mt-0.5" size={18} />
                                        <div>
                                            <p className="font-medium text-charcoal">Physical Candidates</p>
                                            <p className="text-sm text-gray-600">Souvenir/Abstract Book, Conference Kit, Refreshment & Lunch</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="text-earth-green mt-0.5" size={18} />
                                        <div>
                                            <p className="font-medium text-charcoal">Virtual Candidates</p>
                                            <p className="text-sm text-gray-600">Passes for all conference day events</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Late Fee Notice */}
                            <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-200">
                                <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                                    <Clock className="text-amber-600" /> Late Fee Notice
                                </h3>
                                <div className="flex items-center gap-3 p-4 bg-amber-100/50 rounded-xl">
                                    <AlertCircle className="text-amber-600 shrink-0" size={24} />
                                    <p className="text-sm text-gray-700">
                                        <strong className="text-amber-700">₹1,000 or US$ 20</strong> late fee will be applicable
                                        (irrespective of any category) per person after the registration deadline.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>



                    {/* Register CTA */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center pt-8 pb-24"
                    >
                        <div className="bg-gradient-to-r from-earth-green to-earth-green/90 rounded-3xl p-8 md:p-12 text-white">
                            <h2 className="text-3xl font-serif font-bold mb-4">Ready to Register?</h2>
                            <p className="text-white/80 mb-8 max-w-xl mx-auto">
                                Fill out the registration form and complete your payment to secure your spot at ORP5 International Conference.
                            </p>
                            <Button
                                onClick={openModal}
                                className="bg-white text-earth-green hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-xl"
                            >
                                Register Now →
                            </Button>
                        </div>
                    </motion.section>
                </div>
            </div>
            <Footer />
        </>
    );
}
