"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users, Search, ShieldAlert,
    Edit3, Trash2, Loader2, UserPlus, ChevronRight,
    X, Mail, Phone, Building2, Briefcase, AlertTriangle,
    CheckCircle2, Save, Eye, EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import AddEmployeeModal from "@/components/admin/AddEmployeeModal"

const API = process.env.NEXT_PUBLIC_API_URL

// ─────────────────────────────────────────────────────────────────────────────
//  EDIT EMPLOYEE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function EditEmployeeModal({ user, token, onClose, onSuccess }: {
    user: any; token: string; onClose: () => void; onSuccess: () => void
}) {
    const [form, setForm] = useState({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status || "ACTIVE",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const res = await fetch(`${API}/admin/employees/${user.id}`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to update employee")
            toast.success(`✅ ${form.name} updated successfully!`)
            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const inputCls = "h-11 bg-slate-900 border-white/10 text-white placeholder:text-slate-600 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500/20"
    const labelCls = "text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5"

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/25 backdrop-blur-[3px]"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-lg bg-slate-950 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl shadow-black/50"
                >
                    {/* HEADER */}
                    <div className="p-8 pb-6 border-b border-white/5 bg-gradient-to-r from-indigo-950/50 to-slate-950 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
                                <Edit3 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Edit Employee</h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Modify Personnel Record</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                                <p className="text-rose-400 text-sm font-semibold">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Full Name *</label>
                                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Full Name" className={inputCls} required />
                            </div>
                            <div>
                                <label className={labelCls}>Email</label>
                                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="email@company.com" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Phone</label>
                                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    placeholder="+91 98765 43210" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Status</label>
                                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                    className={`${inputCls} w-full px-3`}>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                            <Button type="button" variant="ghost" onClick={onClose}
                                className="text-slate-500 hover:text-white hover:bg-white/5 rounded-xl font-black uppercase text-xs tracking-widest">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase text-xs tracking-widest px-8 h-11 shadow-lg shadow-indigo-600/20 transition-all">
                                {loading ? (
                                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Saving...</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Save className="w-4 h-4" />Save Changes</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
//  DELETE CONFIRMATION MODAL
// ─────────────────────────────────────────────────────────────────────────────
function DeleteConfirmModal({ user, token, onClose, onSuccess }: {
    user: any; token: string; onClose: () => void; onSuccess: () => void
}) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}/admin/employees/${user.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to delete employee")
            }
            toast.success(`🗑️ ${user.name} removed from the system.`)
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/25 backdrop-blur-[3px]"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-md bg-slate-950 border border-rose-500/20 rounded-[32px] overflow-hidden shadow-2xl shadow-rose-900/30 p-10 text-center"
                >
                    <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                        <AlertTriangle className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Terminate Access?</h3>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        You are about to permanently remove <span className="text-white font-bold">{user.name}</span> from the system. This action cannot be undone.
                    </p>
                    <div className="flex gap-3 mt-8">
                        <Button onClick={onClose} variant="ghost"
                            className="flex-1 h-12 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl font-black uppercase text-xs tracking-widest">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} disabled={loading}
                            className="flex-1 h-12 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-rose-600/20">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" />Confirm Delete</span>}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN TABLE
// ─────────────────────────────────────────────────────────────────────────────
export function UserManagementTable({ token }: { token: string }) {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [editUser, setEditUser] = useState<any | null>(null)
    const [deleteUser, setDeleteUser] = useState<any | null>(null)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}/users?limit=ALL`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if (res.ok) setUsers(Array.isArray(data) ? data : (data.users || data.data || []))
            else toast.error("Failed to load personnel")
        } catch (err) { toast.error("Connection lost") }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchUsers() }, [token])

    const filtered = users.filter((u: any) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm h-full flex flex-col relative group font-sans">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap');
                .font-brand { font-family: 'Plus Jakarta Sans', sans-serif; }
            `}</style>

            {/* HEADER */}
            <div className="p-8 pb-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 transition-transform hover:rotate-3">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight leading-none font-brand">Personnel Roster</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 opacity-70">Strategic Talent Inventory · {users.length} Total</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filter by name or email..."
                            className="h-11 border-slate-100 bg-slate-50 rounded-xl pl-11 text-[11px] font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="h-11 px-6 bg-slate-900 text-white hover:bg-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/10 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        Add Employee
                    </Button>
                </div>
            </div>

            {/* TABLE HEADER */}
            <div className="px-8 py-3 bg-slate-50/60 border-b border-slate-100 grid grid-cols-[1fr_180px_140px_120px] text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span>Employee</span>
                <span>Role</span>
                <span>Status</span>
                <span className="text-right">Actions</span>
            </div>

            {/* LIST AREA */}
            <div className="flex-1 overflow-auto custom-scrollbar">
                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Syncing database...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4 opacity-50">
                        <ShieldAlert className="w-12 h-12 text-slate-200" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">No identities found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filtered.map((user, idx) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="px-8 py-4 grid grid-cols-[1fr_180px_140px_120px] items-center hover:bg-slate-50/60 transition-all group/row"
                            >
                                {/* Employee Info */}
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm shrink-0">
                                        {user.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-black text-slate-900 group-hover/row:text-indigo-600 transition-colors uppercase tracking-tight">{user.name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium lowercase mt-0.5">{user.email}</p>
                                    </div>
                                </div>

                                {/* Role */}
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">
                                    {user.role?.name || user.role || "MEMBER"}
                                </span>

                                {/* Status */}
                                <div>
                                    <Badge className={cn(
                                        "text-[8px] font-black uppercase tracking-tighter px-2.5 h-5 border-none shadow-none",
                                        user.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                    )}>
                                        {user.status || "ACTIVE"}
                                    </Badge>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 justify-end">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setEditUser(user)}
                                        title="Edit Employee"
                                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteUser(user)}
                                        title="Delete Employee"
                                        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                    <div className="ml-1 w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover/row:bg-indigo-50 transition-colors">
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/row:text-indigo-500 transition-all" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-slate-50 bg-white flex justify-between items-center px-8">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                        {filtered.length} of {users.length} Personnel
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                        Node Healthy
                    </span>
                </div>
                <Button variant="link" onClick={() => setShowAddModal(true)}
                    className="p-0 text-indigo-600 font-black uppercase text-[11px] tracking-widest italic hover:text-indigo-700 transition-all flex items-center gap-2 no-underline">
                    <UserPlus className="w-4 h-4" /> Onboard Personnel
                </Button>
            </div>

            {/* MODALS */}
            {showAddModal && (
                <AddEmployeeModal token={token} onClose={() => setShowAddModal(false)} onSuccess={fetchUsers} />
            )}
            {editUser && (
                <EditEmployeeModal user={editUser} token={token} onClose={() => setEditUser(null)} onSuccess={fetchUsers} />
            )}
            {deleteUser && (
                <DeleteConfirmModal user={deleteUser} token={token} onClose={() => setDeleteUser(null)} onSuccess={fetchUsers} />
            )}
        </div>
    )
}
