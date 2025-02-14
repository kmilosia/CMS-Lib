import React from 'react'
import { useState } from 'react'
import { backgroundOverlayModule } from '../../styles'
import CloseWindowButton from '../../components/buttons/CloseWindowButton'
import DefaultInput from '../../components/forms/DefaultInput'
import DefaultSelect from '../../components/forms/DefaultSelect'
import { useEffect } from 'react'
import { supplyValidate } from '../../utils/validation/newValidate'
import { convertDate } from '../../utils/functions/convertDate'
import Select from 'react-select'
import { IoClose } from "react-icons/io5";
import { getDeliveryStatuses, getFormBookItems, getPaymentMethods, getSuppliers } from '../../api/selectAPI'

function NewSupply({setShowNewModule, postData}) {
    const [errors,setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [suppliers, setSuppliers] = useState([])
    const [books, setBooks] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const [deliveryStatuses, setDeliveryStatuses] = useState([])
    const [selectedBook, setSelectedBook] = useState(null)
    const [bruttoPrice, setBruttoPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [productError, setProductError] = useState(null)
    const [values, setValues] = useState({
      bookItems: [],
      deliveryDate: '',
      paymentMethodID: null,
      deliveryStatusID: null,
      supplierID: null,
    })
    const handleDateChange = (e) => {
      setValues({ ...values, deliveryDate: e.target.value })
    }   
    const handleDeliveryStatusChange = (selectedOption) => {
      setValues({ ...values, deliveryStatusID: selectedOption })
    }
    const handlePaymentMethodChange = (selectedOption) => {
      setValues({ ...values, paymentMethodID: selectedOption })
    }
    const handleSupplierChange = (selectedOption) => {
      setValues({ ...values, supplierID: selectedOption })
    }
    const handleBooksChange = (selectedBook) => {
      setSelectedBook(selectedBook)
    }
    const removeBookItem = (id) => {
      const updatedBookItems = values.bookItems.filter(item => item.id !== id)
      setValues({ ...values, bookItems: updatedBookItems })
    }
    const addNewProduct = () => {
      if((selectedBook.value.formName === 'Book' && (quantity <= 0 || !quantity)) || (bruttoPrice <= 0 || !bruttoPrice)){
        setProductError("Wprowadź prawidłowe dane (ilość ani cena brutto nie mogą być mniejsze niż 1!")
      }else{
        const existingBook = values.bookItems.find(item => item.id === selectedBook.value.id)
        if(!existingBook){
          const currentBookItems = values.bookItems
          const newBookItem = {
            ...selectedBook.value,
            bruttoPrice: Number(bruttoPrice)
          }
          if(selectedBook.value.formName === 'Book'){
            newBookItem.quantity = Number(quantity)
          }
          const updatedBookItems = [...currentBookItems, newBookItem]
          setValues({ ...values, bookItems: updatedBookItems })
        }
        setSelectedBook(null)
        setQuantity(0)
        setBruttoPrice(0)
        setProductError(null)
      }
    }
    const handleCloseModule = () => {
        setShowNewModule(false)
    }          
    const handleAcceptButton = () => {
        setSubmitting(true)
        setErrors(supplyValidate(values))
      } 
      const finishSubmit = () => {
        const convertedDate = convertDate(values.deliveryDate)
        const data = {
          supplierId: values.supplierID.value,
          deliveryStatusId: values.deliveryStatusID.value,
          paymentMethodId: values.paymentMethodID.value,
          deliveryDate: convertedDate,
          bookItems: values.bookItems.map((item) => {
            const bookItemData = {
              bookItemId: item.id,
              bruttoPrice: item.bruttoPrice
          }
          if(item.quantity) {
              bookItemData.quantity = item.quantity
          }
          return bookItemData
          }),
        }
          postData(data)
          handleCloseModule()
        }
      useEffect(() => {
        if (Object.keys(errors).length === 0 && submitting) {
          finishSubmit()
        }
      }, [errors])
    useEffect(() => {
      getFormBookItems(setBooks)
      getPaymentMethods(setPaymentMethods)
      getDeliveryStatuses(setDeliveryStatuses)
      getSuppliers(setSuppliers)
    },[])
  return (
    <div className='module-wrapper' style={backgroundOverlayModule}>
    <div className='module-window'>
        <div className='module-content-wrapper'>
        <div className='module-header-row'>
              <h1 className='module-header'>Dodaj nową dostawę</h1>
              <CloseWindowButton handleCloseModule={handleCloseModule} />
            </div>
            <div className='grid grid-cols-2 gap-2'>
                <DefaultSelect name="supplierID" error={errors.supplierID} onChange={handleSupplierChange} value={values.supplierID} options={suppliers} title='Dostawca' placeholder='Dostawca'/>
                <DefaultInput name="deliveryDate" onChange={handleDateChange} value={values.deliveryDate} error={errors.deliveryDate} type='date' title='Data dostawy'/>
                <DefaultSelect name="paymentMethodID" error={errors.paymentMethodID} onChange={handlePaymentMethodChange} value={values.paymentMethodID} options={paymentMethods} title='Metoda płatności' placeholder='Metoda płatności'/>
                <DefaultSelect name="deliveryStatusID" error={errors.deliveryStatusID} onChange={handleDeliveryStatusChange} value={values.deliveryStatusID} options={deliveryStatuses} title='Status dostawy' placeholder='Status dostawy'/>
            </div>
            <div className='divider' />
            <h2 className='font-semibold text-xl text-dracula-600 dark:text-dracula-300 mb-2'>Produkty</h2>
            <div className='grid grid-cols-1 gap-2'>
              <div className='flex flex-col mb-1'>
                  <Select value={selectedBook} name='bookItems' id='bookItems' onChange={handleBooksChange} maxMenuHeight={140} placeholder="Dodaj produkt" options={books} isClearable={true} isSearchable={true}className="my-react-select-module-container w-full" classNamePrefix="my-react-select-module"/>
                  {selectedBook &&
                  <>
                  <div className='grid grid-cols-2 gap-2 mt-2'>
                    <DefaultInput name="bruttoPrice" onChange={(e) => {setBruttoPrice(e.target.value)}} value={bruttoPrice} type='number' title='Cena brutto'/>
                    {selectedBook?.value?.formName === 'Book' &&
                    <DefaultInput name="quantity" onChange={(e) => {setQuantity(e.target.value)}} value={quantity} type='number' title='Ilość'/>
                    }
                    <button onClick={addNewProduct} className='default-border-button w-max self-end'>Dodaj produkt</button>
                  </div>
                  {productError && <p className='error-text'>{productError}</p>}
                  </>
                  }
              </div>
              <div className='grid grid-cols-1 gap-2'>
                {values.bookItems.length > 0 && values.bookItems.map((item,index) => {
                  return(
                    <div key={index} className='flex flex-row items-center justify-between border-2 border-gray-200 dark:border-dracula-700 rounded-md p-3 dark:text-white'>
                      <div className='flex flex-col'>
                        <h1 className='font-semibold'>{item.bookTitle}</h1>
                        <h2 className='text-sm'>{item.formName === 'Book' ? 'Książka' : 'Ebook'}</h2>
                        <h3 className='text-xs font-light mt-1'>ISBN {item.isbn}</h3>
                      </div>
                      <div className='flex flex-col items-end justify-start h-full'>
                        <button onClick={() => removeBookItem(item.id)} className='text-xl dark:text-white'><IoClose /></button>
                        <div className='flex flex-col mt-4 text-sm font-light items-end'>
                          {item.quantity && <p>Ilość: {item.quantity}</p>}
                          <p>Cena brutto: {item?.bruttoPrice?.toFixed(2)}zł</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {errors.bookItems && <p className='error-text'>{errors.bookItems}</p>}
            </div>
            <button onClick={handleAcceptButton} className='module-button'>Akceptuj</button>
        </div>
    </div>
</div>
  )
}

export default NewSupply
