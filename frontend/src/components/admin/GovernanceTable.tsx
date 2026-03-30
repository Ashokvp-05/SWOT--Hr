"use client"

import { useState } from "react"
import { 
    Shield, Lock, Eye, Edit3, Trash2, CheckCircle2, XCircle, 
    MoreHorizontal, Filter, Search, Download, Plus, ChevronRight,
    Users, Briefcase, Database, CreditCard, Bell, Globe
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function GovernanceTable({ token }: { token: string }) {
    const roles = [
        { id: "COMPANY_ADMIN", label: "Company Admin", level: "Global", color: "bg-indigo-50 text-indigo-600" },
        { id: "HR_ADMIN", label: "HR Admin", level: "Ops", color: "bg-emerald-50 text-emerald-600" },
        { id: "MANAGER", label: "Team Manager", level: "Team", color: "bg-amber-50 text-amber-600" },
        { id: "PAYROLL_ADMIN", label: "Payroll Admin", level: "Finance", color: "bg-violet-50 text-violet-600" },
        { id: "AUDITOR", label: "Compliance Auditor", level: "Audit", color: "bg-slate-50 text-slate-600" },
        { id: "SUPPORT_ADMIN", label: "Support Desk", level: "Support", color: "bg-rose-50 text-rose-600" }
    ]

    const permissions = [
        { module: "Employees", company_admin: "Full", hr_admin: "Write", manager: "View Team", payroll: "None", auditor: "Read", support: "View" },
        { module: "Payroll", company_admin: "Full", hr_admin: "Read", manager: "None", payroll: "Full", auditor: "Read", support: "None" },
        { module: "Leave", company_admin: "Full", hr_admin: "Full", manager: "Approve", payroll: "Read", auditor: "Read", support: "View" },
        { module: "Settings", company_admin: "Full", hr_admin: "None", manager: "None", payroll: "None", auditor: "Read", support: "Write" },
        { module: "Security Logs", company_admin: "Full", hr_admin: "Read", manager: "None", payroll: "None", auditor: "Full", support: "Read" }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* GOVERNANCE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-2 leading-none">Security Architecture</p>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Role & Permission Matrix</h2>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-slate-100 bg-white rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest gap-2 shadow-sm hover:bg-slate-50 transition-all">
                        <Download className="w-3.5 h-3.5" /> Export Manifest
                    </Button>
                    <Button className="h-12 bg-slate-900 hover:bg-black text-white rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-slate-900/10 transition-all active:scale-95">
                        <Plus className="w-3.5 h-3.5" /> Define Custom Role
                    </Button>
                </div>
            </div>

            {/* ROLE CARDS HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {roles.map((role) => (
                    <div key={role.id} className="bg-white p-5 rounded-[28px] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", role.color)}>
                            <Shield className="w-5 h-5" />
                        </div>
                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none truncate">{role.label}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{role.level} Access</p>
                    </div>
                ))}
            </div>

            {/* PERMISSION WORKSPACE */}
            <div className="bg-white border border-slate-100 rounded-[44px] overflow-hidden shadow-sm">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-black text-slate-900 uppercase tracking-tight leading-none">Access Control Manifest</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">Syncing across 6 defined administrative identities</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-1.5 pr-4 border border-slate-100 w-full md:w-80">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-400">
                            <Search className="w-3.5 h-3.5" />
                        </div>
                        <Input className="bg-transparent border-none text-[11px] font-bold uppercase tracking-widest placeholder:text-slate-300 focus:ring-0 h-8" placeholder="Filter Permissions..." />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Functional Module</th>
                                <th className="py-10 px-6 text-[10px] font-black text-indigo-600 uppercase tracking-widest">Company Admin</th>
                                <th className="py-10 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">HR Admin</th>
                                <th className="py-10 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Manager</th>
                                <th className="py-10 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payroll Admin</th>
                                <th className="py-10 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditor</th>
                                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operational Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {permissions.map((p, i) => (
                                <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="p-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                            <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{p.module}</span>
                                        </div>
                                    </td>
                                    <td className="py-10 px-6">
                                        <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] px-3 py-1 rounded-lg italic uppercase">{p.company_admin}</Badge>
                                    </td>
                                    <td className="py-10 px-6">
                                        <Badge variant="outline" className="border-slate-100 text-slate-600 font-bold text-[9px] px-3 py-1 rounded-lg uppercase">{p.hr_admin}</Badge>
                                    </td>
                                    <td className="py-10 px-6">
                                        <Badge variant="outline" className="border-slate-100 text-slate-400 font-bold text-[9px] px-3 py-1 rounded-lg uppercase">{p.manager}</Badge>
                                    </td>
                                    <td className="py-10 px-6">
                                        <Badge variant="outline" className="border-slate-100 text-slate-400 font-bold text-[9px] px-3 py-1 rounded-lg uppercase">{p.payroll}</Badge>
                                    </td>
                                    <td className="py-10 px-6">
                                        <Badge variant="outline" className="border-slate-100 text-slate-400 font-bold text-[9px] px-3 py-1 rounded-lg uppercase">{p.auditor}</Badge>
                                    </td>
                                    <td className="p-10 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 transition-all">
                                                <Edit3 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-sm text-slate-400 hover:text-rose-600 transition-all">
                                                <Lock className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex justify-between items-center px-10">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Global Permission Sync Active</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none italic">Platform Architecture v4.9.0-Final</span>
                </div>
            </div>
        </div>
    )
}
