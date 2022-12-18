import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const TextFieldEditable = props => {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value])

  const save = () => {
    if (props.required && !value) {
      toast.error("Field cannot be empty");
      setValue(props.value);
      setEditMode(false);
    }
    else if(props.value==value) setEditMode(false)
    else {
      props.save(value);
      setEditMode(false);
    }
  }

  const onKeyDownInInput = e => {
    if(e.key=='Escape') {
      setValue(props.value);
      setEditMode(false);
    }
    else if(e.key=='Enter') save();
  }

  return <div className='d-flex align-items-center' style={{width:props.width?props.width:null}}>
    {editMode?
      <input className={`w-100 form-control`} type={props.type} value={value} onChange={e => setValue(e.target.value)} onBlur={save} autoFocus onKeyDown={onKeyDownInInput} placeholder={props.placeholder}
        style={{fontSize:props.fontSize}}/>
      :
      <button className={`w-100 btn btn-light`} style={{textAlign:'start',fontSize:props.fontSize}} onClick={e => setEditMode(true)} disabled={props.disabled} >
        {value || 'Click to edit'} 
      </button>
    }
  </div>;
}

export function SelectFieldInput(props){
  return <select className="form-select" style={{width:props.width?props.width:null}} value={props.value} onChange={e=>props.onChange(e.target.value)} disabled={props.disabled}>
    {props.children}
  </select>
}