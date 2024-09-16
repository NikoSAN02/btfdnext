import React from 'react'
import Image from 'next/image'
import FAQAccordion from './accordian'
import Footer from './footer'
function HomePage() {
  return (
    <main className='h-full w-full'>
    <div className="bg-[url('/images/bg-1.png')] h-screen	w-full bg-cover flex-1">
    </div>
    <div className='h-screen relative flex items-center justify-center'>
      <div className='absolute left-[813px] top-[13px]'>
        <Image
        src='/images/Etherium-1.png'
        alt=''
        height={226}
        width={226}
        />
      </div>
      <div className='absolute left-[-150px] rotate-15 skew-x-12 top-[425px]'>
        <Image
        src='/images/Etherium-1.png'
        alt=''
        height={314}
        width={314}
        />
      </div>
      <div className='absolute left-[1508px] rotate-15 skew-x-8 top-[495px]'>
        <Image
        src='/images/Etherium-1.png'
        alt=''
        height={298}
        width={298}
        />
      </div>
      <div className='font-extrabold text-5xl'>
      <div >WTF POINTS</div>
      <div>Coming Soon!</div>
      </div>
      
    </div>
    <div className='h-screen w-full flex items-center justify-center'>
      <FAQAccordion/>
    </div>
    <div className='p-5'>
      <Footer/>
    </div>
    </main>
    
  )
}

export default HomePage