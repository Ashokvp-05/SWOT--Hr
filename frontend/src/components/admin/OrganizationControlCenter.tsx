"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Building2, Users, Briefcase,
    Plus, Search, Edit3, Trash2, ChevronRight,
    Loader2, AlertCircle, CheckCircle2, MoreVertical, ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface OrgUnit {
    id: string
    name: string
    description?: string
    manager?: { id: string, name: string }
    _count?: { users: number }
    status?: "ACTIVE" | "INACTIVE"
    parentId?: string
    parent?: { id: string, name: string }
}

interface User {
    id: string
    name: string
    email: string
}

const GlobalStyles = () => (
    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root {
            --zoho-blue: #4F46E5;
            --zoho-blue-light: #F5F7FF;
            --zoho-border: #F1F5F9;
            --zoho-text: #1E293B;
            --zoho-text-light: #64748B;
        }

        .font-brand { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }

        .pro-card {
            background: #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid var(--zoho-border);
            border-radius: 20px;
        }
        
        .pro-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
            border-color: #E2E8F0;
        }

        .status-badge {
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
    `}</style>
)

export default function OrganizationControlCenter({ token }: { token: string }) {
    const [activeTab, setActiveTab] = useState("departments")
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<OrgUnit[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState("")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newUnit, setNewUnit] = useState({ 
        name: "", 
        description: "", 
        managerId: "", 
        parentId: "", 
        status: "ACTIVE" 
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const apiEndpoint = activeTab === "departments" ? "departments" : activeTab === "designations" ? "designations" : activeTab === "branches" ? "branches" : "roles"
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organization/${apiEndpoint}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const result = await res.json()
            if (res.ok) setData(result)
            else toast.error(result.error || "Failed to fetch data")

            // Fetch users for manager dropdown
            const uRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const uData = await uRes.json()
            if (uRes.ok) setUsers(uData)
        } catch (err) {
            toast.error("Network error occurred")
        } finally {
            setLoading(false)
        }
    }, [activeTab, token])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const apiEndpoint = activeTab === "departments" ? "departments" : activeTab === "designations" ? "designations" : activeTab === "branches" ? "branches" : "roles"
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organization/${apiEndpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newUnit)
            })
            if (res.ok) {
                toast.success(`${activeTab.slice(0, -1)} added successfully`)
                setIsAddOpen(false)
                setNewUnit({ name: "", description: "", managerId: "", parentId: "", status: "ACTIVE" })
                fetchData()
            } else {
                const result = await res.json()
                toast.error(result.error || "Action failed")
            }
        } catch (err) {
            toast.error("Network error occurred")
        }
    }

    const filteredData = Array.isArray(data) ? data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    ) : []

    const stats = {
        total: data.length,
        active: data.filter(i => (i.status || "ACTIVE") === "ACTIVE").length,
        inactive: data.filter(i => i.status === "INACTIVE").length,
        employees: data.reduce((acc, curr) => acc + (curr._count?.users || 0), 0)
    }

    return (
        <div className="space-y-8 font-body text-slate-900 pb-20">
            <GlobalStyles />

            {/* UPGRADED SUMMARY SECTION */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {[
                    { label: `Total ${activeTab}`, value: stats.total, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Active", value: stats.active, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Inactive", value: stats.inactive, color: "text-slate-400", bg: "bg-slate-50" },
                    { label: "Total Personnel", value: stats.employees, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">{stat.label}</p>
                        <div className="flex items-center justify-between">
                            <h3 className={cn("text-2xl font-bold tracking-tighter", stat.color)}>{stat.value}</h3>
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg)}>
                                <CheckCircle2 className={cn("w-4 h-4", stat.color)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* HEADER ACTIONS */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-full lg:w-auto flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder={`Search ${activeTab}...`}
                            className="pl-11 h-12 bg-slate-50 border-none text-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-300 transition-all font-medium text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-200 font-bold gap-2 group transition-all text-sm active:scale-95">
                                <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                                Add {activeTab.slice(0, -1)}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-none text-slate-900 max-w-2xl rounded-[32px] shadow-2xl p-0 overflow-hidden">
                            <form onSubmit={handleAdd}>
                                <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-bold font-brand tracking-tight">Register New {activeTab.slice(0, -1)}</DialogTitle>
                                        <DialogDescription className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-0.5">Initialize a structural organizational component</DialogDescription>
                                    </div>
                                </div>

                                <div className="p-8 grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5 col-span-2 lg:col-span-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Title</label>
                                        <Input
                                            className="bg-slate-50 border-none h-12 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/10"
                                            placeholder={`e.g. ${activeTab === 'departments' ? 'Engineering' : 'Global Sales'}`}
                                            value={newUnit.name}
                                            onChange={e => setNewUnit({ ...newUnit, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-2 lg:col-span-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Head / Lead</label>
                                        <select 
                                            className="w-full bg-slate-50 border-none h-12 rounded-xl text-sm font-bold text-slate-900 px-4 focus:ring-2 focus:ring-indigo-500/10 outline-none appearance-none cursor-pointer"
                                            value={newUnit.managerId}
                                            onChange={e => setNewUnit({ ...newUnit, managerId: e.target.value })}
                                        >
                                            <option value="">Select Personnel</option>
                                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Structural Mandate (Description)</label>
                                        <textarea
                                            className="w-full bg-slate-50 border-none min-h-[100px] rounded-xl text-sm font-medium text-slate-900 p-4 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                                            placeholder="Outline the core objectives and scope of this unit..."
                                            value={newUnit.description}
                                            onChange={e => setNewUnit({ ...newUnit, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-2 lg:col-span-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hierarchy Placement (Parent)</label>
                                        <select 
                                            className="w-full bg-slate-50 border-none h-12 rounded-xl text-sm font-bold text-slate-900 px-4 focus:ring-2 focus:ring-indigo-500/10 outline-none appearance-none cursor-pointer"
                                            value={newUnit.parentId}
                                            onChange={e => setNewUnit({ ...newUnit, parentId: e.target.value })}
                                        >
                                            <option value="">Top Level (Root)</option>
                                            {data.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 col-span-2 lg:col-span-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deployment Status</label>
                                        <div className="flex items-center gap-4 h-12">
                                            <Button 
                                                type="button"
                                                onClick={() => setNewUnit({...newUnit, status: "ACTIVE"})}
                                                className={cn("flex-1 text-[10px] font-black px-4 rounded-xl", newUnit.status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200")}
                                            >ACTIVE</Button>
                                            <Button 
                                                type="button"
                                                onClick={() => setNewUnit({...newUnit, status: "INACTIVE"})}
                                                className={cn("flex-1 text-[10px] font-black px-4 rounded-xl", newUnit.status === "INACTIVE" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200")}
                                            >INACTIVE</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50/50 flex gap-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="flex-1 h-12 rounded-xl font-bold text-slate-400 hover:text-slate-600">Dismiss</Button>
                                    <Button type="submit" className="flex-[2] bg-indigo-600 text-white hover:bg-indigo-700 font-bold h-12 rounded-xl shadow-xl shadow-indigo-100 active:scale-95 transition-all">Initialize Unit</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Tabs value={activeTab} className="w-full lg:w-auto" onValueChange={setActiveTab}>
                    <TabsList className="bg-transparent h-auto p-0 gap-8">
                        {[
                            { id: "departments", icon: Building2, label: "Departments", count: stats.total },
                            { id: "designations", icon: Briefcase, label: "Designations", count: 0 },
                            { id: "roles", icon: ShieldCheck, label: "Roles", count: 0 }
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="relative flex items-center gap-2.5 px-0 py-4 bg-transparent data-[state=active]:bg-transparent text-slate-400 data-[state=active]:text-indigo-600 font-black text-[11px] uppercase tracking-widest transition-all rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 group"
                            >
                                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-600" : "text-slate-300 group-hover:text-slate-500")} />
                                <span>{tab.label}</span>
                                {tab.count > 0 && <span className="ml-1 px-1.5 py-0.5 bg-slate-100 group-data-[state=active]:bg-indigo-50 rounded-md text-[8px]">{tab.count}</span>}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* CONTENT AREA */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {loading ? (
                        <div className="h-80 flex flex-col items-center justify-center gap-4 text-slate-300">
                            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                            <p className="font-bold text-[10px] uppercase tracking-[0.3em]">Querying Core Structure...</p>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="h-[500px] border-2 border-dashed border-slate-100 rounded-[48px] flex flex-col items-center justify-center gap-8 bg-white/50 group">
                            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                <AlertCircle className="w-10 h-10 text-slate-200" />
                            </div>
                            <div className="text-center px-12 max-w-sm">
                                <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter italic-none">Empty Manifest</h3>
                                <p className="text-slate-400 text-sm font-medium mt-3 leading-relaxed">System found no active structural units in this shard matching your parameters.</p>
                                <Button
                                    onClick={() => setIsAddOpen(true)}
                                    className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-2xl px-8 shadow-xl shadow-indigo-100"
                                >
                                    Initialize First Unit
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredData.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="pro-card p-10 flex flex-col group relative"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-slate-900 rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-slate-200 transition-all group-hover:bg-indigo-600 group-hover:scale-105 group-hover:-rotate-3">
                                                {activeTab === "departments" ? <Building2 className="w-6 h-6" /> :
                                                    activeTab === "designations" ? <Briefcase className="w-6 h-6" /> :
                                                        <ShieldCheck className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="text-slate-900 font-black text-lg tracking-tighter leading-none group-hover:text-indigo-600 transition-colors uppercase italic">{item.name}</h4>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                                                    ID: <span className="text-slate-300">#{item.id.slice(-6).toUpperCase()}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="text-slate-300 hover:text-slate-900 transition-colors p-2 rounded-xl hover:bg-slate-50">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-48 bg-white border border-slate-100 rounded-2xl p-2 shadow-2xl">
                                                <DropdownMenuItem className="p-3 gap-3 text-[11px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer">
                                                    <Users className="w-3.5 h-3.5" /> View Personnel
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="p-3 gap-3 text-[11px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer">
                                                    <Plus className="w-3.5 h-3.5" /> Add Employee
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-50" />
                                                <DropdownMenuItem className="p-3 gap-3 text-[11px] font-bold text-rose-500 rounded-xl hover:bg-rose-50 cursor-pointer">
                                                    <Trash2 className="w-3.5 h-3.5" /> Terminate Node
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-slate-500 text-[12px] leading-relaxed font-bold tracking-tight mb-8">
                                            {item.description || "Core operational infrastructure governing strategic personnel and resource allocation."}
                                        </p>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-all">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                                    <Users className="w-4 h-4 text-indigo-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Manager</p>
                                                    <p className="text-[12px] font-bold text-slate-800">{item.manager?.name || "Unassigned"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="flex-1 flex items-center gap-3">
                                                    <div className="flex -space-x-3">
                                                        {[1, 2, 3].map((i) => (
                                                            <div key={i} className="w-8 h-8 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-sm text-[8px] font-black text-indigo-500">
                                                                <span className="p-1.5 bg-indigo-50 rounded-full w-full h-full flex items-center justify-center">U</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-700 uppercase">{item._count?.users || 0} Members</span>
                                                </div>
                                                <div className={cn("status-badge", (item.status || "ACTIVE") === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                                                    {(item.status || "ACTIVE")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        <Button className="bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl h-10 text-[10px] font-black uppercase tracking-tighter transition-all">
                                            Edit Node
                                        </Button>
                                        <Button variant="ghost" className="text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl h-10 text-[10px] font-black uppercase tracking-tighter">
                                            Delete
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
