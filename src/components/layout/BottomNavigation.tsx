'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid, ShoppingCart, Heart, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

// ============================================================================
// INTERFACES
// ============================================================================

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export interface BottomNavigationProps {
  className?: string
}

// ============================================================================
// NAV ITEMS
// ============================================================================

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Categories',
    href: '/products',
    icon: Grid,
  },
  {
    label: 'Cart',
    href: '/cart',
    icon: ShoppingCart,
  },
  {
    label: 'Favorites',
    href: '/dashboard/favorites',
    icon: Heart,
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
]

// ============================================================================
// BOTTOM NAVIGATION COMPONENT
// ============================================================================

export default function BottomNavigation({ className = '' }: BottomNavigationProps) {
  const pathname = usePathname()
  const { itemCount } = useCart()

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E9ECEF] md:hidden ${className}`}
      style={{ height: '70px' }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const isCart = item.label === 'Cart'

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              {/* Icon with badge */}
              <div className="relative">
                <Icon
                  className="w-6 h-6"
                  style={{
                    color: active ? '#FF6B35' : '#ADB5BD',
                  }}
                />
                
                {/* Cart Badge */}
                {isCart && itemCount > 0 && (
                  <div
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-white text-xs font-bold px-1"
                    style={{ backgroundColor: '#FF6B35' }}
                  >
                    {itemCount}
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className="text-xs mt-1 font-medium"
                style={{
                  fontSize: '11px',
                  color: active ? '#FF6B35' : '#ADB5BD',
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
