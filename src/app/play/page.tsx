import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeoGuesserClient } from '@/components/play/GeoGuesserClient'
import { CometGame } from '@/components/games/CometGame'
import { ogImageUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Play',
  description: 'A couple of small games — guess locations from orbit, or fly a comet.',
  openGraph: {
    title: 'Play',
    description: 'A couple of small games — guess locations from orbit, or fly a comet.',
    images: [ogImageUrl('Play', 'page', 'Guess locations from orbit, or fly a comet.')],
  },
  twitter: { card: 'summary_large_image' },
}

export default function PlayPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <h1 className="font-display text-text text-4xl font-bold tracking-tight sm:text-5xl">
          Play
        </h1>
        <p className="text-text-muted mt-4 max-w-xl text-lg">
          Two small games. Guess where on Earth a satellite is looking, or steer a comet through a
          field of rocks.
        </p>

        <Tabs defaultValue="geo" className="mt-10">
          <TabsList>
            <TabsTrigger value="geo">Where on Earth</TabsTrigger>
            <TabsTrigger value="comet">Comet Run</TabsTrigger>
          </TabsList>

          <TabsContent value="geo" className="pt-8">
            <GeoGuesserClient />
          </TabsContent>

          <TabsContent value="comet" className="pt-8">
            <div className="mx-auto max-w-2xl">
              <CometGame variant="inline" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  )
}
