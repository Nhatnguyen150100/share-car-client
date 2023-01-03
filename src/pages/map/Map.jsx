import React, { Component } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const MapConfig = {
  key: "AIzaSyDCXRPTsCGFIFnVQ-iIGs94mdoD-UN2Kfc"
}

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

export default function Map(){
  return <LoadScript googleMapsApiKey={MapConfig.key}>
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
    >
    </GoogleMap>
  </LoadScript>
}