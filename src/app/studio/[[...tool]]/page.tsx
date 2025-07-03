/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import Link from 'next/link'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return (
    <>
      <div className="p-4">
        <Link href="/" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-medium mb-4">
          กลับหน้าหลัก
        </Link>
      </div>
      <NextStudio config={config} />
    </>
  )
}
