/**
 * debug.js — temporary runtime tracing.
 * Import in any component to print a labelled context snapshot.
 * Remove this file and all imports before final deploy.
 */

export function traceContext(label, ctx) {
  console.group(`%c[TRACE] ${label}`, "color:#2563EB;font-weight:bold");
  console.log("uploadId       :", ctx.uploadId);
  console.log("stats.rows     :", ctx.stats?.rows);
  console.log("numericColumns :", ctx.numericColumns);
  console.log("columnNames    :", ctx.columnNames);
  console.log("dataset.length :", ctx.dataset?.length);
  console.log("datasetLoading :", ctx.datasetLoading);
  console.log("datasetError   :", ctx.datasetError);
  console.log("uploading      :", ctx.uploading);
  console.log("uploadError    :", ctx.uploadError);
  console.groupEnd();
}

export function traceRequest(method, url, body, status, responseBody) {
  console.group(`%c[NETWORK] ${method} ${url}`, "color:#059669;font-weight:bold");
  console.log("→ body   :", body);
  console.log("← status:", status);
  console.log("← body  :", responseBody);
  console.groupEnd();
}
