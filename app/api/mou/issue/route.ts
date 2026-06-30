import { issueMouSubmission, MouRequestError } from "@/lib/mou/server";
import type { MouIssueResponse } from "@/lib/mou/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await issueMouSubmission(body);

    return Response.json({
      ok: true,
      ...result,
    } satisfies MouIssueResponse);
  } catch (error) {
    const status = error instanceof MouRequestError ? 400 : 500;
    const message =
      error instanceof Error ? error.message : "Unable to issue the membership token right now.";

    return Response.json(
      {
        error: message,
        ok: false,
      } satisfies MouIssueResponse,
      { status },
    );
  }
}
