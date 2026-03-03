import { proxyQueryRequest } from "@/lib/api-proxy";

export async function POST(request: Request) {
  return proxyQueryRequest(request, "/api/v1/chart-data", "chart-data proxy");
}
