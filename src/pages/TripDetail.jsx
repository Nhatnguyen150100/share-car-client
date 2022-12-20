import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAgeFromBirthDay, getDay, getTime } from '../common/Commom';
import { TextFieldEditable } from '../common/FieldInput';
import NavBarComponent from '../component/NavBarComponent';
import { getToServerWithTokenAndUserObject } from '../services/getAPI.jsx';

export default function TripDetail(props){
  const trip = useSelector(state => state.trip.data);
  const [selectedTab,setSelectedTab] = useState(0);
  let currentTab=null

  switch(selectedTab){
    case 0: currentTab = <div className='d-flex flex-column w-100'>
            <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>full name driver:</span>
                <TextFieldEditable fontSize="18px" width="100%" value={trip.driverInfo.fullName} disabled={true}/>
            </div> 
            <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>email driver:</span>
                <TextFieldEditable fontSize="18px" width="100%" value={trip.driverInfo.email} disabled={true}/>
            </div> 
            <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>age driver:</span>
                <TextFieldEditable fontSize="18px" width="100%" value={getAgeFromBirthDay(trip.driverInfo.age)} disabled={true}/>
            </div> 
            <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>email driver:</span>
                <TextFieldEditable fontSize="18px" width="100%" value={trip.driverInfo.email} disabled={true}/>
            </div>
            <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>phone Number driver:</span>
                <TextFieldEditable fontSize="18px" width="100%" value={trip.driverInfo.phoneNUmber} disabled={true}/>
            </div> 
            <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>address driver:</span>
                <TextFieldEditable fontSize="18px" width="100%" value={trip.driverInfo.email} disabled={true}/>
            </div>  
            <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>cardId:</span>
                <TextFieldEditable fontSize="18px" width="100%" value={trip.driverInfo.cardId} disabled={true}/>
            </div> 
            <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
                <span className='sc-heading text-uppercase' style={{width:"300px"}}>bankId:</span>
                <TextFieldEditable fontSize="18px" width="100%" value={trip.driverInfo.bankId} disabled={true}/>
            </div> 
        </div>
      break;
    case 1: currentTab = <div className='d-flex flex-column w-100'>
          <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>car name:</span>
              <TextFieldEditable fontSize="18px" width="100%" value={trip.carInfo.carName} disabled={true}/>
          </div> 
          <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>max user:</span>
              <TextFieldEditable fontSize="18px" width="100%" value={trip.carInfo.maxUser} disabled={true}/>
          </div> 
          <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>time start:</span>
              <TextFieldEditable fontSize="18px" width="100%" value={getTime(trip.startAt) + ' ~ ' + getDay(trip.startAt)} disabled={true}/>
          </div> 
          <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>start position:</span>
              <TextFieldEditable fontSize="18px" width="100%" value={trip.startPosition} disabled={true}/>
          </div>
          <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
              <span className='sc-heading text-uppercase' style={{width:"300px"}}>end position:</span>
              <TextFieldEditable fontSize="18px" width="100%" value={trip.endPosition} disabled={true}/>
          </div>
      </div>
      break;
  }

  return <div className="container-fluid p-0 h-100">
    <NavBarComponent />
    <div className='container h-100'>
      <h2 className='text-center fw-bold my-4 sc-color' style={{fontSize:"3em"}}>Information of the trip</h2>
      <ul className="nav nav-tabs justify-content-center fw-bold">
        <li className="nav-item"><a className={`text-uppercase d-flex align-items-center justify-content-center nav-link ${(selectedTab==0)?"vc-blue active":"text-secondary nav-link-non-active"}`} style={{cursor:"pointer"}} onClick={e=>setSelectedTab(0)}>
            <span className="material-symbols-outlined me-1">manage_accounts</span>
            <span className="d-none d-lg-block">Driver Infomation</span>
        </a></li>
        <li className="nav-item"><a className={`text-uppercase d-flex align-items-center justify-content-center nav-link ${(selectedTab==1)?"vc-blue active":"text-secondary nav-link-non-active"}`} style={{cursor:"pointer"}} onClick={e=>setSelectedTab(1)}>
            <span className="material-symbols-outlined me-1">pacemaker</span>
            <span className="d-none d-lg-block">Trip Infomation</span>
        </a></li>
      </ul>
      {currentTab}
    </div>
  </div>
}