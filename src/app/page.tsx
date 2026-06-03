'use client'
import Link from 'next/link'
import { specs, classColors } from '@/data/bisData'

const CLASS_ORDER = [
  'Death Knight','Druid','Hunter','Mage','Paladin',
  'Priest','Rogue','Shaman','Warlock','Warrior'
]

const ROLE_ICON: Record<string, string> = { DPS: '⚔️', Tank: '🛡️', Healer: '💚' }
const CLASS_ICON: Record<string, string> = {
  'Death Knight': '💀', 'Druid': '🌿', 'Hunter': '🏹', 'Mage': '✨',
  'Paladin': '⚔️', 'Priest': '✝️', 'Rogue': '🗡️', 'Shaman': '⚡',
  'Warlock': '🔥', 'Warrior': '🛡️'
}

export default function Home() {
  const byClass: Record<string, typeof specs> = {}
  for (const spec of specs) {
    if (!byClass[spec.class]) byClass[spec.class] = []
    byClass[spec.class].push(spec)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <style>{`
        .spec-row { transition: background 0.15s; }
        .spec-row:hover { background: rgba(255,255,255,0.04) !important; }
        .item-link:hover { text-decoration: underline; }
        .sibling-link:hover { border-color: var(--border-light) !important; color: var(--text-primary) !important; }
        .btn-primary:hover { background: rgba(200,168,75,0.22) !important; }
        .btn-secondary:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      <header style={{
        background: 'linear-gradient(180deg, #0d0e14 0%, #181921 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'var(--accent)' }}>CATA BiS</span>
          <span style={{ background: 'rgba(200,168,75,0.15)', border: '1px solid rgba(200,168,75,0.3)', color: 'var(--accent)', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.08em' }}>PRE-RAID</span>
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 12 }}>Cataclysm Classic · All Specs</span>
        </div>
      </header>

      <div style={{ background: 'linear-gradient(135deg, #0d0e14 0%, #1a1422 50%, #111218 100%)', borderBottom: '1px solid var(--border)', padding: '48px 24px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)', marginBottom: 12, textShadow: '0 0 40px rgba(200,168,75,0.3)' }}>Pre-Raid Best in Slot</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 560, margin: '0 auto' }}>
          Optimal gear from Heroic Dungeons, Valor Points &amp; crafting — for every spec in Cataclysm Classic before stepping into raids.
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          {(['DPS','Tank','Healer'] as const).map(role => (
            <span key={role} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
              <span>{ROLE_ICON[role]}</span>
              <span style={{ color: 'var(--text-primary)' }}>{specs.filter(s => s.role === role).length}</span>
              {role} specs
            </span>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 60px' }}>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {CLASS_ORDER.filter(c => byClass[c]).map(cls => {
            const clsSpecs = byClass[cls]
            const clsId = cls.toLowerCase().replace(' ', '-')
            const colors = classColors[clsId] ?? classColors['warrior']
            return (
              <div key={cls} style={{ background: 'var(--bg-card)', border: `1px solid ${colors.border}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ background: colors.bg, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${colors.border}` }}>
                  <span style={{ fontSize: 20 }}>{CLASS_ICON[cls]}</span>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: colors.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cls}</h2>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)' }}>{clsSpecs.length} spec{clsSpecs.length > 1 ? 's' : ''}</span>
                </div>
                {clsSpecs.map((spec, i) => {
                  const rc = spec.role === 'DPS'
                    ? { bg: 'rgba(224,96,96,0.15)', border: 'rgba(224,96,96,0.3)', text: '#e08888' }
                    : spec.role === 'Tank'
                    ? { bg: 'rgba(100,140,220,0.15)', border: 'rgba(100,140,220,0.3)', text: '#88aaee' }
                    : { bg: 'rgba(86,201,111,0.15)', border: 'rgba(86,201,111,0.3)', text: '#80c890' }
                  return (
                    <Link key={spec.id} href={`/bis/${spec.id}`} className="spec-row" style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
                      borderBottom: i < clsSpecs.length - 1 ? '1px solid var(--border)' : 'none',
                      textDecoration: 'none', background: 'transparent',
                    }}>
                      <span style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.text, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3, letterSpacing: '0.06em', minWidth: 44, textAlign: 'center' }}>{spec.role}</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 14 }}>{spec.name}</span>
                      <span style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: 12 }}>{spec.gear.length} slots →</span>
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: 12 }}>
        Cata Classic Pre-Raid BiS · Data sourced from wowtbc.gg &amp; Wowhead · Not affiliated with Blizzard
      </footer>
    </div>
  )
}
