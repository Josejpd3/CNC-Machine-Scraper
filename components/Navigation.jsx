import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaRobot, FaChartBar } from 'react-icons/fa'

export function Navigation() {
  const currentPath = usePathname()

  return (
    <nav className="bg-white shadow-md p-4 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <FaRobot className="text-3xl text-red-600 mr-2" />
          <span className="text-xl font-bold">
            <span className="text-red-600">CNC</span>
            <span className="text-black">Analyzer</span>
          </span>
          <FaChartBar className="text-3xl text-black ml-2" />
        </div>
        <ul className="flex space-x-4 h-full">
          <li className="h-full flex items-center">
            <Link 
              href="/" 
              className={`text-slate-800 hover:text-slate-600 relative h-full flex items-center ${
                currentPath === '/' ? 'after:content-[""] after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-1 after:bg-red-500 after:shadow-[0_-5px_10px_0px_rgba(239,68,68,0.5)]' : ''
              }`}
            >
              Home
            </Link>
          </li>
          <li className="h-full flex items-center">
            <Link 
              href="/analysis" 
              className={`text-slate-800 hover:text-slate-600 relative h-full flex items-center ${
                currentPath === '/analysis' ? 'after:content-[""] after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-1 after:bg-red-500 after:shadow-[0_-5px_10px_0px_rgba(239,68,68,0.5)]' : ''
              }`}
            >
              Analysis
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}