const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export interface CheckoutParams {
  creatorId: string;
  tierId: string;
  userId: string;
  userEmail: string;
  billingPeriod?: 'monthly' | 'annual';
}

export interface CheckoutResult {
  url: string;
}

export async function createCheckoutSession(
  params: CheckoutParams,
  accessToken: string,
): Promise<CheckoutResult> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/create-stripe-checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        creatorId: params.creatorId,
        tierId: params.tierId,
        billingPeriod: params.billingPeriod ?? 'monthly',
        successUrl: `${window.location.origin}/subscribe/success?creator=${params.creatorId}`,
        cancelUrl: `${window.location.origin}/subscribe/cancel?creator=${params.creatorId}`,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error ?? `Checkout failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.url) {
    throw new Error('No checkout URL returned from server');
  }

  return { url: data.url };
}
