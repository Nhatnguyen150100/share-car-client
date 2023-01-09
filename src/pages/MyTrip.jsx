import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAgeFromBirthDay, getDay, getTime } from '../common/Commom';
import NavBarComponent from '../component/NavBarComponent';
import { setDataTrip, setDownLocationData } from '../redux/TripDetailSlice';
import { getToServerWithTokenAndUserObject } from '../services/getAPI.jsx';

export default function MyTrip(props){
  const user = useSelector(state => state.user.data);
  const dispatch = useDispatch();

  const [listTrip,setListTrip] = useState([]);
  const [loading,setLoading] = useState();

  useEffect(()=>{
    getMyStrip();
  },[])


  const getMyStrip = () => {
    setLoading(true);
    getToServerWithTokenAndUserObject('/v1/trip/user/',
    {id: user.id},user.accessToken)
    .then((result) => {
      toast.success(result.message);
      setListTrip(result.trips);
    })
    .catch((result) => toast.error(result.message)).finally(() => setLoading(false));
  }

  const setDataTripToRedux = (trip) =>{
    dispatch(setDataTrip(trip.tripInfo));
    dispatch(setDownLocationData(trip));
  } 

  console.log(listTrip);

  return <div className="container-fluid p-0 h-100">
    <NavBarComponent />
    <div className='container h-100'>
      <h2 className='text-center fw-bold my-4 sc-color' style={{fontSize:"3em"}}>My trip</h2>
      { listTrip.length > 0 ? 
        <table className='table table-bordered table-hover' style={{border:"double",padding:"5px",borderColor:"#043d5d"}}>
          <thead className='text-center sc-background-color' style={{color:"white"}}>
            <tr>
              <th className='text-capitalize' scope="col">stt</th>
              <th className='text-capitalize' scope="col">driver name</th>
              <th className='text-capitalize' scope="col">car name</th>
              <th className='text-capitalize' scope="col">time start</th>
              <th className='text-capitalize' scope="col">start position</th>
              <th className='text-capitalize' scope="col">end position</th>
              <th className='text-capitalize' scope="col">action</th>
            </tr>
          </thead>
          <tbody style={{cursor:"pointer"}}>
            {
              listTrip.map((value,index)=>{
                return (
                  <tr key={value.id} style={{height:"50px"}}>
                    <th className='text-center' scope="row">{index}</th>
                    <th className='text-center' scope="row">{value.tripInfo.driverInfo.fullName}</th>
                    <th className='text-center' scope="row">{value.tripInfo.carInfo.carName}</th>

                    <th className='text-center' scope="row">{getTime(value.tripInfo.startAt) + ' ~ ' + getDay(value.tripInfo.startAt)}</th>
                    <th className='text-center' scope="row">{value.tripInfo.startPosition}</th>
                    <th className='text-center' scope="row">{value.tripInfo.endPosition}</th>
                    <th className='text-center' scope="row" style={{width:"200px"}}>
                      <Link to={'/trip-detail'} >
                        <button
                          onClick={e=>setDataTripToRedux(value)}
                          className={`btn border-0 btn-info rounded-pill text-uppercase fw-bold`}
                          style={{ color: 'white', width: '150px'}}>
                          Information
                        </button>
                      </Link>
                    </th>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        :
        <div className="progress">
          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-label="Animated striped example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}}></div>
        </div>
      }
    </div>
  </div>
}