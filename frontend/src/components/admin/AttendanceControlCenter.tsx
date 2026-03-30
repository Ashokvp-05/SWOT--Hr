"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Clock, Calendar, Users, MapPin,
    Plus, Search, Edit3, Trash2,
    Loader2, AlertCircle, CheckCircle2,
    ShieldCheck, Timer,
    ChevronRight, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Shift {
    id: string
    name: string
    startTime: string
    endTime: string
    workDays: number[]
}

export default function AttendanceControlCenter({ token }: { token: string }) {
    const [shifts, setShifts] = useState<Shift[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddShiftOpen, setIsAddShiftOpen] = useState(false)
    const [newShift, setNewShift] = useState({
        name: "",
        startTime: "09:00",
        endTime: "18:00",
        workDays: [1, 2, 3, 4, 5]
    })

    const fetchShifts = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance-v2/shifts`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if (res.ok) setShifts(data)
            else toast.error("Failed to load shifts")
        } catch (err) { toast.error("Network error") }
        finally { setLoading(false) }
    }, [token])

    useEffect(() => {
        fetchShifts()
    }, [fetchShifts])

    const handleCreateShift = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance-v2/shifts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newShift)
            })
            if (res.ok) {
                toast.success("Shift policy created")
                setIsAddShiftOpen(false)
                fetchShifts()
            } else {
                toast.error("Failed to create shift")
            }
        } catch (err) { toast.error("Network error") }
    }

    const toggleDay = (day: number) => {
        setNewShift(prev => ({
            ...prev,
            workDays: prev.workDays.includes(day)
                ? prev.workDays.filter(d => d !== day)
                : [...prev.workDays, day]
        }))
    }

    return (
        <div className="space-y-10 bg-white p-6 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden font-sans">
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-[20px] shadow-xl shadow-indigo-100 transition-transform hover:rotate-6">
                            <Timer className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Attendance Matrix</h2>
                    </div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] ml-16">Configure Shifts, Geofencing & Real-time Presence Protocols</p>
                </div>

                <div className="flex items-center gap-4">
                    <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-14 px-8 bg-slate-900 hover:bg-black text-white rounded-[20px] shadow-xl shadow-slate-900/10 font-black uppercase text-[11px] tracking-widest gap-3 transition-all active:scale-95">
                                <Plus className="w-4 h-4" />
                                Design New Shift
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-slate-100 text-slate-900 max-w-md rounded-[40px] shadow-2xl p-10">
                            <form onSubmit={handleCreateShift}>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black uppercase tracking-tight italic">Shift Architecture</DialogTitle>
                                    <DialogDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Define operational timings and workweek cycles.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-8 py-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Policy Name</label>
                                        <Input className="bg-slate-50 border-slate-100 h-14 rounded-2xl text-lg font-black text-slate-900 px-6 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none" placeholder="e.g. Core Morning" value={newShift.name} onChange={e => setNewShift({ ...newShift, name: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commencement</label>
                                            <Input type="time" className="bg-slate-50 border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none" value={newShift.startTime} onChange={e => setNewShift({ ...newShift, startTime: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conclusion</label>
                                            <Input type="time" className="bg-slate-50 border-slate-100 h-14 rounded-2xl px-5 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none" value={newShift.endTime} onChange={e => setNewShift({ ...newShift, endTime: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Operational Workweek</label>
                                        <div className="flex justify-between gap-1">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => toggleDay(idx)}
                                                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-[11px] transition-all border-2 ${newShift.workDays.includes(idx)
                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-110"
                                                        : "bg-slate-50 border-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                                        }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-black h-16 rounded-[24px] font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-slate-900/10 transition-all active:scale-95">Deploy Profile</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 p-2">
                {loading ? (
                    <div className="col-span-full h-80 flex flex-col items-center justify-center gap-6 text-slate-400">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Syncing synchronization nodes...</p>
                    </div>
                ) : shifts.length === 0 ? (
                    <div className="col-span-full h-80 border-[3px] border-dashed border-slate-50 rounded-[50px] flex flex-col items-center justify-center text-center p-12 group hover:border-indigo-100 transition-all duration-700 bg-slate-50/20">
                        <div className="p-8 bg-white rounded-[32px] border border-slate-50 mb-6 group-hover:scale-110 transition-transform duration-700 shadow-sm">
                            <Clock className="w-12 h-12 text-slate-200" />
                        </div>
                        <h4 className="text-slate-900 font-black uppercase tracking-tight text-xl italic">No Active Policies</h4>
                        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-3 max-w-sm leading-relaxed">Establish your first shift profile to begin automated personnel presence monitoring.</p>
                    </div>
                ) : (
                    shifts.map((shift, idx) => (
                        <motion.div
                            key={shift.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group bg-white border border-slate-100 rounded-[44px] p-10 hover:border-indigo-100 transition-all shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-12">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase leading-none">{shift.name}</h4>
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black uppercase tracking-[0.1em] py-1 px-3 shadow-none">Operational</Badge>
                                </div>
                                <div className="flex gap-1.5 translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-[14px] transition-colors">
                                        <Edit3 className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[14px] transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-12">
                                <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-50 group-hover:border-indigo-50/50 transition-colors">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Start Time</span>
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">{shift.startTime} <span className="text-[11px] text-slate-400 font-bold uppercase tracking-normal">am</span></span>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-50 group-hover:border-indigo-50/50 transition-colors">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">End Time</span>
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">{shift.endTime} <span className="text-[11px] text-slate-400 font-bold uppercase tracking-normal">pm</span></span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Days</span>
                                    <span className="text-[10px] font-black text-indigo-600 italic uppercase">Sync Established</span>
                                </div>
                                <div className="flex justify-between items-center p-1.5 rounded-[22px] bg-slate-50/50 border border-slate-50">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                        <span
                                            key={i}
                                            className={`text-[11px] font-black w-9 h-9 flex items-center justify-center rounded-2xl transition-all ${shift.workDays.includes(i) ? "bg-white text-indigo-600 shadow-sm" : "text-slate-300"
                                                }`}
                                        >
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-9 h-9 rounded-2xl border-[3px] border-white bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400">
                                                {i === 3 ? "+42" : "U"+i}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Assets</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* GEOFENCING SETTINGS SECTION - White Minimalist Style */}
            <div className="mt-20 pt-16 border-t border-slate-50 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-indigo-600 rounded-[24px] shadow-xl shadow-indigo-100">
                            <MapPin className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">GPS Geofencing</h3>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Automated personnel presence verification nodes</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="border-indigo-100 text-indigo-600 font-black uppercase text-[10px] tracking-[0.2em] px-6 py-2 bg-indigo-50/30 rounded-full shadow-none border-[1.5px]">Infrastructure Core v2.4</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-3 bg-slate-50/50 rounded-[50px] border border-slate-100 p-12 flex items-center justify-center min-h-[400px] group relative overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-122.4241,37.78,14.25,0/800x600?access_token=MOCK_TOKEN')] bg-cover opacity-20 group-hover:opacity-40 transition-opacity duration-1000 grayscale group-hover:grayscale-0" />
                        <div className="relative z-10 text-center space-y-8">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-indigo-600 shadow-2xl mx-auto relative group-hover:scale-110 transition-transform duration-700">
                                <div className="absolute inset-0 bg-indigo-600/5 rounded-full animate-ping" />
                                <ShieldCheck className="w-10 h-10 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="text-slate-900 font-black uppercase tracking-tight italic text-2xl">Calibration Sequence Required</h4>
                                <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-3 max-w-sm mx-auto leading-relaxed">Infrastructure authentication pending. Connect your global map engine to enable spatial verification.</p>
                            </div>
                            <Button className="bg-slate-900 hover:bg-black text-white h-14 px-10 rounded-[20px] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-slate-900/10 transition-all active:scale-95">Link Infrastructure</Button>
                        </div>
                    </div>

                    <div className="space-y-8 flex flex-col justify-center">
                        <div className="bg-white border border-slate-100 p-8 rounded-[40px] space-y-6 shadow-sm hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Fence Sensitivity</span>
                                <Badge className="bg-indigo-50 text-indigo-600 border-none font-black px-3 py-1">200m Rad</Badge>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div className="h-full w-2/3 bg-indigo-600 rounded-full" />
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">Precision threshold for automated staff identity verification at registered HQs.</p>
                        </div>

                        <div className="bg-white border border-slate-100 p-8 rounded-[40px] flex items-center justify-between group cursor-pointer hover:border-indigo-100 transition-all shadow-sm hover:shadow-xl group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                                    <Info className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest block">Operational Logs</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">Identity Audit</span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
