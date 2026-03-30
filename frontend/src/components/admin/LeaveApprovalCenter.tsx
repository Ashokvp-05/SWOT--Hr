"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ClipboardList, CheckCircle2, XCircle, Clock,
    User, Calendar, Tag, Loader2, AlertCircle,
    MessageSquare, ChevronDown, Filter, Search, ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface LeaveRequest {
    id: string
    user: { name: string; email: string; department?: { name: string } }
    type: string
    startDate: string
    endDate: string
    reason?: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: string
}

interface LeaveApprovalCenterProps {
    token: string
}

const TYPE_COLORS: Record<string, string> = {
    SICK: "bg-rose-50 text-rose-600 border-none",
    CASUAL: "bg-blue-50 text-blue-600 border-none",
    EARNED: "bg-emerald-50 text-emerald-600 border-none",
    MEDICAL: "bg-orange-50 text-orange-600 border-none",
}

const STATUS_ICONS = {
    PENDING: <Clock className="w-3 h-3" />,
    APPROVED: <CheckCircle2 className="w-3 h-3" />,
    REJECTED: <XCircle className="w-3 h-3" />,
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 border-none",
    APPROVED: "bg-emerald-50 text-emerald-600 border-none",
    REJECTED: "bg-rose-50 text-rose-600 border-none",
}

