import Link from 'next/link'

export function Navigation() {
  return (
    <nav className="bg-slate-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:text-slate-300">
            Home
          </Link>
        </li>
        <li>
          <Link href="/analysis" className="hover:text-slate-300">
            Analysis
          </Link>
        </li>
      </ul>
    </nav>
  )
}