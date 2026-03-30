"use client"

import { useSession } from "next-auth/react"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import {
    ShieldCheck, Eye, ClipboardCheck, Lock, Activity,
    BarChart3, LayoutDashboard, Globe, AlertTriangle,
    CheckCircle2, XCircle, Clock, FileText, Search, ShieldAlert,
    ChevronRight, LogOut, Users, UserCheck
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const SecurityAuditLogs = dynamic(() => import("@/components/admin/SecurityAuditLogs").then(m => m.SecurityAuditLogs), { 
    ssr: false,
    loading: () => <div className="p-20 flex items-center justify-center text-indigo-400 font-bold uppercase text-[10px] animate-pulse">Decrypting Audit Shards...</div>
})

export default function AuditorDashboardPage() {
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
        const tab = searchParams?.get("tab")
        if (tab) setCurrentTab(tab)
    }, [authStatus, router, searchParams])

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab)
        const url = new URL(window.location.href)
        url.searchParams.set("tab", tab)
        window.history.pushState({}, "", url.toString())
    }

    const token = session?.user?.accessToken || ""

    const navItems = [
        { id: "dashboard", label: "Intelligence", icon: LayoutDashboard },
        { id: "logs", label: "Activity Logs", icon: Eye },
        { id: "compliance", label: "Compliance", icon: ClipboardCheck },
        { id: "verification", label: "Verification", icon: ShieldCheck },
        { id: "security", label: "Security", icon: Lock },
        { id: "reports", label: "Analytics", icon: BarChart3 },
    ]

    if (!hasMounted) return <div className="min-h-screen bg-[#fcfdff] dark:bg-slate-950" />

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-[#fcfdff] dark:bg-slate-950 font-sans">
            
            {/* 🛡️ PROFESSIONAL ELITE SIDEBAR */}
            <aside className="w-80 h-screen sticky top-0 hidden lg:flex flex-col bg-white border-r border-slate-100 py-12 px-8 z-50">
                <div className="mb-12 flex items-center gap-4 group cursor-pointer px-2">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500">
                        <ShieldAlert className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 leading-none tracking-tight">Audit Console</h2>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 leading-none">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Oversight Shard
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
                        <LogOut className="w-4 h-4" /> Exit Oversight
                    </button>
                </div>
            </aside>

            {/* 🏗️ MAIN AUDIT COMMAND AREA */}
            <main className="flex-1 flex flex-col min-h-screen">
                <div className="p-6 lg:p-12 pb-32 space-y-10 max-w-[1600px] mx-auto w-full">
                    
                    {/* Prestigious Audit Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-indigo-50/50 dark:border-white/5 shadow-2xl shadow-indigo-100/30 dark:shadow-none relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700 blur-sm">
                            <ShieldCheck className="w-64 h-64 text-indigo-700" />
                        </div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-900 dark:bg-white rounded-[2rem] shadow-2xl flex items-center justify-center">
                                {(() => {
                                    const Icon = navItems.find(i => i.id === currentTab)?.icon || ShieldAlert;
                                    return <Icon className="w-7 h-7 text-white dark:text-black" />
                                })()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-indigo-900 dark:text-white flex items-center gap-3 tracking-tighter leading-none">
                                    {navItems.find(i => i.id === currentTab)?.label || "Audit Console"} <span className="opacity-20 text-indigo-600 font-light hidden md:inline">|</span> <span className="text-indigo-600">Oversight</span>
                                </h1>
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.4em] mt-3 flex items-center gap-2 leading-none">
                                    <Globe className="w-3.5 h-3.5" /> Elite Management Environment
                                </p>
                            </div>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                            <Button variant="outline" className="h-11 px-6 rounded-2xl border-indigo-100 text-indigo-600 font-bold uppercase text-[9px] tracking-widest hover:bg-indigo-50 active:scale-95 transition-all">Generate Report</Button>
                            <Button className="h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-[9px] tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Full Validation</Button>
                        </div>
                    </div>

                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {currentTab === "dashboard" && (
                            <div className="space-y-10">
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                      {[
                                         { label: "Integrity Risks", value: "0", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
                                         { label: "Active Logs", value: "2,482", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
                                         { label: "Oversight Sync", value: "99.8%", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                                         { label: "Security Tier", value: "Optimal", icon: LayoutDashboard, color: "text-violet-600", bg: "bg-violet-50" },
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

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { title: "Forensic History", id: "logs", desc: "System-wide immutable logs", icon: Eye },
                                        { title: "Compliance Scan", id: "compliance", desc: "Labor law adherence diagnostics", icon: ClipboardCheck },
                                        { title: "Data Integrity", id: "verification", desc: "Validate employee & payroll records", icon: UserCheck },
                                    ].map((mod, i) => (
                                        <div key={i} onClick={() => handleTabChange(mod.id)} className="cursor-pointer">
                                            <Card className="p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:translate-y-[-8px] transition-all group overflow-hidden relative">
                                                <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-150 transition-transform duration-700">
                                                    <mod.icon className="w-32 h-32 text-indigo-900" />
                                                </div>
                                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                        <mod.icon className="w-5 h-5" />
                                                    </div>
                                                    <h4 className="text-sm font-bold uppercase tracking-tight text-indigo-900 dark:text-white">{mod.title}</h4>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider relative z-10 leading-relaxed">{mod.desc}</p>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentTab === "logs" && <SecurityAuditLogs token={token} />}
                        
                        {currentTab === "compliance" && (
                            <Card className="p-12 rounded-[3.5rem] border-indigo-50 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-100/20">
                                 <div className="flex items-center justify-between mb-10">
                                     <h2 className="text-xl font-bold italic text-indigo-900 dark:text-white tracking-tight uppercase">HR Governance Integrity</h2>
                                     <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-2 font-bold rounded-xl uppercase text-[10px] tracking-widest">Optimal Status</Badge>
                                 </div>
                                 <div className="space-y-6">
                                      {[
                                          { label: "Payroll Accuracy Matrix", status: "VERIFIED", date: "Last scanned: Today", icon: Clock },
                                          { label: "Policy Acknowledgement", status: "98.4%", date: "Across 1,254 identities", icon: FileText },
                                          { label: "Access Control Governance", status: "HIGH", date: "Zero anomalies detected", icon: Lock },
                                      ].map((c, i) => (
                                          <div key={i} className="flex items-center justify-between p-8 rounded-3xl bg-slate-50/50 dark:bg-slate-800/40 border border-transparent hover:border-indigo-100 transition-all group">
                                               <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                        <c.icon className="w-5 h-5 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[14px] font-bold text-indigo-900 dark:text-white uppercase tracking-tight">{c.label}</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{c.date}</p>
                                                    </div>
                                               </div>
                                               <span className="text-[11px] font-bold text-indigo-700 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">{c.status}</span>
                                          </div>
                                      ))}
                                 </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
