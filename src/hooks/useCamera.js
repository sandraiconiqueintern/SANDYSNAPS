import { useRef, useState, useCallback } from "react";

export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState("user");

  const startCamera = useCallback(async (facing = "user") => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setHasPermission(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const flipCamera = useCallback(() => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    startCamera(next);
  }, [facingMode, startCamera]);

  const capturePhoto = useCallback((filterClass = "") => {
    if (!videoRef.current) return null;
    const video = videoRef.current;

   
    const displayW = video.clientWidth;
    const displayH = video.clientHeight;

    const streamW = video.videoWidth;
    const streamH = video.videoHeight;

    const canvas = document.createElement("canvas");
    canvas.width = displayW;
    canvas.height = displayH;
    const ctx = canvas.getContext("2d");

    const scale = Math.max(displayW / streamW, displayH / streamH);
    const scaledW = streamW * scale;
    const scaledH = streamH * scale;
    const offsetX = (displayW - scaledW) / 2;
    const offsetY = (displayH - scaledH) / 2;

    const filterMap = {
      "filter-warm": "sepia(0.4) saturate(1.3) brightness(1.05)",
      "filter-cool": "hue-rotate(20deg) saturate(0.9) brightness(1.05)",
      "filter-bw": "grayscale(1) contrast(1.1)",
      "filter-vintage": "sepia(0.6) contrast(1.1) brightness(0.9) saturate(0.8)",
      "filter-fade": "brightness(1.1) saturate(0.7) contrast(0.9)",
      "filter-vivid": "saturate(1.8) contrast(1.1)",
    };
    if (filterMap[filterClass]) ctx.filter = filterMap[filterClass];
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, offsetX, offsetY, scaledW, scaledH);

    return canvas.toDataURL("image/png");
  }, [facingMode]);

  return { videoRef, hasPermission, error, facingMode, startCamera, stopCamera, flipCamera, capturePhoto };
}