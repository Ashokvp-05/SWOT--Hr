"use client"

import { useEffect, useState } from "react"
import { FileText, Loader2, Plus, Download, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const API = process.env.NEXT_PUBLIC_API_URL

const TYPE_COLORS: Record<string, string> = {
    Contract: "bg-indigo-50 text-indigo-600",
    Offer: "bg-emerald-50 text-emerald-600",
    Legal: "bg-rose-50 text-rose-600",
    Identity: "bg-amber-50 text-amber-600",
    Certificate: "bg-violet-50 text-violet-600",
}

export default function DocumentsModule({ token }: { token: string }) {
    const [docs, setDocs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDocs = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${API}/documents`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setDocs(Array.isArray(data) ? data : (data.documents || data.data || []))
                } else {
                    toast.error("Failed to load documents")
                }
            } catch {
                toast.error("Connection error")
            } finally {
                setLoading(false)
            }
        }
        fetchDocs()
    }, [token])

    if (loading) return (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-300">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Loading Documents...</p>
        </div>
    )

    return (
        <div className="space-y-5">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] text-slate-400 font-medium">
                        Upload, manage, and control access to employee documents.
                    </p>
                    <p className="text-[10px] text-slate-300 mt-0.5">{docs.length} document{docs.length !== 1 ? "s" : ""} on record</p>
                </div>
                <Button
                    size="sm"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 h-9 px-4 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    onClick={() => toast.info("File upload coming soon")}
                >
                    <Plus className="w-3 h-3" /> Upload Document
                </Button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[1fr_160px_120px_100px] px-6 py-3 border-b border-slate-100 bg-slate-50/60">
                    {["Document", "Employee", "Date", "Type"].map(h => (
                        <span key={h} className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h}</span>
                    ))}
                </div>

                {docs.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center gap-3 opacity-40">
                        <ShieldAlert className="w-10 h-10 text-slate-200" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">No Documents Found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {docs.map((doc: any, i: number) => {
                            const typeKey = doc.type || "Other"
                            const colorClass = TYPE_COLORS[typeKey] || "bg-slate-50 text-slate-500"
                            const employee = doc.user?.name || doc.employee || "—"
                            const date = doc.createdAt
                                ? new Date(doc.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                : "—"

                            return (
                                <div key={doc.id || i} className="grid grid-cols-[1fr_160px_120px_100px] px-6 py-4 hover:bg-slate-50/80 transition-colors cursor-pointer items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                            <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <span className="text-[12px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{doc.name}</span>
                                            {doc.fileUrl && (
                                                <a href={doc.fileUrl} target="_blank" rel="noreferrer"
                                                    className="ml-2 text-[9px] font-black text-indigo-400 hover:text-indigo-600 uppercase tracking-wider"
                                                    onClick={e => e.stopPropagation()}>
                                                    <Download className="w-3 h-3 inline" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-slate-500 font-medium">{employee}</span>
                                    <span className="text-[11px] text-slate-400">{date}</span>
                                    <span className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-lg w-fit tracking-wider", colorClass)}>
                                        {typeKey}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
