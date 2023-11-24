import React, { useEffect } from 'react'
import { useState } from 'react'
import { backgroundOverlayModule } from '../../styles'
import CloseWindowButton from '../../components/buttons/CloseWindowButton'
import axiosClient from '../../api/apiClient'
import DefaultInput from '../../components/forms/DefaultInput'

function EditTranslator(props) {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [translator,setTranslator] = useState({})

    const getItem = async (id) => {
        try{
          const response = await axiosClient.get(`/Translator/${id}`)
          setTranslator(response.data)
          setName(response.data.name)
          setSurname(response.data.surname)
        }catch(err){
          console.error(err)
        }
    }
    const handleNameInput = (e) => {
        setName(e.target.value)
    }
    const handleSurnameInput = (e) => {
        setSurname(e.target.value)
    }
    const handleCloseModule = () => {
      props.setEditedID(null)
      props.setShowEditModule(false)
    }
    const handleSaveClick = () => {
        translator.name = name
        translator.surname = surname
        props.putData(translator.id, translator)
        props.setEditedID(null)
        props.setShowEditModule(false)
  }
  useEffect(()=> {
    getItem(props.editedID)
  },[])
  return (
    <div className='module-wrapper center-elements' style={backgroundOverlayModule}>
        <div className='module-window'>
            <div className='module-content-wrapper'>
            <div className='module-header-row'>
                  <h1 className='module-header'>Edytuj translatora</h1>
                  <CloseWindowButton handleCloseModule={handleCloseModule} />
                </div>
                <DefaultInput value={name} onChange={handleNameInput} type='text' placeholder='Imię' title='Imię translatora' />
                <DefaultInput value={surname} onChange={handleSurnameInput} type='text' placeholder='Nazwisko' title='Nazwisko translatora' />
                <button onClick={handleSaveClick} className='module-button'>Akceptuj</button>
            </div>
        </div>
    </div>
  )
}

export default EditTranslator
