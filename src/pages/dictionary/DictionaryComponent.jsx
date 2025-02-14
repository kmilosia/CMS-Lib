import React, { useRef, useEffect } from 'react';
import SortBar from '../../components/SortBar';
import Searchbar from '../../components/Searchbar';
import AddNewButton from '../../components/buttons/AddNewButton';
import { dictionarySortOptions } from '../../utils/select-options';
import ListHeader from '../../components/ListHeader';
import { dictionaryColumns } from '../../utils/column-names';
import { AiFillEdit } from 'react-icons/ai';
import { FaSave } from 'react-icons/fa';
import { BsTrash3Fill } from 'react-icons/bs';
import { useState } from 'react';
import Spinner from '../../components/Spinner';

function DictionaryComponent(props) {
  const inputRef = useRef(null)
  const [nameValue, setNameValue] = useState('')
  const [error, setError] = useState(null)
  const handleEditClick = (itemID, itemName) => {
    if (props.editedID === null){
      props.setEditedID(itemID)
      setNameValue(itemName)
    }else{
      props.setEditedID(null)
      setNameValue('')
    }
  }
  const handleInputChange = (e) => {
    setNameValue(e.target.value)
  }
  const handleSaveClick = (id) => {
    if(nameValue === ''){
      setError("Wartość nie może być pusta")
    }else{
    if(error){
      setError(null)
    }
    props.putData(id, nameValue)
    props.setEditedID(null)
    }
  }
  const handleDeleteClick = (id) => {
    props.deleteData(id)
  }
  useEffect(() => {
    if (props.editedID !== null){
      inputRef.current.focus()
    }
  }, [props.editedID])

  return (
    <>
      <div className='main-wrapper'>
        <div className='flex flex-col'>
          <h1 className='main-header'>{props.title}</h1>
          <div className='filter-panel'>
            <SortBar
              options={dictionarySortOptions}
              setSelectedOption={props.setSelectedOption}
              selectedOption={props.selectedOption}
              isAscending={props.isAscending}
              setIsAscending={props.setIsAscending}
            />
            <Searchbar setSearchValue={props.setSearchValue} searchValue={props.searchValue} />
            {props.writePermission &&                                          
            <AddNewButton setShowNewModule={props.setShowNewModule} title={props.title} />}
          </div>
          <ListHeader columnNames={dictionaryColumns} />
        </div>
        {props.isDataLoading ? (
          <Spinner />
        ) : (
          <div className='main-list-wrapper'>
            {props.filteredItems.map((item) => (
              <div key={item.id} className='table-row-wrapper'>
                <p className='px-2'>{item.id}</p>
                {props.editedID !== null && props.editedID === item.id ? (
                  <div className='flex flex-col'>
                  <input
                    ref={inputRef}
                    type='text'
                    onChange={handleInputChange}
                    value={nameValue}
                    className='module-input-text'
                  />
                  {error && <p className='error-text'>{error}</p>}
                  </div>
                ) : (
                  <p className='px-2'>{item.name}</p>
                )}
                <div className='flex justify-end'>
                  {props.editedID !== null && props.editedID === item.id && (
                    <button onClick={() => handleSaveClick(item.id)} className='table-button'>
                      <FaSave />
                    </button>
                  )}
                  {props.editPermission &&                                          
                  <button onClick={() => handleEditClick(item.id, item.name)} className='table-button'>
                    <AiFillEdit />
                  </button>}
                  {props.deletePermission &&                                          
                  <button onClick={() => handleDeleteClick(item.id)} className='table-button'>
                    <BsTrash3Fill />
                  </button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default DictionaryComponent
