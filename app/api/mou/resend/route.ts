import { MouRequestError, resendMouEmails } from "@/lib/mou/server";
import type { MouResendResponse } from "@/lib/mou/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await resendMouEmails(body);

    return Response.json({
      ok: true,
      ...result,
    } satisfies MouResendResponse);
  } catch (error) {
    const status = error instanceof MouRequestError ? 400 : 500;
    const message =
      error instanceof Error ? error.message : "Unable to resend the membership email right now.";

    return Response.json(
      {
        error: message,
        ok: false,
      } satisfies MouResendResponse,
      { status },
    );
  }
}
