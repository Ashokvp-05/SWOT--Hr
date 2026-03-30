"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    Users, Briefcase, Activity, Calendar, Clock,
    LayoutDashboard, Globe, Award, UserPlus, CreditCard,
    FileText, GraduationCap, BarChart3, ShieldCheck,
    Building2, UserMinus, Shield, LogOut, ChevronRight, ShieldAlert
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { motion } from "framer-motion"

// Dynamic imports for HR Manager tools
const HRManagerDashboardHub = dynamic(() => import("@/components/manager/HRManagerDashboardHub"), { 
    ssr: false, 
    loading: () => <div className="p-20 flex items-center justify-center text-slate-400 font-black uppercase text-[10px] animate-pulse">Initializing Human Capital Hub...</div>
})
const AttendanceControl = dynamic(() => import("@/components/admin/AttendanceControlCenter"), { ssr: false })
const LeaveApprovalCenter = dynamic(() => import("@/components/admin/LeaveApprovalCenter"), { ssr: false })
const PerformanceModule = dynamic(() => import("@/components/admin/PerformanceModule"), { ssr: false })
const KudosWall = dynamic(() => import("@/components/kudos/KudosWall"), { ssr: false })
const RecruitmentHub = dynamic(() => import("@/components/admin/RecruitmentHub"), { ssr: false })
const OnboardingManager = dynamic(() => import("@/components/manager/ManagerOnboardingView"), { ssr: false })
const PayrollCenter = dynamic(() => import("@/components/admin/PayrollControlCenter"), { ssr: false })
const ExecutiveHub = dynamic(() => import("@/components/admin/ExecutiveHub"), { ssr: false })
const AddEmployeeModal = dynamic(() => import("@/components/admin/AddEmployeeModal"), { ssr: false })
const DocumentsModule = dynamic(() => import("@/components/admin/DocumentsModule"), { ssr: false })
const DepartmentManager = dynamic(() => import("@/components/manager/ManagerDepartmentView"), { ssr: false })
const OffboardingManager = dynamic(() => import("@/components/manager/ManagerOffboardingView"), { ssr: false })
const PolicyManager = dynamic(() => import("@/components/manager/ManagerPolicyView"), { ssr: false })

export default function HRManagerDashboardPage() {
    const { data: session, status: authStatus } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentTab, setCurrentTab] = useState(searchParams?.get("tab") || "dashboard")
    const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
        if (authStatus === "unauthenticated") {
            router.push("/dashboard")
        }
        const tab = searchParams?.get("tab")
        if (tab) setCurrentTab(tab)

        if (typeof window !== 'undefined') {
            (window as any).setIsAddEmployeeOpen = setIsAddEmployeeOpen
        }
    }, [authStatus, router, searchParams])

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab)
        const url = new URL(window.location.href)
        url.searchParams.set("tab", tab)
        window.history.pushState({}, "", url.toString())
    }

    const token = (session?.user as any)?.accessToken || ""

    const navItems = [
        { id: "dashboard", label: "Intelligence", icon: LayoutDashboard },
        { id: "onboarding", label: "Onboarding", icon: UserPlus },
        { id: "attendance", label: "Attendance", icon: Clock },
        { id: "leaves", label: "Approvals", icon: Calendar },
        { id: "payroll", label: "Payroll", icon: CreditCard },
        { id: "performance", label: "Performance", icon: Award },
        { id: "recruitment", label: "Recruitment", icon: Briefcase },
        { id: "departments", label: "Architecture", icon: Building2 },
        { id: "documents", label: "Documents", icon: FileText },
        { id: "policies", label: "Governance", icon: Shield },
        { id: "offboarding", label: "Offboarding", icon: UserMinus },
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
                        <h2 className="text-base font-bold text-slate-900 leading-none tracking-tight">HR Console</h2>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 leading-none">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Executive Shards
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
                    <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 transition-all active:scale-95">
                        <LogOut className="w-4 h-4" /> Exit Console
                    </button>
                </div>
            </aside>

            {/* 🏗️ MAIN COMMAND AREA */}
            <main className="flex-1 flex flex-col min-h-screen">
                <div className="p-6 lg:p-12 pb-32 space-y-10 max-w-[1600px] mx-auto w-full">
                    
                    {/* Prestigious Context Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-indigo-50/50 dark:border-white/5 shadow-2xl shadow-indigo-100/30 dark:shadow-none relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700 blur-sm">
                            <ShieldCheck className="w-64 h-64 text-indigo-700" />
                        </div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-900 dark:bg-white rounded-[2rem] shadow-2xl flex items-center justify-center">
                                {(() => {
                                    const Icon = navItems.find(i => i.id === currentTab)?.icon || Users;
                                    return <Icon className="w-7 h-7 text-white dark:text-black" />
                                })()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-indigo-900 dark:text-white flex items-center gap-3 tracking-tighter leading-none">
                                    {navItems.find(i => i.id === currentTab)?.label || "HR Console"} <span className="opacity-20 text-indigo-600 font-light hidden md:inline">|</span> <span className="text-indigo-600">Unit</span>
                                </h1>
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.4em] mt-3 flex items-center gap-2 leading-none">
                                    <Globe className="w-3.5 h-3.5" /> High-Performance Command Environment
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
                        {currentTab === "dashboard" && <HRManagerDashboardHub token={token} onNavigate={handleTabChange} />}
                        {currentTab === "attendance" && <AttendanceControl token={token} />}
                        {currentTab === "leaves" && <LeaveApprovalCenter token={token} />}
                        {currentTab === "performance" && (
                            <div className="space-y-12">
                                <PerformanceModule token={token} />
                                <KudosWall token={token} />
                            </div>
                        )}
                        {currentTab === "onboarding" && <OnboardingManager token={token} onAddEmployee={() => setIsAddEmployeeOpen(true)} />}
                        {currentTab === "recruitment" && <RecruitmentHub token={token} />}
                        {currentTab === "payroll" && <PayrollCenter token={token} />}
                        {currentTab === "departments" && <DepartmentManager token={token} />}
                        {currentTab === "documents" && <DocumentsModule token={token} />}
                        {currentTab === "policies" && <PolicyManager token={token} />}
                        {currentTab === "offboarding" && <OffboardingManager token={token} />}
                        {currentTab === "reports" && <ExecutiveHub token={token} />}
                    </div>
                </div>
            </main>

            {/* INTEGRATED MODALS */}
            {isAddEmployeeOpen && (
                <AddEmployeeModal 
                    token={token} 
                    onClose={() => setIsAddEmployeeOpen(false)} 
                    onSuccess={() => {
                        setIsAddEmployeeOpen(false)
                        toast.success("Intelligence Hub: Personnel Registration Complete")
                    }}
                />
            )}
        </div>
    )
}
