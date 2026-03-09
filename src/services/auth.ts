import type { RegisterPayload, RegisterResponse } from "@/types/auth";

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { ok: false, message: "Server error" };
  }

  return (await res.json()) as RegisterResponse;
}
