import cross from './cross.png'
import { useState } from 'react';
import { Succesfull } from './Sucessfull';



const Cancelorder=()=>{

    const [showsuccess, setShowSuccess] = useState(false);


    const SucessModel = () => {
        return (
          <div className='w-full fixed inset-0 flex justify-center items-center backdrop-opacity-65 bg-black/30'>
            <div className=' rounded-lg  p-6 relative w-full sm:w-2/3 lg:w-1/2'>
              {/* <button onClick={closeDetails} className='absolute top-2 right-2 text-2xl font-bold'>×</button> */}
              <Succesfull/>
            </div>
          </div>
        );
      };

    return(
     <>
     <div className="border h-80 shadow-lg w-72 rounded-3xl m-auto mt-40 p-5 bg-white">
         <img src={cross} className='h-12 m-auto mb-6'/>
         <h1 className='font-bold text-xl text-center mb-5'>Are You Sure You Want To Cancel Order ?</h1>
        <div className='flex'> <input type='checkbox'/><p className='text-sm ml-3'> Delete associated shipping lable and tracking info</p></div>
        <div className='mt-10 mx-6'>
        <button onClick={()=>setShowSuccess(true)} className='px-7 py-2 bg-gradient-to-t from-red-400 to-red-600  rounded-xl mr-4 mb-2 border-2 font-bold'>Yes</button>
        {showsuccess && <SucessModel/>}
        <button className='px-7 py-2 bg-gradient-to-t from-cyan-400 to-blue-500  rounded-xl  mb-2 border-2  font-bold ml-2'>No</button></div>
     </div>
     </>
    )
 }

 export default Cancelorder;