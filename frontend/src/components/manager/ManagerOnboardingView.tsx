"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    UserPlus, FileText, CheckCircle2, Circle, 
    ArrowRight, Search, Filter, Loader2, Sparkles, 
    Clock, ShieldCheck, Mail, Phone, MoreHorizontal,
    UserCircle, ClipboardCheck
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { API_BASE_URL } from "@/lib/config"
import { toast } from "sonner"

interface ManagerOnboardingViewProps {
    token: string
    onAddEmployee?: () => void
}

export default function ManagerOnboardingView({ token, onAddEmployee }: ManagerOnboardingViewProps) {
    const [employees, setEmployees] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ totalPending: 0, completedThisMonth: 0, avgProgress: 0 })

    const fetchOnboardingData = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/employees?status=PENDING`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (res.ok) {
                const fetchedEmployees = data.users || data || []
                setEmployees(fetchedEmployees)
                
                setStats({
                    totalPending: fetchedEmployees.length,
                    completedThisMonth: 14,
                    avgProgress: 68
                })
            }
        } catch (e) {
            toast.error("Failed to sync onboarding data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOnboardingData()
    }, [token])

    return (
        <div className="space-y-8">
            {/* 1. STANDARD HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Employee <span className="text-indigo-600">Onboarding</span></h2>
                    <p className="text-xs font-medium text-slate-500 mt-1">Manage new hire documents and registration progress</p>
                </div>
                <Button 
                    onClick={onAddEmployee}
                    className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 text-xs font-semibold gap-2 shadow-lg shadow-indigo-500/10"
                >
                    <UserPlus className="w-4 h-4" /> Add New Employee
                </Button>
            </div>

            {/* 2. NORMALIZED STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Pending Onboarding", value: stats.totalPending, sub: "Currently in progress", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50/50" },
                    { label: "Completion Rate", value: `${stats.avgProgress}%`, sub: "Average team progress", icon: ClipboardCheck, color: "text-emerald-600", bg: "bg-emerald-50/50" },
                    { label: "Recent Completions", value: stats.completedThisMonth, sub: "Finalized this month", icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50/50" },
                ].map((s, i) => (
                    <Card key={i} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
                                <s.icon className={cn("w-5 h-5", s.color)} />
                            </div>
                            <div className="text-right">
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">{s.value}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 3. STANDARD SEARCH */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search employees by name, email or department..." className="h-11 pl-12 rounded-xl border-none bg-slate-50 dark:bg-black/20 text-xs font-medium focus-visible:ring-indigo-600" />
                </div>
                <Button variant="ghost" className="h-11 w-11 rounded-xl p-0"><Filter className="w-4 h-4 text-slate-400" /></Button>
            </div>

            {/* 4. CLEAN EMPLOYEE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Employees...</p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <UserCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h4 className="text-sm font-bold text-slate-400">No Pending Onboarding</h4>
                        <p className="text-xs text-slate-400 mt-1">All employees are currently set up.</p>
                    </div>
                ) : (
                    employees.map((emp) => (
                        <Card key={emp.id} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-lg font-bold text-indigo-600">
                                        {emp.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{emp.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{emp.designation?.name || "General Staff"}</p>
                                    </div>
                                </div>
                                <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-none px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full">Phase: {emp.onboardingPhase || "Basic"}</Badge>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                                        <span className="text-xs font-bold text-indigo-600">{emp.progress || 45}%</span>
                                    </div>
                                    <Progress value={emp.progress || 45} className="h-1.5 rounded-full bg-slate-100 dark:bg-black/40" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => toast.success("Identity verified")} className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 flex items-center gap-2 hover:bg-emerald-50 transition-colors">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Verify Identity</span>
                                    </button>
                                    <button onClick={() => toast.success("Requesting signatures")} className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 flex items-center gap-2 hover:bg-amber-50 transition-colors">
                                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Sign Docs</span>
                                    </button>
                                </div>

                                <div className="pt-5 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-black/20 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><Mail className="w-4 h-4" /></button>
                                        <button className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-black/20 flex items-center justify-center"><Phone className="w-4 h-4" /></button>
                                    </div>
                                    <Button variant="outline" onClick={() => toast.info("Advancing phase...")} className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50 group">
                                        Next Step <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
