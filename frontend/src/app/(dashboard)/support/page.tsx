"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
    Search, Filter, CheckCircle2, XCircle, 
    MoreHorizontal, SearchCheck, MessageSquare, 
    AlertTriangle, ShieldCheck, Zap, Globe, 
    ChevronRight, Ticket, User, LifeBuoy, Database,
    LayoutDashboard, UserCircle, Activity, Settings,
    LogOut, HelpCircle, Users
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

    useEffect(() => {
        setHasMounted(true)
        if (authStatus === "unauthenticated") {
            router.push("/dashboard")
        }
    }, [authStatus, router])

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab)
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
        <div className="flex min-h-[calc(100vh-64px)] bg-[#fcfdff] dark:bg-slate-950 font-sans">
            
            {/* 🛡️ PROFESSIONAL ELITE SIDEBAR */}
            <aside className="w-80 h-screen sticky top-0 hidden lg:flex flex-col bg-white border-r border-slate-100 py-12 px-8 z-50">
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
                                "w-full flex items-center justify-between p-4 rounded-[1.25rem] text-[11px] font-bold uppercase tracking-wide transition-all duration-300 relative overflow-hidden group active:scale-95",
                                currentTab === item.id 
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                            )}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <item.icon className={cn("w-4.5 h-4.5 transition-colors", currentTab === item.id ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                                <span>{item.label}</span>
                            </div>
                            
                            {currentTab === item.id && <ChevronRight className="w-4 h-4 text-white/40 relative z-10" />}
                        </button>
                    ))}
                </nav>

                <div className="mt-10 pt-8 border-t border-indigo-50 dark:border-white/5 px-2">
                    <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 transition-all">
                        <LogOut className="w-4 h-4" /> Sign Out Portal
                    </button>
                </div>
            </aside>

            {/* 🏗️ MAIN SUPPORT COMMAND AREA */}
            <main className="flex-1 flex flex-col min-h-screen">
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
                                <h1 className="text-3xl font-bold text-indigo-900 dark:text-white flex items-center gap-3 tracking-tighter leading-none">
                                    {navItems.find(i => i.id === currentTab)?.label || "Support Console"} <span className="opacity-20 text-indigo-600 font-light hidden md:inline">|</span> <span className="text-indigo-600">Control Hub</span>
                                </h1>
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.4rem] mt-3 flex items-center gap-2 leading-none">
                                    <Globe className="w-3.5 h-3.5" /> High-Performance Infrastructure Terminal
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
                                     { label: "Active Tickets", value: "24", icon: Ticket, color: "text-rose-600", bg: "bg-rose-50" },
                                     { label: "Nodes Resolved", value: "842", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                                     { label: "System Load", value: "12%", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
                                     { label: "Agent Power", value: "100%", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
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
                                            <h2 className="text-2xl font-bold tracking-tight text-indigo-900 dark:text-white uppercase leading-none">Ticket <span className="text-indigo-400">Registry</span></h2>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 italic">Active Troubleshooting Matrix</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                        {["PENDING", "RESOLVED", "ALL"].map(tab => (
                                            <Button 
                                                key={tab}
                                                variant="ghost"
                                                className={cn(
                                                    "h-10 px-6 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all",
                                                    tab === "PENDING" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-indigo-600"
                                                )}
                                            >
                                                {tab}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    {MOCK_TICKETS.map((ticket, i) => (
                                        <div key={i} className="group p-8 rounded-[3rem] bg-slate-50/30 dark:bg-slate-800/20 border border-transparent hover:border-indigo-100 hover:bg-white transition-all duration-500">
                                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-50">
                                                        <UserCircle className="w-7 h-7 text-indigo-200" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <p className="text-[15px] font-bold text-indigo-900 dark:text-white uppercase tracking-tight italic">{ticket.user}</p>
                                                            <Badge className="bg-rose-50 text-rose-600 border-none text-[8px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest">{ticket.priority}</Badge>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{ticket.email} · {ticket.unit}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                     <div className="text-right px-6 border-r border-indigo-50">
                                                         <p className="text-[9px] font-bold text-slate-300 uppercase leading-none mb-1">Tracking</p>
                                                         <p className="text-[12px] font-bold text-indigo-400 uppercase tracking-tighter tabular-nums">{ticket.id}</p>
                                                     </div>
                                                     <Button className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/10 active:scale-95">
                                                         <ShieldCheck className="w-4 h-4 mr-2" /> Resolve Node
                                                     </Button>
                                                </div>
                                            </div>

                                            <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900/50 border-l-4 border-indigo-600 italic">
                                                <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">"{ticket.description}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 pt-8 border-t border-indigo-50 flex items-center justify-between opacity-30 hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Database className="w-3.5 h-3.5 text-indigo-500" /> Node integrity finalized: 100%
                                    </p>
                                </div>
                            </Card>
                        )}

                    </div>
                </div>
            </main>
        </div>
    )
}
