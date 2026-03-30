"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Building2, Users, Plus, Search, Filter, 
    MoreHorizontal, MapPin, Loader2, Target,
    ExternalLink, Trash2, Edit2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { API_BASE_URL } from "@/lib/config"
import { toast } from "sonner"

export default function ManagerDepartmentView({ token }: { token: string }) {
    const [departments, setDepartments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchDepartments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/organization/departments`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (res.ok) setDepartments(data)
        } catch (e) {
            toast.error("Structural synchronization failure")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDepartments()
    }, [token])

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Organizational <span className="text-indigo-600">Architecture</span></h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Manage departmental units & hierarchy protocols</p>
                </div>
                <Button className="h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 text-[11px] font-black uppercase tracking-widest gap-3 shadow-xl">
                    <Plus className="w-5 h-5" /> Construct Unit
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Filter architecture by unit name or lead..." className="h-12 pl-12 rounded-2xl border-none bg-slate-50 dark:bg-black/20 text-xs font-black uppercase tracking-widest" />
                </div>
                <Button variant="ghost" className="h-12 w-12 rounded-2xl p-0"><Filter className="w-5 h-5 text-slate-400" /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scanning Unit Topology...</p>
                    </div>
                ) : departments.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                        <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h4 className="text-sm font-black uppercase text-slate-400 italic">No Architecture Defined</h4>
                    </div>
                ) : (
                    departments.map((dept) => (
                        <Card key={dept.id} className="p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none group hover:border-indigo-500/20 transition-all">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="w-5 h-5" /></Button>
                            </div>

                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic mb-1">{dept.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{dept.description || "Core organizational management unit"}</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Personnel</p>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3 h-3 text-indigo-600" />
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{dept._count?.users || 0}</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Governance</p>
                                    <div className="flex items-center gap-2">
                                        <Target className="w-3 h-3 text-emerald-600" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase">Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">U</div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">+</div>
                                </div>
                                <Button variant="ghost" className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2 hover:bg-transparent">
                                    Unit Details <ExternalLink className="w-3 h-3" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
