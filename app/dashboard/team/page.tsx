"use client";
import { useState, useEffect } from "react";
import { Plus, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInitials } from "@/lib/utils";
import bcrypt from "bcryptjs";

const ROLES = ["OWNER", "ADMIN", "MANAGER", "DETAILER", "RECEPTIONIST"];

const DEMO_TEAM = [
  { id: "1", name: "Marcus Rivera", email: "marcus@revive.com", role: "OWNER", status: "ACTIVE", phone: "(555) 847-2100" },
  { id: "2", name: "Jessica Chen", email: "jessica@revive.com", role: "MANAGER", status: "ACTIVE", phone: "(555) 847-2101" },
  { id: "3", name: "Tyler Banks", email: "tyler@revive.com", role: "DETAILER", status: "ACTIVE", phone: "(555) 847-2102" },
  { id: "4", name: "Amir Hassan", email: "amir@revive.com", role: "DETAILER", status: "ACTIVE", phone: "(555) 847-2103" },
];

export default function TeamPage() {
  const [team, setTeam] = useState(DEMO_TEAM);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "DETAILER", password: "" });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowNew(false);
        const newMember = await res.json();
        setTeam(t => [...t, { id: newMember.id, name: newMember.name, email: newMember.email, role: newMember.role, status: "ACTIVE", phone: form.phone }]);
      }
    } finally {
      setSaving(false);
    }
  };

  const roleColors: Record<string, any> = { OWNER: "default", ADMIN: "info", MANAGER: "gold", DETAILER: "secondary", RECEPTIONIST: "secondary" };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Team</h1>
          <p className="text-[#707070] text-sm mt-0.5">{team.length} team members</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4" /> Add Member</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {team.map(member => (
          <div key={member.id} className="bg-white border border-[#e5e5e3] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#0B0B0C] flex items-center justify-center text-white font-semibold text-base">
                {getInitials(member.name)}
              </div>
              <div>
                <div className="font-semibold text-[#111111] text-sm">{member.name}</div>
                <Badge variant={roleColors[member.role] || "secondary"} className="mt-0.5">{member.role}</Badge>
              </div>
            </div>
            <div className="space-y-1 text-xs text-[#707070]">
              <div>{member.email}</div>
              {member.phone && <div>{member.phone}</div>}
            </div>
            <div className="mt-3 pt-3 border-t border-[#f0f0ee]">
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <Input label="Full Name" value={form.name} onChange={e => set("name", e.target.value)} />
            <Input label="Email" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
            <Input label="Phone" value={form.phone} onChange={e => set("phone", e.target.value)} />
            <Select value={form.role} onValueChange={v => set("role", v)}>
              <SelectTrigger label="Role"><SelectValue /></SelectTrigger>
              <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            <Input label="Temporary Password" type="password" value={form.password} onChange={e => set("password", e.target.value)} />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={save} loading={saving}>Add Member</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
