"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
    UploadCloud, 
    Image as ImageIcon, 
    Film, 
    Trash2, 
    Copy, 
    Check, 
    Loader2, 
    RefreshCw, 
    ExternalLink, 
    Plus, 
    CheckCircle2, 
    AlertCircle,
    Layers,
    Filter,
    FolderPlus
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vvqnxqtiwbfmipawtqet.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTY4NjIsImV4cCI6MjA4MDY3Mjg2Mn0.p1ZT0lUN0PIAEXbSphB44g3Nv-YJ5G5oqDRBPU99V5I";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface MediaItem {
    name: string;
    url: string;
    type: "image" | "video";
    size?: number;
    createdAt?: string;
    category?: string;
}

export default function AdminMediaPage() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; filename: string }>({ current: 0, total: 0, filename: "" });
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
    const [videoUrlInput, setVideoUrlInput] = useState("");
    const [videoTitleInput, setVideoTitleInput] = useState("");
    const [videoCategoryInput, setVideoCategoryInput] = useState("Conference Highlights");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = async () => {
        setLoading(true);
        try {
            // 1. Fetch files from Supabase Storage 'uploads' bucket
            const { data: files, error } = await supabase.storage.from("uploads").list("", {
                limit: 200,
                sortBy: { column: "created_at", order: "desc" }
            });

            if (error) {
                console.error("Storage list error:", error);
            }

            const items: MediaItem[] = [];
            if (files && files.length > 0) {
                files.forEach((f) => {
                    if (!f.name || f.name.startsWith(".")) return;
                    const { data: publicData } = supabase.storage.from("uploads").getPublicUrl(f.name);
                    const isVid = f.name.match(/\.(mp4|webm|mov|mkv|avi|m4v)$/i);
                    items.push({
                        name: f.name,
                        url: publicData.publicUrl,
                        type: isVid ? "video" : "image",
                        size: f.metadata?.size,
                        createdAt: f.created_at,
                    });
                });
            }

            // 2. Also fetch gallery content to include custom embedded videos (YouTube/Drive)
            const res = await fetch("/api/content/gallery");
            if (res.ok) {
                const galleryData = await res.json();
                if (galleryData.videos && Array.isArray(galleryData.videos)) {
                    galleryData.videos.forEach((v: any) => {
                        items.unshift({
                            name: v.title || "Embedded Video",
                            url: v.url,
                            type: "video",
                            category: v.category || "Video",
                        });
                    });
                }
            }

            setMediaItems(items);
        } catch (e) {
            console.error("Error loading media:", e);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Client-side fast image compressor (resizes high-res phone 10MB images to crisp ~250KB WebP)
     * Completely prevents server lag and upload timeouts.
     */
    const compressImage = async (file: File): Promise<Blob> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxDim = 1920; // 1080p / 2K max display resolution
                    let width = img.width;
                    let height = img.height;

                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height = Math.round((height * maxDim) / width);
                            width = maxDim;
                        } else {
                            width = Math.round((width * maxDim) / height);
                            height = maxDim;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            resolve(blob || file);
                        },
                        "image/webp",
                        0.85 // High quality, low filesize
                    );
                };
            };
        });
    };

    /**
     * Multi-file direct client-side uploader directly to Supabase Storage.
     * Bypasses Next.js server limits (no 4.5MB Vercel barrier).
     */
    const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const fileList = Array.from(files);

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            setUploadProgress({
                current: i + 1,
                total: fileList.length,
                filename: file.name
            });

            try {
                let fileToUpload: Blob = file;
                const isImage = file.type.startsWith("image/");
                const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|webm|mov)$/i);

                // Auto-compress high-res photos on client
                if (isImage && file.size > 800 * 1024) {
                    fileToUpload = await compressImage(file);
                }

                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                const path = `media/${Date.now()}_${cleanName}`;

                const { error: uploadErr } = await supabase.storage.from("uploads").upload(path, fileToUpload, {
                    contentType: isImage ? "image/webp" : file.type || "application/octet-stream",
                    upsert: true
                });

                if (uploadErr) {
                    console.error("Upload error for file:", file.name, uploadErr);
                }
            } catch (err) {
                console.error("Failed to process file:", file.name, err);
            }
        }

        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await loadMedia();
    };

    /**
     * Add YouTube / Vimeo / Cloud Video URL directly to gallery
     */
    const handleAddVideoLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoUrlInput.trim()) return;

        try {
            const res = await fetch("/api/content/gallery");
            let galleryData: any = {};
            if (res.ok) {
                galleryData = await res.json();
            }

            const existingVideos = galleryData.videos || [];
            existingVideos.unshift({
                id: `vid-${Date.now()}`,
                title: videoTitleInput.trim() || "Conference Session Video",
                url: videoUrlInput.trim(),
                category: videoCategoryInput.trim() || "Highlights",
                createdAt: new Date().toISOString()
            });

            galleryData.videos = existingVideos;

            await fetch("/api/content/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(galleryData)
            });

            setVideoUrlInput("");
            setVideoTitleInput("");
            alert("Video Link Added Successfully!");
            await loadMedia();
        } catch (err) {
            console.error(err);
            alert("Error saving video link");
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2500);
    };

    const filteredMedia = mediaItems.filter((m) => {
        if (filterType === "all") return true;
        return m.type === filterType;
    });

    return (
        <div className="min-h-screen bg-[#F8FAF8] p-6 sm:p-10 font-sans text-gray-900">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
                    <div>
                        <span className="text-xs font-black tracking-widest text-[#d99b26] uppercase">
                            ORP-5 Cloud Assets
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#123125] flex items-center gap-3 mt-1">
                            <Layers className="text-[#123125]" size={30} />
                            Media & Gallery Direct Uploader
                        </h1>
                        <p className="text-xs text-gray-600 mt-1">
                            Direct high-speed cloud upload with auto client-side image optimization. Zero server lag.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={loadMedia} 
                            disabled={loading || uploading}
                            className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                        </Button>
                    </div>
                </div>

                {/* Upload Action Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Bulk File Dropzone */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                                        <UploadCloud size={18} />
                                    </div>
                                    <h3 className="font-bold text-sm text-[#123125]">Bulk Upload Photos & Direct Videos</h3>
                                </div>
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                                    Client-to-Cloud (Fast)
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 mb-6">
                                Select or drag 1 to 50+ photos/videos at once. Photos are automatically compressed on your device for instant loading.
                            </p>

                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFilesSelected}
                                multiple 
                                accept="image/*,video/mp4,video/webm,video/quicktime" 
                                className="hidden" 
                                id="bulk-media-upload"
                            />

                            <label 
                                htmlFor="bulk-media-upload"
                                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition text-center ${
                                    uploading 
                                        ? "bg-amber-50/50 border-amber-300 cursor-not-allowed" 
                                        : "border-emerald-300/80 bg-emerald-50/30 hover:bg-emerald-50/70 hover:border-emerald-500"
                                }`}
                            >
                                {uploading ? (
                                    <div className="space-y-3 flex flex-col items-center">
                                        <Loader2 size={36} className="animate-spin text-amber-600" />
                                        <div>
                                            <p className="font-bold text-xs text-amber-900">
                                                Uploading {uploadProgress.current} of {uploadProgress.total}...
                                            </p>
                                            <p className="text-[10px] text-amber-700 truncate max-w-xs mt-0.5">
                                                {uploadProgress.filename}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-700">
                                            <UploadCloud size={24} />
                                        </div>
                                        <p className="text-xs font-bold text-[#123125]">
                                            Click to Browse or Drag Multiple Files
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            Supports JPG, PNG, WebP, MP4, MOV (Multiple Selection Enabled)
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-500">
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                            <span>Files upload directly to high-speed CDN storage without burdening the web server.</span>
                        </div>
                    </div>

                    {/* Add Video URL (YouTube / Vimeo / Cloud) */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                                    <Film size={18} />
                                </div>
                                <h3 className="font-bold text-sm text-[#123125]">Embed Video Link</h3>
                            </div>

                            <p className="text-xs text-gray-500 mb-4">
                                For large conference recordings or session streams (YouTube, Vimeo, Google Drive, or MP4 URL).
                            </p>

                            <form onSubmit={handleAddVideoLink} className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                                        Video URL
                                    </label>
                                    <input 
                                        type="url"
                                        required
                                        placeholder="https://youtu.be/... or https://..."
                                        value={videoUrlInput}
                                        onChange={(e) => setVideoUrlInput(e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#123125]"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                                        Session Title / Description
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Inaugural Ceremony & Keynote"
                                        value={videoTitleInput}
                                        onChange={(e) => setVideoTitleInput(e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#123125]"
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full bg-[#123125] hover:bg-[#1a4434] text-white text-xs font-bold py-2 mt-2 gap-2"
                                >
                                    <Plus size={14} /> Add Video to Gallery
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Media Library View */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-base text-[#123125]">
                                Uploaded Assets ({filteredMedia.length})
                            </h3>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                            {(["all", "image", "video"] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider transition ${
                                        filterType === type 
                                            ? "bg-[#123125] text-white shadow-xs" 
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    {type === "all" ? "All Media" : type === "image" ? "Photos" : "Videos"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                            <Loader2 size={30} className="animate-spin text-[#123125] mb-2" />
                            <p className="text-xs">Loading media assets...</p>
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <ImageIcon size={36} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-xs font-medium">No media uploaded yet. Use the upload box above to add photos & videos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredMedia.map((item, idx) => (
                                <div 
                                    key={idx}
                                    className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:border-[#123125]/40 transition flex flex-col justify-between shadow-2xs relative"
                                >
                                    {/* Preview */}
                                    <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                        {item.type === "video" ? (
                                            item.url.includes("youtube.com") || item.url.includes("youtu.be") ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-purple-900/90 text-white p-2 text-center">
                                                    <Film size={28} className="text-[#d99b26] mb-1" />
                                                    <span className="text-[10px] font-bold truncate max-w-full">YouTube Video</span>
                                                </div>
                                            ) : (
                                                <video 
                                                    src={item.url} 
                                                    className="w-full h-full object-cover"
                                                    preload="metadata"
                                                />
                                            )
                                        ) : (
                                            <img 
                                                src={item.url} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                loading="lazy"
                                                onError={(e: any) => {
                                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23ccc'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EImage%3C/text%3E%3C/svg%3E";
                                                }}
                                            />
                                        )}

                                        {/* Type Badge */}
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                                            {item.type}
                                        </div>
                                    </div>

                                    {/* Footer Info & Copy Button */}
                                    <div className="p-3 bg-white flex flex-col gap-1.5 border-t border-gray-100">
                                        <p className="text-[11px] font-bold text-gray-800 truncate" title={item.name}>
                                            {item.name}
                                        </p>
                                        <div className="flex items-center gap-1.5 pt-1">
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => copyToClipboard(item.url)}
                                                className="flex-1 text-[10px] h-7 px-2 border-gray-200 hover:bg-gray-50 text-gray-700 gap-1 font-bold"
                                            >
                                                {copiedUrl === item.url ? (
                                                    <>
                                                        <Check size={11} className="text-emerald-600" /> Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={11} /> Copy URL
                                                    </>
                                                )}
                                            </Button>

                                            <a 
                                                href={item.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                                                title="Open in new tab"
                                            >
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
