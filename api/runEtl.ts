export async function runEtl() {
  const url = process.env.EXPO_PUBLIC_API_URL!;
  const secret = process.env.EXPO_PUBLIC_NARA_INTERNAL_SECRET;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "X-Internal-Secret": secret } : {}),
      "Idempotency-Key":
        (global as any).crypto?.randomUUID?.() ?? String(Date.now())
    },
    body: JSON.stringify({ action: "ingest_students" })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ETL failed ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<{
    ok: boolean;
    kpi: number;
    by_year: number;
    by_major: number;
  }>;
}
