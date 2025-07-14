import React from 'react'
import AdsPage from './pageClient'
import { getAllflyers } from '@/lib/getData'

const page = async () => {
    const flyers = await getAllflyers()
  return (
    <div>
        <AdsPage initialFlyers={flyers} />
    </div>
  )
}

export default page