import React from 'react'
import Image from 'next/image'
import FAQAccordion from './accordian'
import Footer from './footer'
function HomePage() {
  return (
    <main className='h-full w-full'>
    <div className="bg-[url('/images/bg-1.png')] h-[500px] sm:h-screen sm:w-full	w-screen bg-cover sm:bg-cover flex-1">
    </div>
    <div className='h-full sm:mt-0 mt-8 sm:h-screen relative flex items-center justify-center'>
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
      <div className='font-bold sm:w-2/4 sm:text-[30px] text-[20px] z-10 w-2/4 flex flex-col items-center justify-center gap-5'>
      <div >Get ready for a wild ride as three unlikely amigos join forces across continents to build a no-loss capital for social games cuz losing capital is fkin haram! After years of frustration from getting rugged, these social impact superheroes, they're about to unleash a meme-worthy revolution that'll make the world go, "Wowzers, that's epic!"
<br/>
<br/>
Enter BTFD church and join the cult now - https://linktr.ee/btfdwtf
Join our campaign and win BIG - https://soquest.xyz/space/btfd</div>
      <button className='p-2 pl-4 pr-4 font-semibold text-[16px] bg-gradient-to-r from-[#933FFE] to-[#18C8FF] rounded-md'>Get Started</button>
      </div>
      
    </div>
    <div className=" h-full	w-full flex items-center justify-center">
    <Image
    className='h-screen w-screen'
    src='/images/3bppl about usv6 1.png'
    alt=''
    height={2000}
    width={2000}
    />
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