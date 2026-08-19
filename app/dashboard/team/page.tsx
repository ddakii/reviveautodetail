"use client";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

const TEAM = [
  { name: "Alex Rivera", role: "Lead Detailer & Founder", email: "alex@reviveautodetail.com", bio: "IDA-certified with 8+ years specializing in paint correction and ceramic coatings.", status: "Active" },
  { name: "Jordan Kim", role: "Senior Detailer", email: "jordan@reviveautodetail.com", bio: "Expert in PPF installation and interior restoration with 5 years of experience.", status: "Active" },
  { name: "Sam Torres", role: "Detailing Technician", email: "sam@reviveautodetail.com", bio: "Specializes in exterior detailing and maintenance services. Joined the team in 2023.", status: "Active" },
];

export default function TeamPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageHeader title="Team" description="Your detailing team members." />
      <div style={{ padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {TEAM.map(member => (
            <div key={member.email} style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "var(--r-md)", background: "var(--c-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {getInitials(member.name)}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--c-ink)" }}>{member.name}</div>
                  <div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 2 }}>{member.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "var(--c-text-2)", lineHeight: 1.6, marginBottom: 16 }}>{member.bio}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--c-text-3)" }}>{member.email}</span>
                <Badge variant="success">{member.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
