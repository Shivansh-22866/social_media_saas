'use client'

import Link from "next/link"
import {SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useAuth} from '@clerk/nextjs'
import {useState, useEffect} from 'react'
import { Menu, X, Zap } from "lucide-react"

export function Navbar() {
    const {userId} = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    })

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-md' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-4 sm:px-8 py-4 sm:py-6">
                <div className="flex justify-between items-center flex-wrap max-w-6xl mx-auto">
                    <div className="flex items-center">
                        <Link href={"/"} className="flex items-center space-x-2">
                            <Zap className="w-8 h-8 text-blue-800" />
                            <span className="text-xl sm:text-2xl font-bold text-white" >SocialWarp</span>
                        </Link>
                    </div>
                    <button className="sm:hidden text-white focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                    <div className={`w-full sm:w-auto ${isMenuOpen ? 'block' : 'hidden'} sm:block mt-4 sm:mt-0`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
                            {['Features', 'Pricing', 'Docs'].map((item) =>(
                                <Link key={item} href={`/${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors py-2 sm:py-0 relative group">
                                    {item}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            ))}
                            {userId && (
                                <Link href={'/generate'} className="text-gray-300 hover:text-white transition-colors py-2 sm:py-0 relative group" >
                                    Dashboard
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            )}
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="text-gray-300 hover:text-white transition-colors mt-2 sm:mt-0">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="text-gray-300 hover:text-white hover:bg-blue-800 bg-blue-600 py-2 px-4 rounded-full transition-colors mt-2 sm:mt-0">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton appearance={{
                                    elements: {
                                        avatarBox: 'w-10 h-10'
                                    }
                                }} ></UserButton>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}