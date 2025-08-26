"use client"

import HeroVideoDialog from '@/components/magicui/hero-video-dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import { ArrowDown, Globe2, Landmark, Plane, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export const suggestions=[
    {
        title:'Create New Trip',
        icon:<Globe2 className='text-blue-400 h-5 w-5 '/>
    },
    {
        title:'Inspire me where to go',
        icon:<Plane className='text-green-500 h-5 w-5'/>
    },
    {
        title:'Create New Trip',
        icon:<Landmark className='text-orange-500 h-5 w-5'/>
    },
    {
        title:'Create New Trip',
        icon:<Globe2 className='text-yellow-600 h-5 w-5'/>
    }

]


function Hero() {
const {user}=useUser();
const router=useRouter()
const onSend=()=>{
  if (!user){
    router.push('/sign-in')
    return
  }
  //navigate to create iternary webpage
  router.push('/create-new-trip')
}
  return (
    <div className='mt-25 flex justify-center'>
    {/*Content*/}
     <div className='max-w-3xl w-full text-center space-y-5'>
        <h1 className='text-xl md:text-5xl font-bold'>Hey, I'm your personal <span className='text-primary'>Trip Planner</span> </h1>
        <p className='text-lg'>Tell me what you want, and I'll handle the rest:Flights, Hotels, Trip planner - all in seconds </p>
         {/*Input Box */}
         <div>
            <div className='border rounded-2xl p-4 shadow'>
  <div className="flex flex-col">
    <Textarea
      placeholder='Create a iternary from Delhi to Paris..'
      className='w-full h-28 bg-transparent border-none resize-none'
    />
    <div className="flex justify-end mt-2">
  <Button size={'icon'} className="cursor-pointer" onClick={()=>onSend()}>
    <Send size={20} />
  </Button>
</div>
  </div>

{/*Suggestion list */}
<div className="flex justify-between w-full mt-3">
  {suggestions.map((suggestion, index) => (
    <div key={index} className="flex items-center gap-1 border rounded-full p-2 cursor-pointer hover:bg-primary hover:text-white">
      {suggestion.icon}
      <h2 className="text-sm">{suggestion.title}</h2>
    </div>
  ))}
</div>
<div className='flex items-center flex-col justify-center'>
<h2 className='my-7 mt-14 flex gap-2 text-center space-y-6 '>Not Sure where to start? <strong>See how it works</strong><ArrowDown/></h2>
{/*Video Section */}
<HeroVideoDialog
  className="block dark:hidden"
  animationStyle="from-center"
  videoSrc="https://www.example.com/dummy-video"
  thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
  thumbnailAlt="Dummy Video Thumbnail"
/>
</div>
</div>
         </div>
     </div>
     
    </div>
  )
}

export default Hero
