import React, {useState} from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import NavBarComponent from "../../component/NavBarComponent";
import Account from './Account';
import Driver from './Driver';
import TripRegister from './TripRegister';
import { setDataDriver } from '../../redux/DriverSlice';
import { callToServerWithTokenAndUserObject } from '../../services/getAPI';
import MyListTrip from './MyListTrip';

const FONT_SIZE = '15px';

export default function Profile(props){
  const [selectedTab,setSelectedTab] = useState(0);
  const user = useSelector(state=>state.user.data);
  const driver = useSelector(state=>state.driver.data);
  const dispatch = useDispatch();
  let currentTab=null

  const getListCar = () => {
    callToServerWithTokenAndUserObject("post",'/v1/user-car/',
    {
      id: user.id
    },
    {},user.accessToken)
    .then((result) => {
      dispatch(setDataDriver(result.data));
    })
    .catch((result) => toast.error(result.message));
  }

  useEffect(()=>{
    getListCar();
  },[])

  switch(selectedTab){
    case 0: currentTab = <Account FONT_SIZE={FONT_SIZE}/>
      break;
    case 1: currentTab = <Driver FONT_SIZE={FONT_SIZE}/>
      break;
    case 2: currentTab = <TripRegister FONT_SIZE={FONT_SIZE}/>
      break;
    case 3: currentTab = <MyListTrip FONT_SIZE={FONT_SIZE} />
      break;
  }

  return <div className="container-fluid p-0">
    <NavBarComponent />
    <div className="container py-4">
      <div className="d-flex flex-column"
        style={{border:"double",borderColor:"#043d5d",borderRadius:"5px"}}>
        <h3 className="text-uppercase sc-color fw-bold text-center py-3"
          style={{borderBottom:"double"}}>
          information</h3>
          <ul className="nav nav-tabs justify-content-center fw-bold">
            <li className="nav-item"><a className={`text-uppercase d-flex align-items-center justify-content-center nav-link ${(selectedTab==0)?"vc-blue active":"text-secondary nav-link-non-active"}`} style={{cursor:"pointer"}} onClick={e=>setSelectedTab(0)}>
              <span className="material-symbols-outlined me-1">manage_accounts</span>
              <span className="d-none d-lg-block">Account</span>
            </a></li>
            <li className="nav-item"><a className={`text-uppercase d-flex align-items-center justify-content-center nav-link ${(selectedTab==1)?"vc-blue active":"text-secondary nav-link-non-active"}`} style={{cursor:"pointer"}} onClick={e=>setSelectedTab(1)}>
              <span className="material-symbols-outlined me-1">directions_car</span>
              <span className="d-none d-lg-block">Driver</span>
            </a></li>
            {
              driver.length>0 && <li className="nav-item"><a className={`text-uppercase d-flex align-items-center justify-content-center nav-link ${(selectedTab==2)?"vc-blue active":"text-secondary nav-link-non-active"}`} style={{cursor:"pointer"}} onClick={e=>setSelectedTab(2)}>
                <span className="material-symbols-outlined me-1">pacemaker</span>
                <span className="d-none d-lg-block">Trip</span>
              </a></li>
            }
            {
              driver.length>0 && <li className="nav-item"><a className={`text-uppercase d-flex align-items-center justify-content-center nav-link ${(selectedTab==3)?"vc-blue active":"text-secondary nav-link-non-active"}`} style={{cursor:"pointer"}} onClick={e=>setSelectedTab(3)}>
                <span className="material-symbols-outlined me-1">format_list_bulleted</span>
                <span className="d-none d-lg-block">List Trip</span>
              </a></li>
            }
          </ul>
          {currentTab}
      </div>
    </div>
  </div>
}