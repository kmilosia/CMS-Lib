import React from 'react'
import { useState } from 'react'
import { backgroundOverlayModule } from '../../styles'
import CloseWindowButton from '../../components/CloseWindowButton'
import Select from 'react-select'
import { useEffect } from 'react'
import axiosClient from '../../api/apiClient'
import { FiMinus, FiPlus } from 'react-icons/fi'


function EditBook({setShowEditModule, putData, editedID}) {
    const getAuthors = async () => {
        try{
          const response = await axiosClient.get(`/Author`)
          const options = response.data.map(item => ({
            value: item.id,
            label: item.name + " " + item.surname
          }))
          setAuthorOptions(options)
        }catch(err){
          console.error(err)
        }
    }
    const getCategories = async () => {
        try{
          const response = await axiosClient.get(`/Category`)
          const options = response.data.map(item => ({
            value: item.id,
            label: item.name
          }))
          setCategoryOptions(options)
        }catch(err){
          console.error(err)
        }
    }
    const getLanguages = async () => {
        try{
          const response = await axiosClient.get(`/Language`)
          const options = response.data.map(item => ({
            value: item.id,
            label: item.name
          }))
          setLanguageOptions(options)
        }catch(err){
          console.error(err)
        }
    }
    const getPublishers = async () => {
        try{
          const response = await axiosClient.get(`/Publisher`)
          const options = response.data.map(item => ({
            value: item.id,
            label: item.name
          }))
          setPublisherOptions(options)
        }catch(err){
          console.error(err)
        }
    }
    const getItem = async (id) => {
      try{
        const response = await axiosClient.get(`/Book/${id}`)
        setBook(response.data)
        setTitle(response.data.title)
        setDescription(response.data.description)
        setLanguageID(response.data.originalLanguageID)
        setPublisherID(response.data.publisherID)
        setAuthors(response.data.authors)
        setCategories(response.data.categories)
        setSelectedImages(response.data.images)
      }catch(err){
        console.error(err)
      }
    }
    const [book,setBook] = useState([])
    const [title, setTitle] = useState('')
    const [imageTitle, setImageTitle] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [description, setDescription] = useState('')
    
    const [selectedLanguage, setSelectedLanguage] = useState(null)
    const [selectedPublisher, setSelectedPublisher] = useState(null)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedAuthors, setSelectedAuthors] = useState([])
    const [selectedImages, setSelectedImages] = useState([])

    const [languageOptions, setLanguageOptions] = useState([])
    const [publisherOptions, setPublisherOptions] = useState([])
    const [categoryOptions, setCategoryOptions] = useState([])
    const [authorOptions, setAuthorOptions] = useState([])

    const [languageID, setLanguageID] = useState([])
    const [publisherID, setPublisherID] = useState([])

    const [authors, setAuthors] = useState([])
    const [categories, setCategories] = useState([])


    const handleImageTitleInput = (e) => {
      setImageTitle(e.target.value)
    }
    const handleImageURLInput = (e) => {
      setImageURL(e.target.value)
    }
    const handleTitleInput = (e) => {
        setTitle(e.target.value)
    }
    const handleDescriptionInput = (e) => {
        setDescription(e.target.value)
    }
    const handleLanguageInput = (selectedLanguage) => {
        setSelectedLanguage(selectedLanguage)
    }
    const handlePublisherInput = (selectedPublisher) => {
        setSelectedPublisher(selectedPublisher)
    }
    const handleCategoriesChange = (selectedCategories) => {
        setSelectedCategories(selectedCategories)
    }
    const handleAuthorsChange = (selectedAuthors) => {
        setSelectedAuthors(selectedAuthors)
    }
    const handleImagesChange = (selectedImages) => {
      setSelectedImages(selectedImages)
    }
    const handleCloseModule = () => {
        setShowEditModule(false)
    }   
    const handleDeleteImage = (index) => {
      const updatedImages = selectedImages.filter((_,i) => i !== index)
      setSelectedImages(updatedImages)
    }
    const handleAddPhoto = () => {
      setSelectedImages([...selectedImages,{title: imageTitle, imageURL: imageURL}])
      setImageTitle('')
      setImageURL('')
      console.log(selectedImages);
    }
    const handleAcceptButton = () => {
        const authors = selectedAuthors.map(item => (
            {
                id: item.value
            }
        ))
        const categories = selectedCategories.map(item => (
            {
                id: item.value
            }
        ))
        const data = {
            id: book.id,
            title: title,
            description: description,
            originalLanguageID: selectedLanguage.value,
            publisherID: selectedPublisher.value,
            listOfBookAuthors: authors,
            listOfBookCategories: categories,
            listOfBookImages: selectedImages
        }
        console.log(data)
        putData(data)
        handleCloseModule()
    } 
    useEffect(() => {
        const fetchAll = async () => {
            try{
                getAuthors()
                getPublishers()
                getCategories()
                getLanguages()
                getItem(editedID)
            }catch(error){
                console.error(error)
            }
        }
        fetchAll()
    },[])

    useEffect(() => {
      const selected = languageOptions.find((x) => x.value === languageID)
      if(selected){
        setSelectedLanguage(selected)
      }
    },[languageOptions,languageID])

    useEffect(() => {
      const selected = publisherOptions.find((x) => x.value === publisherID)
      if(selected){
        setSelectedPublisher(selected)
      }
    },[publisherOptions,publisherID])

    useEffect(() => {
      const updatedSelectedAuthors = authors.reduce((selectedAuthors, item) => {
        const selected = authorOptions.find((option) => option.value === item.id);
        if (selected) {
          return [...selectedAuthors, selected];
        }
        return selectedAuthors;
      }, []);
      setSelectedAuthors(updatedSelectedAuthors);
    }, [authors, authorOptions]);

    useEffect(() => {
      const updatedSelectedCategories = categories.reduce((selectedCategories, item) => {
        const selected = categoryOptions.find((option) => option.value === item.id);
        if (selected) {
          return [...selectedCategories, selected];
        }
        return selectedCategories;
      }, []);
      setSelectedCategories(updatedSelectedCategories);
    }, [categories, categoryOptions]);

  return (
    <div className='module-wrapper' style={backgroundOverlayModule}>
        <div className='module-window'>
            <div className='module-content-wrapper'>
                <div className='module-header-row'>
                  <h1 className='module-header'>Edytuj książkę</h1>
                  <CloseWindowButton handleCloseModule={handleCloseModule} />
                </div>
                <input onChange={handleTitleInput} type='text' value={title} className='module-input-text'/>
                <textarea onChange={handleDescriptionInput} value={description} rows={5} className='module-input-textarea'/>
                <div className='grid grid-cols-2 gap-2'>
                  <Select onChange={handleLanguageInput} maxMenuHeight={100} value={selectedLanguage} options={languageOptions} isClearable={true} isSearchable={true} className="my-react-select-module-container my-2 w-full" classNamePrefix="my-react-select-module" placeholder='Język oryginału'/>
                  <Select onChange={handlePublisherInput} maxMenuHeight={100} value={selectedPublisher} options={publisherOptions} isClearable={true} isSearchable={true} className="my-react-select-module-container my-2 w-full" classNamePrefix="my-react-select-module" placeholder='Wydawnictwo'/>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <Select onChange={handleAuthorsChange} maxMenuHeight={100} value={selectedAuthors} options={authorOptions} isClearable={true} isSearchable={true} isMulti={true} className="my-react-select-module-container my-2 w-full" classNamePrefix="my-react-select-module" placeholder='Autor/autorzy'/>
                  <Select onChange={handleCategoriesChange} maxMenuHeight={100} value={selectedCategories} options={categoryOptions} isClearable={true} isMulti={true} isSearchable={true} className="my-react-select-module-container my-2 w-full" classNamePrefix="my-react-select-module" placeholder='Kategorie'/>
                </div>
                <div className='divider'></div>
                <p className='w-full text-sm mt-1 mx-1 font-[500] text-dracula-500 dark:text-dracula-400'>Zdjęcia książki:</p>
                {selectedImages && 
                <div className='flex flex-row flex-wrap'>
                <div className='grid grid-cols-3 gap-2 my-2'>
                  {selectedImages.map((item,index)=>(
                    <div key={index} className='flex flex-col rounded-md bg-dracula-200 dark:bg-dracula-800 dark:text-dracula-300'>
                      <div className='relative'>
                      <img src={item.imageURL} className='w-full h-auto object-contain rounded-t-md' />
                      <button onClick={() => handleDeleteImage(index)} className='module-minus-button'><FiMinus/></button>
                      </div>
                      <h3 className='p-2 text-xs'>{item.title}</h3>
                    </div>
                  ))}
                </div>
                </div>}
                <div className='flex flex-row items-center'>
                  <div className='grid grid-cols-[1fr_2fr] gap-2'>
                    <input onChange={handleImageTitleInput} value={imageTitle} type='text' placeholder='Tytuł zdjęcia' className='module-input-text'/>
                    <input onChange={handleImageURLInput} value={imageURL} type='text' placeholder='Adres URL' className='module-input-text'/>
                  </div>
                  <button className='module-round-button' onClick={handleAddPhoto}><FiPlus/></button>
                </div>
                <button onClick={handleAcceptButton} className='module-button'>Akceptuj</button>
            </div>
        </div>
    </div>
  )
}

export default EditBook
