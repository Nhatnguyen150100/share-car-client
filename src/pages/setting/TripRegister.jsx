import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { TextFieldEditable,SelectFieldInput } from '../../common/FieldInput';
import ButtonComponent from '../../component/ButtonComponent';
import { callToServerWithTokenAndUserObject, getToServerWithTokenAndUserObject } from '../../services/getAPI';

export default function TripRegister(props){
  const driver = useSelector(state=>state.driver.data);
  const user = useSelector(state=>state.user.data);
  const city = useSelector(state=>state.city.data);

  const [carId,setCarId] = useState(driver[0].id);
  const [cost,setCost] = useState();
  const [time,setTime] = useState();
  const [loading,setLoading] = useState(false);
  const [cityId,setCityId] = useState();
  const [district,setDistrict] = useState();
  const [street,setStreet] = useState('');
  const [cityIdEnd,setCityIdEnd] = useState();
  const [districtEnd,setDistrictEnd] = useState();
  const [streetEnd,setStreetEnd] = useState('');

  console.log(time);

  const createTrip = () =>{
    if(!cost) toast.error("Cost is required");
    else if(!time) toast.error("time start is required");
    else{
      if(confirm("Are you sure you want create this trip?")){
        let startPosition = Object.assign({},{city:city[cityId-1].name, district: city[cityId-1].districts[district].name, street: street});
        let endPosition = Object.assign({},{city:city[cityIdEnd-1].name, district: city[cityIdEnd-1].districts[districtEnd].name, street: streetEnd});
        setLoading(true);
        callToServerWithTokenAndUserObject("post",'/v1/trip/register-trip',
        {
          id: user.id
        },
        {
          cost:cost,
          startAt: time,
          carId: carId,
          startPosition: city[cityId-1].name,
          endPosition: city[cityId-1].districts[district].name,
        },user.accessToken)
        .then((result) => {
          toast.success(result.message);
        })
        .catch((result) => toast.error(result.message)).finally(() => setLoading(false));
      }
    }
  }

  useEffect(()=>{
    if(city){
      setCityId(1);
      setCityIdEnd(1);
      setDistrict(0);
      setDistrictEnd(0);
    }
  },[city])

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
        <span className='sc-heading text-uppercase' style={{width:"250px"}}>Cost:</span>
        <TextFieldEditable fontSize={props.FONT_SIZE} width="100%" type='number' value={cost} save={value=>setCost(value)} placeholder="$" required={true}/>
      </div> 
      <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
        <span className='sc-heading text-uppercase' style={{width:"250px"}}>Time start:</span>
        <TextFieldEditable fontSize={props.FONT_SIZE} width="100%" type='date' value={time} save={value=>setTime(value)} required={true}/>
      </div>
      <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
        <span className='sc-heading text-uppercase' style={{width:"250px"}}>Start position:</span>
        <div className='d-flex flex-row justify-content-between w-100'>
        <SelectFieldInput width="auto" value={cityId} onChange={cityId=>setCityId(cityId)} required={true}>
          {
            Object.values(city).map(city=><option key={city.id} value={city.id}>{city.name}</option>)
          }
        </SelectFieldInput>
        {
          city[cityId-1] && <SelectFieldInput width="auto" value={district} onChange={district=>setDistrict(district)} required={true}>
            {
              city[cityId-1].districts.map(district=><option key={district.id} value={district.id}>{district.name}</option>)
            }
          </SelectFieldInput>
        }
        <TextFieldEditable fontSize={props.FONT_SIZE} width="350px" value={street} save={value=>setStreet(value)} placeholder="Name of Street" required={true}/>
        </div>
      </div> 
      <div className='d-flex flex-row justify-content-start align-items-center my-4' style={{borderBottom:"double",paddingBottom:"5px"}}>
        <span className='sc-heading text-uppercase' style={{width:"250px"}}>End position:</span>
        <div className='d-flex flex-row justify-content-between w-100'>
        <SelectFieldInput width="auto" value={cityIdEnd} onChange={cityIdEnd=>setCityIdEnd(cityIdEnd)} required={true}>
          {
            Object.values(city).map(city=><option key={city.id} value={city.id}>{city.name}</option>)
          }
        </SelectFieldInput>
        {
          city[cityIdEnd-1] && <SelectFieldInput width="auto" value={districtEnd} onChange={district=>setDistrictEnd(district)} required={true}>
            {
              city[cityIdEnd-1].districts.map(district=><option key={district.id} value={district.id}>{district.name}</option>)
            }
          </SelectFieldInput>
        }
        <TextFieldEditable fontSize={props.FONT_SIZE} width="350px" value={streetEnd} save={value=>setStreetEnd(value)} placeholder="Name of Street" required={true}/>
        </div>
      </div>
      <div className='mt-4 d-flex justify-content-center'>
        {loading ? <div className="spinner-grow"></div> : <ButtonComponent btnType="btn-success" label="create trip" onClick={createTrip}/>}
      </div>
    </div>
  </div>
}