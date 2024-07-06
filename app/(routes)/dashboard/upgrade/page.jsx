"use client"; 
import React from 'react'
import { useRouter } from 'next/navigation';

function Upgrade() {
  
  const router =useRouter();

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold' onClick={() => router.back()}> 🡠 Upgrade</h2>
      <div className='flex justify-center'>
      <img src='https://static.vecteezy.com/system/resources/previews/002/108/133/large_2x/promote-a-new-product-concept-vector.jpg' width='700px'/>
      </div>
    </div>
  )
}

export default Upgrade
