'use client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { specs, getSpec, classColors } from '@/data/bisData'
import { use } from 'react'

export default function SpecPage({ params }: { params: Promise<{ spec: string }> | { spec: string } }) {
  // Support both Next 14 sync and async params
  const resolvedParams = params instanceof Promise ? use(params) : params
  const spec = getSpec(resolvedParams.spec)
  if (!spec) notFound()

  const clsId = spec.class.toLowerCase().replace(' ', '-')
  const colors = classColors[clsId] ?? classColors['warrior']
  const WOWHEAD = (id: number) => `https://www.wowhead.com/cata/item=${id}`
  const roleColor = spec.role === 'DPS'
    ? { bg: 'rgba(224,96,96,0.15)', border: 'rgba(224,96,96,0.3)', text: '#e08888' }
    : spec.role === 'Tank'
    ? { bg: 'rgba(100,140,220,0.15)', border: 'rgba(100,140,220,0.3)', text: '#88aaee' }
    : { bg: 'rgba(86,201,111,0.15)', border: 'rgba(86,201,111,0.3)', text: '#80c890' }
  const siblings = specs.filter(s => s.class === spec.class && s.id !== spec.id)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <style>{`
        .item-link:hover { text-decoration: underline; }
        .sibling-link:hover { border-color: var(--border-light) !important; color: var(--text-primary) !important; }
        .btn-primary { background: rgba(200,168,75,0.12); border: 1px solid rgba(200,168,75,0.3); color: var(--accent); padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none; cursor: pointer; transition: background 0.15s; }
        .btn-primary:hover { background: rgba(200,168,75,0.22) !important; text-decoration: none; }
        .btn-secondary { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: var(--text-muted); padding: 8px 16px; border-radius: 6px; font-size: 13px; text-decoration: none; cursor: pointer; transition: background 0.15s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.09) !important; text-decoration: none; }
        .gear-row:hover { background: rgba(255,255,255,0.025) !important; }
      `}</style>

      <header style={{ background: 'linear-gradient(180deg, #0d0e14 0%, #181921 100%)', borderBottom: '1px solid var(--border)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--accent)', fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>CATA BiS</Link>
          <span style={{ color: 'var(--border-light)' }}>/</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{spec.class}</span>
          <span style={{ color: 'var(--border-light)' }}>/</span>
          <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{spec.name}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {siblings.map(s => (
              <Link key={s.id} href={`/bis/${s.id}`} className="sibling-link" style={{ fontSize: 12, color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 10px', textDecoration: 'none', transition: 'all 0.15s' }}>{s.name}</Link>
            ))}
          </span>
        </div>
      </header>

      <div style={{ background: `linear-gradient(135deg, ${colors.bg} 0%, var(--bg-surface) 60%, var(--bg-base) 100%)`, borderBottom: `1px solid ${colors.border}`, padding: '36px 24px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ background: roleColor.bg, border: `1px solid ${roleColor.border}`, color: roleColor.text, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: '0.08em' }}>{spec.role}</span>
            <span style={{ background: 'rgba(200,168,75,0.15)', border: '1px solid rgba(200,168,75,0.3)', color: 'var(--accent)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: '0.08em' }}>PRE-RAID</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.text, marginBottom: 10 }}>{spec.name} {spec.class} — Pre-Raid BiS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            <strong style={{ color: 'var(--text-dim)', marginRight: 6 }}>Stat Priority:</strong>
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{spec.statPriority}</span>
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 190px 170px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border)', padding: '10px 16px', gap: 12 }}>
            {['Slot','Item','Source','Location'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
            ))}
          </div>

          {spec.gear.map((item, i) => (
            <div key={`${item.slot}-${i}`} className="gear-row" style={{
              display: 'grid', gridTemplateColumns: '130px 1fr 190px 170px', gap: 12,
              padding: '12px 16px',
              borderBottom: i < spec.gear.length - 1 ? '1px solid var(--border)' : 'none',
              background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent',
              alignItems: 'center', transition: 'background 0.12s',
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.slotLabel}</span>
              <div>
                <a href={WOWHEAD(item.itemId)} target="_blank" rel="noopener noreferrer" className="item-link" style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>{item.name}</a>
                {item.enchant && <div style={{ fontSize: 11, color: '#88aacc', marginTop: 3 }}>✦ {item.enchant}</div>}
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.source}</span>
              <span style={{ fontSize: 12, color: 'var(--text-dim)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px', display: 'inline-block' }}>{item.location}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="https://wowsims.github.io/cata/" target="_blank" rel="noopener noreferrer" className="btn-primary">Sim yourself on WowSims →</a>
          <Link href="/" className="btn-secondary">← All Specs</Link>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: 12 }}>
        Cata Classic Pre-Raid BiS · Not affiliated with Blizzard Entertainment
      </footer>
    </div>
  )
}
