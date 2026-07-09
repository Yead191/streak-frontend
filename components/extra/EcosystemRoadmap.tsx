import React from 'react'

export default function EcosystemRoadmap() {
    return (
        <div className="cs-roadmap w-full max-w-4xl mb-24 px-4 text-left">
            <div className="flex flex-col items-center md:items-start mb-10 text-center md:text-left gap-2">
                <h3 className="font-display text-xl font-bold tracking-widest text-white/80 uppercase">
                    Ecosystem Roadmap
                </h3>
                <p className="text-xs text-white/45 max-w-md">
                    Tracking our growth from underground seeds to global connection.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {/* Phase 1: Seeding */}
                <div
                    className="group relative flex flex-col justify-between rounded-3xl border border-white/5 bg-[#090f0a]/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-[#090f0a]/60"
                    style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02), 0 10px 30px rgba(0,0,0,0.3)"
                    }}
                >
                    {/* Large background number */}
                    <div className="absolute right-6 top-4 font-display text-5xl font-black text-white/5 select-none transition-colors duration-300 group-hover:text-white/10">01</div>

                    <div>
                        {/* Badge */}
                        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-(--green)/30 bg-(--green)/5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-(--green)">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Completed</span>
                        </div>

                        <h4 className="font-display text-base font-bold text-white mb-2">Phase 1: Seeding</h4>
                        <p className="text-xs text-white/50 leading-relaxed mb-6">
                            Ecosystem architecture, tokenomics modelling, and mycelial routing protocol design.
                        </p>
                    </div>

                    {/* Milestones */}
                    <div className="border-t border-white/5 pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-white/60">
                            <span className="text-(--green)">✓</span>
                            <span>Ecosystem whitepaper release</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/60">
                            <span className="text-(--green)">✓</span>
                            <span>Core smart contract audits</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/60">
                            <span className="text-(--green)">✓</span>
                            <span>Seed nodes network map</span>
                        </div>
                    </div>
                </div>

                {/* Phase 2: Sprouting */}
                <div
                    className="group relative flex flex-col justify-between rounded-3xl border border-(--green)/40 bg-[#0c160e]/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-(--green)/60"
                    style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 36px rgba(125,255,87,0.08)"
                    }}
                >
                    {/* Radial glow background */}
                    <div className="absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(125,255,87,0.06)_0%,transparent_70%)] pointer-events-none" />

                    {/* Large background number */}
                    <div className="absolute right-6 top-4 font-display text-5xl font-black text-(--green)/10 select-none transition-colors duration-300 group-hover:text-(--green)/20">02</div>

                    <div>
                        {/* Badge */}
                        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-(--green) bg-(--green)/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-(--green) animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-(--green)" />
                            <span>Active Beta</span>
                        </div>

                        <h4 className="font-display text-base font-bold text-white mb-2">Phase 2: Sprouting</h4>
                        <p className="text-xs text-white/70 leading-relaxed mb-6 font-medium">
                            Onboarding early users, public interface rollouts, and waitlist allocations.
                        </p>
                    </div>

                    {/* Milestones & Progress */}
                    <div className="border-t border-(--green)/20 pt-4 space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-bold text-(--green) uppercase tracking-wider">
                                <span>Testflight Allocation</span>
                                <span>72%</span>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-linear-to-r from-(--green) to-(--green-deep) rounded-full" style={{ width: "72%" }}></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-white/80">
                                <span className="text-(--green)">→</span>
                                <span>Private iOS / Android testing</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-white/80">
                                <span className="text-(--green)">→</span>
                                <span>Early adopter keys allocation</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phase 3: Blooming */}
                <div
                    className="group relative flex flex-col justify-between rounded-3xl border border-white/5 bg-[#090f0a]/30 p-6 opacity-55 transition-all duration-300 hover:opacity-85 hover:-translate-y-1 hover:border-white/10 hover:bg-[#090f0a]/50"
                    style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.01), 0 10px 30px rgba(0,0,0,0.2)"
                    }}
                >
                    {/* Large background number */}
                    <div className="absolute right-6 top-4 font-display text-5xl font-black text-white/5 select-none transition-colors duration-300 group-hover:text-white/10">03</div>

                    <div>
                        {/* Badge */}
                        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/45">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <span>Scheduled</span>
                        </div>

                        <h4 className="font-display text-base font-bold text-white/60 mb-2">Phase 3: Blooming</h4>
                        <p className="text-xs text-white/40 leading-relaxed mb-6">
                            Public app release on Apple App Store & Google Play Store alongside live partner integrations.
                        </p>
                    </div>

                    {/* Milestones */}
                    <div className="border-t border-white/5 pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-white/30">
                            <span>○</span>
                            <span>Public App Store Release</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/30">
                            <span>○</span>
                            <span>Global partner events integration</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/30">
                            <span>○</span>
                            <span>Ecosystem rewards network go-live</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
