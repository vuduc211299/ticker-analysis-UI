import { proxyQueryRequest } from "@/lib/api-proxy";

export async function POST(request: Request) {
  return proxyQueryRequest(request, "/api/v1/report", "report proxy");
}
