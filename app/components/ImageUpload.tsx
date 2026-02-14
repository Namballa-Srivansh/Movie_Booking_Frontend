"use client";

import { useState, ChangeEvent } from "react";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import { getOptimizedImageUrl } from "@/app/utils/cloudinary";

interface ImageUploadProps {
    onUpload: (url: string) => void;
    label?: string;
    value?: string;
    onRemove?: () => void;
}

export default function ImageUpload({ onUpload: parentOnUpload, label = "Upload Image", value, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError("Image size should be less than 5MB");
            return;
        }

        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
            formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "");

            console.log("Uploading to Cloudinary...", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Cloudinary Error:", data);
                throw new Error(data.error?.message || "Upload failed");
            }

            console.log("Upload success:", data.secure_url);
            parentOnUpload(data.secure_url);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
                {label}
            </label>

            {value ? (
                <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
                    <img
                        src={getOptimizedImageUrl(value, 'thumbnail')}
                        alt="Uploaded preview"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {onRemove && (
                            <button
                                type="button"
                                onClick={onRemove}
                                className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110 shadow-lg"
                                title="Remove image"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="relative group">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    />

                    <div className={`
                        relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200
                        ${error
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300 bg-slate-50 group-hover:bg-slate-100 group-hover:border-indigo-400"
                        }
                        ${isUploading ? "opacity-70" : ""}
                    `}>
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-3 animate-pulse">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                <p className="text-sm text-slate-500 font-medium">Uploading to cloud...</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <Upload className={`w-6 h-6 ${error ? "text-red-500" : "text-indigo-600"}`} />
                                </div>
                                <div className="text-center">
                                    <p className={`text-sm font-medium ${error ? "text-red-600" : "text-slate-700"}`}>
                                        {error ? "Upload failed" : "Click to upload image"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {error ? error : "SVG, PNG, JPG or GIF (max. 5MB)"}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
