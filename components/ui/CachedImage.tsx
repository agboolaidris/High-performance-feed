import React, { useState, useEffect } from "react";
import { ImageProps, Image } from "react-native";
import * as FileSystem from "expo-file-system";

export const CachedImage = ({ source, ...props }: ImageProps) => {
  const [cachedSource, setCachedSource] = useState(source);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const cacheImage = async () => {
      // Only cache remote images with URI (not arrays or local requires)
      if (
        !source ||
        Array.isArray(source) ||
        typeof source === "number" ||
        !source.uri
      ) {
        return;
      }

      try {
        // Create a unique filename using the entire URL hash
        const createUniqueFilename = (url: string): string => {
          // Simple hash function to create unique filename from URL
          let hash = 0;
          for (let i = 0; i < url.length; i++) {
            const char = url.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
          }
          const extension = url.split(".").pop() || "jpg";
          return `image-${Math.abs(hash)}.${extension}`;
        };

        const uniqueFilename = createUniqueFilename(source.uri);
        const localPath = `${FileSystem.cacheDirectory}${uniqueFilename}`;

        // Check if image already exists in cache
        const fileInfo = await FileSystem.getInfoAsync(localPath);

        if (fileInfo.exists && isMounted) {
          setCachedSource({ uri: localPath });
          return;
        }

        // Download and cache the image
        const { uri } = await FileSystem.downloadAsync(source.uri, localPath);

        if (isMounted) {
          setCachedSource({ uri });
        }
      } catch (error) {
        console.error("Error caching image:", error);
        if (isMounted) {
          setError(true);
          // Fallback to original source on error
          setCachedSource(source);
        }
      }
    };

    cacheImage();

    return () => {
      isMounted = false;
    };
  }, [source]);

  return (
    <Image source={cachedSource} onError={() => setError(true)} {...props} />
  );
};

CachedImage.displayName = "CachedImage";
