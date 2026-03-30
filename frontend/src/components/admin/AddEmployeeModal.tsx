"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, UserPlus, Mail, Lock, Phone, Building2,
    Briefcase, Users, Calendar, Eye, EyeOff,
    CheckCircle2, Loader2, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface AddEmployeeModalProps {
    token: string
    onClose: () => void
    onSuccess: () => void
}

interface SelectOption { id: string; name: string }

export default function AddEmployeeModal({ token, onClose, onSuccess }: AddEmployeeModalProps) {
    const API = process.env.NEXT_PUBLIC_API_URL

    const [form, setForm] = useState({
        name: "", email: "", password: "", phone: "",
        roleId: "", deptId: "", designationId: "", managerId: "",
        joiningDate: new Date().toISOString().split("T")[0],
    })
    const [showPwd, setShowPwd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const [roles, setRoles] = useState<SelectOption[]>([])
    const [depts, setDepts] = useState<SelectOption[]>([])
    const [designations, setDesignations] = useState<SelectOption[]>([])
    const [managers, setManagers] = useState<SelectOption[]>([])

    const h = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        const load = async () => {
            try {
                const [rRes, dRes, dgRes, mRes] = await Promise.all([
                    fetch(`${API}/admin/roles`, { headers: h }),
                    fetch(`${API}/organization/departments`, { headers: h }),
                    fetch(`${API}/organization/designations`, { headers: h }),
                    fetch(`${API}/users?limit=ALL`, { headers: h }),
                ])
                if (rRes.ok) setRoles(await rRes.json())
                if (dRes.ok) setDepts(await dRes.json())
                if (dgRes.ok) setDesignations(await dgRes.json())
                if (mRes.ok) {
                    const d = await mRes.json()
                    setManagers(Array.isArray(d) ? d : (d.users || []))
                }
            } catch { /* silent */ }
        }
        load()
    }, [token])

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!form.name || !form.email || !form.password) {
            setError("Name, email and password are required")
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`${API}/admin/employees`, {
                method: "POST",
                headers: { ...h, "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to create employee")
            setSuccess(true)
            toast.success(`✅ ${form.name} added successfully!`)
            setTimeout(() => { onSuccess(); onClose() }, 1500)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const inputCls = "h-11 bg-slate-900 border-white/10 text-white placeholder:text-slate-600 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500/20"
    const labelCls = "text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5"
    const selectCls = `${inputCls} w-full px-3`

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/25 backdrop-blur-[3px]"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-2xl bg-slate-950 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl shadow-black/50"
                >
                    {/* HEADER */}
                    <div className="p-8 pb-6 border-b border-white/5 bg-gradient-to-r from-indigo-950/50 to-slate-950 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
                                <UserPlus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Add New Employee</h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Phase 3 — Personnel Onboarding</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* SUCCESS STATE */}
                    {success ? (
                        <div className="p-16 flex flex-col items-center gap-4">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                                <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                            </motion.div>
                            <p className="text-white font-black text-xl uppercase italic tracking-tight">{form.name} Created!</p>
                            <p className="text-slate-500 text-sm">Employee account is now active.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                            {/* Error */}
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                    <p className="text-rose-400 text-sm font-semibold">{error}</p>
                                </motion.div>
                            )}

                            {/* SECTION: Identity */}
                            <div>
                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                    <span className="w-4 h-px bg-indigo-400/40" />Identity<span className="flex-1 h-px bg-indigo-400/20" />
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}><Mail className="inline w-3 h-3 mr-1" />Full Name *</label>
                                        <Input value={form.name} onChange={e => set("name", e.target.value)}
                                            placeholder="e.g. John Smith" className={inputCls} required />
                                    </div>
                                    <div>
                                        <label className={labelCls}><Mail className="inline w-3 h-3 mr-1" />Email Address *</label>
                                        <Input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                                            placeholder="john@company.com" className={inputCls} required />
                                    </div>
                                    <div>
                                        <label className={labelCls}><Lock className="inline w-3 h-3 mr-1" />Password *</label>
                                        <div className="relative">
                                            <Input type={showPwd ? "text" : "password"} value={form.password}
                                                onChange={e => set("password", e.target.value)}
                                                placeholder="Min 8 characters" className={`${inputCls} pr-12`} required />
                                            <button type="button" onClick={() => setShowPwd(s => !s)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}><Phone className="inline w-3 h-3 mr-1" />Phone Number</label>
                                        <Input value={form.phone} onChange={e => set("phone", e.target.value)}
                                            placeholder="+91 98765 43210" className={inputCls} />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION: Organization */}
                            <div>
                                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                    <span className="w-4 h-px bg-emerald-400/40" />Organization<span className="flex-1 h-px bg-emerald-400/20" />
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}><Users className="inline w-3 h-3 mr-1" />Role</label>
                                        <select value={form.roleId} onChange={e => set("roleId", e.target.value)} className={selectCls}>
                                            <option value="">Select Role</option>
                                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}><Building2 className="inline w-3 h-3 mr-1" />Department</label>
                                        <select value={form.deptId} onChange={e => set("deptId", e.target.value)} className={selectCls}>
                                            <option value="">Select Department</option>
                                            {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}><Briefcase className="inline w-3 h-3 mr-1" />Designation</label>
                                        <select value={form.designationId} onChange={e => set("designationId", e.target.value)} className={selectCls}>
                                            <option value="">Select Designation</option>
                                            {designations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}><Users className="inline w-3 h-3 mr-1" />Reporting Manager</label>
                                        <select value={form.managerId} onChange={e => set("managerId", e.target.value)} className={selectCls}>
                                            <option value="">Select Manager</option>
                                            {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className={labelCls}><Calendar className="inline w-3 h-3 mr-1" />Joining Date</label>
                                        <Input type="date" value={form.joiningDate} onChange={e => set("joiningDate", e.target.value)}
                                            className={inputCls} />
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                                <Button type="button" variant="ghost" onClick={onClose}
                                    className="text-slate-500 hover:text-white hover:bg-white/5 rounded-xl font-black uppercase text-xs tracking-widest">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase text-xs tracking-widest px-8 h-11 shadow-lg shadow-indigo-600/20 transition-all">
                                    {loading ? (
                                        <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Creating...</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" />Create Employee</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
