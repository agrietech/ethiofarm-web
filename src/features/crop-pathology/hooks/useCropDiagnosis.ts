/**
 * @file useCropDiagnosis.ts
 * @owner Zinegnaw
 * @feature Crop AI & Plant Pathology
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { cropPathologyService } from '../services/crop-pathology.service';
import type { DiagnoseRequestPayload, DiagnosisRecord } from '../types/crop-pathology.types';

export interface UseCropDiagnosisResult {
  analyzing: boolean;
  currentResult: DiagnosisRecord | null;
  error: string | null;
  scanLeaf: (payload: DiagnoseRequestPayload) => Promise<DiagnosisRecord | null>;
  clearResult: () => void;
}

function toErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.code === 'ECONNABORTED') return 'The AI scan timed out. Please try again.';
    if (!err.response) return 'Network error. Check your connection and try again.';
    const message = (err.response.data as { message?: string } | undefined)?.message;
    return message ?? `Diagnosis failed (HTTP ${err.response.status}).`;
  }
  return err instanceof Error ? err.message : 'Unexpected error during diagnosis.';
}

export function useCropDiagnosis(): UseCropDiagnosisResult {
  const [analyzing, setAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<DiagnosisRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ignores responses from superseded scans or after unmount.
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const scanLeaf = useCallback(async (payload: DiagnoseRequestPayload) => {
    const requestId = ++requestIdRef.current;
    setAnalyzing(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await cropPathologyService.scanLeaf(payload);
      if (!mountedRef.current || requestId !== requestIdRef.current) return null;
      setCurrentResult(result);
      return result;
    } catch (err) {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setError(toErrorMessage(err));
      }
      return null;
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setAnalyzing(false);
      }
    }
  }, []);

  const clearResult = useCallback(() => {
    requestIdRef.current++;
    setAnalyzing(false);
    setCurrentResult(null);
    setError(null);
  }, []);

  return { analyzing, currentResult, error, scanLeaf, clearResult };
}
