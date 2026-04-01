"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
    Search, Filter, CheckCircle2, XCircle, 
    MoreHorizontal, SearchCheck, MessageSquare, 
    AlertTriangle, ShieldCheck, Zap, Globe, 
    ChevronRight, Ticket, User, LifeBuoy, Database,
    LayoutDashboard, UserCircle, Activity, Settings,
    LogOut, HelpCircle, Users, Clock
} from "lucide-react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// ──────────────────────────────────────────────────────────────────────────
//  MOCK DATA ENGINE
// ──────────────────────────────────────────────────────────────────────────

const MOCK_TICKETS = [
    {
        id: "TCK-1024",
        user: "VIKRAM MALHOTRA",
        email: "vikram@hrms.com",
        unit: "ENGINEERING UNIT",
        type: "LOGIN ISSUE",
        status: "PENDING",
        priority: "CRITICAL",
        date: "APR 1, 2026",
        description: "User unable to access the system via Azure SSO. Getting 'Token Expired' error repeatedly.",
        actions: 1
    },
    {
        id: "TCK-1025",
        user: "SARAH KHAN",
        email: "sarah@hrms.com",
        unit: "FINANCE OPS",
        type: "PAYROLL ERROR",
        status: "PENDING",
        priority: "HIGH",
        date: "MAR 28, 2026",
        description: "Payslip for March 2026 shows incorrect deduction for Tax regime. Needs manual audit.",
        actions: 2
    }
]

