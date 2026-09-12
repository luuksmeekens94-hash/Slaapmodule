import { next } from "@vercel/functions";
import {
  previewGate,
  previewHeaders,
  PREVIEW_BRANCH,
} from "./lib/preview-access.js";

export default function middleware(request) {
  const environment = process.env.VERCEL_ENV;
  const branch = process.env.VERCEL_GIT_COMMIT_REF;
  const blocked = previewGate(request, { environment, branch });
  if (blocked) return blocked;
  return next(
    environment === "preview" && branch === PREVIEW_BRANCH
      ? { headers: previewHeaders }
      : undefined,
  );
}
