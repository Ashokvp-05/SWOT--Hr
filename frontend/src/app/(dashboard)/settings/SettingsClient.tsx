"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Settings, Shield, Bell, UserCog, Lock, Laptop, Globe, Zap, Smartphone, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { API_BASE_URL } from "@/lib/config"

export default function SettingsClient({ session }: { session: any }) {
    const { toast } = useToast()
    const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" })
    const [passLoading, setPassLoading] = useState(false)
    const [logoutLoading, setLogoutLoading] = useState(false)

    // WORK PREFERENCES STATE
    const [delegationEnabled, setDelegationEnabled] = useState(false)
    const [delegateUser, setDelegateUser] = useState("")
    const [wfhDays, setWfhDays] = useState<string[]>(["Wed", "Fri"])
    const [shareContact, setShareContact] = useState(true)

    const toggleWfhDay = (day: string) => {
        setWfhDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    const handleDelegationToggle = (checked: boolean) => {
        setDelegationEnabled(checked)
        toast({
            title: checked ? "Delegation Mode Enabled" : "Delegation Mode Disabled",
            description: checked ? "Approval requests will be routed to your delegate." : "You have reclaimed approval authority.",
        })
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordData.new !== passwordData.confirm) {
            toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
            return
        }

        setPassLoading(true)
        try {
            const token = (session?.user as any)?.accessToken
            const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.current,
                    newPassword: passwordData.new
                })
            })

            const data = await res.json()
            if (res.ok) {
                toast({ title: "Success", description: "Password updated successfully" })
                setPasswordData({ current: "", new: "", confirm: "" })
            } else {
                toast({ title: "Error", description: data.error || "Failed to update password", variant: "destructive" })
            }
        } catch (e) {
            toast({ title: "Error", description: "Network error", variant: "destructive" })
        } finally {
            setPassLoading(false)
        }
    }

    const handleLogoutOthers = async () => {
        setLogoutLoading(true)
        try {
            const token = (session?.user as any)?.accessToken
            const res = await fetch(`${API_BASE_URL}/auth/logout-others`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.ok) {
                toast({ title: "Success", description: "All other devices have been logged out." })
            } else {
                const data = await res.json()
                toast({ title: "Error", description: data.error || "Failed to logout other devices", variant: "destructive" })
            }
        } catch (e) {
            toast({ title: "Error", description: "Network error", variant: "destructive" })
        } finally {
            setLogoutLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-6 md:p-10 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <UserCog className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
                        <p className="text-sm font-medium text-muted-foreground mt-1 text-balance">Manage your profile preferences, work schedule, and security credentials.</p>
                    </div>
                </div>
                <Badge variant="outline" className="hidden md:flex h-8 px-3 rounded-lg border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Secure Access
                </Badge>
            </div>

            <Tabs defaultValue="preferences" className="w-full">
                <TabsList className="flex w-full overflow-x-auto justify-start md:w-[600px] h-12 rounded-xl bg-slate-100 dark:bg-white/5 p-1 mb-10 no-scrollbar">
                    <TabsTrigger value="preferences" className="flex-1 rounded-lg h-10 font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary data-[state=active]:shadow-sm">
                        <UserCog className="w-3.5 h-3.5 mr-2" /> Preferences
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex-1 rounded-lg h-10 font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary data-[state=active]:shadow-sm">
                        <Shield className="w-3.5 h-3.5 mr-2" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex-1 rounded-lg h-10 font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary data-[state=active]:shadow-sm">
                        <Bell className="w-3.5 h-3.5 mr-2" /> Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="preferences" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <Card className="lg:col-span-8 border-border shadow-sm bg-card rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-border p-6 md:p-8">
                                <CardTitle className="text-lg font-bold">Work & Leave Delegation</CardTitle>
                                <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Configure automated workflows for your absence periods.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 space-y-10">
                                <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-slate-50/50 dark:bg-white/5">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-bold">Out of Office Delegation</Label>
                                        <p className="text-xs text-muted-foreground">Automatically route approvals to a colleague when you are away.</p>
                                    </div>
                                    <Switch checked={delegationEnabled} onCheckedChange={handleDelegationToggle} />
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Delegate Approval Authority To</Label>
                                    <Select disabled={!delegationEnabled} value={delegateUser} onValueChange={setDelegateUser}>
                                        <SelectTrigger className="h-12 rounded-xl border-border bg-card font-medium px-4">
                                            <SelectValue placeholder="Select a team member..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="sarah">Sarah Connor (Senior Analyst)</SelectItem>
                                            <SelectItem value="james">James Bond (Operations Specialist)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-5 pt-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Remote Work Schedule</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                                            <button
                                                key={day}
                                                onClick={() => toggleWfhDay(day)}
                                                className={`h-11 px-6 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${wfhDays.includes(day)
                                                    ? 'bg-primary text-white border-primary shadow-md'
                                                    : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-8 border-t border-border">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-bold">Share Work Contact</Label>
                                        <p className="text-xs text-muted-foreground">Allow team members to see your work phone number in the directory.</p>
                                    </div>
                                    <Switch checked={shareContact} onCheckedChange={setShareContact} />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="lg:col-span-4 h-full">
                            <div className="bg-slate-900 rounded-2xl p-8 text-white h-full relative overflow-hidden flex flex-col justify-end min-h-[240px]">
                                <Globe className="absolute top-0 right-0 w-40 h-40 text-white/5 -mr-16 -mt-16" />
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold leading-tight">Your data is synced across devices.</h4>
                                    <p className="text-xs text-indigo-300 font-medium">Changes made here are instantly reflected across mobile and desktop apps.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <Card className="lg:col-span-12 border-border shadow-sm bg-card rounded-2xl overflow-hidden max-w-4xl">
                            <CardHeader className="p-6 md:p-8 border-b">
                                <CardTitle className="text-lg font-bold">Password & Authentication</CardTitle>
                                <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Ensure your account remains secure by updating your credentials regularly.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <form onSubmit={handlePasswordChange} className="space-y-8 max-w-2xl">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Current Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                className="h-12 pl-12 rounded-xl bg-slate-50/50 dark:bg-white/5 border-border"
                                                value={passwordData.current}
                                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">New Password</Label>
                                            <Input
                                                type="password"
                                                className="h-12 rounded-xl border-border"
                                                value={passwordData.new}
                                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Confirm New Password</Label>
                                            <Input
                                                type="password"
                                                className="h-12 rounded-xl border-border"
                                                value={passwordData.confirm}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="h-11 px-8 bg-primary rounded-xl font-bold uppercase tracking-widest text-[10px]" disabled={passLoading}>
                                        {passLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Password
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card className="max-w-2xl border-border shadow-sm bg-card rounded-2xl overflow-hidden">
                        <CardHeader className="p-6 md:p-8 border-b">
                            <CardTitle className="text-lg font-bold">Email Notifications</CardTitle>
                            <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Configure which updates you want to receive directly to your inbox.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-6">
                            {[
                                { label: "Work Reminders", desc: "Sent at 9:00 AM every business day.", icon: Clock },
                                { label: "Approval Notifications", desc: "Instant alerts for leave and claim requests.", icon: Shield },
                                { label: "Company Announcements", desc: "Direct updates from the organization.", icon: Bell }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-primary/30 transition-all group lg:col-span-1">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-sm font-bold">{item.label}</Label>
                                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
