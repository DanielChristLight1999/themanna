import StartSession from '@/components/pos/start-session'
import { getActivePOSSession } from '@/lib/pos-data/getposdata'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
    const ActiveposSession = await getActivePOSSession()
    if (ActiveposSession) {
       redirect('/')
    }
    return (
        <div>
            <StartSession />
        </div>
    )
}

export default page