export default function SupportAdminDashboard() {
    const { data: session, status: authStatus } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentTab, setCurrentTab] = useState(searchParams?.get("tab") || "dashboard")
    const [hasMounted, setHasMounted] = useState(false)

    const [stats, setStats] = useState({
        tickets: "24",
        resolved: "842",
        load: "12%",
        power: "100%"
    })

    useEffect(() => {
        setHasMounted(true)
        if (authStatus === "unauthenticated") {
            router.push("/dashboard")
        }

        // INFRASTRUCTURE REAL-TIME SYNC
        const syncConsole = async () => {
            try {
                // In production, this would refresh the MOCK_TICKETS and Stats from API
                setStats(prev => ({
                    ...prev,
                    load: `${Math.floor(8 + Math.random() * 10)}%`,
                    resolved: (parseInt(prev.resolved) + Math.floor(Math.random() * 2)).toString()
                }))
                
                // Add automated log event
                if (currentTab === 'logs') {
                    const newLog = {
                        id: `EV-${Math.floor(Math.random() * 10000)}`,
                        msg: [
                            "Identity Node Verified", 
                            "Packet Transmission Stable", 
                            "Shard Decryption Active", 
                            "Infrastructure Pulse: Optimal"
                        ][Math.floor(Math.random() * 4)],
                        time: new Date().toLocaleTimeString(),
                        type: Math.random() > 0.8 ? 'WARN' : 'INFO'
                    }
                    setLogs(prev => [newLog, ...prev].slice(0, 50))
                }
            } catch (err) {
                console.error("Support Sync Failure:", err)
            }
        }

        const interval = setInterval(syncConsole, 5000) // FASTER POLL FOR LOGS
        syncConsole() // INITIAL NODE AUTHENTICATION

        return () => clearInterval(interval)
    }, [authStatus, router, currentTab])

    const [tickets, setTickets] = useState(MOCK_TICKETS.map(t => ({ ...t, status: 'PENDING' })))
    const [logs, setLogs] = useState([
        { id: "EV-001", msg: "Support Console Handshake Established", time: "12:00:01", type: "INFO" },
        { id: "EV-002", msg: "Strategic Oversight Shard Synchronized", time: "12:00:03", type: "INFO" }
    ])
    const [filterState, setFilterState] = useState('PENDING')
    const [resolvingId, setResolvingId] = useState<string | null>(null)

    const handleResolve = (id: string) => {
        setResolvingId(id)
        toast.loading(`Deploying Fix to ${id}...`)
        
        setTimeout(() => {
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED' } : t))
            setResolvingId(null)
            toast.success(`Node ${id} Integrity Restored`)
            setStats(prev => ({
                ...prev,
                resolved: (parseInt(prev.resolved) + 1).toString(),
                tickets: (prev.tickets === '0' ? '0' : (parseInt(prev.tickets) - 1).toString())
            }))
        }, 2000)
    }

    const filteredTickets = tickets.filter(t => {
        if (filterState === 'ALL') return true
        return t.status === filterState
    })

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab)
        setFilterState('PENDING') // Reset filter when changing main tabs
        const url = new URL(window.location.href)
        url.searchParams.set("tab", tab)
        window.history.pushState({}, "", url.toString())
    }

    const navItems = [
        { id: "dashboard", label: "Control Hub", icon: LayoutDashboard },
        { id: "tickets", label: "Support Tickets", icon: Ticket },
        { id: "users", label: "User Management", icon: Users },
        { id: "system", label: "System Health", icon: Activity },
        { id: "logs", label: "Diagnostic Logs", icon: SearchCheck },
    ]

    if (!hasMounted) return <div className="min-h-screen bg-[#fcfdff] dark:bg-slate-950" />

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#fcfdff] dark:bg-slate-950 font-sans">
            
            {/* 🛡️ PROFESSIONAL ELITE SIDEBAR */}
            <aside className="w-80 h-full hidden lg:flex flex-col bg-white border-r border-slate-100 py-12 px-8 z-50">
                <div className="mb-12 flex items-center gap-4 group cursor-pointer px-2">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500">
                        <LifeBuoy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 leading-none tracking-tight">Support Console</h2>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 leading-none">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Infrastructure Shard
                        </p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-4.5 rounded-[1.5rem] transition-all duration-300 relative overflow-hidden group active:scale-95",
                                currentTab === item.id 
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200/50" 
                                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                            )}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <item.icon className={cn("w-4.5 h-4.5 transition-colors", currentTab === item.id ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                            </div>
                            
                            {currentTab === item.id && <ChevronRight className="w-4 h-4 text-white/60 relative z-10" />}
                        </button>
                    ))}
                </nav>

            </aside>

            {/* 🏗️ MAIN SUPPORT COMMAND AREA */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto">
                <div className="p-6 lg:p-12 pb-32 space-y-10 max-w-[1600px] mx-auto w-full">
                    
                    {/* Prestigious Support Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-indigo-50/50 dark:border-white/5 shadow-2xl shadow-indigo-100/30 dark:shadow-none relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700 blur-sm">
                            <Zap className="w-64 h-64 text-indigo-700" />
                        </div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-900 dark:bg-white rounded-[2rem] shadow-2xl flex items-center justify-center">
                                <LifeBuoy className="w-7 h-7 text-white dark:text-black" />
                            </div>
                            <div>
                                <h1 className="text-4xl text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter leading-none italic uppercase">
                                    <span className="font-black">{navItems.find(i => i.id === currentTab)?.label || "Support"}</span>
                                    <span className="opacity-20 text-indigo-600 font-light hidden md:inline">|</span>
                                    <span className="text-indigo-600 font-light lowercase tracking-widest">{navItems.find(i => i.id === currentTab)?.id === 'dashboard' ? 'Unit' : 'Module'}</span>
                                </h1>
                                <p className="text-[9px] font-black text-indigo-600/60 uppercase tracking-[0.5em] mt-5 flex items-center gap-3 leading-none ml-1">
                                    <Globe className="w-3.5 h-3.5" /> High-Performance Infrastructure Shard
                                </p>
                            </div>
                        </div>
                        <div className="relative z-10 flex items-center gap-6">
                             <div className="pl-6 border-l border-indigo-100 text-right">
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Agents Online</p>
                                <p className="text-[16px] font-bold text-indigo-900 dark:text-white mt-1.5 tabular-nums">14 Active Nodes</p>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        
                        {currentTab === "dashboard" && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                 {[
                                     { label: "Active Tickets", value: stats.tickets, icon: Ticket, color: "text-rose-600", bg: "bg-rose-50" },
                                     { label: "Nodes Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                                     { label: "System Load", value: stats.load, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
                                     { label: "Agent Power", value: stats.power, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
                                 ].map((stat, i) => (
                                     <Card key={i} className="p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group active:scale-95">
                                         <div className={cn("w-12 h-12 rounded-[1.25rem] flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg)}>
                                             <stat.icon className={cn("w-6 h-6", stat.color)} />
                                         </div>
                                         <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 tabular-nums italic tracking-tighter leading-none">{stat.value}</h3>
                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
                                     </Card>
                                 ))}
                             </div>
                        )}

                        {["dashboard", "tickets"].includes(currentTab) && (
                            <Card className="p-10 rounded-[4rem] bg-white dark:bg-slate-900 border border-indigo-50/50 dark:border-white/5 shadow-2xl shadow-indigo-100/20 relative overflow-hidden">
                                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-200">
                                            <SearchCheck className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none italic">Ticket <span className="text-indigo-600">Registry</span></h2>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Active Troubleshooting Matrix</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                        {["PENDING", "RESOLVED", "ALL"].map(tab => (
                                            <Button 
                                                key={tab}
                                                variant="ghost"
                                                onClick={() => setFilterState(tab)}
                                                className={cn(
                                                    "h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                                                    tab === filterState ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:text-indigo-600"
                                                )}
                                            >
                                                {tab}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    {filteredTickets.length === 0 ? (
                                        <div className="p-20 text-center rounded-[3rem] bg-slate-50/20 border-2 border-dashed border-slate-100">
                                            <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6", filterState === 'RESOLVED' ? 'bg-indigo-50' : 'bg-emerald-50')}>
                                                {filterState === 'RESOLVED' ? <Clock className="w-10 h-10 text-indigo-400" /> : <CheckCircle2 className="w-10 h-10 text-emerald-500" />}
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">
                                                {filterState === 'RESOLVED' ? 'No Historical Data' : 'All Nodes Verified'}
                                            </h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">
                                                {filterState === 'RESOLVED' ? 'All diagnostic fixes are currently pending' : 'Infrastructure operational integrity is optimal'}
                                            </p>
                                        </div>
                                    ) : (
                                        filteredTickets.map((ticket, i) => (
                                            <div key={ticket.id} className={cn(
                                                "group p-10 rounded-[3.5rem] transition-all duration-700",
                                                resolvingId === ticket.id ? "opacity-40 scale-[0.98] blur-[1px]" : "bg-slate-50/30 dark:bg-slate-800/10 border border-transparent hover:border-indigo-100 hover:bg-white"
                                            )}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                                                            <UserCircle className="w-7 h-7 text-indigo-400" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="text-[16px] font-black text-slate-900 uppercase italic tracking-tight">{ticket.user}</h4>
                                                                <Badge className={cn("border-none px-4 py-1 font-black rounded-lg uppercase text-[9px] tracking-[0.1em]", ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}>{ticket.status === 'RESOLVED' ? 'RESOLVED' : ticket.priority}</Badge>
                                                            </div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">
                                                                {ticket.email} <span className="mx-2 opacity-30">•</span> {ticket.unit}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5">Tracking</p>
                                                        <p className="text-[13px] font-black text-indigo-500 uppercase tracking-tighter tabular-nums italic">{ticket.id}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-10 p-10 rounded-[2.5rem] bg-indigo-50/20 border-l-4 border-indigo-500/50 relative overflow-hidden group-hover:bg-indigo-50/40 transition-colors">
                                                    <p className="text-[14px] text-slate-600 font-medium italic leading-relaxed relative z-10 pr-12">
                                                        "{ticket.description}"
                                                    </p>
                                                </div>
                                                {ticket.status === 'PENDING' && (
                                                    <div className="mt-10 flex justify-end">
                                                        <Button 
                                                            disabled={resolvingId !== null}
                                                            onClick={() => handleResolve(ticket.id)}
                                                            className={cn(
                                                                "h-12 px-8 rounded-2xl font-black uppercase text-[9px] tracking-[0.1em] transition-all duration-500",
                                                                resolvingId === ticket.id 
                                                                    ? "bg-amber-100 text-amber-600 border-amber-200" 
                                                                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 active:scale-95"
                                                            )}
                                                        >
                                                            {resolvingId === ticket.id ? (
                                                                <>
                                                                    <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent animate-spin rounded-full mr-3" />
                                                                    Validating Fix
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ShieldCheck className="w-4 h-4 mr-2" /> Resolve Node
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 leading-none italic">
                                        <Database className="w-3.5 h-3.5" /> Node integrity finalized: 100%
                                    </p>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Encrypted Shard Session</p>
                                </div>
                            </Card>
                        )}

                        {currentTab === "users" && (
                             <Card className="p-12 rounded-[4rem] bg-white dark:bg-slate-900 border border-slate-100 shadow-2xl shadow-indigo-100/10">
                                 <div className="flex items-center justify-between mb-12">
                                     <div>
                                         <h2 className="text-2xl font-black italic text-slate-900 uppercase tracking-tighter">Identity Registry</h2>
                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Managing 1,248 Organizational Shards</p>
                                     </div>
                                     <Button variant="outline" className="rounded-2xl font-black uppercase text-[9px] tracking-widest px-8 h-12 border-slate-100">
                                         Export Shards
                                     </Button>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                     {[
                                         { name: "Rahul Sharma", role: "Manager", status: "Active" },
                                         { name: "Ananya Iyer", role: "Developer", status: "Active" },
                                         { name: "Siddharth Verma", role: "Support", status: "Active" },
                                         { name: "Zoya Khan", role: "HR", status: "Active" },
                                         { name: "Vikram Malhotra", role: "Architect", status: "Active" }
                                     ].map((user, i) => (
                                         <div key={i} className="p-10 rounded-[3rem] bg-slate-50/40 border border-transparent hover:border-indigo-100 transition-all group">
                                             <div className="flex items-center gap-6 mb-8">
                                                 <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                                     <UserCircle className="w-7 h-7 text-indigo-400" />
                                                 </div>
                                                 <div>
                                                     <h4 className="text-[15px] font-black text-slate-900 uppercase italic leading-none">{user.name}</h4>
                                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{user.role}</p>
                                                 </div>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                 <Button className="flex-1 rounded-xl h-10 bg-white text-slate-600 border border-slate-100 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50">Reset</Button>
                                                 <Button className="flex-1 rounded-xl h-10 bg-white text-rose-500 border border-slate-100 text-[9px] font-black uppercase tracking-widest hover:bg-rose-50">Lock</Button>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </Card>
                        )}

                        {currentTab === "system" && (
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                 {[
                                     { label: "Identity Node A1", status: "Synchronized", uptime: "99.9%" },
                                     { label: "Payroll Cluster", status: "Active", uptime: "100%" },
                                     { label: "Auth Gateway", status: "Pulse Found", uptime: "99.4%" },
                                 ].map((node, i) => (
                                     <Card key={i} className="p-12 rounded-[4rem] bg-white border border-slate-50 shadow-xl shadow-indigo-100/10 text-center">
                                         <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-8 animate-pulse shadow-inner">
                                             <ShieldCheck className="w-10 h-10 text-emerald-500" />
                                         </div>
                                         <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{node.label}</h3>
                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 mb-8">{node.status}</p>
                                         <div className="pt-8 border-t border-slate-50">
                                             <p className="text-4xl font-black text-slate-900 italic tracking-tighter tabular-nums">{node.uptime}</p>
                                             <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-2">Operational Integrity</p>
                                         </div>
                                     </Card>
                                 ))}
                             </div>
                        )}

                        {currentTab === "logs" && (
                             <Card className="rounded-[4rem] bg-[#020617] border border-indigo-500/20 shadow-2xl p-1 relative overflow-hidden h-[700px] flex flex-col">
                                 <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
                                 <div className="flex items-center justify-between px-10 pt-10 pb-8 border-b border-white/5 bg-white/5 backdrop-blur-sm relative z-10">
                                     <div className="flex items-center gap-5">
                                         <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse shadow-lg shadow-rose-500/50" />
                                         <div>
                                             <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic leading-none">Diagnostic Stream</h2>
                                             <p className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest mt-2">Live Shard Feed // SEC-OPS-04</p>
                                         </div>
                                     </div>
                                     <div className="flex items-center gap-8">
                                         <div className="flex items-center gap-2">
                                             <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Connected</span>
                                         </div>
                                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{logs.length} Operations Indexed</span>
                                     </div>
                                 </div>
                                 <div className="flex-1 overflow-y-auto p-12 space-y-4 no-scrollbar font-mono relative z-10">
                                     {logs.map((log, i) => (
                                         <div key={i} className={cn(
                                             "flex items-start gap-6 text-[11px] leading-relaxed group",
                                             log.type === 'WARN' ? "text-amber-400" : "text-indigo-300"
                                         )}>
                                             <span className="text-slate-600 font-bold shrink-0 tabular-nums">[{log.time}]</span>
                                             <span className="font-bold flex-1 tracking-tight">
                                                 <span className={cn("px-2 py-0.5 rounded-md mr-3 text-[9px] font-black", log.type === 'WARN' ? "bg-amber-400/10 text-amber-500" : "bg-indigo-400/10 text-indigo-400")}>{log.type}</span>
                                                 &gt; {log.msg} <span className="text-slate-700 italic ml-3 opacity-0 group-hover:opacity-100 transition-opacity">-- shard_cid:{log.id}</span>
                                             </span>
                                         </div>
                                     ))}
                                     <div className="h-8" />
                                 </div>
                             </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
