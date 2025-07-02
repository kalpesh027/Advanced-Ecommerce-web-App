import correct from './correct.png'



export  function Succesfull(){
    return(
     <>
     <div className="border h-48 shadow-lg w-72 rounded-3xl m-auto mt-40 p-5 bg-white">
         <img src={correct} className='h-12 m-auto mb-6'/>
         <h1 className='font-bold text-2xl text-center mb-5'>Order Cancelled Successfully</h1>
          </div>
     </>
    )
 }