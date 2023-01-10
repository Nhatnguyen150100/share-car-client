import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CURRENT_MONEY, forMatMoneyVND, getAgeFromBirthDay, getDay, getTime, publicKey } from '../common/Commom.jsx';
import { SelectFieldInput, TextFieldEditable } from '../common/FieldInput.jsx';
import ButtonComponent from '../component/ButtonComponent.jsx';
import NavBarComponent from '../component/NavBarComponent.jsx';
import { setDataTrip, setDownLocationData } from '../redux/TripDetailSlice.jsx';
import { callToServerWithTokenAndUserObject, getLocationOnReverseGeocoding, getToServerWithTokenAndUserObject } from '../services/getAPI.jsx';
import mapboxgl from 'mapbox-gl';
import { useRef } from 'react';

mapboxgl.accessToken = publicKey;

const FONT_SIZE = '13px';

export default function ListTrip(props){
  const user = useSelector(state => state.user.data);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [listTrip,setListTrip] = useState([]);

  const [nameSearch,setNameSearch] = useState();
  const [citySearch,setCitySearch] = useState('');
  const [userLocation,setUserLocation] = useState();
  const [userLocationName,setUserLocationName] = useState('');
  const [checkUserLocation,setCheckUserLocation] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
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

  const marker = new mapboxgl.Marker({
    draggable: true
  })

  const [loadingListTrip,setLoadingListTrip] = useState(false);

  useEffect(()=>{
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [105.84438,21.042774],
      zoom: 12
    });

    map.current.addControl(
      mapboxDirections,
      'bottom-left'
    );
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      }),
      'top-left'
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
    map.current.on('click', addMarker);
    marker.on('dragend', onDragEnd);
  },[])

  console.log(userLocationName);

  const setRouteOnMap = (lngStartPosition,latStartPosition,lngEndPosition,latEndPosition) => {
    mapboxDirections.setOrigin([lngStartPosition,latStartPosition]);
    mapboxDirections.setDestination([lngEndPosition,latEndPosition]);
  }

  const onDragEnd = () => {
    let lngLat = marker.getLngLat();
    setUserLocation({lngDownLocation:lngLat.lng,latDownLocation:lngLat.lat});
    getLocationOnReverseGeocoding(lngLat.lng,lngLat.lat).then(data=>setUserLocationName(data.features[0].place_name));
  }


  const addMarker = (event) => {
    if(map.current.getCanvas().style.cursor == 'crosshair'){
      let coordinates = event.lngLat;
      let userLocationOb = {lngDownLocation:coordinates.lng,latDownLocation:coordinates.lat};
      getLocationOnReverseGeocoding(coordinates.lng,coordinates.lat).then(data=>setUserLocationName(data.features[0].place_name));
      setUserLocation(userLocationOb);
      console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
      marker.setLngLat(coordinates).addTo(map.current);
      setCheckUserLocation(false);
      map.current.getCanvas().style.cursor = 'grab';
    }
  }

  const onSearch = () => {
    getListTripPromise().then((data) => {
      let result;
      if(nameSearch){
        result = data.filter(trip => trip.driverInfo.fullName.toLowerCase().includes(nameSearch.toLowerCase()));
        if(citySearch){
          let resultCity = result.filter(trip => trip.endPosition.toLowerCase().includes(citySearch.toLowerCase()));
          setListTrip(resultCity);
        }
      }else result = data.filter(trip => trip.endPosition.toLowerCase().includes(citySearch.toLowerCase()));
      setListTrip(result);
    }).catch(error => toast.error(error)).finally(()=>{setLoadingListTrip(false)})
  }

  useEffect(()=>{
    getListTrip();
  },[])

  useEffect(()=>{
    if(nameSearch || citySearch) setTimeout(onSearch,500)
    else getListTrip();
  },[nameSearch,citySearch])

  const getListTripPromise = () => {
    setLoadingListTrip(true);
    mapboxDirections.removeRoutes();
    return new Promise((resolve, reject) => {
      getToServerWithTokenAndUserObject('/v1/trip/',
      {},user.accessToken)
      .then((result) => {
        resolve(result.data);
      }).catch((result) => toast.error(result.message)).finally(() => reject());
    })
  }
  

  const getListTrip = () => {
    setLoadingListTrip(true);
    getToServerWithTokenAndUserObject('/v1/trip/',
    {},user.accessToken)
    .then((result) => {
      setListTrip(result.data);
    })
    .catch((result) => toast.error(result.message)).finally(() => setLoadingListTrip(false));
  }


  const oderTrip = (trip) =>{
    if(confirm("Are you sure you want to order this trip?")){
      callToServerWithTokenAndUserObject("post",`/v1/trip/${trip.id}`,
      {
        id: user.id
      },
      {
        latDownLocation: userLocation?userLocation.latDownLocation:trip.latEndPosition,
        lngDownLocation: userLocation?userLocation.lngDownLocation:trip.lngEndPosition,
        downLocation: userLocationName?userLocationName:trip.endPosition,
      },user.accessToken)
      .then((result) => {
        toast.success(result.message);
        getListTrip();
        dispatch(setDataTrip(listTrip.filter((item) => item.id===trip.id)[0]));
        dispatch(setDownLocationData({downLocation:userLocationName?userLocationName:trip.endPosition,lngDownLocation:userLocation?userLocation.lngDownLocation:trip.lngEndPosition,latDownLocation:userLocation?userLocation.latDownLocation:trip.latEndPosition}));
        nav('/trip-detail');
      })
      .catch((result) => toast.error(result.message));
    }
  }

  const onSetUserLocation = () => {
    if(checkUserLocation){
      setCheckUserLocation(false);
      map.current.getCanvas().style.cursor = 'grab';
    }else{
      setCheckUserLocation(true);
      map.current.getCanvas().style.cursor = 'crosshair';
    }
  }

  return <div className="container-fluid p-0 h-100" style={{overflowY:"hidden"}}>
    <NavBarComponent />
    <div className='container-fluid h-100'>
      <div className='d-flex flex-row my-4 h-100'>
        <div className='d-flex flex-column justify-content-start align-items-start flex-grow-1 me-3'>
          <div className='d-flex flex-row rounded ps-2 sc-background-color shadow-lg align-items-center w-100'>
            <h3 className='text-white text-center fw-bold mt-2' style={{fontSize:"20px"}}>Filter:</h3>
            <div className='d-flex flex-row justify-content-start align-items-center m-2' style={{width:"150px"}}>
              <input className='form-control p-1' placeholder='Search by name driver' onChange={e=>setNameSearch(e.target.value)} value={nameSearch} style={{fontSize:FONT_SIZE}}/>
            </div>
            <div className='d-flex flex-row justify-content-start align-items-center m-2 flex-grow-1'>
              <input className='form-control p-1' placeholder='Search location' onChange={e=>setCitySearch(e.target.value)} value={citySearch} style={{fontSize:FONT_SIZE}}/>
            </div>
          </div>
          {
            loadingListTrip ? <div className="d-flex justify-content-center" style={{width:"460px"}}>
              <div className="spinner-grow text-info" style={{width:"3rem",height: "3rem"}} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            :
            <div className='mt-2' style={{height:"850px",overflowY:"auto",paddingBottom:"80px",width:"460px"}}>
              {
                listTrip.map((trip) => {
                  return <div key={trip.id} className='d-flex flex-row mb-4 w-100 rounded p-3 trip-hover shadow-lg' style={{border:"double",borderColor:"#043d5d",cursor:"pointer"}} onMouseOver={e=>setRouteOnMap(trip.lngStartPosition,trip.latStartPosition,trip.lngEndPosition,trip.latEndPosition)}>
                    <div className='border p-3 rounded' style={{height:"80px",backgroundColor:"white"}}>
                      <img src="/assets/icon/user.png" alt="Avatar" className="avatar" style={{border:"double",borderColor:"#043d5d",height:"40px",width:"40px",padding:"5px"}}></img>
                    </div>
                    <div className='d-flex flex-column ms-3 w-100'>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"100px",fontSize:"13px"}}>Name driver: </h5>
                        <h5 className='sc-heading ms-2' style={{fontSize:"13px"}}>{trip.driverInfo.fullName}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"100px",fontSize:"13px"}}>Age: </h5>
                        <h5 className='sc-heading ms-2' style={{fontSize:"13px"}}>{getAgeFromBirthDay(trip.driverInfo.age)}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"100px",fontSize:"13px"}}>Car Name: </h5>
                        <h5 className='sc-heading ms-2' style={{fontSize:"13px"}}>{trip.carInfo.carName}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"100px",fontSize:"13px"}}>Max guests: </h5>
                        <h5 className='sc-heading ms-2' style={{fontSize:"13px"}}>{trip.carInfo.maxUser}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"100px",fontSize:"13px"}}>Current guests: </h5>
                        <h5 className='sc-heading ms-2' style={{color:`${trip.userInfo.length==trip.carInfo.maxUser && 'red'}`,fontSize:"13px"}}>{trip.userInfo.length}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"100px",fontSize:"13px"}}>Start position: </h5>
                        <h5 className='sc-heading ms-2' style={{fontSize:"13px",width:"210px"}}>{trip.startPosition}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"100px",fontSize:"13px"}}>End position: </h5>
                        <h5 className='sc-heading ms-2' style={{fontSize:"13px",width:"210px"}}>{trip.endPosition}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"100px",fontSize:"13px"}}>Phone: </h5>
                        <h5 className='sc-heading ms-2' style={{fontSize:"13px"}}>{trip.driverInfo.phoneNumber}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"100px",fontSize:"13px"}}>Time start: </h5>
                        <h5 className='sc-heading ms-2' style={{fontSize:"13px"}}>{getTime(trip.startAt) + ' ~ ' + getDay(trip.startAt)}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"100px",fontSize:"13px"}}>Cost: </h5>
                        <h5 className='sc-heading ms-2' style={{color:"red",fontSize:"13px"}}>{forMatMoneyVND(trip.cost)}</h5>
                        <h5 className='sc-heading ms-2 text-info' style={{fontSize:"13px"}}>{`(${forMatMoneyVND(CURRENT_MONEY)}/1km)`}</h5>
                      </div>
                      <ButtonComponent btnType={`${trip.userInfo.length==trip.carInfo.maxUser?'btn-danger':'btn-info'}`} className="mt-2" label={`${trip.userInfo.length==trip.carInfo.maxUser?'This trip is full':' Order trip'}`} onClick={e=>oderTrip(trip)} disabled={trip.userInfo.length==trip.carInfo.maxUser}/>
                    </div>
                  </div>
                })
              }
            </div>
          }
        </div>
        <button type='button' className={`p-0 btn d-flex align-items-center justify-content-center ${userLocation ? 'btn-success': checkUserLocation ? 'btn-danger':'btn-info'}`} style={{position:"absolute",zIndex:"2",left:"675px",top:"106px",width:"40px",height:"38px"}} onClick={onSetUserLocation} disabled={userLocation && true}>
          <span className={`material-symbols-outlined ${(!userLocation && !checkUserLocation) && 'standout'}`}>
            {checkUserLocation?'cancel':'nature_people'}
          </span>
        </button>
        {
          userLocationName && <div style={{position:"absolute",zIndex:"2",left:"725px",top:"106px",width:"650px",height:"40px"}}>
            <TextFieldEditable fontSize="15px" width="100%" height="100%" value={userLocationName} save={value=>setUserLocationName(value)} required={true}/>
          </div>
        }
        <div ref={mapContainer} className="map-container" style={{height:"85%", width:"100%"}} onMouseUp={e=>{if(!checkUserLocation) map.current.getCanvas().style.cursor = 'grab'}} onMouseDown={e=>{if(!checkUserLocation) map.current.getCanvas().style.cursor = 'grabbing'}}/>
      </div>
    </div>
  </div>
}