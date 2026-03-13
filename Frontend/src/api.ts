import type { ChangeRequest, SimulationResponse } from './types';

const API_BASE = '/api';

export async function simulateChange(request: ChangeRequest): Promise<SimulationResponse> {
  const res = await fetch(`${API_BASE}/Simulation/simulate-change`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
