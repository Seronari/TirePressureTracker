import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface GoogleMapProps {
  address: string;
  height?: string;
  zoom?: number;
  className?: string;
}

export function GoogleMap({ address, height = '300px', zoom = 15, className = '' }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Load the Google Maps script dynamically
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = initializeMap;
      
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;
      
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const map = new window.google.maps.Map(mapRef.current!, {
            center: results[0].geometry.location,
            zoom
          });
          
          new window.google.maps.Marker({
            map,
            position: results[0].geometry.location,
            title: 'TPMSPro'
          });
        } else {
          console.error('Geocode was not successful for the following reason:', status);
          
          // Fallback to a default location (Almaty)
          if (mapRef.current) {
            const defaultLocation = { lat: 43.238949, lng: 76.889709 };
            const map = new window.google.maps.Map(mapRef.current, {
              center: defaultLocation,
              zoom
            });
            
            new window.google.maps.Marker({
              map,
              position: defaultLocation,
              title: 'TPMSPro'
            });
          }
        }
      });
    };

    loadGoogleMapsScript();

    return () => {
      // Cleanup if needed
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, [address, zoom]);

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <div ref={mapRef} className="absolute inset-0"></div>
      <div className="absolute inset-0 flex items-center justify-center bg-light-gray bg-opacity-40 z-10 map-loading">
        <p className="text-mid-gray font-medium">{t('map.loading')}</p>
      </div>
    </div>
  );
}

// Add this to window type
declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}
