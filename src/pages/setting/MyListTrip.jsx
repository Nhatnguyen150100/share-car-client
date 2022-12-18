import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getDay } from '../../common/Commom';
import { TextFieldEditable,SelectFieldInput } from '../../common/FieldInput';
import ButtonComponent from '../../component/ButtonComponent';
import { callToServerWithTokenAndUser, callToServerWithTokenAndUserObject, getToServerWithTokenAndUserObject } from '../../services/getAPI';

export default function MyListTrip(props){
  const driver = useSelector(state=>state.driver.data);
  const user = useSelector(state=>state.user.data);
  const city = useSelector(state=>state.city.data);

  const [loading,setLoading] = useState(false);
  const [loadingGuest,setLoadingGuest] = useState(false);
  const [myListTrip,setMyListTrip] = useState([]);
  const [guest,setGuest] = useState([]);

  console.log(myListTrip);

  useEffect(()=>{
    getMyTrip();
  },[])

  const getMyTrip = () => {
    setLoading(true);
    getToServerWithTokenAndUserObject('/v1/trip/driver/',
    {id: user.id},user.accessToken)
    .then((result) => {
      toast.success(result.message);
      setMyListTrip(result.data);
    })
    .catch((result) => toast.error(result.message)).finally(() => setLoading(false));
  }

  const getGuestOfTrip = (tripId) => {
    setLoadingGuest(true);
    getToServerWithTokenAndUserObject(`/v1/trip/${tripId}`,
    {id: user.id},user.accessToken)
    .then((result) => {
      toast.success(result.message);
      setGuest(result.data);
    })
    .catch((result) => toast.error(result.message)).finally(() => setLoadingGuest(false));
  }

  const deleteTrip = (tripId) => {
    if(confirm("Do you want to delete this trip")){
      callToServerWithTokenAndUser('delete',`/v1/trip/${tripId}`,user,{},user.accessToken)
      .then((result) => {
        toast.success(result.message);
        getMyTrip();
      })
      .catch((result) => toast.error(result.message));
    }
  }

  const changeStatusTrip = (tripId) => {
    if(confirm("Do you want to change status this trip?")){
      callToServerWithTokenAndUserObject("put",`/v1/trip/${tripId}`,{id: user.id},{},user.accessToken)
      .then((result) => {
        toast.success(result.message);
        getMyTrip();
      })
      .catch((text) => toast.error(text));
    }
  }

  console.log(guest)

  return <div className='d-flex flex-column mb-5 justify-content-center align-items-center w-100'>
    <div style={{width:"90%"}}>
      <h3 className='my-3 sc-color fw-bold'>My List Trip</h3>
      { myListTrip.length > 0 ? 
        <table className='table table-bordered table-hover' style={{border:"double",padding:"5px",borderColor:"#043d5d"}}>
          <thead className='text-center sc-background-color' style={{color:"white"}}>
            <tr>
              <th className='text-capitalize' scope="col">car name</th>
              <th className='text-capitalize' scope="col">max user</th>
              <th className='text-capitalize' scope="col">Start position</th>
              <th className='text-capitalize' scope="col">End position</th>
              <th className='text-capitalize' scope="col">Start Day</th>
              <th className='text-capitalize' scope="col">status</th>
              <th className='text-capitalize' scope="col">guests</th>
              <th className='text-capitalize' scope="col">Delete</th>
            </tr>
          </thead>
          <tbody style={{cursor:"pointer"}}>
            {
              myListTrip.map((value,index)=>{
                return (
                  <tr key={value.id} style={{height:"50px"}}>
                    <th scope="row">{value.carInfo.carName}</th>
                    <th className='text-center' scope="row">{value.carInfo.maxUser}</th>
                    <th className='text-center' scope="row">{value.startPosition}</th>
                    <th className='text-center' scope="row">{value.endPosition}</th>
                    <th className='text-center' scope="row">{getDay(value.startAt)}</th>
                    {value.status==7 && <th className='text-center text-capitalize' style={{color:"white"}} scope="row">
                    <button
                          type="button"
                          onClick={e=>changeStatusTrip(value.id)}
                          className={`btn border-0 btn-warning rounded-pill text-uppercase fw-bold`}
                          style={{ color: 'white', width: '120px'}}>
                          Waiting
                        </button>
                      </th>
                    }
                    {value.status==8 && <th className='text-center text-capitalize' style={{color:"white"}} scope="row">
                    <button
                          type="button"
                          onClick={e=>changeStatusTrip(value.id)}
                          className={`btn border-0 btn-success rounded-pill text-uppercase fw-bold`}
                          style={{ color: 'white', width: '120px'}}>
                          Starting
                        </button>
                      </th>
                    }
                    {value.status==9 && <th className='text-center text-capitalize' style={{color:"white"}} scope="row">
                    <button
                          type="button"
                          className={`btn border-0 btn-danger rounded-pill text-uppercase fw-bold`}
                          disabled={true}
                          style={{ color: 'white', width: '120px'}}>
                          End
                        </button>
                      </th>
                    }
                    <th className='text-center' scope="row" style={{width:"100px"}}>
                        <button
                          type="button"
                          data-bs-toggle="modal" 
                          data-bs-target="#exampleModal"
                          onClick={e=>getGuestOfTrip(value.id)}
                          className={`btn border-0 btn-info rounded-pill text-uppercase fw-bold`}
                          style={{ color: 'white', width: '70px'}}>
                          <span className="material-symbols-outlined">
                            groups
                          </span>
                        </button>
                    </th>
                    <th className='text-center' scope="row" style={{width:"200px"}}>
                        <button
                        onClick={e=>deleteTrip(value.id)}
                        className={`btn border-0 btn-danger rounded-pill text-uppercase fw-bold`}
                        style={{ color: 'white', width: '150px'}}>
                        Delete
                      </button>
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
      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">The information of guests</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body sc-color fw-bold">
              <h3 className='mb-2'>Guests: {guest?guest.length:"There are no guests on this trip"}</h3>
              { guest.length > 0 && 
                <table className='table table-bordered table-hover' style={{border:"double",padding:"5px",borderColor:"#043d5d"}}>
                  <thead className='text-center sc-background-color' style={{color:"white"}}>
                    <tr>
                      <th className='text-capitalize' scope="col">full name</th>
                      <th className='text-capitalize' scope="col">email</th>
                      <th className='text-capitalize' scope="col">phone number</th>
                      <th className='text-capitalize' scope="col">address</th>
                    </tr>
                  </thead>
                  <tbody style={{cursor:"pointer"}}>
                    {
                      guest.map((value,index)=>{
                        return (
                          <tr key={value.id} style={{height:"50px"}}>
                            <th className='text-center' scope="row">{value.fullName}</th>
                            <th className='text-center' scope="row">{value.email}</th>
                            <th className='text-center' scope="row">{value.phoneNumber}</th>
                            <th className='text-center' scope="row">{value.address}</th>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              }
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
        </div>
    </div>
  </div>
}