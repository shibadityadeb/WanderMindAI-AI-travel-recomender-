import { suggestions } from '@/app/_components/Hero'
import React from 'react'

function EmptyBoxState({onSelectOption}:any) {
  return (
    <div className='mt-7'>
      <h2 className='font-bold text-3xl text-center'>
        Start planning new <strong className='text-primary'>Trip</strong> using AI
      </h2>
      <p className='text-center text-gray-400 mt-2'>
        Discover personalized travel itineraries, find the best destinations, and plan your dream vacation effortlessly with the power of A.I. Let our smart assistant do the hard work while you enjoy the journey.
      </p>
    <div className="flex flex-col justify-between w-full mt-7">
      {suggestions.map((suggestion, index) => (
        <div key={index}
        onClick={()=>onSelectOption(suggestion.title)}
        className="flex items-center gap-1 border rounded-xl p-3 cursor-pointer hover:border-primary hover:text-primary">
          {suggestion.icon}
          <h2 className="text-lg">{suggestion.title}</h2>
        </div>
      ))}
    </div>
    </div>
  )
}

export default EmptyBoxState
