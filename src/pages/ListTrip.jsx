import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { SelectFieldInput, TextFieldEditable } from '../common/FieldInput.jsx';
import ButtonComponent from '../component/ButtonComponent.jsx';
import NavBarComponent from '../component/NavBarComponent.jsx';
import { callToServerWithTokenAndUserObject, getToServerWithTokenAndUserObject } from '../services/getAPI.jsx';


export default function ListTrip(props){
  const city = useSelector(state => state.city.data);
  const user = useSelector(state => state.user.data);

  const [listTrip,setListTrip] = useState([]);

  const [nameSearch,setNameSearch] = useState();
  const [cityId,setCityId] = useState();
  const [district,setDistrict] = useState();
  const [loading,setLoading] = useState(false);
  const [loadingListTrip,setLoadingListTrip] = useState(false);

  useEffect(()=>{
    if(city){
      setCityId(1);
      setDistrict(0);
    }
    getListTrip();
  },[city])


  const getAgeFromBirthDay = (dateString) => {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  const getListTrip = () => {
    setLoadingListTrip(true);
    getToServerWithTokenAndUserObject('/v1/trip/',
    {},user.accessToken)
    .then((result) => {
      toast.success(result.message);
      setListTrip(result.data);
    })
    .catch((result) => toast.error(result.message)).finally(() => setLoadingListTrip(false));
  }

  const oderTrip = (id) =>{
    if(confirm("Are you sure you want to order this trip?")){
      callToServerWithTokenAndUserObject("post",`/v1/trip/${id}`,
      {
        id: user.id
      },
      {
      },user.accessToken)
      .then((result) => {
        toast.success(result.message);
      })
      .catch((result) => toast.error(result.message));
    }
  }

  return <div className="container-fluid p-0 h-100">
    <NavBarComponent />
    <div className='container h-100'>
      <div className='d-flex flex-row my-4 h-100'>
        <div className='d-flex flex-column rounded p-3 sc-background-color me-4 shadow-lg' style={{height:"350px"}}>
          <h3 className='text-white text-center fw-bold mt-2'>Filter for share car</h3>
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{width:"320px"}}>
            <span className='sc-heading text-uppercase' style={{width:"140px",color:"white"}}>Name:</span>
            <TextFieldEditable fontSize={props.FONT_SIZE} width="100%" value={nameSearch} save={value=>setNameSearch(value)} placeholder="search for look up!" required={true}/>
          </div>
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{width:"320px"}}>
            <span className='sc-heading text-uppercase' style={{width:"150px",color:"white"}}>city:</span>
            <SelectFieldInput width="100%" value={cityId} onChange={cityId=>setCityId(cityId)} required={true}>
              {
                Object.values(city).map(city=><option key={city.id} value={city.id}>{city.name}</option>)
              }
            </SelectFieldInput>
          </div>
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{width:"320px"}}>
            <span className='sc-heading text-uppercase' style={{width:"150px",color:"white"}}>district:</span>
            {
              city[cityId-1] && <SelectFieldInput width="100%" value={district} onChange={district=>setDistrict(district)} required={true}>
                {
                  city[cityId-1].districts.map(district=><option key={district.id} value={district.id}>{district.name}</option>)
                }
              </SelectFieldInput>
            }
          </div>
          <div className='mt-4 d-flex justify-content-center'>
            {loading ? <div className="spinner-grow"></div> : <ButtonComponent btnType="btn-success" label="Search for trip"/>}
          </div>
        </div>
        <div className='d-flex flex-column justify-content-start align-items-start flex-grow-1'>
          {
            loadingListTrip ? <div class="d-flex justify-content-center w-100">
              <div className="spinner-grow text-info" style={{width:"3rem",height: "3rem"}} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            :
            <React.Fragment>
              {
                listTrip.map((trip) => {
                  return <div key={trip.id} className='d-flex flex-row mb-4 w-100 rounded p-3 trip-hover shadow-lg' style={{border:"double",borderColor:"#043d5d",cursor:"pointer"}}>
                    <div className='border p-3 rounded' style={{height:"100px",backgroundColor:"white"}}>
                      <img src="/assets/icon/user.png" alt="Avatar" className="avatar" style={{border:"double",borderColor:"#043d5d",height:"60px",width:"60px",padding:"5px"}}></img>
                    </div>
                    <div className='d-flex flex-column ms-3'>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"150px"}}>Name driver: </h5>
                        <h5 className='sc-heading ms-2'>{trip.driverInfo.fullName}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"150px"}}>Age: </h5>
                        <h5 className='sc-heading ms-2'>{getAgeFromBirthDay(trip.driverInfo.age)}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"150px"}}>Car Name: </h5>
                        <h5 className='sc-heading ms-2'>{trip.carInfo.carName}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"150px"}}>Route: </h5>
                        <h5 className='sc-heading ms-2'>{trip.startPosition} {'->'} {trip.endPosition}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"150px"}}>Phone: </h5>
                        <h5 className='sc-heading ms-2'>{trip.driverInfo.phoneNumber}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"150px"}}>Cost: </h5>
                        <h5 className='sc-heading ms-2' style={{color:"red"}}>{trip.cost}{'$'}</h5>
                      </div>
                      <ButtonComponent btnType="btn-info" className="mt-2" label="Order trip" onClick={e=>oderTrip(trip.id)}/>
                    </div>
                  </div>
                })
              }
            </React.Fragment>
          }
        </div>
      </div>
    </div>
  </div>
}