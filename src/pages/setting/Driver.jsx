import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { TextFieldEditable } from '../../common/FieldInput';
import ButtonComponent from '../../component/ButtonComponent';
import { setDataDriver } from '../../redux/DriverSlice';
import { callToServerWithTokenAndUserObject } from '../../services/getAPI';

export default function Driver(props){
  const driver = useSelector(state=>state.driver.data);
  const user = useSelector(state=>state.user.data);
  const [carName,setCarName] = useState(driver.car_name?driver.car_name:'');
  const [maxUser,setMaxUser] = useState(driver.max_user?driver.max_user:'');
  const [loading,setLoading] = useState(false);
  const [loadingDelete,setLoadingDelete] = useState(false);
  const dispatch = useDispatch();

  const createDriver = (e) =>{
    if(!carName) toast.error("Name car is required");
    else if(!maxUser) toast.error("Max user car is required");
    else{
      if(confirm("Are you sure you want to be a driver?")){
        setLoading(true);
        callToServerWithTokenAndUserObject("post",'/v1/user-car/register',
        {
          id: user.id
        },
        {
          carName:carName,
          maxUser:maxUser
        },user.accessToken)
        .then((result) => {
          toast.success(result.message);
          getListCar();
          setCarName('');
          setMaxUser('');
        })
        .catch((result) => toast.error(result.message)).finally(() => setLoading(false));
      }
    }
  }

  const getListCar = () => {
    setLoading(true);
    callToServerWithTokenAndUserObject("post",'/v1/user-car/',
    {
      id: user.id
    },
    {},user.accessToken)
    .then((result) => {
      toast.success(result.message);
      dispatch(setDataDriver(result.data));
    })
    .catch((result) => toast.error(result.message)).finally(() => setLoading(false));
  }

  const deleteDriver = (id) => {
    if(confirm("Do you want to delete this driver")){
      setLoadingDelete(true);
      callToServerWithTokenAndUserObject("delete",`/v1/user-car/${id}`,{id: user.id},{},user.accessToken)
      .then((result) => {
        toast.success(result.message);
        getListCar();
        dispatch(setDataDriver([]));
      })
      .catch((text) => toast.error(text)).finally(() => setLoadingDelete(false));
    }
  }

  return <div className='d-flex flex-column mb-5 justify-content-center align-items-center w-100'>
    <div style={{width:"600px"}}>
      <h3 className='mt-3 sc-color fw-bold'>Create new driver</h3>
      <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
        <span className='sc-heading text-uppercase' style={{width:"300px"}}>Name car:</span>
        <TextFieldEditable fontSize={props.FONT_SIZE} width="100%" value={carName} save={value=>setCarName(value)} required={true}/>
      </div> 
      <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
        <span className='sc-heading text-uppercase' style={{width:"300px"}}>Max of people:</span>
        <TextFieldEditable fontSize={props.FONT_SIZE} width="100%" type="number" value={maxUser} save={value=>setMaxUser(value)} required={true}/>
      </div>
      <div className='mt-4 d-flex justify-content-center'>
        {loading ? <div className="spinner-grow"></div> : <ButtonComponent btnType="btn-success" label="create driver account" onClick={createDriver} />}
      </div>
      { driver.length > 0 && <h3 className='mt-5 sc-color fw-bold'>List driver</h3> }
      { driver.length > 0 && 
        <table className='table table-bordered table-hover' style={{border:"double",padding:"5px",borderColor:"#043d5d"}}>
          <thead className='text-center sc-background-color' style={{color:"white"}}>
            <tr>
              <th className='text-capitalize' scope="col">car name</th>
              <th className='text-capitalize' scope="col">max user</th>
              <th className='text-capitalize' scope="col">status</th>
              <th className='text-capitalize' scope="col">Action</th>
            </tr>
          </thead>
          <tbody style={{cursor:"pointer"}}>
            {
              driver.map((value,index)=>{
                return (
                  <tr key={value.id} style={{height:"50px"}}>
                    <th scope="row">{value.carName}</th>
                    <th className='text-center' scope="row">{value.maxUser}</th>
                    {value.status==4 && <th className='text-center text-capitalize' style={{backgroundColor:"#df8b1b",color:"white"}} scope="row">waiting</th>}
                    {value.status==5 && <th className='text-center text-capitalize' style={{backgroundColor:"green",color:"white"}} scope="row">accepted</th>}
                    {value.status==6 && <th className='text-center text-capitalize' style={{backgroundColor:"red",color:"white"}} scope="row">Rejected</th>}
                    <th className='text-center' scope="row" style={{width:"200px"}}>
                    {loadingDelete ? <div className="spinner-grow"></div> :
                      <button
                        onClick={e=>deleteDriver(value.id)}
                        className={`btn border-0 btn-danger rounded-pill text-uppercase fw-bold`}
                        style={{ color: 'white', width: '150px'}}>
                        Delete
                      </button>
                    }
                    </th>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      }
    </div>
  </div>
}