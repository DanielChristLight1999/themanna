"use client"
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Loader2, PlayIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePOSStore } from '@/stores/usePOSStore'
import { createPOSSession } from '@/actions/pos/session-actions'
import { toast } from 'sonner'
import { useState } from 'react'

const StartSession = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const initSession = usePOSStore((state) => state.initSession)

    const startSession = async () => {
        setLoading(true)
        const result = await createPOSSession()

        if (result.error) {
            toast.error(result.message)
            setLoading(false)
            return
        }

        const { session } = result
        if (!session) {
            toast.error('Failed to start POS session')
            setLoading(false)
            return
        }
        initSession(
            session.staffId,
            session.staff.name || 'Unknown Cashier',
            session.id,
            new Date(session.openedAt)
        )

        toast.success('POS session started')
        setLoading(false)
        router.replace('/')
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Start POS Session</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-6">Start a new POS session to begin processing transactions</p>
                    <Button disabled={loading} onClick={startSession} size="lg" className="w-full">

                        {loading ? <Loader2 /> : 
                        <div className='flex items-center justify-center'>
                            <PlayIcon className="mr-2 h-5 w-5" />
                            Start New Session
                        </div>}

                    </Button>
                </CardContent>
            </Card>

        </div>
    )
}

export default StartSession