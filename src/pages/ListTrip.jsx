import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getDay, getTime } from '../common/Commom.jsx';
import { SelectFieldInput, TextFieldEditable } from '../common/FieldInput.jsx';
import ButtonComponent from '../component/ButtonComponent.jsx';
import NavBarComponent from '../component/NavBarComponent.jsx';
import { callToServerWithTokenAndUserObject, getToServerWithTokenAndUserObject } from '../services/getAPI.jsx';


export default function ListTrip(props){
  const city = useSelector(state => state.city.data);
  const user = useSelector(state => state.user.data);

  const [listTrip,setListTrip] = useState([]);

  const [nameSearch,setNameSearch] = useState();
  const [citySearch,setCitySearch] = useState('');
  const [districtSearch,setDistrictSearch] = useState('');

  const [loading,setLoading] = useState(false);
  const [loadingListTrip,setLoadingListTrip] = useState(false);

  const checkWordInString = (word,string) => {
    return RegExp('\\b'+ word +'\\b').test(string);
  }

  const onSearch = () => {
    setLoading(true);
    let result = [];
    if(nameSearch) {
      result = listTrip.filter((trip) => {
        return trip.startPosition.includes(city[citySearch-1].name) && trip.startPosition.includes(city[citySearch-1].name) && trip.driverInfo.fullName.includes(nameSearch)
      });
    }else{
      result = listTrip.filter((trip) => {
        return checkWordInString(city[citySearch-1].name,trip.startPosition) && trip.startPosition.includes(city[citySearch-1].name)
      });
    }
    setListTrip(result);
    console.log(result)
    setLoading(false);
  }

  const onRemove = () => {
    getListTrip();
  }

  useEffect(()=>{
    if(city){
      // let cityInsert = citySearch.unshift('');
      // let districtInsert = districtSearch.unshift('');
      // setCitySearch(cityInsert);
      // setDistrictSearch(districtInsert);
      setCitySearch(1);
      setDistrictSearch(0);
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
        <div className='d-flex flex-column rounded p-3 sc-background-color me-4 shadow-lg' style={{height:"400px"}}>
          <h3 className='text-white text-center fw-bold mt-2'>Filter for share car</h3>
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{width:"320px"}}>
            <span className='sc-heading text-uppercase' style={{width:"140px",color:"white"}}>Name:</span>
            <TextFieldEditable fontSize={props.FONT_SIZE} width="100%" value={nameSearch} save={value=>setNameSearch(value)} placeholder="search for look up!"/>
          </div>
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{width:"320px"}}>
            <span className='sc-heading text-uppercase' style={{width:"150px",color:"white"}}>city:</span>
            <SelectFieldInput width="100%" value={citySearch} onChange={citySearch=>setCitySearch(citySearch)} required={true}>
              {
                Object.values(city).map(city=><option key={city.id} value={city.id}>{city.name}</option>)
              }
            </SelectFieldInput>
          </div>
          <div className='d-flex flex-row justify-content-start align-items-center my-2' style={{width:"320px"}}>
            <span className='sc-heading text-uppercase' style={{width:"150px",color:"white"}}>district:</span>
            {
              city[citySearch-1] && <SelectFieldInput width="100%" value={districtSearch} onChange={districtSearch=>setDistrictSearch(districtSearch)} required={true}>
                {
                  city[citySearch-1].districts.map(districtSearch=><option key={districtSearch.id} value={districtSearch.id}>{districtSearch.name}</option>)
                }
              </SelectFieldInput>
            }
          </div>
          <div className='mt-4 d-flex flex-column justify-content-center'>
            {loading ? <div className="spinner-grow"></div> : <ButtonComponent btnType="btn-success" label="Search for trip" onClick={onSearch}/>}
            {loading ? <div className="spinner-grow"></div> : <div className='my-4'><ButtonComponent btnType="btn-danger" label="Remove fliter" onClick={onRemove}/></div>}
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
                        <h5 style={{width:"150px"}}>Start position: </h5>
                        <h5 className='sc-heading ms-2'>{trip.startPosition}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"150px"}}>End position: </h5>
                        <h5 className='sc-heading ms-2'>{trip.endPosition}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"150px"}}>Phone: </h5>
                        <h5 className='sc-heading ms-2'>{trip.driverInfo.phoneNumber}</h5>
                      </div>
                      <div className='d-flex flex-row'>
                        <h5 style={{width:"150px"}}>Time start: </h5>
                        <h5 className='sc-heading ms-2'>{getDay(trip.startAt) + ' ~ ' + getTime(trip.startAt)}</h5>
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