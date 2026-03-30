"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWeekend, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import {
    Clock, Calendar, CreditCard, Loader2,
    User, CheckCircle2, XCircle, ChevronRight,
    Banknote, Coffee, LogIn, LogOut, Sun,
    Sunset, Moon, AlertTriangle, Info, Bell, Settings, Search, MapPin,
    Zap, Timer, Target, Radio, ShieldCheck
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { API_BASE_URL } from "@/lib/config"

interface Props {
    user: any
    token: string
    initialData: any
}

type AttendanceStatus = 'IDLE' | 'ACTIVE' | 'LOADING'

// ── Refined Time Segment ──────────────────────────────────────
function TimeSegment({ value, label }: { value: string, label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="bg-slate-900 dark:bg-black w-12 h-14 rounded-xl flex items-center justify-center border border-white/10 shadow-[inner_0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20" />
                <span className="text-xl font-black text-white tabular-nums tracking-tighter">{value}</span>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-indigo-500/30 group-hover:bg-indigo-500 transition-colors" />
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">{label}</p>
        </div>
    )
}

export default function EmployeeDashboardClient({ user, token, initialData }: Props) {
    const [status, setStatus] = useState<AttendanceStatus>('LOADING')
    const [clockType, setClockType] = useState<'IN_OFFICE' | 'REMOTE'>('IN_OFFICE')
    const [workLocation, setWorkLocation] = useState('')
    const [shareLocation, setShareLocation] = useState<boolean | null>(null)
    const [showPermissionModal, setShowPermissionModal] = useState(false)
    const [startTime, setStartTime] = useState<string | null>(null)
    const [timerParts, setTimerParts] = useState({ h: "00", m: "00", s: "00" })
    const [elapsedStr, setElapsedStr] = useState("00:00 Hrs")
    
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (initialData?.activeEntry) {
            setStatus('ACTIVE')
            setStartTime(initialData.activeEntry.clockIn)
        } else {
            setStatus('IDLE')
        }
    }, [initialData])

    // Client-side only date logic to prevent hydration mismatch
    const greeting = useMemo(() => {
        if (!mounted) return "Hello"
        const h = new Date().getHours()
        if (h < 12) return "Good Morning"
        if (h < 17) return "Good Afternoon"
        return "Good Evening"
    }, [mounted])

    const weekDays = useMemo(() => {
        const d = mounted ? new Date() : new Date("2026-03-24")
        const start = startOfWeek(d, { weekStartsOn: 0 })
        const end = endOfWeek(d, { weekStartsOn: 0 })
        return eachDayOfInterval({ start, end })
    }, [mounted])

    useEffect(() => {
        if (status !== 'ACTIVE' || !startTime) {
            setTimerParts({ h: "00", m: "00", s: "00" })
            setElapsedStr("00:00 Hrs")
            return
        }
        const iv = setInterval(() => {
            const diff = Date.now() - new Date(startTime).getTime()
            const h = Math.floor(diff / 3600000).toString().padStart(2, '0')
            const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')
            const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')
            setTimerParts({ h, m, s })
            setElapsedStr(`${h}:${m} Hrs`)
        }, 1000)
        return () => clearInterval(iv)
    }, [status, startTime])

    const handleClock = useCallback(async (forcedLocationPreference?: boolean) => {
        const isIn = status === 'IDLE'
        
        // Use the passed preference if available, otherwise check current state
        const effectiveShareLocation = typeof forcedLocationPreference === 'boolean' 
            ? forcedLocationPreference 
            : (shareLocation ?? false)

        // Only show modal if signing in and haven't made a choice yet
        if (isIn && shareLocation === null && typeof forcedLocationPreference === 'undefined') {
            setShowPermissionModal(true)
            return
        }

        setStatus('LOADING')
        setShowPermissionModal(false) // Close modal if it was open

        try {
            let locationObj = null
            if (isIn && effectiveShareLocation) {
                try {
                    const position: any = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
                    })
                    locationObj = { lat: position.coords.latitude, lng: position.coords.longitude }
                } catch (e) { 
                    console.warn("Location denied") 
                    toast.success("Security Synced", { description: "Session authorized via protocol fallback." })
                }
            }

            const endpoint = isIn ? '/attendance-v2/clock-in-v2' : '/attendance-v2/clock-out-v2'
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ 
                    type: clockType, 
                    lat: locationObj?.lat, 
                    lng: locationObj?.lng,
                    workLocation: workLocation || (clockType === 'IN_OFFICE' ? 'Office' : 'Remote')
                })
            })
            if (res.ok) {
                const d = await res.json()
                if (isIn) {
                    setStartTime(d.clockIn)
                    setStatus('ACTIVE')
                    setWorkLocation('') // Reset after success
                    toast.success("Sign In Successful", { description: "You have recorded your attendance start." })
                } else {
                    setStatus('IDLE')
                    setStartTime(null)
                    toast.success("Sign Out Successful", { description: "Session finalized and synced." })
                }
            } else {
                const err = await res.json().catch(() => ({}))
                // Try to get message from 'message' or 'error' field
                const errorMsg = err.message || err.error || "Operation Failed"
                toast.error(errorMsg)
                setStatus(isIn ? 'IDLE' : 'ACTIVE')
            }
        } catch (e: any) {
            setStatus(isIn ? 'IDLE' : 'ACTIVE')
            toast.error("Process Aborted", { description: e.message || "Network synchronization error" })
        }
    }, [status, token, clockType])

    const [notifications, setNotifications] = useState<any[]>([])
    const [summary, setSummary] = useState(initialData?.summary || { totalHours: "0", overtimeHours: "0", daysWorked: 0, chartData: [] })

    // Fetch live notifications on mount
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/notifications`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setNotifications(data)
                }
            } catch (e) { console.error("Notification load failure") }
        }
        fetchNotifications()
    }, [token])

    // Calculate dynamic attendance %
    const attendancePercent = useMemo(() => {
        const totalPossible = 5
        const worked = summary.daysWorked || 0
        return Math.min(100, Math.round((worked / totalPossible) * 100))
    }, [summary])

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">

            <main className="max-w-[1600px] mx-auto p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* 🧱 LEFT PANEL (Employee Control Hub) - 30% */}
                    <div className="lg:col-span-4 lg:xl:col-span-3 space-y-6">
                        
                        {/* 👤 Profile Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <Avatar className="w-24 h-24 border-4 border-indigo-50 shadow-sm">
                                        <AvatarImage src={user?.image} className="object-cover" />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-600 text-2xl font-bold uppercase">
                                            {user?.name?.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {status === 'ACTIVE' && (
                                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
                                <p className="text-sm text-slate-500 font-medium">{user?.role?.replace('_', ' ') || 'Process Exec'} • {user?.company?.name || 'Main System'}</p>
                                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {status === 'ACTIVE' ? "Session Synchronized" : "Member Secured"}
                                </div>
                            </div>
                        </div>

                        {/* ⏱️ Attendance Action Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Clock className="w-16 h-16 text-indigo-600" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Sign-in Terminal</h3>
                                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[10px] font-bold py-0.5">
                                        {format(new Date(), 'EEEE, MMM dd')}
                                    </Badge>
                                </div>

                                <div className="flex flex-col items-center justify-center py-4">
                                    <div className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
                                        {timerParts.h}<span className="text-slate-200 mx-1">:</span>
                                        {timerParts.m}<span className="text-slate-200 mx-1">:</span>
                                        <span className="text-[#4F46E5]">{timerParts.s}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{status === 'ACTIVE' ? 'Operating Time' : 'Waiting for Signal'}</p>
                                </div>

                                <div className="space-y-4 pt-2">
                                    {status === 'IDLE' && (
                                        <div className="space-y-4 animate-in fade-in duration-500">
                                            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl gap-1">
                                                <button 
                                                    onClick={() => setClockType('IN_OFFICE')}
                                                    className={cn(
                                                        "flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                                                        clockType === 'IN_OFFICE' ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                                    )}
                                                >
                                                    In-Office
                                                </button>
                                                <button 
                                                    onClick={() => setClockType('REMOTE')}
                                                    className={cn(
                                                        "flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                                                        clockType === 'REMOTE' ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                                    )}
                                                >
                                                    Remote
                                                </button>
                                            </div>

                                            {shareLocation !== null && (
                                                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/20 rounded-2xl animate-in zoom-in-95">
                                                    <div className="flex items-center gap-2">
                                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{shareLocation ? "GPS Active" : "Private Session"}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => setShareLocation(null)}
                                                        className="text-[8px] font-black text-slate-400 hover:text-indigo-600 uppercase transition-colors"
                                                    >
                                                        Reset Permission
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>


                                <Button
                                        onClick={() => handleClock()}
                                        disabled={status === 'LOADING'}
                                        className={cn(
                                            "w-full h-14 rounded-xl font-bold uppercase tracking-[0.1em] text-xs transition-all shadow-lg",
                                            status === 'ACTIVE' 
                                                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200" 
                                                : "bg-[#4F46E5] hover:bg-indigo-700 text-white shadow-indigo-200"
                                        )}
                                    >
                                        {status === 'LOADING' ? <Loader2 className="w-4 h-4 animate-spin"/> : status === 'ACTIVE' ? <LogOut className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                                        {status === 'ACTIVE' ? "Logout Session" : "Authorize SignIn"}
                                    </Button>
                                    
                                    {status === 'ACTIVE' && (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                Active via <span className="text-indigo-600">{clockType.replace('_', ' ')}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        {/* 🏖️ Leave Balance Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 mb-5">Leave Inventory</h3>
                            <div className="space-y-4">
                                {initialData.leaveBalances?.map((lb: any) => (
                                    <div key={lb.id} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-slate-500">{lb.leaveTypeConfig?.name || "Casual"}</span>
                                            <span className="text-slate-900 font-black">{lb.total - lb.used} / {lb.total} <span className="text-[8px] text-slate-400">DYS</span></span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                             <div 
                                                className="h-full bg-indigo-600 transition-all duration-1000"
                                                style={{ width: `${Math.min(100, ((lb.total - lb.used) / lb.total) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!initialData.leaveBalances || initialData.leaveBalances.length === 0) && (
                                    <div className="py-4 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                        <p className="text-xs font-medium text-slate-400">No balances allocated.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ⚡ Quick Actions */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Links</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/leaves" className="h-20 flex flex-col items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 group transition-all">
                                    <Calendar className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Request</span>
                                </Link>
                                <Link href="/payroll" className="h-20 flex flex-col items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 group transition-all">
                                    <Banknote className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Earnings</span>
                                </Link>
                                <Link href="/tickets" className="h-20 flex flex-col items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 group transition-all">
                                    <Target className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Helpdesk</span>
                                </Link>
                                <Link href="/documents" className="h-20 flex flex-col items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 group transition-all">
                                    <CreditCard className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Docs</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 📊 RIGHT PANEL (Data & Insights) - 70% */}
                    <div className="lg:col-span-8 lg:xl:col-span-9 space-y-6">
                        
                        {/* 📅 Attendance Overview (Top Row) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-indigo-600 p-6 rounded-[2rem] border-none shadow-xl flex items-center gap-4 transition-all hover:scale-105">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <LogIn className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Latest Check-in</p>
                                    <h4 className="text-2xl font-black text-white tabular-nums italic tracking-tighter">
                                        {initialData.activeEntry ? format(new Date(initialData.activeEntry.clockIn), 'hh:mm a') : "09:00 AM"}
                                    </h4>
                                    {initialData.activeEntry?.location?.description && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <MapPin className="w-3 h-3 text-white/60" />
                                            <span className="text-[9px] font-black uppercase text-white/40 tracking-tight leading-none truncate max-w-[120px]">
                                                {initialData.activeEntry.location.description}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-rose-600 p-6 rounded-[2rem] border-none shadow-xl flex items-center gap-4 transition-all hover:scale-105">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <LogOut className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Target Out</p>
                                    <h4 className="text-2xl font-black text-white tabular-nums italic tracking-tighter">06:00 PM</h4>
                                </div>
                            </div>
                            <div className="bg-emerald-600 p-6 rounded-[2rem] border-none shadow-xl flex items-center gap-4 transition-all hover:scale-105">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Timer className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Weekly Average</p>
                                    <h4 className="text-2xl font-black text-white tabular-nums italic tracking-tighter">08:45 Hrs</h4>
                                </div>
                            </div>
                        </div>

                        {/* 📆 Weekly Timeline */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-none">Activity Timeline</h3>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">Node activity matrix for current cycle</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-indigo-600 text-xs font-bold uppercase tracking-wider" asChild>
                                    <Link href="/history">Full Logs</Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-7 gap-4">
                                {weekDays.map((day, idx) => {
                                    const isTodayDay = isSameDay(day, new Date())
                                    const isWknd = isWeekend(day)
                                    const dayData = summary.chartData?.find((d: any) => format(new Date(d.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                                    
                                    return (
                                        <div key={idx} className={cn(
                                            "flex flex-col items-center p-3 rounded-2xl border transition-all",
                                            isTodayDay ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-100"
                                        )}>
                                            <p className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider mb-2",
                                                isTodayDay ? "text-indigo-600" : "text-slate-400"
                                            )}>{format(day, 'eee')}</p>
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-3",
                                                isTodayDay ? "bg-indigo-600 text-white shadow-md" : "bg-slate-50 text-slate-500"
                                            )}>
                                                {format(day, 'dd')}
                                            </div>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full mt-1",
                                                isWknd ? "bg-slate-200" : dayData?.hours > 0 ? "bg-emerald-500" : "bg-rose-400"
                                            )} />
                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-tighter mt-2",
                                                isWknd ? "text-slate-300" : dayData?.hours > 0 ? "text-emerald-600" : "text-rose-500"
                                            )}>
                                                {isWknd ? "REST" : dayData?.hours > 0 ? "PRESENT" : "ABSENT"}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 📈 Analytics Cards (Row) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-violet-600 p-6 rounded-[2rem] border-none shadow-xl text-center group transition-all hover:scale-105 active:scale-95">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <h5 className="text-2xl font-black text-white tabular-nums italic tracking-tighter leading-none">{summary.totalHours}</h5>
                                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mt-2">Total Hours</p>
                            </div>
                            <div className="bg-amber-600 p-6 rounded-[2rem] border-none shadow-xl text-center group transition-all hover:scale-105 active:scale-95">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <h5 className="text-2xl font-black text-white tabular-nums italic tracking-tighter leading-none">{summary.overtimeHours}</h5>
                                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mt-2">Extra Ops</p>
                            </div>
                            <div className="bg-indigo-600 p-6 rounded-[2rem] border-none shadow-xl text-center group transition-all hover:scale-105 active:scale-95">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Sun className="w-5 h-5 text-white" />
                                </div>
                                <h5 className="text-2xl font-black text-white tabular-nums italic tracking-tighter leading-none">{summary.daysWorked}</h5>
                                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mt-2">Sync Points</p>
                            </div>
                            <div className="bg-emerald-600 p-6 rounded-[2rem] border-none shadow-xl text-center group transition-all hover:scale-105 active:scale-95">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <h5 className="text-2xl font-black text-white tabular-nums italic tracking-tighter leading-none">{attendancePercent}%</h5>
                                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mt-2">Health Stat</p>
                            </div>
                        </div>

                        {/* 🔔 Notifications Panel */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900 leading-none flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-[#4F46E5]" /> Notifications Feed
                                </h3>
                                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    {notifications.filter(n => !n.isRead).length} New
                                </div>
                            </div>
                            <div className="space-y-4">
                                {notifications.length > 0 ? notifications.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-indigo-50"
                                        )}>
                                            <Info className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                                    {format(new Date(item.createdAt), 'MMM dd')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.message}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-8 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                                        <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No pending notifications</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* 🛡️ Location Privacy Modal (Contextual Pop-up) */}
            <AnimatePresence>
                {showPermissionModal && (
                    <div className="fixed bottom-10 left-10 z-[999] p-0 flex items-end justify-start">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, x: -50 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            exit={{ scale: 0.8, opacity: 0, x: -50 }}
                            className="bg-white dark:bg-slate-900 w-[400px] rounded-[3rem] border-4 border-white dark:border-slate-800 shadow-2xl relative overflow-hidden p-10 ring-1 ring-slate-100/50 dark:ring-white/5"
                        >

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Location Access</h4>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Enhance verification</p>
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                                To verify this session, we'd like to include your GPS coordinates. This ensures attendance integrity for {clockType === 'IN_OFFICE' ? 'Office' : 'Remote'} work.
                            </p>

                            <div className="space-y-3">
                                <button 
                                    onClick={() => {
                                        setShareLocation(true)
                                        handleClock(true)
                                    }}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-all shadow-lg shadow-indigo-600/20 shadow-sm border-none"
                                >
                                    Allow while visiting the site
                                </button>
                                <button 
                                    onClick={() => {
                                        setShareLocation(null) // Keep as temporal
                                        handleClock(true)
                                    }}
                                    className="w-full py-4 bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 active:scale-95 text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-all shadow-sm border-none"
                                >
                                    Allow this time
                                </button>
                                <button 
                                    onClick={() => {
                                        setShareLocation(false)
                                        handleClock(false)
                                    }}
                                    className="w-full py-4 bg-[#FCF39B]/40 hover:bg-[#FCF39B]/60 active:scale-95 text-[#847B0B]/60 text-[11px] font-black uppercase tracking-widest rounded-full transition-all border border-[#E9D934]/10"
                                >
                                    Never allow
                                </button>
                            </div>

                            <button 
                                onClick={() => setShowPermissionModal(false)}
                                className="w-full mt-6 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                            >
                                Decided Later
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

