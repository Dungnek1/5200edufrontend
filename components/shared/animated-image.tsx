"use client";

import { useState, useEffect } from "react";

interface AnimatedImageProps {
  videoSrc: string;
  imageSrc: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export function AnimatedImage({
  videoSrc,
  imageSrc,
  alt,
  className = "",
  width,
  height,
  fallbackSrc = "/images/placeholder.svg",
  autoPlay = true,
  loop = true,
  muted = true,
}: AnimatedImageProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);

  const isGif = videoSrc.toLowerCase().endsWith('.gif');

  useEffect(() => {
    setVideoFailed(false);
    setCurrentImageSrc(imageSrc);
  }, [videoSrc, imageSrc]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setVideoFailed(true);
  };

  const handleImageError = () => {
    if (currentImageSrc !== fallbackSrc) {
      setCurrentImageSrc(fallbackSrc);
    }
  };

  if (isGif) {
    return (
      <img
        src={videoSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        onError={handleImageError}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
      />
    );
  }

  if (videoFailed) {
    return (
      <img
        src={currentImageSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        onError={handleImageError}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    );
  }

  return (
    <video
      src={videoSrc}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      preload="auto"
      controls={false}
      className={className}
      width={width}
      height={height}
      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
      onError={handleVideoError}
      onCanPlay={() => {
        const video = document.querySelector(`video[src="${videoSrc}"]`) as HTMLVideoElement;
        if (video) {
          video.play().catch(e => {/* Autoplay failed */ });
        }
      }}
    />
  );
}
