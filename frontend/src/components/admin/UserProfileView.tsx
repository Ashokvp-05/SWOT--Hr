"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, User, Mail, Phone, MapPin, Building,
    Briefcase, Calendar, Shield, CreditCard,
    Hash, Globe, Award, GraduationCap, Users,
    Clock, ChevronRight, Edit3, Lock, Eye, EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface UserProfileViewProps {
    user: any
    onClose: () => void
    token: string
}

export default function UserProfileView({ user, onClose, token }: UserProfileViewProps) {
    const [showSensitive, setShowSensitive] = useState(false)

    const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
        <div className="flex items-center gap-2 mb-4 mt-10 first:mt-0">
            <div className="p-1 px-2 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white font-brand italic">{title}</h3>
            <div className="flex-1 h-[1px] bg-white/[0.05] ml-4" />
        </div>
    )

    const DataRow = ({ items }: { items: { label: string, value: string | null | undefined, sensitive?: boolean }[] }) => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors px-2 rounded-lg">
            {items.map((item, i) => (
                <div key={i} className="space-y-1">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">{item.label}</p>
                    <p className="text-[11px] font-bold text-slate-300 font-body">
                        {item.sensitive && !showSensitive ? "•••• •••• ••••" : (item.value || "—")}
                    </p>
                </div>
            ))}
        </div>
    )

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full bg-[#0a0c10] border-l border-white/5 relative shadow-2xl z-50 font-body"
        >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />

            {/* TOP ACTIONS BAR */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/30 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Button onClick={onClose} variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <X className="w-4 h-4" />
                    </Button>
                    <div className="h-4 w-[1px] bg-white/10 mx-1" />
                    <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] italic font-brand">Personnel Identity Node</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost" size="sm"
                        className="h-8 px-3 text-slate-400 hover:text-white rounded-lg gap-2 font-black text-[8px] uppercase tracking-widest transition-all"
                        onClick={() => setShowSensitive(!showSensitive)}
                    >
                        {showSensitive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showSensitive ? "Obfuscate" : "Decrypt"}
                    </Button>
                    <Button className="h-8 px-4 bg-white text-black hover:bg-slate-200 rounded-lg gap-2 font-black text-[8px] uppercase tracking-widest transition-all shadow-xl shadow-white/5">
                        <Edit3 className="w-3 h-3" />
                        Modify Registry
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 max-w-7xl mx-auto">

                    {/* EXPANSIVE HEADER */}
                    <div className="flex flex-col md:flex-row items-center gap-10 mb-12 p-8 bg-white/[0.02] border border-white/5 rounded-[32px] relative overflow-hidden">
                        <div className="relative group">
                            <Avatar className="h-28 w-28 border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.1)] group-hover:border-indigo-500/50 transition-all duration-500">
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback className="bg-slate-900 text-3xl font-black text-indigo-500 font-brand">
                                    {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 p-2 bg-black border border-white/10 rounded-xl">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                                <h1 className="text-3xl font-black text-white tracking-tighter italic font-brand">{user.name}</h1>
                                <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-black text-[9px] uppercase tracking-widest px-3">
                                    Verified Personnel
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Designation</p>
                                    <p className="text-[11px] font-black text-slate-300 uppercase italic tracking-wider">{user.designation?.name || "Member"}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Organization</p>
                                    <p className="text-[11px] font-black text-indigo-400 uppercase italic tracking-wider">{user.department?.name || "Core"}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Email Identity</p>
                                    <p className="text-[11px] font-bold text-slate-400 lowercase">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Security Role</p>
                                    <p className="text-[11px] font-black text-amber-500 uppercase italic tracking-wider">{user.role?.name || "Employee"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STRUCTURED DATA SECTIONS */}
                    <div className="space-y-2">
                        <SectionHeader title="Biological Metrics" icon={User} />
                        <DataRow items={[
                            { label: "Age", value: "28" },
                            { label: "Gender", value: "Male" },
                            { label: "Marital Status", value: "Single" },
                            { label: "Blood Group", value: "O+" }
                        ]} />

                        <SectionHeader title="Identity Protocols" icon={Lock} />
                        <DataRow items={[
                            { label: "UAN Index", value: "100234567891", sensitive: true },
                            { label: "PAN Signature", value: "ABCDE1234F", sensitive: true },
                            { label: "Aadhaar Protocol", value: "1234 5678 9012", sensitive: true },
                            { label: "Passport Node", value: "Z9876543", sensitive: true }
                        ]} />

                        <SectionHeader title="Communication Vectors" icon={Phone} />
                        <DataRow items={[
                            { label: "Work Extension", value: "+91 044 123" },
                            { label: "Personal Mobile", value: "+91 98765 43210" },
                            { label: "Personal Email", value: "user.private@mail.com" },
                            { label: "Emergency Contact", value: "+91 98XXX XXX00" }
                        ]} />

                        <SectionHeader title="Spatial Coordinates" icon={MapPin} />
                        <DataRow items={[
                            { label: "Present Domicile", value: "742 Evergreen Terrace, Springfield" },
                            { label: "Registry Permanent", value: "Suite 101, Neural Heights" },
                            { label: "Seating Location", value: "Bay 04, Level 5" },
                            { label: "Branch Node", value: user.branch?.name || "Chennai Hub" }
                        ]} />

                        <SectionHeader title="Professional Trajectory" icon={Briefcase} />
                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden mt-4">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/[0.03] border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Employer Entity</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Designation</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Timeline</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] font-bold text-slate-400">
                                    <tr className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 text-white">Cyberdyne Systems</td>
                                        <td className="px-6 py-4 italic text-indigo-400">Junior Logic Architect</td>
                                        <td className="px-6 py-4 tracking-tighter">JAN 2021 — OCT 2023</td>
                                        <td className="px-6 py-4"><Badge className="bg-emerald-500/10 text-emerald-500 border-none h-5 px-2 text-[8px] font-black uppercase">Synchronized</Badge></td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 text-white">Global Meta Corp</td>
                                        <td className="px-6 py-4 italic text-indigo-400">Internship Program</td>
                                        <td className="px-6 py-4 tracking-tighter">JUN 2019 — DEC 2020</td>
                                        <td className="px-6 py-4"><Badge className="bg-emerald-500/10 text-emerald-500 border-none h-5 px-2 text-[8px] font-black uppercase">Synchronized</Badge></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <SectionHeader title="Academic Pedigree" icon={GraduationCap} />
                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden mt-4">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/[0.03] border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Institutional Node</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Specialization</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Completion</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Grade Score</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] font-bold text-slate-400">
                                    <tr className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 text-white">Institute of Advanced Technology</td>
                                        <td className="px-6 py-4 italic text-indigo-400">Computer Science & Engineering</td>
                                        <td className="px-6 py-4 uppercase tracking-tighter">MAY 2019</td>
                                        <td className="px-6 py-4 font-black text-white">9.4 CGPA</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <SectionHeader title="Dependant Details" icon={Users} />
                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden mt-4">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/[0.03] border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Identity Name</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Relationship Node</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Birth Protocol</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] font-bold text-slate-400">
                                    <tr className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 text-white">Mary Jane Doe</td>
                                        <td className="px-6 py-4 italic text-indigo-400">Spouse (Secure)</td>
                                        <td className="px-6 py-4 uppercase tracking-tighter">OCT 1995</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <SectionHeader title="Registry Metadata" icon={Clock} />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 px-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Initiated By</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase italic">Admin Node 01</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Onboarding Date</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase italic">{user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : "Pending"}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Last Update</p>
                                <p suppressHydrationWarning className="text-[10px] font-black text-slate-400 uppercase italic">{new Date(user.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} Today</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Registry Epoch</p>
                                <p className="text-[10px] font-black text-indigo-400 uppercase italic">v2.4.0 Final</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-20" /> {/* Bottom Spacing */}
                </div>
            </ScrollArea>

            {/* FLOATING ACTION BAR FOR EXIT */}
            <div className="absolute bottom-10 left-10">
                <Button
                    onClick={onClose}
                    className="h-11 px-8 bg-slate-900 border border-white/10 text-white hover:bg-slate-800 rounded-2xl gap-3 font-black text-[10px] uppercase tracking-[.2em] shadow-2xl transition-all active:scale-95 group"
                >
                    <ChevronRight className="w-4 h-4 text-slate-500 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Return to Personnel Registry
                </Button>
            </div>
        </motion.div>
    )
}
