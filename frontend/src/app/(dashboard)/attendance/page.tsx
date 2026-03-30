import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AttendanceHistoryTable from "@/components/dashboard/AttendanceHistoryTable"
import { CalendarCheck, Clock, Activity, Fingerprint } from "lucide-react"
import AttendanceCalendar from "@/components/dashboard/AttendanceCalendar"

export default async function AttendancePage() {
    const session = await auth()
    if (!session) redirect("/login")

    const token = (session.user as any)?.accessToken || ""

    return (
        <div className="flex-1 space-y-8 p-4 md:p-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Premium Multi-Layer Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
                        <CalendarCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Temporal Audit</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Digital log of your work hours, shifts, and systemic presence.</p>
                    </div>
                </div>
                <div className="relative z-10 flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Node Synchronized</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 space-y-8">
                    <AttendanceHistoryTable token={token} />
                </div>
                <div className="md:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Monthly Matrix</h3>
                            <Clock className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="p-8">
                            <AttendanceCalendar token={token} />
                            <div className="flex gap-6 justify-center mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 text-[9px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20"></div> Present</div>
                                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-lg shadow-rose-500/20"></div> Absent</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group h-56 flex flex-col justify-end">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Fingerprint className="w-24 h-24" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Identity Verification</p>
                        <h4 className="text-xl font-black italic uppercase leading-tight max-w-[200px]">Biometric synchronization active for all terminal access points.</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}
