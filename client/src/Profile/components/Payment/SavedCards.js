import React from 'react'
import Process from '../../../Routers/Process'
import visa from './visa.png'
import upi from './upilogo.png'

const SavedCards = () => {
  return (
    // <div>
    //   <Process/>
    // </div>
    <>
    <div className='border h-64 w-96 rounded-2xl m-5 bg-gradient-to-r from-yellow-300 to-yellow-600'>
      <img src={upi} className=' h-14 w-2/4 m-2 '/>
   <h1 className='text-white text-3xl font-semibold m-12 my-13'>45xx xxxx xxxx 9362</h1>
   <div className=' h-12 '>
           <img src={visa} className='border h-12 w-28 ml-64  rounded-xl '/>
   </div>

  </div>
  <h2 className='font-bold text-blue-500 w-40 ml-auto text-right mr-10 mb-5 '>+ ADD NEW CARD</h2>

  <hr/>
  </>
  )
}

export default SavedCards
