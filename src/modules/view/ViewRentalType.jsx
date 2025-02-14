import React, { useEffect, useState } from 'react'
import { backgroundOverlayModule } from '../../styles'
import CloseWindowButton from '../../components/buttons/CloseWindowButton'

function ViewRentalType(props) {
    const [type, setType] = useState({})
    const handleCloseModule = () => {
        props.setEditedID(null)
        props.setShowViewModule(false)
      }
    useEffect(()=>{
        props.getItem(props.editedID,setType)
    },[])
  return (
    <div className='module-wrapper center-elements' style={backgroundOverlayModule}>
        <div className='module-window'>
            <div className='module-content-wrapper'>
            <div className='module-header-row'>
                    <h1 className='module-header'>{type?.name}</h1>
                    <CloseWindowButton handleCloseModule={handleCloseModule} />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col col-span-2'>
                    <p className='column-info-title'>Nazwa</p>
                    <h2 className='column-info-text'>{type?.name}</h2>
                </div>
                <div className='flex flex-col'>
                    <p className='column-info-title'>Dni wypożyczenia</p>
                    <h2 className='column-info-text'>{type?.days}</h2>
                </div>
                <div className='flex flex-col'>
                    <p className='column-info-title'>Cena</p>
                    <h2 className='column-info-text'>{type?.price}PLN</h2>
                </div>
                </div>         
            </div>
        </div>
    </div>
  )
}

export default ViewRentalType
