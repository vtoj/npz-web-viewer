import FileUploader from '@/components/dashboard/file-uploader/FileUploader'
import { GithubIcon } from 'lucide-react'
import Link from 'next/link'
import BgNoiseWrapper from '@/components/ui/texture-wrapper'
//
export default function Home() {
  return (
    <BgNoiseWrapper url="/cult-noise.png">
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">NPZ Viewer</span>
            <span className="block text-indigo-600 dark:text-indigo-400">Visualize Your Data</span>
          </div>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Upload and explore your NumPy array files (.npy/.npz) with our modern, intuitive viewer.
          </p>
        </div>

        <div className="relative">
          <FileUploader />
        </div>

        <footer className="mt-16 text-center">
          <Link className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400" href="https://github.com/anipr2002/npz-web-viewer">
            <GithubIcon className="h-4 w-4" />
            <span>View on GitHub</span>
          </Link>
        </footer>
      </div>
    </main>
    </BgNoiseWrapper>
  )
}