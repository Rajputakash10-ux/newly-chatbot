import { NextResponse } from "next/server";

export async function GET() {
  const metrics = {
    neural: 80 + Math.random() * 15,
    vision: 88 + Math.random() * 10,
    pattern: 75 + Math.random() * 10,
    inference: 92 + Math.random() * 8,
    predictive: 85 + Math.random() * 10,
    activeUsers: 2800 + Math.floor(Math.random() * 100),
    modelsDeployed: 15200 + Math.floor(Math.random() * 100),
    uptime: 99.9,
    dataProcessed: 840 + Math.floor(Math.random() * 20),
  };

  return NextResponse.json({ metrics, timestamp: new Date().toISOString() });
}
