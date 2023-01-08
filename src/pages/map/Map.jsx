import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { publicKey } from '../../common/Commom';

// const testKey = 'sk.eyJ1Ijoibmt0b2FuMTkwNSIsImEiOiJjbGNsbXJ6Z2kxNXViM3dwNjN5ajdwc3l3In0.mQBjaJ11sn-JD9m67ReU-Q';
// const publicKey = 'pk.eyJ1Ijoibmt0b2FuMTkwNSIsImEiOiJjbGNnYjRwdWQwN25jM3FrYjR2cW0wdjBnIn0.Gmum4cSi-U6skWPEq4eQaA';

mapboxgl.accessToken = publicKey;

export default function Map(){
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lngCenter, setLngCenter] = useState(105.84438);
  const [latCenter, setLatCenter] = useState(21.042774);
  const [zoom, setZoom] = useState(12);
  const [startPosition, setStartPosition] = useState();
  const [endPosition, setEndPosition] = useState();
  const mapboxDirections = new MapboxDirections({
    accessToken: mapboxgl.accessToken
  })
  // mapboxDirections.setOrigin(startPosition);
  // mapboxDirections.setDestination(endPosition);

  const getOrigin = () => {
    return 
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lngCenter,latCenter],
      zoom: zoom
    });
    // new mapboxgl.Marker({
    //   color: "#FFFFFF",
    //   draggable: true
    // }).setLngLat([105.84438, 21.042774]).addTo(map.current);

    map.current.addControl(
      mapboxDirections,
      'top-left'
    );
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      }),
      'top-right'
    );
    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(
      new mapboxgl.NavigationControl()
    );
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      })
      );
  },[]);

  return <div ref={mapContainer} className="map-container" style={{height:"500px", width:"770px"}}/>
}