export default function LeaveApprovalCenter({ token }: LeaveApprovalCenterProps) {
    const API = process.env.NEXT_PUBLIC_API_URL
    const [leaves, setLeaves] = useState<LeaveRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING")
    const [search, setSearch] = useState("")
    const [rejectId, setRejectId] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }

    const fetchLeaves = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}/leaves/all`, { headers: h })
            if (res.ok) {
                const data = await res.json()
                setLeaves(Array.isArray(data) ? data : [])
            }
        } catch { toast.error("Failed to load leave requests") }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchLeaves() }, [token])

    const approve = async (id: string) => {
        setActionLoading(id)
        try {
            const res = await fetch(`${API}/leaves/${id}/approve`, { method: "PUT", headers: h })
            if (res.ok) {
                toast.success("Leave approved ✅")
                setLeaves(l => l.map(x => x.id === id ? { ...x, status: "APPROVED" } : x))
            } else {
                const d = await res.json()
                toast.error(d.error || "Failed to approve")
            }
        } catch { toast.error("Network error") }
        finally { setActionLoading(null) }
    }

    const reject = async (id: string) => {
        if (!rejectReason.trim()) { toast.error("Please enter a rejection reason"); return }
        setActionLoading(id)
        try {
            const res = await fetch(`${API}/leaves/${id}/reject`, {
                method: "PUT", headers: h,
                body: JSON.stringify({ reason: rejectReason })
            })
            if (res.ok) {
                toast.success("Leave rejected")
                setLeaves(l => l.map(x => x.id === id ? { ...x, status: "REJECTED" } : x))
                setRejectId(null); setRejectReason("")
            } else {
                const d = await res.json()
                toast.error(d.error || "Failed to reject")
            }
        } catch { toast.error("Network error") }
        finally { setActionLoading(null) }
    }

    const daysCount = (s: string, e: string) => {
        const diff = new Date(e).getTime() - new Date(s).getTime()
        return Math.ceil(diff / 86400000) + 1
    }

    const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })

    const filtered = leaves.filter(l => {
        const matchStatus = filter === "ALL" || l.status === filter
        const matchSearch = !search || l.user?.name?.toLowerCase().includes(search.toLowerCase())
            || l.type?.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchSearch
    })

    const pendingCount = leaves.filter(l => l.status === "PENDING").length

    return (
        <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm flex flex-col font-sans">
            {/* HEADER */}
            <div className="p-10 pb-8 border-b border-slate-50 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-amber-500 rounded-[20px] shadow-xl shadow-amber-100 relative group transition-all hover:rotate-3">
                        <ClipboardList className="w-7 h-7 text-white" />
                        {pendingCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 border-4 border-white rounded-full text-[10px] font-black text-white flex items-center justify-center animate-pulse">
                                {pendingCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 border-none italic uppercase tracking-tighter leading-none">Leave Approvals</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
                            {pendingCount} Critical Actions · {leaves.length} Recorded Units
                        </p>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-1.5 rounded-2xl border border-slate-100/50">
                    <div className="relative mr-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Filter personnel..."
                            className="h-9 pl-9 bg-white border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-900 placeholder:text-slate-300 w-44 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none" />
                    </div>
                    {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s
                                ? "bg-amber-500 text-white shadow-xl shadow-amber-500/10"
                                : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-white"
                                }`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-auto p-10 space-y-5 h-[600px] custom-scrollbar">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-6 text-slate-400">
                        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing synchronization nodes...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-6 opacity-40">
                        <ClipboardList className="w-16 h-16 text-slate-100" />
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">No organizational {filter !== "ALL" ? filter.toLowerCase() : ""} requests</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filtered.map((leave, idx) => (
                            <motion.div key={leave.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.04 }}
                                className="p-8 bg-white border border-slate-50 rounded-[32px] hover:border-amber-100 hover:bg-slate-50/20 transition-all duration-300 group shadow-sm hover:shadow-xl"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    {/* LEFT: User + Leave Info */}
                                    <div className="flex items-start gap-6 flex-1">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-[24px]" />
                                            <User className="w-7 h-7 text-slate-200 relative z-10" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap mb-2">
                                                <h4 className="text-slate-900 font-black uppercase tracking-tight text-[16px] group-hover:text-amber-600 transition-colors leading-none">{leave.user?.name || "Unknown"}</h4>
                                                <Badge className={cn("text-[9px] font-black px-3 py-0.5 shadow-none", TYPE_COLORS[leave.type] || "bg-slate-50 text-slate-400")}>
                                                    {leave.type}
                                                </Badge>
                                                <Badge className={cn("text-[9px] font-black px-3 py-0.5 flex items-center gap-1.5 shadow-none", STATUS_COLORS[leave.status])}>
                                                    {STATUS_ICONS[leave.status]} {leave.status}
                                                </Badge>
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] flex items-center gap-2 mb-4">
                                                <span className="font-medium tracking-normal italic lowercase">{leave.user?.email}</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span>{leave.user?.department?.name || "Operational Unit"}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50/50 border border-slate-50/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter" suppressHydrationWarning>
                                                        {fmt(leave.startDate)} <ArrowRight className="inline w-3 h-3 mx-1 text-slate-300" /> {fmt(leave.endDate)}
                                                    </span>
                                                </div>
                                                <div className="h-6 w-[1.5px] bg-slate-200" />
                                                <span className="text-amber-600 font-black text-[12px] uppercase">{daysCount(leave.startDate, leave.endDate)} UNITS</span>
                                            </div>
                                            
                                            {leave.reason && (
                                                <div className="mt-4 flex gap-3 p-4 rounded-2xl border-l-[4px] border-amber-200 bg-amber-50/20 italic text-[11px] text-slate-500 font-medium">
                                                    <MessageSquare className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                                                    "{leave.reason}"
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* RIGHT: Actions */}
                                    {leave.status === "PENDING" && (
                                        <div className="flex items-center gap-3 shrink-0">
                                            {rejectId === leave.id ? (
                                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                                                    <Input
                                                        value={rejectReason}
                                                        onChange={e => setRejectReason(e.target.value)}
                                                        placeholder="Rejection insight..."
                                                        className="h-12 text-xs bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 rounded-[14px] w-64 focus:ring-4 focus:ring-rose-500/10 transition-all"
                                                    />
                                                    <Button onClick={() => reject(leave.id)} disabled={actionLoading === leave.id}
                                                        className="h-12 px-6 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black uppercase rounded-[14px] border-none shadow-xl shadow-rose-100">
                                                        {actionLoading === leave.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                                                    </Button>
                                                    <Button onClick={() => { setRejectId(null); setRejectReason("") }} variant="ghost"
                                                        className="h-12 px-4 text-slate-400 hover:text-slate-600 text-[11px] font-black uppercase rounded-[14px] hover:bg-slate-50 transition-all">
                                                        Cancel
                                                    </Button>
                                                </motion.div>
                                            ) : (
                                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                                    <Button onClick={() => approve(leave.id)} disabled={actionLoading === leave.id}
                                                        className="h-14 px-8 bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-[20px] shadow-2xl shadow-slate-900/10 flex items-center gap-3 transition-all active:scale-95 group/btn">
                                                        {actionLoading === leave.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />}
                                                        Deploy Approval
                                                    </Button>
                                                    <Button onClick={() => setRejectId(leave.id)} variant="ghost"
                                                        className="h-14 px-6 text-rose-500 hover:bg-rose-50 hover:text-rose-600 text-[11px] font-black uppercase tracking-widest rounded-[20px] border-2 border-transparent hover:border-rose-100 flex items-center gap-2 transition-all">
                                                        <XCircle className="w-4 h-4" /> Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* FOOTER */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center px-10">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        {filtered.length} Units Manifested · Global Sync Level 100%
                    </span>
                </div>
                <button onClick={fetchLeaves} className="text-[10px] font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest transition-all italic hover:underline flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Re-sync Nodes ↻
                </button>
            </div>
        </div>
    )
}
