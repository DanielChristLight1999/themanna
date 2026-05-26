import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

const GoToWhatsapp = () => {
  return (
    <Link className='fixed bottom-20 right-10 z-50' href="https://wa.link/2ae0t3" target="_blank">
        <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full bg-green-500 text-white"
        >
            <Image src="/whatsapp.svg" alt="Whatsapp" width={20} height={20} />
        </Button>
    </Link>
  )
}

export default GoToWhatsapp