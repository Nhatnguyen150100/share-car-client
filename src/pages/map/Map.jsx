import React, { Component } from 'react';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';

const MapConfig = {
  key: "AIzaSyDCXRPTsCGFIFnVQ-iIGs94mdoD-UN2Kfc"
}

const mapContainerStyle = {
  height: "400px",
  width: "800px"
};

const center = {
  lat: 0,
  lng: -180
};

const onLoad = polyline => {
  console.log('polyline: ', polyline)
};

const path = [
  {lat: 37.772, lng: -122.214},
  {lat: 21.291, lng: -157.821},
  {lat: -18.142, lng: 178.431},
  {lat: -27.467, lng: 153.027}
];

const options = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  paths: [
    {lat: 37.772, lng: -122.214},
    {lat: 21.291, lng: -157.821},
    {lat: -18.142, lng: 178.431},
    {lat: -27.467, lng: 153.027}
  ],
  zIndex: 1
};

export default function Map(){
  return <LoadScript googleMapsApiKey={MapConfig.key}>
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
    >
      <Polyline 
        onLoad={onLoad}
        path={path}
        options={options}
      />
    </GoogleMap>
  </LoadScript>
}