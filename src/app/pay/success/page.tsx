export default function PaySuccessPage({
  searchParams,
}: {
  searchParams: { payment_id?: string; type?: string };
}) {
  const typeLabels: Record<string, string> = {
    request:       'Request confirmed',
    drop_unlock:   'Drop unlocked',
    pulse_session: 'Pulse session confirmed',
    tip:           'Tip sent',
  };
  const label = typeLabels[searchParams.type ?? ''] ?? 'Payment confirmed';

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0A0A1A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif', color: '#fff',
      flexDirection: 'column', gap: 16, padding: 24,
    }}>
      <div style={{ fontSize: 56 }}>✓</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: '#00FFB2' }}>
        {label}
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 400 }}>
        Go back to the Zik4U app to access your content.
      </p>
      <a href="/" style={{
        marginTop: 8, padding: '12px 28px', borderRadius: 10,
        background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
        color: '#0A0A1A', fontWeight: 700, textDecoration: 'none',
      }}>
        Back to Zik4U →
      </a>
    </div>
  );
}
