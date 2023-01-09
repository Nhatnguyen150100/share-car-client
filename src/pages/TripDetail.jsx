import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAgeFromBirthDay, getDay, getTime, publicKey } from '../common/Commom';
import { TextFieldEditable } from '../common/FieldInput';
import NavBarComponent from '../component/NavBarComponent';
import mapboxgl from 'mapbox-gl';
import { useRef } from 'react';

mapboxgl.accessToken = publicKey;

export default function TripDetail(props){
  const trip = useSelector(state => state.trip.data);
  const tripDetail = useSelector(state => state.trip.downLocationData);
  const [selectedTab,setSelectedTab] = useState(0);

  const mapContainerViewInfo = useRef(null);
  const mapViewInfo = useRef(null);
  const mapboxDirections = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    profile: 'mapbox/driving',
    controls:{
      inputs: false,
      instructions : false,
    },
    zoom:8,
    interactive: false
  });

  useEffect(()=>{
    if(tripDetail.downLocation) {
      console.log('okee');
      new mapboxgl.Marker({}).setLngLat([tripDetail.lngDownLocation,tripDetail.latDownLocation]).addTo(mapViewInfo.current);
    }
  },[tripDetail.downLocation])
 
  useEffect(()=>{
    if (mapViewInfo.current) return;
      mapViewInfo.current = new mapboxgl.Map({
        container: mapContainerViewInfo.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [105.84438,21.042774],
        zoom: 12,
        cooperativeGestures: true
      });

      mapViewInfo.current.addControl(
        mapboxDirections,
        'bottom-left'
      );
      mapViewInfo.current.addControl(
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl
        }),
        'top-left'
      );
      mapViewInfo.current.addControl(new mapboxgl.FullscreenControl());
      mapViewInfo.current.addControl(
        new mapboxgl.NavigationControl()
      );
      mapViewInfo.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          // When active the mapViewInfo will receive updates to the device's location as it changes.
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: true
        })
      );
    
  },[])

  useEffect(()=>{
    mapboxDirections.setOrigin([trip.lngStartPosition,trip.latStartPosition]);
    mapboxDirections.setDestination([trip.lngEndPosition,trip.latEndPosition]);
  },[])
  
  let currentTab=null

  switch(selectedTab){
    case 0: currentTab = <div className='d-flex flex-column w-100'>
            <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>full name driver:</span>
                <span style={{fontSize:"15px"}}>{trip.driverInfo.fullName?trip.driverInfo.fullName:"No data"}</span>
            </div> 
            <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>email driver:</span>
                <span style={{fontSize:"15px"}}>{trip.driverInfo.email?trip.driverInfo.email:'No data'}</span>
            </div> 
            <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>age driver:</span>
                <span style={{fontSize:"15px"}}>{getAgeFromBirthDay(trip.driverInfo.age)?getAgeFromBirthDay(trip.driverInfo.age):'No data'}</span>
            </div> 
            <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>email driver:</span>
                <span style={{fontSize:"15px"}}>{trip.driverInfo.email?trip.driverInfo.email:'No data'}</span>
            </div>
            <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>phone Number driver:</span>
                <span style={{fontSize:"15px"}}>{trip.driverInfo.phoneNUmber?trip.driverInfo.phoneNUmber:'No data'}</span>
            </div> 
            <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>address driver:</span>
                <span style={{fontSize:"15px"}}>{trip.driverInfo.email?trip.driverInfo.email:'No data'}</span>
            </div>  
            <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>cardId:</span>
                <span style={{fontSize:"15px"}}>{trip.driverInfo.cardId?trip.driverInfo.cardId:'No data'}</span>
            </div> 
            <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>bankId:</span>
                <span style={{fontSize:"15px"}}>{trip.driverInfo.bankId?trip.driverInfo.bankId:'No data'}</span>
            </div> 
        </div>
      break;
    case 1: currentTab = <div className='d-flex flex-column w-100'>
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>car name:</span>
              <span style={{fontSize:"15px"}}>{trip.carInfo.carName?trip.carInfo.carName:'No data'}</span>
          </div> 
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>max user:</span>
              <span style={{fontSize:"15px"}}>{trip.carInfo.maxUser?trip.carInfo.maxUser:'No data'}</span>
          </div> 
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>time start:</span>
              <span style={{fontSize:"15px"}}>{getTime(trip.startAt) + ' ~ ' + getDay(trip.startAt)}</span>
          </div> 
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>start position:</span>
              <span style={{fontSize:"15px"}}>{trip.startPosition}</span>
          </div>
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>end position:</span>
              <span style={{fontSize:"15px"}}>{trip.endPosition}</span>
          </div>
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{borderBottom:"double",paddingBottom:"2px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>user position:</span>
              <span style={{fontSize:"15px"}}>{tripDetail.downLocation}</span>
          </div>
      </div>
      break;
  }

  return <div className="container-fluid p-0 h-100">
    <NavBarComponent />
    <div className='container h-100'>
      <h2 className='text-center fw-bold my-2 sc-color' style={{fontSize:"2em"}}>Information of the trip</h2>
      <ul className="nav nav-tabs justify-content-center fw-bold">
        <li className="nav-item"><a className={`text-uppercase d-flex align-items-center justify-content-center nav-link ${(selectedTab==0)?"vc-blue active":"text-secondary nav-link-non-active"}`} style={{cursor:"pointer"}} onClick={e=>setSelectedTab(0)}>
            <span className="material-symbols-outlined me-1">manage_accounts</span>
            <span className="d-none d-lg-block" style={{fontSize:"13px"}}>Driver Infomation</span>
        </a></li>
        <li className="nav-item"><a className={`text-uppercase d-flex align-items-center justify-content-center nav-link ${(selectedTab==1)?"vc-blue active":"text-secondary nav-link-non-active"}`} style={{cursor:"pointer"}} onClick={e=>setSelectedTab(1)}>
            <span className="material-symbols-outlined me-1">pacemaker</span>
            <span className="d-none d-lg-block" style={{fontSize:"13px"}}>Trip Infomation</span>
        </a></li>
      </ul>
      {currentTab}
      <div ref={mapContainerViewInfo} className="map-container" style={{height:"600px", width:"100%"}}/>
    </div>
  </div>
}