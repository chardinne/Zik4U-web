export default function PaySuccessPage({
  searchParams,
}: {
  searchParams: { payment_id?: string; type?: string };
}) {
  const typeLabels: Record<string, string> = {
    request:       'Ta demande est confirmée',
    drop_unlock:   'Drop débloqué',
    pulse_session: 'Session Pulse confirmée',
    tip:           'Tip envoyé',
  };
  const label = typeLabels[searchParams.type ?? ''] ?? 'Paiement confirmé';

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
        Retourne dans l&apos;app Zik4U pour accéder à ton contenu.
      </p>
      <a href="/" style={{
        marginTop: 8, padding: '12px 28px', borderRadius: 10,
        background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
        color: '#0A0A1A', fontWeight: 700, textDecoration: 'none',
      }}>
        Retour à Zik4U →
      </a>
    </div>
  );
}
