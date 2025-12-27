"use client";

import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { CheckCircle, XCircle, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export default function AdminScannerPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [manualId, setManualId] = useState("");
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [registrant, setRegistrant] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleScan = (result: any) => {
        console.log("Scan result:", result);
        if (result && result[0] && result[0].rawValue) {
            // Avoid double scanning
            if (verificationStatus === 'idle' && !scanResult) {
                const code = result[0].rawValue;
                console.log("Found code:", code);
                setScanResult(code);
                verifyTicket(code);
            }
        }
    };

    const handleError = (error: any) => {
        console.error("Scanner error:", error);
        setErrorMsg("Camera error: " + (error?.message || "Unknown error"));
        setVerificationStatus('error');
    };

    const verifyTicket = async (ticketId: string) => {
        setVerificationStatus('loading');
        setErrorMsg(null);

        try {
            const res = await fetch('/api/admin/verify-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId })
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                setRegistrant(data.registrant);
                setVerificationStatus('success');
            } else {
                setVerificationStatus('error');
                setErrorMsg(data.message || 'Invalid Ticket');
            }
        } catch (e) {
            setVerificationStatus('error');
            setErrorMsg('Network Error');
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setRegistrant(null);
        setVerificationStatus('idle');
        setErrorMsg(null);
        setManualId("");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#123125] p-4 text-white flex justify-between items-center">
                    <h1 className="font-bold text-lg">Ticket Scanner</h1>
                    <Button variant="ghost" size="sm" onClick={resetScan} className="text-white hover:bg-white/10 h-8 w-8 p-0">
                        <RefreshCw size={16} />
                    </Button>
                </div>

                {/* Scanner Area */}
                <div className="relative bg-black min-h-[300px] flex items-center justify-center">
                    {verificationStatus === 'idle' ? (
                        <div className="w-full h-full">
                            <Scanner
                                onScan={handleScan}
                                onError={handleError}
                                styles={{ container: { width: '100%', height: '300px' } }}
                                components={{ finder: true }}
                            />
                            <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-xs">
                                Point camera at QR Code
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-[300px] flex flex-col items-center justify-center bg-gray-100 p-6">
                            {verificationStatus === 'loading' && (
                                <Loader2 className="animate-spin text-earth-green mb-4" size={48} />
                            )}

                            {verificationStatus === 'success' && (
                                <div className="text-center">
                                    <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                                        <CheckCircle className="text-green-600" size={48} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-700 mb-1">VERIFIED</h2>
                                    <p className="text-sm text-gray-500">Access Granted</p>
                                </div>
                            )}

                            {verificationStatus === 'error' && (
                                <div className="text-center">
                                    <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
                                        <XCircle className="text-red-600" size={48} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-red-700 mb-1">INVALID</h2>
                                    <p className="text-sm text-gray-500">{errorMsg}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Result / Details Area */}
                <div className="p-6">
                    {verificationStatus === 'success' && registrant ? (
                        <div className="space-y-4">
                            <div className="border-b border-gray-100 pb-4">
                                <label className="text-xs text-gray-400 uppercase font-bold">Name</label>
                                <p className="text-xl font-bold text-charcoal">{registrant.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold">Category</label>
                                    <p className="font-medium text-gray-800">{registrant.category}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold">Ticket ID</label>
                                    <p className="font-mono text-sm text-gray-600 truncate" title={registrant.ticketId}>{registrant.ticketId}</p>
                                </div>
                            </div>

                            <Button onClick={resetScan} className="w-full bg-[#123125] text-white hover:bg-[#1a4534] mt-4">
                                Scan Next
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <span className={verificationStatus === 'error' ? "text-red-500 font-bold" : "text-gray-400"}>
                                    {scanResult ? `Scanned: ${scanResult}` : "Ready to scan"}
                                </span>
                            </div>

                            {verificationStatus === 'error' && (
                                <Button onClick={resetScan} className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300">
                                    Try Again
                                </Button>
                            )}

                            {/* Manual Entry Fallback */}
                            {verificationStatus === 'idle' && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 text-center mb-3 font-bold uppercase">Or Enter ID Manually</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="ORP5IC-..."
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            value={manualId}
                                            onChange={(e) => setManualId(e.target.value)}
                                        />
                                        <Button
                                            onClick={() => verifyTicket(manualId)}
                                            disabled={!manualId}
                                            className="bg-[#DFC074] text-[#123125] hover:bg-[#C9AB63]"
                                        >
                                            Verify
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
