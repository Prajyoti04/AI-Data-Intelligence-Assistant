/**
 * DataContext — single source of truth for the entire application.
 *
 * All upload state lives here. Every page reads from this context instead of
 * receiving props. This eliminates prop-drilling and ensures state survives
 * navigation between pages (since the provider lives above the router).
 */
import { createContext, useContext, useState, useCallback, useRef } from "react";
import { apiUpload, apiFetch } from "../services/apiService";

// ─── Context shape ────────────────────────────────────────────────────────────
const DataContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function DataProvider({ children }) {
  // Upload metadata (lightweight — always kept in memory)
  const [uploadId, setUploadId]                   = useState(null);
  const [stats, setStats]                         = useState({ rows: 0, columns: 0, missing_values: 0, duplicates: 0 });
  const [preview, setPreview]                     = useState([]);
  const [columnNames, setColumnNames]             = useState([]);
  const [numericColumns, setNumericColumns]       = useState([]);
  const [correlationMatrix, setCorrelationMatrix] = useState({});
  const [recommendedTask, setRecommendedTask]     = useState(null);

  // Full dataset — lazy loaded by pages that need it (e.g. Visualizations)
  const [dataset, setDataset]                     = useState([]);
  const [datasetLoading, setDatasetLoading]       = useState(false);
  const [datasetError, setDatasetError]           = useState(null);

  // Upload status
  const [uploading, setUploading]                 = useState(false);
  const [uploadError, setUploadError]             = useState(null);

  // Prevent duplicate dataset fetches
  const fetchingDataset    = useRef(false);
  const datasetLoadedForId = useRef(null); // tracks which upload_id's dataset is loaded

  // ── Upload a file ────────────────────────────────────────────────────────────
  const uploadFile = useCallback(async (file) => {
    console.log("[DataContext] uploadFile START — file:", file?.name);
    setUploading(true);
    setUploadError(null);

    // Reset all state on a new upload
    setUploadId(null);
    setDataset([]);
    setDatasetError(null);
    fetchingDataset.current    = false;
    datasetLoadedForId.current = null;

    try {
      const data = await apiUpload(file);
      console.log("[DataContext] uploadFile SUCCESS — upload_id:", data.upload_id, "rows:", data.rows, "numeric_columns:", data.numeric_columns);

      setUploadId(data.upload_id);
      setStats({
        rows:           data.rows           ?? 0,
        columns:        data.columns        ?? 0,
        missing_values: data.missing_values ?? 0,
        duplicates:     data.duplicates     ?? 0,
      });
      setPreview(data.preview           ?? []);
      setColumnNames(data.column_names  ?? []);
      setNumericColumns(data.numeric_columns ?? []);
      setCorrelationMatrix(data.correlation_matrix ?? {});
      setRecommendedTask(data.recommended_task ?? null);

      return data.upload_id;
    } catch (err) {
      console.error("[DataContext] uploadFile ERROR:", err.message);
      setUploadError(err.message ?? "Upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  // ── Lazy-load the full dataset rows (for charts / visualizations) ─────────
  //
  // IMPORTANT: deps array is intentionally empty [].
  //
  // Problem with [uploadId, dataset.length]:
  //   1. uploadFile() resets uploadId to null then sets it to real_id in two
  //      separate renders. During the null render, loadDataset is recreated
  //      with uploadId=null inside its closure. If Visualizations' useEffect
  //      fires at that moment, it calls loadDataset with a null targetId and
  //      sets fetchingDataset.current=true — permanently blocking all future
  //      fetches because the finally block sets it back to false only AFTER
  //      apiFetch returns, but the early `return` on !targetId exits before
  //      reaching fetchingDataset.current=true, so that path is actually safe.
  //
  //   2. Having dataset.length in deps means loadDataset is recreated after
  //      every successful fetch, which re-triggers useEffect in Visualizations,
  //      causing an infinite refetch loop.
  //
  // Fix: use a ref for the "already loaded" guard so we never need dataset
  // in the deps array. Use the id argument (always passed by callers) instead
  // of the uploadId closure value so we never need uploadId in deps either.
  // Both guards use refs, making the callback stable for its entire lifetime.

  const loadDataset = useCallback(async (id) => {
    console.log("[DataContext] loadDataset called — id:", id, "| loadedForId:", datasetLoadedForId.current, "| fetching:", fetchingDataset.current);
    if (!id)                               { console.log("[DataContext] loadDataset SKIP — no id"); return; }
    if (datasetLoadedForId.current === id) { console.log("[DataContext] loadDataset SKIP — already loaded for", id); return; }
    if (fetchingDataset.current)           { console.log("[DataContext] loadDataset SKIP — in-flight"); return; }

    fetchingDataset.current = true;
    setDatasetLoading(true);
    setDatasetError(null);

    try {
      console.log("[DataContext] loadDataset FETCHING /dataset — id:", id);
      const data = await apiFetch("/dataset", { upload_id: id });
      console.log("[DataContext] loadDataset /dataset response — rows:", data.dataset?.length);
      setDataset(data.dataset ?? []);
      datasetLoadedForId.current = id;
    } catch (err) {
      console.error("[DataContext] loadDataset ERROR:", err.message);
      setDatasetError(err.message ?? "Failed to load dataset.");
    } finally {
      setDatasetLoading(false);
      fetchingDataset.current = false;
    }
  }, []);

  // ── Reset everything (new upload) ────────────────────────────────────────
  const reset = useCallback(() => {
    setUploadId(null);
    setStats({ rows: 0, columns: 0, missing_values: 0, duplicates: 0 });
    setPreview([]);
    setColumnNames([]);
    setNumericColumns([]);
    setCorrelationMatrix({});
    setRecommendedTask(null);
    setDataset([]);
    setDatasetError(null);
    setUploadError(null);
    fetchingDataset.current = false;
    datasetLoadedForId.current = null; // allow fresh load after reset
  }, []);

  const value = {
    // State
    uploadId,
    stats,
    preview,
    columnNames,
    numericColumns,
    correlationMatrix,
    recommendedTask,
    dataset,
    datasetLoading,
    datasetError,
    uploading,
    uploadError,
    // Actions
    uploadFile,
    loadDataset,
    reset,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
