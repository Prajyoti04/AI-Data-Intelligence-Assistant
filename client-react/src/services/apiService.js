/**
 * apiService.js — centralized API layer.
 *
 * All network calls go through here. Benefits:
 *  - Single place to update the base URL
 *  - Consistent error handling and message formatting
 *  - Prevents duplicate fetch() calls scattered across components
 *  - Handles both JSON and binary (blob) responses
 */

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

// ─── Core helpers ─────────────────────────────────────────────────────────────

/**
 * POST JSON, return parsed JSON.
 * Throws a descriptive Error on HTTP errors or network failures.
 */
export async function apiFetch(path, body = {}) {
  console.log("[apiFetch] →", path, "body:", JSON.stringify(body));
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
  } catch (err) {
    console.error("[apiFetch] NETWORK ERROR on", path, err);
    throw new Error(
      "Cannot reach the server. The backend may be starting up — please wait 30 seconds and try again."
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    console.error("[apiFetch] JSON PARSE ERROR on", path, "status:", response.status);
    throw new Error(`Server returned an unreadable response (HTTP ${response.status}).`);
  }

  console.log("[apiFetch] ←", path, "status:", response.status, "data:", data);

  if (!response.ok || data?.error) {
    const msg = data?.error ?? `Request failed (HTTP ${response.status}).`;
    if (response.status === 404) {
      throw new Error(
        "Dataset not found on the server. The server may have restarted — please re-upload your file."
      );
    }
    throw new Error(msg);
  }

  return data;
}

/**
 * POST multipart FormData for file upload, return parsed JSON.
 */
export async function apiUpload(file) {
  const formData = new FormData();
  formData.append("file", file);

  let response;
  try {
    response = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body:   formData,
      // Do NOT set Content-Type here — browser sets it with the boundary
    });
  } catch {
    throw new Error(
      "Cannot reach the server. Check your internet connection and try again."
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Server returned an invalid response during upload.");
  }

  if (!response.ok || data?.error) {
    throw new Error(data?.error ?? `Upload failed (HTTP ${response.status}).`);
  }

  // ── TRACE: print every key the backend actually returned ──
  console.log("[apiUpload] response keys:", Object.keys(data));
  console.log("[apiUpload] upload_id value:", data.upload_id);
  console.log("[apiUpload] full response:", JSON.stringify(data).slice(0, 500));

  return data;
}

/**
 * POST JSON, return a Blob (for file downloads).
 */
export async function apiDownload(path, body = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }

  if (!response.ok) {
    // Read the body as text first, then try to parse as JSON for a better message
    let errorMsg = `Download failed (HTTP ${response.status}).`;
    try {
      const text = await response.text();
      const json = JSON.parse(text);
      if (json?.error) errorMsg = json.error;
    } catch {
      // ignore — use default errorMsg
    }
    throw new Error(errorMsg);
  }

  return response.blob();
}

// ─── Named endpoint wrappers ─────────────────────────────────────────────────
// Each page imports only what it needs — no raw fetch() calls anywhere else.

export const api = {
  report:          (uploadId)          => apiFetch("/report",          { upload_id: uploadId }),
  clean:           (uploadId)          => apiFetch("/clean",           { upload_id: uploadId }),
  dataset:         (uploadId)          => apiFetch("/dataset",         { upload_id: uploadId }),
  chat:            (uploadId, question) => apiFetch("/chat",           { upload_id: uploadId, question }),
  predict:         (uploadId, target, inputs) =>
                                          apiFetch("/predict",         { upload_id: uploadId, target, inputs }),
  downloadReport:  (uploadId)          => apiDownload("/download-report",  { upload_id: uploadId }),
  downloadCleaned: (uploadId)          => apiDownload("/download-cleaned", { upload_id: uploadId }),
};
