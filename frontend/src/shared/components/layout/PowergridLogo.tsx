import { Link } from 'react-router-dom'
import logoUrl from '../../../../assets/logo.png'

interface PowergridLogoProps {
  className?: string
}

export default function PowergridLogo({ className = '' }: PowergridLogoProps) {
  return (
    <Link to="/" className={`inline-flex items-center ${className}`.trim()} aria-label="Go to POWERGRID home">
      <img src={logoUrl} alt="POWERGRID" className="h-10 w-auto object-contain" />
    </Link>
  )
}
