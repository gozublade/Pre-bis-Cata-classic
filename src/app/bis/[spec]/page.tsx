'use client'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, use } from 'react'
import { specs, getSpec, classColors, specsByClass, PHASE_LABELS, SLOT_LABELS } from '@/data/bisData'
import type { Phase } from '@/data/bisData'

const RARITY_COLOR: Record<string, string> = {
  common: '#ffffff',
  uncommon: '#1eff00',
  rare: '#0070dd',
  epic: '#a335ee',
  legendary: '#ff8000',
}

export default function SpecPage({ params }: { params: Promise<{ spec: string }> | { spec: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params
  const spec = getSpec(resolvedParams.spec)
  if (!spec) notFound()

  const [phase, setPhase] = useState<Phase>('pre-bis')

  const clsId = spec.class.toLowerCase().replace(' ', '-')
  const colors = classColors[clsId] ?? classColors['warrior']
  const siblings = specsByClass(spec.class).filter(s => s.id !== spec.id)

  const roleColor = spec.role === 'DPS'
    ? { bg: 'rgba(224,96,96,0.15)', border: 'rgba(224,96,96,0.3)', text: '#e08888' }
    : spec.role === 'Tank'
    ? { bg: 'rgba(100,140,220,0.15)', border: 'rgba(100,140,220,0.3)', text: '#88aaee' }
    : { bg: 'rgba(86,201,111,0.15)', border: 'rgba(86,201,111,0.3)', text: '#80c890' }

  const gear = spec.phases[phase] ?? []

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <style>{`
        .item-link { color: inherit; text-decoration: none; }
        .item-link:hover { text-decoration: underline; }
        .sibling-link { font-size:12px; color:var(--text-muted); border:1px solid var(--border); border-radius:4px; padding:3px 10px; text-decoration:none; transition:all 0.15s; }
        .sibling-link:hover { border-color:var(--border-light); color:var(--text-primary); }
        .phase-btn { padding:6px 14px; border-radius:5px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid var(--border); background:transparent; color:var(--text-muted); transition:all 0.15s; letter-spacing:0.04em; }
        .phase-btn:hover { border-color:var(--border-light); color:var(--text-primary); }
        .phase-btn.active { background:rgba(200,168,75,0.15); border-color:rgba(200,168,75,0.45); color:var(--accent); }
        .gear-row { transition:background 0.1s; }
        .gear-row:hover { background:rgba(255,255,255,0.03) !important; }
        .btn-sim { background:rgba(200,168,75,0.12); border:1px solid rgba(200,168,75,0.3); color:var(--accent); padding:8px 16px; border-radius:6px; font-size:13px; font-weight:600; text-decoration:none; transition:background 0.15s; }
        .btn-sim:hover { background:rgba(200,168,75,0.22); }
        .btn-back { background:rgba(255,255,255,0.05); border:1px solid var(--border); color:var(--text-muted); padding:8px 16px; border-radius:6px; font-size:13px; text-decoration:none; transition:background 0.15s; }
        .btn-back:hover { background:rgba(255,255,255,0.09); }
        @media(max-width:700px){
          .gear-table-row { grid-template-columns: 90px 1fr !important; }
          .col-source, .col-gems, .col-enchant { display:none; }
        }
      `}</style>

      {/* Header */}
      <header style={{ background: 'linear-gradient(180deg,#0d0e14 0%,#181921 100%)', borderBottom: '1px solid var(--border)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--accent)', fontFamily: 'Cinzel,serif', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>CATA BiS</Link>
          <span style={{ color: 'var(--border-light)' }}>/</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{spec.class}</span>
          <span style={{ color: 'var(--border-light)' }}>/</span>
          <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{spec.name}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {siblings.map(s => (
              <Link key={s.id} href={`/bis/${s.id}`} className="sibling-link">{s.name}</Link>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,${colors.bg} 0%,var(--bg-surface) 60%,var(--bg-base) 100%)`, borderBottom: `1px solid ${colors.border}`, padding: '32px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ background: roleColor.bg, border: `1px solid ${roleColor.border}`, color: roleColor.text, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: '0.08em' }}>{spec.role}</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text, marginBottom: 20 }}>
            {spec.name} {spec.class} — Best in Slot
          </h1>

          {/* Phase selector */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['pre-bis','t11','t12','t13'] as Phase[]).map(p => (
              <button key={p} className={`phase-btn${phase === p ? ' active' : ''}`} onClick={() => setPhase(p)}>
                {PHASE_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gear table */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 60px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>

          {/* Table header */}
          <div className="gear-table-row" style={{ display: 'grid', gridTemplateColumns: '110px 1fr 180px 200px 160px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border)', padding: '10px 16px', gap: 12 }}>
            {['Slot','Item','Source','Gems','Enchant'].map(h => (
              <span key={h} className={h === 'Source' ? 'col-source' : h === 'Gems' ? 'col-gems' : h === 'Enchant' ? 'col-enchant' : ''} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
            ))}
          </div>

          {gear.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No data for this phase yet.
            </div>
          )}

          {gear.map((item, i) => {
            const rarityColor = RARITY_COLOR[item.rarity ?? ''] ?? '#ffffff'
            return (
              <div key={`${item.slot}-${i}`} className="gear-row" style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr 180px 200px 160px',
                gap: 12,
                padding: '11px 16px',
                borderBottom: i < gear.length - 1 ? '1px solid var(--border)' : 'none',
                background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent',
                alignItems: 'center',
              }}>
                {/* Slot */}
                <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {SLOT_LABELS[item.slot] ?? item.slot}
                </span>

                {/* Item + reforge */}
                <div>
                  <span style={{ color: rarityColor, fontWeight: 600, fontSize: 14 }}>
                    {item.item}
                  </span>
                  {item.reforge_from && item.reforge_to && (
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                      ↻ {item.reforge_from} → <span style={{ color: '#b0d0ff' }}>{item.reforge_to}</span>
                    </div>
                  )}
                </div>

                {/* Source */}
                <div className="col-source">
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.source}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 1 }}>{item.source_type}</div>
                </div>

                {/* Gems */}
                <div className="col-gems" style={{ fontSize: 11, color: '#e8c96a' }}>
                  {item.gems ? item.gems.split("|").map((g, gi, arr) => (
                    <div key={gi} style={{ marginBottom: gi < arr.length - 1 ? 2 : 0 }}>
                      ◆ {g.trim()}
                    </div>
                  )) : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                </div>

                {/* Enchant */}
                <div className="col-enchant" style={{ fontSize: 11, color: '#88aacc' }}>
                  {item.enchant ? <>✦ {item.enchant}</> : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer actions */}
        <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="https://wowsims.github.io/cata/" target="_blank" rel="noopener noreferrer" className="btn-sim">
            Sim en WowSims →
          </a>
          <Link href="/" className="btn-back">← Todas las specs</Link>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: 12 }}>
        Cata Classic BiS · Not affiliated with Blizzard Entertainment
      </footer>
    </div>
  )
}
