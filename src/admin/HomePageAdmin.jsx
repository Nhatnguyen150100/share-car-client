import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavBarComponentAdmin from './NavBarComponentAdmin.jsx';
import { useEffect } from 'react';
import { callToServerWithTokenAndUserObject } from '../services/getAPI.jsx';
import { toast } from 'react-toastify';

export default function HomePageAdmin() {
	const user = useSelector((state) => state.user.data);
	const nav = useNavigate();
  const [loading,setLoading] = useState(false);
  const [listCar,setListCar] = useState([]);

  const getListCar = () => {
    setLoading(true);
    callToServerWithTokenAndUserObject("post",'/v1/admin-car/',{},{},user.accessToken)
    .then((result) => {
      toast.success(result.message);
      setListCar(result.data);
    })
    .catch((text) => toast.error(text)).finally(() => setLoading(false));
  }

  const onAccept = (id,status,message) => {
    if(confirm(message)){
      setLoading(true);
      callToServerWithTokenAndUserObject("put",`/v1/admin-car/${id}`,{},{status:status},user.accessToken)
      .then((result) => {
        toast.success(result.message);
        getListCar();
      })
      .catch((text) => toast.error(text)).finally(() => setLoading(false));
    }
  }

	useEffect(()=>{
    getListCar();
	},[])
	
	return (
		<div
			className="d-flex flex-column justify-content-center align-items-center"
			style={{
				height: '100%',
				backgroundImage: `url("/assets/images/login_background.jpg")`,
				backgroundSize: '100% 100%',
			}}>
			<NavBarComponentAdmin />
			<div className="d-flex flex-column justify-content-start align-items-center h-100 w-100 container">
        <h2 className='text-uppercase fw-bold my-4' style={{color:"#813535"}}>List car status</h2>
        {
          listCar.length && 
          <table className='table table-bordered table-hover' style={{border:"double",padding:"5px",borderColor:"#813535"}}>
          <thead className='text-center' style={{backgroundColor:"#813535",color:"white"}}>
            <tr>
              <th className='text-capitalize' scope="col">id car</th>
              <th className='text-capitalize' scope="col">car name</th>
              <th className='text-capitalize' scope="col">max user</th>
              <th className='text-capitalize' scope="col">user id</th>
              <th className='text-capitalize' scope="col">status</th>
              <th className='text-capitalize' scope="col">Action</th>
            </tr>
          </thead>
          <tbody style={{cursor:"pointer"}}>
            {
              listCar.map((value,index)=>{
                return (
                  <tr key={value.id} style={{height:"50px"}}>
                    <th className='text-center' scope="row">{value.id}</th>
                    <th scope="row">{value.carName}</th>
                    <th className='text-center' scope="row">{value.maxUser}</th>
                    <th className='text-center' scope="row">{value.userId}</th>
                    {value.status==4 && <th className='text-center text-capitalize' style={{backgroundColor:"#df8b1b",color:"white"}} scope="row">waiting</th>}
                    {value.status==5 && <th className='text-center text-capitalize' style={{backgroundColor:"green",color:"white"}} scope="row">accepted</th>}
                    {value.status==6 && <th className='text-center text-capitalize' style={{backgroundColor:"red",color:"white"}} scope="row">Rejected</th>}
                    {
                      value.status == 4 &&
                      <th className='text-center' scope="row" style={{width:"200px"}}>
                        <div className='d-flex flex-row justify-content-center w-100'>
                          {loading ? <div className="spinner-grow"></div> :
                            <button
                              onClick={e=>onAccept(value.id,5,"Are you sure you want to accept this request")}
                              className={`btn border-0 me-2 btn-success rounded-pill text-uppercase fw-bold`}
                              style={{ color: 'white', width: '150px'}}>
                              accept
                            </button>
                          }
                          {loading ? <div className="spinner-grow"></div> :
                            <button
                              onClick={e=>onAccept(value.id,6,"Are you sure you want to reject this request")}
                              className={`btn border-0 btn-danger rounded-pill text-uppercase fw-bold`}
                              style={{ color: 'white', width: '150px'}}>
                              Rejected
                            </button>
                          }
                        </div>
                      </th>                   
                    }
                    {
                      value.status == 5 && <th className='text-center' scope="row" style={{width:"200px"}}>
                        {loading ? <div className="spinner-grow"></div> :
                          <button
                            onClick={e=>onAccept(value.id,6,"Are you sure you want to reject this request")}
                            className={`btn border-0 btn-danger rounded-pill text-uppercase fw-bold`}
                            style={{ color: 'white', width: '150px'}}>
                            Rejected
                          </button>
                        }
                      </th>
                    }
                    {
                      value.status == 6 && <th className='text-center' scope="row" style={{width:"200px"}}>
                      </th>
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        }
			</div>
		</div>
	);
}
