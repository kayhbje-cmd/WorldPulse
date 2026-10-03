// src/components/MapComponent.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Problem } from '../types';
import { PROBLEM_CATEGORIES } from '../constants/categories';

interface Props {
  problems: Problem[];
  center?: [number, number];
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
  onSelectProblem?: (problem: Problem) => void;
  selectedProblemId?: string;
  allowPinDrop?: boolean;
  onPinDropped?: (lat: number, lng: number) => void;
  className?: string;
}

export const MapComponent: React.FC<Props> = ({
  problems,
  center = [19.076, 72.8777], // Default to Mumbai / Pune area
  zoom = 12,
  userLocation,
  onSelectProblem,
  selectedProblemId,
  allowPinDrop = false,
  onPinDropped,
  className = 'h-full min-h-[380px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const droppedMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle Pin Drop if enabled
      if (allowPinDrop) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          if (droppedMarkerRef.current) {
            droppedMarkerRef.current.setLatLng([lat, lng]);
          } else {
            const dropIcon = L.divIcon({
              className: 'custom-drop-pin',
              html: `
                <div style="background-color: #16A34A; color: white; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">
                  <span style="transform: rotate(45deg); font-size: 16px;">📍</span>
                </div>
              `,
              iconSize: [34, 34],
              iconAnchor: [17, 34],
            });
            droppedMarkerRef.current = L.marker([lat, lng], { icon: dropIcon }).addTo(map);
          }
          if (onPinDropped) {
            onPinDropped(lat, lng);
          }
        });
      }
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [center[0], center[1], zoom]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. User Location Beacon Marker
    if (userLocation) {
      const userBeaconIcon = L.divIcon({
        className: 'user-beacon',
        html: `
          <div style="position: relative; width: 22px; height: 22px;">
            <div style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: #3B82F6; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; top: 4px; left: 4px; width: 14px; height: 14px; border-radius: 50%; background: #2563EB; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userBeaconIcon })
        .bindPopup('<b style="font-size:12px;">📍 Your Current Location</b>')
        .addTo(markersLayer);
    }

    // 2. Problem Markers
    problems.forEach((problem) => {
      const categoryObj = PROBLEM_CATEGORIES.find((c) => c.id === problem.category);
      const color = categoryObj?.color || '#EF4444';
      const emoji = categoryObj?.emoji || '⚠️';
      const isSelected = selectedProblemId === problem.id;

      const hasHype = (problem.hype_score && problem.hype_score >= 10);
      const markerHtml = `
        <div style="position: relative;">
          <div style="
            background-color: ${color}; 
            color: white; 
            width: ${isSelected ? '38px' : '32px'}; 
            height: ${isSelected ? '38px' : '32px'}; 
            border-radius: 50% 50% 50% 0; 
            transform: rotate(-45deg); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.35); 
            border: 2px solid white;
            transition: transform 0.2s;
          ">
            <span style="transform: rotate(45deg); font-size: ${isSelected ? '16px' : '14px'};">${emoji}</span>
          </div>
          ${hasHype ? `
            <div style="
              position: absolute;
              top: -6px;
              right: -6px;
              background: linear-gradient(135deg, #f97316, #dc2626);
              color: white;
              font-size: 9px;
              font-weight: 800;
              padding: 0 4px;
              border-radius: 999px;
              border: 1.5px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              gap: 1px;
            ">🔥${problem.hype_score}</div>
          ` : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        className: `custom-marker-${problem.id}`,
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([problem.latitude, problem.longitude], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.style.width = '210px';
      popupContent.style.fontFamily = 'system-ui, sans-serif';
      popupContent.innerHTML = `
        <div style="overflow: hidden; border-radius: 10px;">
          ${
            problem.images?.[0]
              ? `<img src="${problem.images[0]}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px 8px 0 0; margin-bottom: 6px;" />`
              : ''
          }
          <div style="padding: 2px 4px 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
              <span style="font-size: 11px; font-weight: bold; background: ${color}20; color: ${color}; padding: 2px 6px; border-radius: 12px;">
                ${emoji} ${categoryObj?.name || problem.category}
              </span>
              <span style="font-size: 10px; font-weight: 800; background: #FFF7ED; color: #C2410C; border: 1px solid #FDBA74; padding: 1px 5px; border-radius: 10px;">
                🔥 Hype ${problem.hype_score || 1}
              </span>
            </div>
            <h4 style="margin: 0 0 4px; font-size: 12px; font-weight: bold; line-height: 1.3; color: #111827;">
              ${problem.title}
            </h4>
            <p style="margin: 0 0 8px; font-size: 10px; color: #6B7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              📍 ${problem.address}
            </p>
            <button id="view-details-${problem.id}" style="
              width: 100%; 
              background: #16A34A; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              padding: 6px 10px; 
              font-size: 11px; 
              font-weight: 600; 
              cursor: pointer;
            ">
              View Dossier & Track →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-details-${problem.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectProblem) onSelectProblem(problem);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectProblem) onSelectProblem(problem);
      });

      marker.addTo(markersLayer);
    });
  }, [problems, selectedProblemId, userLocation]);

  return (
    <div className={`relative w-full ${className} rounded-2xl overflow-hidden shadow-xs border border-gray-200/80`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
