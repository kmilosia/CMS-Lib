import React from 'react'
import WebsiteLayoutLink from '../components/links/WebsiteLayoutLink'

function WebsiteLayout() {
  return (
    <div className='main-wrapper overflow-y-auto page-scrollbar'>
        <h1 className='main-header'>Strona internetowa</h1>    
        <div className='flex flex-col mx-2'>
            <div className='flex flex-col border-b border-slate-200 dark:border-dracula-700 my-1 py-2'>
            <h2 className='text-lg text-dracula-500 font-medium'>Footer</h2>
            <div className='flex flex-wrap'>
                <WebsiteLayoutLink title="Kolumna w footerze" path='/footer-kolumna' />
                <WebsiteLayoutLink title="Link w footerze" path='/footer-link' />
            </div>
            </div>
            <div className='flex flex-col border-b border-slate-200 dark:border-dracula-700 my-1 py-2'>
            <h2 className='text-lg text-dracula-500 font-medium'>Navbar</h2>
            <div className='flex flex-wrap'>
                <WebsiteLayoutLink title="Linki w menu" path='/navbar-link' />
            </div>
            </div>
            <div className='flex flex-col border-b border-slate-200 dark:border-dracula-700 my-1 py-2'>
            <h2 className='text-lg text-dracula-500 font-medium'>Elementy stron</h2>
            <div className='flex flex-wrap'>
                <WebsiteLayoutLink title="Baner" path='/baner' />
                <WebsiteLayoutLink title="Baner promocyjny" path='/baner-promocyjny' />
                <WebsiteLayoutLink title="Element kategorii" path='/element-kategorii' />
            </div>
            </div>
         </div>
    </div>
  )
}

export default WebsiteLayout
