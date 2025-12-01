import { mockAlerts, type MockAlert } from "@/mocks/mockAlerts";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const alertsService = {
  async getAlerts(): Promise<MockAlert[]> {
    await delay(400);
    return [...mockAlerts];
  },

  async getAlertById(id: string): Promise<MockAlert | null> {
    await delay(300);
    return mockAlerts.find((alert) => alert.id === id) || null;
  },

  async getUnresolvedAlerts(): Promise<MockAlert[]> {
    await delay(400);
    return mockAlerts.filter((a) => !a.resolved);
  },

  async getAlertsBySeverity(severity: MockAlert["severity"]): Promise<MockAlert[]> {
    await delay(400);
    return mockAlerts.filter((a) => a.severity === severity);
  },

  async resolveAlert(id: string): Promise<MockAlert | null> {
    await delay(300);
    const alert = mockAlerts.find((a) => a.id === id);
    if (!alert) return null;
    
    alert.resolved = true;
    alert.resolvedAt = new Date().toISOString();
    return alert;
  },

  async acknowledgeAlert(id: string): Promise<MockAlert | null> {
    await delay(200);
    return mockAlerts.find((a) => a.id === id) || null;
  },

  async deleteAlert(id: string): Promise<boolean> {
    await delay(300);
    const index = mockAlerts.findIndex((a) => a.id === id);
    if (index === -1) return false;
    
    mockAlerts.splice(index, 1);
    return true;
  },

  async getAlertStats() {
    await delay(400);
    const total = mockAlerts.length;
    const resolved = mockAlerts.filter((a) => a.resolved).length;
    const unresolved = total - resolved;
    const critical = mockAlerts.filter((a) => a.severity === "critical").length;
    const warnings = mockAlerts.filter((a) => a.severity === "warning").length;

    return {
      total,
      resolved,
      unresolved,
      critical,
      warnings,
      info: mockAlerts.filter((a) => a.severity === "info").length,
    };
  },
};
