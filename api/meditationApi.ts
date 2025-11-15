const API_BASE = "http://10.5.41.85:5000/api";

export async function getStats(token: string) {
  const res = await fetch(`${API_BASE}/meditation/stats`, {
    headers: {
      Authorization: token,
    },
  });
  return res.json();
}

export async function addMeditation(
  minutes: number,
  meditationId: string | null,
  title: string | null,
  token: string
) {
  const res = await fetch(`${API_BASE}/meditation/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ minutes, meditationId, title }),
  });
  return res.json();
}
