/**
 * @file CameraViewfinder.tsx
 * @owner Zinegnaw
 * @feature Crop AI & Plant Pathology
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ChangeEvent, DragEvent } from 'react';
import { Camera, ImagePlus, RefreshCw, X, Aperture } from 'lucide-react';

export interface CameraViewfinderProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  maxSizeMb?: number;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const styles: Record<string, CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' },
  frame: {
    position: 'relative',
    width: '100%',
    aspectRatio: '4 / 3',
    borderRadius: 12,
    overflow: 'hidden',
    background: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropZone: {
    width: '100%',
    aspectRatio: '4 / 3',
    borderRadius: 12,
    border: '2px dashed #94a3b8',
    background: '#f8fbf8',
    color: '#334155',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
  },
  dropZoneActive: { borderColor: '#2e7d32', background: '#e8f5e9' },
  media: { width: '100%', height: '100%', objectFit: 'contain' },
  actions: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.55rem 1rem',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#1e293b',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  primaryButton: { background: '#2e7d32', borderColor: '#2e7d32', color: '#ffffff' },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: '0.35rem',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(15, 23, 42, 0.7)',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
  },
  error: { color: '#d32f2f', fontSize: '0.85rem', margin: 0 },
  hint: { color: '#64748b', fontSize: '0.8rem', margin: 0 },
};

export function CameraViewfinder({ file, onFileChange, disabled = false, maxSizeMb = 10 }: CameraViewfinderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);

  const stopCamera = useCallback(() => setStream(null), []);

  const acceptFile = useCallback(
    (candidate: File | undefined) => {
      if (!candidate) return;
      if (!ACCEPTED_TYPES.includes(candidate.type)) {
        setError('Please choose a JPEG, PNG or WebP image.');
        return;
      }
      if (candidate.size > maxSizeMb * 1024 * 1024) {
        setError(`Image is larger than ${maxSizeMb} MB.`);
        return;
      }
      setError(null);
      onFileChange(candidate);
    },
    [maxSizeMb, onFileChange],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setDragActive(true);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (!disabled) acceptFile(event.dataTransfer.files?.[0]);
  };

  const startCamera = async () => {
    setError(null);
    // Without getUserMedia (e.g. non-HTTPS), fall back to the device's native capture picker.
    if (!navigator.mediaDevices?.getUserMedia) {
      captureInputRef.current?.click();
      return;
    }
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      setStream(media);
    } catch {
      setError('Camera access was denied or is unavailable. You can upload a photo instead.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Could not capture the photo. Please try again.');
          return;
        }
        acceptFile(new File([blob], `leaf-${Date.now()}.jpg`, { type: 'image/jpeg' }));
        stopCamera();
      },
      'image/jpeg',
      0.9,
    );
  };

  const clearFile = () => {
    setError(null);
    onFileChange(null);
  };

  const buttonStyle = (primary = false): CSSProperties => ({
    ...styles.button,
    ...(primary ? styles.primaryButton : {}),
    ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
  });

  return (
    <div style={styles.root}>
      {stream ? (
        <div style={styles.frame}>
          <video ref={videoRef} autoPlay playsInline muted style={styles.media} aria-label="Live camera preview" />
        </div>
      ) : previewUrl ? (
        <div style={styles.frame}>
          <img src={previewUrl} alt="Selected leaf" style={styles.media} />
          {!disabled && (
            <button type="button" style={styles.removeButton} onClick={clearFile} aria-label="Remove photo">
              <X size={18} />
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          style={{ ...styles.dropZone, ...(dragActive ? styles.dropZoneActive : {}) }}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <ImagePlus size={40} color="#2e7d32" />
          <strong>Drag &amp; drop a leaf photo here</strong>
          <span style={styles.hint}>or click to browse — JPEG, PNG or WebP up to {maxSizeMb} MB</span>
        </div>
      )}

      <div style={styles.actions}>
        {stream ? (
          <>
            <button type="button" style={buttonStyle(true)} onClick={capturePhoto} disabled={disabled}>
              <Aperture size={18} /> Capture
            </button>
            <button type="button" style={buttonStyle()} onClick={stopCamera}>
              <X size={18} /> Cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" style={buttonStyle()} onClick={() => fileInputRef.current?.click()} disabled={disabled}>
              {file ? <RefreshCw size={18} /> : <ImagePlus size={18} />} {file ? 'Choose another' : 'Upload photo'}
            </button>
            <button type="button" style={buttonStyle()} onClick={startCamera} disabled={disabled}>
              <Camera size={18} /> Use camera
            </button>
          </>
        )}
      </div>

      {error && (
        <p role="alert" style={styles.error}>
          {error}
        </p>
      )}

      <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(',')} hidden onChange={handleInputChange} />
      <input ref={captureInputRef} type="file" accept="image/*" capture="environment" hidden onChange={handleInputChange} />
    </div>
  );
}

export default CameraViewfinder;
