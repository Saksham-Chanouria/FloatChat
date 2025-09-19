import React, { useRef, useState, useEffect } from "react";
import { Viewer } from "resium";
import { Ion, IonImageryProvider } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const CesiumGlobe2 = () => {
  const creditContainerRef = useRef(null);
  const [imageryProvider, setImageryProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Different imagery asset IDs to test quality
  const imageryAssets = {
    default: 3, // Default Bing Maps Aerial
    sentinel2: 3954, // Sentinel-2 Cloudless (10m resolution)
    bingAerial: 2, // Bing Maps Aerial with Labels
    bingAerialNoLabels: 3812, // Bing Maps Aerial without Labels
    naturalEarthII: 4 // Natural Earth II
  };
  
  // Change this to test different imagery
  const selectedAsset = imageryAssets.sentinel2; // Try sentinel2, bingAerialNoLabels, or default

  useEffect(() => {
    const initializeImagery = async () => {
      try {
        if (process.env.REACT_APP_CESIUM_ION_TOKEN) {
          Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ION_TOKEN;
        }
        
        const provider = await IonImageryProvider.fromAssetId(selectedAsset);
        setImageryProvider(provider);
      } catch (error) {
        console.error("Failed to load imagery:", error);
        // Fallback to default if selected asset fails
        try {
          const fallbackProvider = await IonImageryProvider.fromAssetId(3);
          setImageryProvider(fallbackProvider);
        } catch (fallbackError) {
          console.error("Fallback imagery also failed:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeImagery();
  }, [selectedAsset]);

  if (isLoading) {
    return (
      <div style={{ 
        width: "100%", 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#1e1e1e",
        color: "white"
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }} id="cesium-container">
      <div ref={creditContainerRef} style={{ display: "none" }} />
      
      <Viewer
        id="cesium-viewer"
        full
        animation={false}
        timeline={false}
        baseLayerPicker={true}
        geocoder={true}
        homeButton={false}
        sceneModePicker={false}
        navigationHelpButton={false}
        imageryProvider={imageryProvider}
        creditContainer={creditContainerRef.current}
        scene3DOnly={true}
        skyAtmosphere={false}
        contextOptions={{
          webgl: {
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
          }
        }}
      />

      <style jsx>{`
        // .cesium-widget-credits,
        // .cesium-credit-lightbox,
        // .cesium-credit-expand-link {
        //   display: none !important;
        // }
        
        /* Target base layer picker using the container ID */
        // #cesium-container .cesium-toolbar-button:first-child,
        // #cesium-viewer .cesium-toolbar-button:first-child,
        // #cesium-container .cesium-baseLayerPicker-button,
        // #cesium-viewer .cesium-baseLayerPicker-button {
        //   display: none !important;
        // }
        
        // #cesium-container .cesium-baseLayerPicker-dropDown,
        // #cesium-viewer .cesium-baseLayerPicker-dropDown {
        //   display: none !important;
        // }
      `}</style>
    </div>
  );
};

export default CesiumGlobe2;