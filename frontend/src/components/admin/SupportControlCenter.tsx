"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Ticket, MessageSquare, Clock, AlertCircle, CheckCircle2, 
    Filter, Search, User, UserPlus, ChevronRight, MoreHorizontal,
    Send, Info, ShieldAlert, Activity, BarChart3, TrendingUp,
    Settings, Play, Download, Plus, Loader2, Save, Trash2,
    Bug, Lock, Unlock, Zap, Headphones, Cpu, AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "sonner"
import { API_BASE_URL } from "@/lib/config"
import { cn } from "@/lib/utils"

interface TicketComment {
    id: string
    userId: string
    content: string
    isInternal: boolean
    createdAt: string
    user: { name: string, avatarUrl?: string }
}

interface TicketData {
    id: string
    userId: string
    ticketNumber: number
    token: string
    title: string
    description: string
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    category: 'BUG' | 'FEATURE' | 'ACCOUNT' | 'PAYROLL' | 'ATTENDANCE' | 'OTHER'
    createdAt: string
    user: { name: string, email: string, avatarUrl?: string }
    assignedTo?: { name: string, email: string }
    comments: TicketComment[]
}

export default function SupportControlCenter({ token }: { token: string }) {
    const [tickets, setTickets] = useState<TicketData[]>([])
    const [analytics, setAnalytics] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL')

    const fetchData = async () => {
        setLoading(true)
        try {
            const [tRes, aRes] = await Promise.all([
                fetch(`${API_BASE_URL}/tickets`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/tickets/analytics`, { headers: { Authorization: `Bearer ${token}` } })
            ])
            if (tRes.ok) setTickets(await tRes.json())
            if (aRes.ok) setAnalytics(await aRes.json())
        } catch (e) {
            toast.error("Telemetry failure: Support node offline")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [token])

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                             t.token.toLowerCase().includes(search.toLowerCase())
        const matchesTab = activeTab === 'ALL' || t.status === activeTab
        return matchesSearch && matchesTab
    })

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* ── 📊 TELEMETRY OVERLAY ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[ 
                    { label: "Active Nodes", val: analytics?.status?.find((s: any) => s.name === 'OPEN')?.value || 0, icon: Activity, color: "indigo" },
                    { label: "Resolving", val: analytics?.status?.find((s: any) => s.name === 'IN_PROGRESS')?.value || 0, icon: Clock, color: "amber" },
                    { label: "Stability Rate", val: "94.2%", icon: Zap, color: "emerald" },
                    { label: "Critical Ops", val: analytics?.priority?.find((p: any) => p.name === 'CRITICAL')?.value || 0, icon: ShieldAlert, color: "rose" }
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                    >
                        <Card className="bg-white border-none shadow-[20px_20px_60px_rgba(0,0,0,0.02)] rounded-[32px] overflow-hidden group hover:shadow-xl transition-all">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 bg-${stat.color}-50 rounded-2xl group-hover:scale-110 transition-transform`}>
                                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                                    </div>
                                    <TrendingUp className="w-4 h-4 text-slate-200" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 leading-none">{stat.val}</h3>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* ── 🛡️ TICKET MANIFEST ── */}
            <Card className="bg-white border-none shadow-[20px_20px_60px_rgba(0,0,0,0.02)] rounded-[40px] overflow-hidden">
                <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-3">Service <span className="text-indigo-600">Terminal</span></CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronized ticket manifest & issue tracking</CardDescription>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[24px]">
                        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={cn(
                                    "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </CardHeader>

                <CardContent className="p-10 space-y-8">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                            <Input 
                                placeholder="IDENTIFY TICKET BY TOKEN OR SUBJECT..." 
                                className="h-14 bg-slate-50 border-none rounded-[20px] pl-14 text-[11px] font-black tracking-widest uppercase focus-visible:ring-indigo-600/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="ghost" className="h-14 w-14 rounded-[20px] bg-slate-50 hover:bg-white transition-all shadow-sm" onClick={fetchData}>
                            <Activity className={cn("w-5 h-5 text-slate-400", loading && "animate-spin text-indigo-600")} />
                        </Button>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                                    <th className="px-8 pb-4 text-left font-black">Issue Details</th>
                                    <th className="px-8 pb-4 text-left font-black">Identity</th>
                                    <th className="px-8 pb-4 text-left font-black">Priority</th>
                                    <th className="px-8 pb-4 text-left font-black">Status</th>
                                    <th className="px-8 pb-4 text-right font-black">Control</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filteredTickets.map((ticket) => (
                                        <TicketRow key={ticket.id} ticket={ticket} token={token} onUpdate={fetchData} />
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        {!loading && filteredTickets.length === 0 && (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto opacity-50">
                                    <Headphones className="w-10 h-10 text-slate-200" />
                                </div>
                                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No Active Issue Nodes Found</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function TicketRow({ ticket, token, onUpdate }: { ticket: TicketData, token: string, onUpdate: () => void }) {
    const [comment, setComment] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleUpdate = async (data: any) => {
        try {
            const res = await fetch(`${API_BASE_URL}/tickets/${ticket.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data)
            })
            if (res.ok) {
                toast.success("Synchronized")
                onUpdate()
            }
        } catch (e) {}
    }

    const addComment = async (isInternal = false) => {
        if (!comment) return
        setSubmitting(true)
        try {
            const res = await fetch(`${API_BASE_URL}/tickets/${ticket.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ content: comment, isInternal })
            })
            if (res.ok) {
                setComment("")
                onUpdate()
                toast.success("Packet deployed")
            }
        } catch (e) {} finally { setSubmitting(false) }
    }

    const priorityColor = {
        LOW: "bg-slate-50 text-slate-400",
        MEDIUM: "bg-indigo-50 text-indigo-600",
        HIGH: "bg-amber-50 text-amber-600",
        CRITICAL: "bg-rose-50 text-rose-600"
    }

    const statusColor = {
        OPEN: "bg-indigo-50 text-indigo-600 shadow-sm",
        IN_PROGRESS: "bg-amber-50 text-amber-600 shadow-sm",
        RESOLVED: "bg-emerald-50 text-emerald-600 shadow-sm",
        CLOSED: "bg-slate-100 text-slate-400 shadow-sm"
    }

    return (
        <motion.tr 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="group hover:bg-slate-50/50 transition-colors"
        >
            <td className="px-8 py-6 rounded-l-[32px] bg-white group-hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-[18px] bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-white transition-all uppercase italic tracking-tighter border border-transparent group-hover:border-slate-100 group-hover:shadow-sm">
                        {ticket.category[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{ticket.token}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight line-clamp-1">{ticket.title}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6 bg-white group-hover:bg-slate-50/50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-600">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase">
                        {ticket.user.name[0]}
                    </div>
                    {ticket.user.name}
                </div>
            </td>
            <td className="px-8 py-6 bg-white group-hover:bg-slate-50/50 transition-all">
                <Badge className={cn("text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg border-none", priorityColor[ticket.priority])}>
                    {ticket.priority}
                </Badge>
            </td>
            <td className="px-8 py-6 bg-white group-hover:bg-slate-50/50 transition-all">
                <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border-none", statusColor[ticket.status])}>
                    {ticket.status.replace('_', ' ')}
                </Badge>
            </td>
            <td className="px-8 py-6 rounded-r-[32px] bg-white group-hover:bg-slate-50/50 text-right transition-all">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-sm group-hover:scale-110 transition-transform">
                            <ChevronRight className="w-5 h-5 text-slate-300" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-white border-l border-slate-50 w-[600px] sm:w-[720px] p-0 rounded-l-[50px] shadow-2xl overflow-y-auto custom-scrollbar">
                        <SheetHeader className="pt-20 px-12 pb-10 border-b border-slate-50/50">
                            <div className="flex items-start justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="p-5 bg-indigo-600 rounded-[24px] shadow-xl shadow-indigo-100 rotate-6">
                                        <Headphones className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <Badge className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border-none ring-2 ring-white/20", statusColor[ticket.status])}>{ticket.status}</Badge>
                                            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50/30 px-3 py-1 rounded-lg">{ticket.token}</span>
                                        </div>
                                        <SheetTitle className="text-3xl font-black italic uppercase tracking-tighter leading-none">{ticket.title}</SheetTitle>
                                    </div>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="p-12 space-y-12">
                            {/* ISSUE METADATA */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] pl-1">Primary Node (Reporter)</Label>
                                    <div className="h-16 bg-slate-50 rounded-[28px] flex items-center gap-4 px-6 border border-slate-50/50">
                                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[11px] font-black text-indigo-600 uppercase italic tracking-tighter">{ticket.user.name[0]}</div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{ticket.user.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">{ticket.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] pl-1">Severity / Priority</Label>
                                    <div className="flex items-center gap-3">
                                        {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => (
                                            <button 
                                                key={p}
                                                onClick={() => handleUpdate({ priority: p })}
                                                className={cn(
                                                    "h-12 flex-1 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all",
                                                    ticket.priority === p ? priorityColor[p] + " ring-4 ring-white shadow-lg" : "bg-slate-50 text-slate-300 opacity-50 grayscale hover:grayscale-0"
                                                )}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="space-y-6">
                                <Label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] pl-1">Packet Payload (Description)</Label>
                                <div className="p-10 bg-slate-50 rounded-[40px] text-xs font-semibold text-slate-600 leading-relaxed border border-slate-50/50 italic shadow-inner">
                                    "{ticket.description}"
                                </div>
                            </div>

                            {/* CONTROL ACTIONS */}
                            <div className="space-y-6">
                                <Label className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] pl-1">Lifecycle Orchestration</Label>
                                <div className="grid grid-cols-3 gap-6">
                                    {[
                                        { s: 'OPEN', icon: Play, label: 'Initialize' },
                                        { s: 'IN_PROGRESS', icon: Activity, label: 'Investigate' },
                                        { s: 'RESOLVED', icon: CheckCircle2, label: 'Resolve' }
                                    ].map((action) => (
                                        <Button 
                                            key={action.s}
                                            variant="ghost" 
                                            className={cn(
                                                "h-16 rounded-[24px] flex flex-col items-center justify-center gap-1 group border-2 border-transparent transition-all",
                                                ticket.status === action.s ? "bg-white border-indigo-600/20 shadow-xl -translate-y-1 scale-105" : "bg-slate-50 hover:bg-white"
                                            )}
                                            onClick={() => handleUpdate({ status: action.s })}
                                        >
                                            <action.icon className={cn("w-4 h-4", ticket.status === action.s ? "text-indigo-600" : "text-slate-300")} />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{action.label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* COMMUNICATION CHANNEL */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between pl-1">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Packet Communication Logs</Label>
                                    <Badge className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase px-4 py-1.5 rounded-full border-none">{ticket.comments.length} Log Entries</Badge>
                                </div>

                                <div className="space-y-6 max-h-96 overflow-y-auto pr-6 custom-scrollbar">
                                    {ticket.comments.map((c, i) => (
                                        <div key={i} className={cn("flex gap-4", c.userId === ticket.userId ? "justify-start" : "justify-end flex-row-reverse")}>
                                            <div className="w-8 h-8 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center text-[9px] font-black uppercase italic tracking-tighter">
                                                {c.user.name[0]}
                                            </div>
                                            <div className="space-y-2 max-w-[80%]">
                                                <div className={cn(
                                                    "p-6 rounded-[28px] relative",
                                                    c.userId === ticket.userId ? "bg-slate-50 text-slate-600 rounded-tl-none border border-slate-50/50" : "bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-100",
                                                    c.isInternal && "ring-4 ring-amber-500/20 bg-amber-50 text-amber-700 border-amber-200"
                                                )}>
                                                    {c.isInternal && <Badge className="absolute -top-3 -right-3 bg-amber-500 text-white text-[8px] font-black uppercase px-3 py-1 scale-75">Internal Link</Badge>}
                                                    <p className="text-xs font-medium leading-relaxed">{c.content}</p>
                                                </div>
                                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] px-2">Synchronized: {new Date(c.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50/50">
                                    <div className="relative group">
                                        <Input 
                                            placeholder="DEPLOY COMMUNICATION PACKET..." 
                                            className="h-20 bg-slate-50 border-none rounded-[32px] px-10 text-[11px] font-black tracking-widest uppercase italic shadow-inner"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addComment()}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <Button 
                                                variant="ghost" 
                                                className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-50 hover:bg-amber-50 group/internal"
                                                onClick={() => addComment(true)}
                                            >
                                                <Lock className="w-5 h-5 text-slate-300 group-hover/internal:text-amber-500 transition-colors" />
                                            </Button>
                                            <Button 
                                                disabled={submitting || !comment} 
                                                className="h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 gap-3 group/send shadow-xl shadow-indigo-100"
                                                onClick={() => addComment(false)}
                                            >
                                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover/send:translate-x-1 transition-transform" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-6">
                                        <Info className="w-3.5 h-3.5 text-amber-400" />
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Internal logs (lock icon) are hidden from the ticket requester node.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </td>
        </motion.tr>
    )
}
