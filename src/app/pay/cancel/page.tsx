export default function PayCancelPage() {
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0A0A1A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif', color: '#fff',
      flexDirection: 'column', gap: 16, padding: 24,
    }}>
      <div style={{ fontSize: 56 }}>✗</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Paiement annulé</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)' }}>Tu peux retourner dans l&apos;app.</p>
      <a href="/" style={{
        marginTop: 8, padding: '12px 28px', borderRadius: 10,
        background: '#12122A', border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff', fontWeight: 700, textDecoration: 'none',
      }}>
        Retour →
      </a>
    </div>
  );
}
