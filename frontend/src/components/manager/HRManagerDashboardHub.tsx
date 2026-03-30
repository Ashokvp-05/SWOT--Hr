"use client"

import { useState, useEffect, useMemo } from "react"
import { 
    Users, Clock, Calendar, FileText, CheckCircle2, 
    XCircle, Clock8, Activity, BarChart3, Building2, 
    Bell, Search, MoreHorizontal, Download, ArrowUpRight,
    ArrowDownRight, Check, X, ShieldAlert, GraduationCap,
    UserPlus, Briefcase, Megaphone, Plus, Shield
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { API_BASE_URL } from "@/lib/config"
import { toast } from "sonner"
import { format } from "date-fns"

interface ManagerDashboardProps {
    token: string
    onNavigate?: (tab: string) => void
}

export default function HRManagerDashboardHub({ token, onNavigate }: ManagerDashboardProps) {
    const [stats, setStats] = useState<any>(null)
    const [attendance, setAttendance] = useState<any[]>([])
    const [leaves, setLeaves] = useState<any[]>([])
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAll = async () => {
        setLoading(true)
        try {
            const headers = { Authorization: `Bearer ${token}` }
            const [statsRes, overviewRes, leaveRes, employeeRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/stats`, { headers }),
                fetch(`${API_BASE_URL}/admin/overview`, { headers }),
                fetch(`${API_BASE_URL}/admin/leave-requests`, { headers }),
                fetch(`${API_BASE_URL}/admin/employees?limit=ALL`, { headers })
            ])

            if (statsRes.ok && overviewRes.ok && leaveRes.ok && employeeRes.ok) {
                const statsData = await statsRes.json()
                const overviewData = await overviewRes.json()
                const leaveData = await leaveRes.json()
                const employeeData = await employeeRes.json()

                const totalPersonnel = statsData.totalUsers || employeeData.pagination?.total || 0
                const activeNow = overviewData.clockedIn || 0

                setStats({
                    total: totalPersonnel,
                    present: activeNow,
                    absent: Math.max(0, totalPersonnel - activeNow),
                    onLeave: Array.isArray(leaveData) 
                        ? leaveData.filter((l: any) => l.status === 'APPROVED' && new Date(l.startDate) <= new Date() && new Date(l.endDate) >= new Date()).length 
                        : 0,
                    pendingLeaves: overviewData.pendingApprovals || (Array.isArray(leaveData) ? leaveData.filter((l: any) => l.status === 'PENDING').length : 0)
                })

                setAttendance(overviewData.remoteUsers || [])
                setLeaves(Array.isArray(leaveData) ? leaveData.filter((l: any) => l.status === 'PENDING').slice(0, 5) : [])
                
                if (overviewData.recentActivity?.length > 0) {
                    setActivities(overviewData.recentActivity.map((a: any) => ({
                        user: a.admin?.name || 'System',
                        time: format(new Date(a.createdAt), 'HH:mm'),
                        detail: a.details || a.action,
                        type: a.action
                    })))
                } else {
                    setActivities([
                        { user: 'System', time: 'Now', detail: 'Infrastructure monitoring active' },
                        { user: 'Admin', time: '1h ago', detail: 'Global policy synchronization complete' }
                    ])
                }
            }
        } catch (error) {
            console.error("Dashboard Sync Error:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchAll()
        const interval = setInterval(fetchAll, 60000)
        return () => clearInterval(interval)
    }, [token])

    const handleLeaveAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
        try {
            const res = await fetch(`${API_BASE_URL}/leaves/${id}/${action.toLowerCase()}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) fetchAll()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="space-y-8 pb-20">
            
            {/* 1. Dashboard Context Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Intelligence <span className="text-indigo-600">Hub</span></h2>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Diagnostic Center</p>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <button 
                            onClick={() => {
                                fetchAll()
                                toast.success("Shards Synchronized")
                            }}
                            className="text-[9px] font-black text-indigo-600 uppercase tracking-tight hover:underline flex items-center gap-1 group"
                        >
                            <Activity className={cn("w-2.5 h-2.5", loading && "animate-spin")} />
                            Sync Protocol
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input placeholder="Scan personnel..." className="h-9 pl-9 rounded-xl bg-white border-slate-100 dark:bg-slate-900 border-none shadow-sm text-[10px] font-bold uppercase tracking-widest" />
                    </div>
                </div>
            </div>

            {/* 1.5 Professional Strategic Operations Bar */}
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-[1.5rem] border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => {
                            const win = window as any;
                            if(win.setIsAddEmployeeOpen) win.setIsAddEmployeeOpen(true);
                            else onNavigate?.('onboarding');
                        }}
                        className="flex-shrink-0 px-6 py-3 rounded-xl bg-indigo-600 text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus className="w-3.5 h-3.5" /> Initialize Personnel
                    </button>

                    <button 
                        onClick={() => onNavigate?.('recruitment')}
                        className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white dark:text-black text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-colors"
                    >
                        <Briefcase className="w-3 h-3" /> Provision Role
                    </button>

                    <div className="w-px h-6 bg-slate-100 dark:bg-white/5 mx-2" />

                    <button 
                        onClick={() => toast.info("Broadcast protocol initializing...")}
                        className="flex-shrink-0 px-5 py-2.5 rounded-xl text-indigo-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 transition-all active:scale-95"
                    >
                        <Megaphone className="w-3 h-3" /> Broadcast
                    </button>
                    
                    <button onClick={() => onNavigate?.('policies')} className="flex-shrink-0 px-5 py-2.5 rounded-xl text-slate-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-all">
                        <Shield className="w-3 h-3 text-emerald-500" /> Policy
                    </button>
                </div>
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-black tracking-widest uppercase text-slate-400">System Optimized</span>
                </div>
            </div>

            {/* 2. Overview Statistics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { id: 'dashboard', label: "Total Personnel", value: stats?.total ?? "—", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { id: 'attendance', label: "Active Today", value: stats?.present ?? "—", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { id: 'attendance', label: "Absent Units", value: stats?.absent ?? "—", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
                    { id: 'leaves', label: "On Leave", value: stats?.onLeave ?? "—", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
                    { id: 'leaves', label: "Pending", value: stats?.pendingLeaves ?? "—", icon: Clock8, color: "text-violet-600", bg: "bg-violet-50" },
                ].map((s, i) => (
                    <Card key={i} 
                          onClick={() => onNavigate?.(s.id)}
                          className="p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group active:scale-95"
                    >
                        <div className={cn("mb-6 w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-transform group-hover:scale-110", s.bg)}>
                            <s.icon className={cn("w-6 h-6", s.color)} />
                        </div>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter italic leading-none">{s.value}</h4>
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mt-2">{s.label}</p>
                    </Card>
                ))}
            </div>

            {/* 3 & 4. Primary Data Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <Card className="col-span-full p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black uppercase italic text-slate-900 dark:text-white">Chronos <span className="text-indigo-600">Sync</span></h3>
                        <Button variant="ghost" onClick={() => onNavigate?.('attendance')} size="sm" className="text-[10px] uppercase font-black text-indigo-600">View History Matrix</Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <th className="pb-6">Identity</th>
                                    <th className="pb-6">Check-in Terminal</th>
                                    <th className="pb-6">Status Protocol</th>
                                    <th className="pb-6 text-right">Node Connectivity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {attendance.length > 0 ? attendance.slice(0, 7).map((row: any, i: number) => (
                                    <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-5 font-black text-xs uppercase tracking-tight text-slate-900 dark:text-white">{row.name || 'Personnel'}</td>
                                        <td className="py-5 text-xs font-bold text-slate-400 italic font-mono">{format(new Date(row.clockIn), 'HH:mm:ss')} hrs</td>
                                        <td className="py-5">
                                            <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-slate-100 dark:border-slate-800 font-black px-3 py-1 bg-white dark:bg-black/20">{row.status}</Badge>
                                        </td>
                                        <td className="py-5 text-right"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse shadow-xl shadow-emerald-500/20" /></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="py-20 text-center text-[10px] font-black uppercase text-slate-200 tracking-widest italic opacity-50">Diagnostic Stream Idle</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>

            {/* 5. Minimal Activity Strip */}
            <Card className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-4 mb-8 overflow-x-auto no-scrollbar">
                    <Activity className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex-shrink-0">Operational Activity Stream</h3>
                    <div className="h-px flex-1 bg-slate-50 dark:bg-white/5 min-w-[50px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activities.map((act, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-50 dark:border-white/5 group hover:border-indigo-100 transition-all">
                            <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">{act.user}</p>
                                    <span className="text-[8px] font-bold text-slate-300 shrink-0">{act.time}</span>
                                </div>
                                <p className="text-[9px] text-slate-500 truncate">{act.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

        </div>
    )
}
