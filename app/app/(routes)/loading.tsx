import LoadingComponent from '@/components/Apps/common/loading'
import React from 'react'

const Loading = () => {
  return (
    <LoadingComponent className='min-h-screen' variant="pulse" size="lg" message="Loading..." showProgress={true} />
  )
}

export default Loading