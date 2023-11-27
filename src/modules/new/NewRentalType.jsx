import React from 'react'
import { useState } from 'react'
import { backgroundOverlayModule } from '../../styles'
import CloseWindowButton from '../../components/buttons/CloseWindowButton'
import DefaultInput from '../../components/forms/DefaultInput'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { showAlert } from '../../store/alertSlice'
import { namePriceValidate } from '../../utils/validation/newValidate'

function NewRentalType({setShowNewModule, postData}) {
    const dispatch = useDispatch()
    const [errors,setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [values,setValues] = useState({
        name: '',
        price: '',
    })
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }
    const handleCloseModule = () => {
        setShowNewModule(false)
    }   
    const handleAcceptButton = () => {
        setSubmitting(true)
        setErrors(namePriceValidate(values))
    } 
    useEffect(() => {
        if (Object.keys(errors).length === 0 && submitting) {
            postData(values)
            handleCloseModule()
            dispatch(showAlert({ title: 'Nowy typ wypożyczenia został dodany!' }));
        }
      }, [errors])
  return (
    <div className='module-wrapper center-elements' style={backgroundOverlayModule}>
        <div className='module-window'>
            <div className='module-content-wrapper'>
            <div className='module-header-row'>
                  <h1 className='module-header'>Dodaj nowy typ wypożyczenia</h1>
                  <CloseWindowButton handleCloseModule={handleCloseModule} />
                </div>
                <DefaultInput name="name" error={errors.name} onChange={handleChange} type='text' placeholder='Nazwa' title='Nazwa'/>
                <DefaultInput name="price" error={errors.price} onChange={handleChange} type='number' placeholder='Cena' title='Cena wypożyczenia'/>
                <button onClick={handleAcceptButton} className='module-button'>Akceptuj</button>
            </div>
        </div>
    </div>
  )
}

export default NewRentalType
