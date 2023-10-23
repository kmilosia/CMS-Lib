import React from 'react'
import { useState } from 'react'
import { backgroundOverlayModule } from '../../styles'
import CloseWindowButton from '../../components/CloseWindowButton'
import {convertDate}  from '../../utils/convertDate'
import { useEffect } from 'react'
import Select from 'react-select'
import axiosClient from '../../api/apiClient'
import TextInput from '../../components/forms/TextInput'

function NewDiscount({setShowNewModule, postData}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [startingDate, setStartingDate] = useState('')
    const [percent, setPercent] = useState('')
    const [selectedBooks, setSelectedBooks] = useState([])
    const [bookOptions, setBookOptions] = useState([])
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
    const handleTitleInput = (e) => {
        setTitle(e.target.value)
    }
    const handleDescriptionInput = (e) => {
        setDescription(e.target.value)
    }
    const handleExpirationDate = (e) => {
        setExpirationDate(e.target.value)
    }
    const handleStartingDate = (e) => {
        setStartingDate(e.target.value)
    }
    const handlePercent = (e) => {
        setPercent(Number(e.target.value))
    }
    const handleBooks = (selectedBooks) => {
        setSelectedBooks(selectedBooks)
    }
    const handleCloseModule = () => {
        setShowNewModule(false)
    }   
    const handleAcceptButton = () => {
        const convertedExpDate = convertDate(expirationDate)
        const convertedStartDate = convertDate(startingDate)
        const booksList = selectedBooks.map(item => (
            {
                id: item.value
            }
        ))
        const data = {
            title: title,
            description: description,
            percentOfDiscount: percent,
            expiryDate: convertedExpDate,
            startingDate: convertedStartDate,
            listOfBookItems: booksList,
        }
        console.log(data);
        postData(data)
        handleCloseModule()
    } 
    useEffect(() => {
        getBooks()
        console.log(bookOptions);
    },[])
  return (
    <div className='module-wrapper' style={backgroundOverlayModule}>
        <div className='module-window'>
            <div className='module-content-wrapper'>
            <div className='module-header-row'>
                  <h1 className='module-header'>Dodaj nową promocję</h1>
                  <CloseWindowButton handleCloseModule={handleCloseModule} />
                </div>
                <div className='p-2 border-2 my-1'>
                    <label className='absolute top-[-10px] left-[10px] bg-white text-xs px-1' for='name'>Nazwa</label>
                    <input name='name' onChange={handleTitleInput} type='text' placeholder='Nazwa' className=''/>
                </div>
                <TextInput label="Nazwa" handle={handleTitleInput}/>        
                <input onChange={handlePercent} type='number' placeholder='Wartość promocji (liczba)' className='module-input-text'/>
                <textarea onChange={handleDescriptionInput} placeholder='Opis' rows={5} className='module-input-textarea'/>
                <input onChange={handleExpirationDate} type='date' className='module-input-text'/>
                <input onChange={handleStartingDate} type='date' className='module-input-text'/>
                <Select onChange={handleBooks} maxMenuHeight={100} value={selectedBooks} options={bookOptions} isClearable={true} isMulti={true} isSearchable={true} className="my-react-select-module-container my-2 w-full" classNamePrefix="my-react-select-module" placeholder='Egzemplarze książek'/>
                <button onClick={handleAcceptButton} className='module-button'>Akceptuj</button>
            </div>
        </div>
    </div>
  )
}

export default NewDiscount
