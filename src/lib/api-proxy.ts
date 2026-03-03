import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

interface QueryPayload {
  query?: unknown;
}

export async function proxyQueryRequest(request: Request, endpoint: string, source: string) {
  try {
    const body = (await request.json()) as QueryPayload;
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      const detail = await upstreamResponse.text();
      return NextResponse.json(
        {
          error: `Upstream API error: ${upstreamResponse.status}`,
          detail,
        },
        { status: upstreamResponse.status },
      );
    }

    const data = await upstreamResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[${source}] Error:`, error);
    return NextResponse.json(
      { error: `Failed to fetch data from ${source}` },
      { status: 500 },
    );
  }
}
