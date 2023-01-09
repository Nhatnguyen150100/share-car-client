import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CURRENT_MONEY, forMatMoneyVND, getDay, publicKey } from '../../common/Commom';
import { TextFieldEditable,SelectFieldInput } from '../../common/FieldInput';
import ButtonComponent from '../../component/ButtonComponent';
import { callToServerWithTokenAndUserObject, getDirections, getLocationOnReverseGeocoding } from '../../services/getAPI';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = publicKey;

export default function TripRegister(props){
  const driver = useSelector(state=>state.driver.data);
  const user = useSelector(state=>state.user.data);
  const mapContainerSelect = useRef(null);
  const mapSelect = useRef(null);

  const [carId,setCarId] = useState(driver[0].id);
  const [cost,setCost] = useState();
  const [time,setTime] = useState();
  const [date,setDate] = useState();
  const [loading,setLoading] = useState(false);
  const [startPosition,setStartPosition] = useState('No data');
  const [endPosition,setEndPosition] = useState('No data');
  const [latStartPosition,setLatStartPosition] = useState();
  const [lngStartPosition,setLngStartPosition] = useState();
  const [latEndPosition,setLatEndPosition] = useState();
  const [lngEndPosition,setLngEndPosition] = useState();
  const [distance,setDistance] = useState();
  const mapboxDirectionsControl = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    profile: 'mapbox/driving',
    controls:{
      instructions : false,
    }
  });

  const getCoordinates = () =>{
    setLngStartPosition(mapboxDirectionsControl.getOrigin().geometry.coordinates[0])
    setLatStartPosition(mapboxDirectionsControl.getOrigin().geometry.coordinates[1]);
    setLngEndPosition(mapboxDirectionsControl.getDestination().geometry.coordinates[0]);
    setLatEndPosition(mapboxDirectionsControl.getDestination().geometry.coordinates[1]);
    getLocationOnReverseGeocoding(mapboxDirectionsControl.getOrigin().geometry.coordinates[0],mapboxDirectionsControl.getOrigin().geometry.coordinates[1]).then(
      data => setStartPosition(data.features[0].place_name)
    ).catch(error => toast.error(error));
    getLocationOnReverseGeocoding(mapboxDirectionsControl.getDestination().geometry.coordinates[0],mapboxDirectionsControl.getDestination().geometry.coordinates[1]).then(
      data => setEndPosition(data.features[0].place_name)
    ).catch(error => toast.error(error));
    getDirections(mapboxDirectionsControl.getOrigin().geometry.coordinates[0],mapboxDirectionsControl.getOrigin().geometry.coordinates[1],mapboxDirectionsControl.getDestination().geometry.coordinates[0],mapboxDirectionsControl.getDestination().geometry.coordinates[1]).then(data=>
      setDistance((data.routes[0].distance/1000).toFixed(2))
    )
  }

  useEffect(() => {
    if(distance) setCost(distance*CURRENT_MONEY);
  }, [distance]);

  useEffect(()=>{
    if (mapSelect.current) return; // initialize mapSelect only once
    mapSelect.current = new mapboxgl.Map({
      container: mapContainerSelect.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [105.84438,21.042774],
      zoom: 12,
      cooperativeGestures: true
    });
    // new mapboxgl.Marker({
    //   color: "#FFFFFF",
    //   draggable: true
    // }).setLngLat([105.84438, 21.042774]).addTo(mapSelect.current);

    mapSelect.current.addControl(
      mapboxDirectionsControl,
      'top-left'
    );
    // mapSelect.current.addControl(
    //   new MapboxGeocoder({
    //     accessToken: mapboxgl.accessToken,
    //     mapboxgl: mapboxgl
    //   }),
    //   'top-right'
    // );
    mapSelect.current.addControl(new mapboxgl.FullscreenControl());
    mapSelect.current.addControl(
      new mapboxgl.NavigationControl()
    );
    mapSelect.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the mapSelect will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      })
      );
  },[])

  const createTrip = () =>{
    if(!cost) toast.error("Cost is required");
    else if(!time) toast.error("time start is required");
    else if(!date) toast.error("date start is required");
    else if(!startPosition.localeCompare('No data')) toast.error("start position start is required");
    else if(!endPosition.localeCompare('No data')) toast.error("end position is required");
    else{
      if(confirm("Are you sure you want create this trip?")){
        // let timeToserver = getDay(date)+' '+ time;
        let timeToserver = date +' '+ time;
        setLoading(true);
        callToServerWithTokenAndUserObject("post",'/v1/trip/register-trip',
        {
          id: user.id
        },
        {
          cost:cost,
          startAt: timeToserver,
          carId: carId,
          startPosition: startPosition,
          endPosition: endPosition,
          latStartPosition: latStartPosition,
          lngStartPosition: lngStartPosition,
          latEndPosition: latEndPosition,
          lngEndPosition: lngEndPosition,
        },user.accessToken)
        .then((result) => {
          toast.success(result.message);
        })
        .catch((result) => toast.error(result.message)).finally(() => setLoading(false));
      }
    }
  }

  return <div className='d-flex flex-column mb-5 justify-content-center align-items-center w-100'>
    <div style={{width:"900px"}}>
      <h3 className='mt-3 sc-color fw-bold'>Create new Trip</h3>
      <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
        <span className='sc-heading text-uppercase' style={{width:"250px"}}>Car of trip:</span>
        <SelectFieldInput width="100%" value={carId} onChange={carId=>setCarId(carId)} required={true}>
          {
            driver.map(car=><option key={car.id} value={car.id}>{car.carName}</option>)
          }
        </SelectFieldInput>
      </div> 
      <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
        <span className='sc-heading text-uppercase' style={{width:"250px"}}>Time start:</span>
        <TextFieldEditable fontSize={props.FONT_SIZE} width="100%" type='time' value={time} save={value=>setTime(value)} required={true}/>
      </div>
      <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
        <span className='sc-heading text-uppercase' style={{width:"250px"}}>Date start:</span>
        <TextFieldEditable fontSize={props.FONT_SIZE} width="100%" type='date' value={date} save={value=>setDate(value)} required={true}/>
      </div>
      <div ref={mapContainerSelect} className="map-container" style={{height:"500px", width:"100%"}}/>
      <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
        <span className='sc-heading text-uppercase me-3' style={{width:"150px"}}>Start position:</span>
        <span>{startPosition}</span>
        <span className='sc-heading text-uppercase mx-3' style={{width:"130px"}}>End position:</span>
        <span>{endPosition}</span>
        <button type="button" className="btn btn-primary ms-3" onClick={getCoordinates}>
          Select position
        </button>
      </div>
      <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
        <span className='sc-heading text-uppercase' style={{width:"100px"}}>distance:</span>
        <span className='mx-4'>{distance ? (distance + ' km') : '---'} </span>
        <span className='sc-heading text-uppercase' style={{width:"50px"}}>Cost:</span>
        <span className='ms-4'>{cost ? forMatMoneyVND(cost) : '---' }</span>
        <span className='text-info ms-3'>{cost ? `(${forMatMoneyVND(CURRENT_MONEY)}/1km)` : '' }</span>
      </div> 
      <div className='mt-4 d-flex justify-content-center'>
        {loading ? <div className="spinner-grow"></div> : <ButtonComponent btnType="btn-success" label="create trip" onClick={createTrip}/>}
      </div>
    </div>
  </div>
}