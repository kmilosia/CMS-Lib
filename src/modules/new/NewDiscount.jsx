import React from 'react'
import { useState } from 'react'
import { backgroundOverlayModule } from '../../styles'
import CloseWindowButton from '../../components/buttons/CloseWindowButton'
import {convertDate}  from '../../utils/functions/convertDate'
import { useEffect } from 'react'
import axiosClient from '../../api/apiClient'
import DefaultInput from '../../components/forms/DefaultInput'
import DefaultTextarea from '../../components/forms/DefaultTextarea'
import DefaultSelect from '../../components/forms/DefaultSelect'
import { useDispatch } from 'react-redux'
import { showAlert } from '../../store/alertSlice'
import { discountValidate } from '../../utils/validation/newValidate'

function NewDiscount({setShowNewModule, postData}) {
    const today = new Date().toISOString().split('T')[0];
    const dispatch = useDispatch()
    const [errors,setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [bookOptions, setBookOptions] = useState([])
    const [values, setValues] = useState({
      title: '',
      description: '',
      percent: '',
      expirationDate: today,
      startingDate: today,
      selectedBooks: [],
    })
    const handleChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
    const getBooks = async () => {
        try{
          const response = await axiosClient.get(`/BookItems`)
          const options = response.data.map(item => ({
            value: item.id,
            label: item.bookTitle
          }))
          setBookOptions(options)
        }catch(err){
          console.error(err)
        }
    }
    const handleBooks = (selectedBooks) => {
        setValues({ ...values, selectedBooks });
    }
    const handleCloseModule = () => {
        setShowNewModule(false)
    }   
    const handleAcceptButton = () => {
        setSubmitting(true)
        setErrors(discountValidate(values))
      } 
      const finishSubmit = () => {
        const convertedExpDate = convertDate(values.expirationDate)
        const convertedStartDate = convertDate(values.startingDate)
        const data = {
          title: values.title,
          description: values.description,
          percentOfDiscount: Number(values.percent),
          expiryDate: convertedExpDate,
          startingDate: convertedStartDate,
          listOfBookItems: values.selectedBooks.map((item) => ({
            id: item.value,
          })),
        };     
          console.log(data)
          postData(data)
          handleCloseModule()
          dispatch(showAlert({ title: 'Nowa promocja została dodana!' }));
      }
      useEffect(() => {
        if (Object.keys(errors).length === 0 && submitting) {
          finishSubmit()
        }
      }, [errors])
    useEffect(() => {
        getBooks()
    },[])
  return (
    <div className='module-wrapper' style={backgroundOverlayModule}>
        <div className='module-window'>
            <div className='module-content-wrapper'>
            <div className='module-header-row'>
                  <h1 className='module-header'>Dodaj nową promocję</h1>
                  <CloseWindowButton handleCloseModule={handleCloseModule} />
                </div>
                <div className='grid grid-cols-[2fr_1fr] gap-2'>
                <DefaultInput name="title" error={errors.title} onChange={handleChange} type='text' placeholder='Tytuł' title="Tytuł promocji"/>
                <DefaultInput name="percent" error={errors.percent} onChange={handleChange} type='number' placeholder='Wyrażona w %' title="Wartość rabatu"/>
                </div>
                <DefaultTextarea name="description" error={errors.description} onChange={handleChange} placeholder='Opis' title="Opis promocji"/>
                <div className='grid grid-cols-2 gap-2'>
                <DefaultInput name="startingDate" onChange={handleChange} value={values.startingDate} type='date' title='Data rozpoczęcia'/>
                <DefaultInput name="expirationDate" onChange={handleChange} value={values.expirationDate} type='date' title="Termin ważności"/>
                </div>
                <DefaultSelect name="selectedBooks" error={errors.selectedBooks} onChange={handleBooks} value={values.selectedBooks} options={bookOptions} isMulti={true} title="Wszystkie egzemplarze objęte promocją" placeholder='Egzemplarze książek'/>
                <button onClick={handleAcceptButton} className='module-button'>Akceptuj</button>
            </div>
        </div>
    </div>
  )
}

export default NewDiscount
