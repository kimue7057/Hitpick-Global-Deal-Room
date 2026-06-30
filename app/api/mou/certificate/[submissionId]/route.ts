import {
  buildMouCertificateFilename,
  buildMouCertificateHtml,
} from "@/lib/mou/certificate";
import { getIssuedMouTokenBySubmissionId, MouRequestError } from "@/lib/mou/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ submissionId: string }> },
) {
  const { submissionId } = await context.params;

  try {
    const token = await getIssuedMouTokenBySubmissionId(submissionId);
    const body = buildMouCertificateHtml(token);

    return new Response(body, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${buildMouCertificateFilename(token)}"`,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    const status = error instanceof MouRequestError ? 404 : 500;
    const message =
      error instanceof Error
        ? error.message
        : "Unable to download the certificate right now.";

    return Response.json(
      {
        error: message,
        ok: false,
      },
      { status },
    );
  }
}
