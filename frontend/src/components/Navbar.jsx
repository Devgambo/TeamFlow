import React from 'react'
import { NavLink, Link } from 'react-router-dom'

function Navbar() {
    return (
        <div className="bg-[url('https://source.unsplash.com/random')]">
        <div className='flex justify-between items-center sticky top-0 z-10 backdrop-blur-xl'>
            <div className='flex items-center'>
                <Link to="/">
                    <div>
                        <img src="src/assets/logo.png" alt="logo" className='w-35'/>
                    </div>
                </Link>
                <h1 className='text-4xl font-bold font-roboto-flex hidden md:block'>TEAMFLOW</h1>
            </div>
            <div className='text-xs md:text-2xl'>
                <div className='flex items-center gap-4 mr-10 '>
                    <Link to="/about">
                        <span className='text-white font-roboto-slab'>
                            About
                        </span>
                    </Link>
                    <Link to="/signup">
                        <div className='rounded-full px-4 py-2' style={{ backgroundColor: '#310963' }}>
                            <span className='text-white font-roboto-slab'>Signup</span>
                        </div>
                    </Link>
                    <Link to="/login">
                        <span className='text-white font-roboto-slab'>
                            Login
                        </span>
                    </Link>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Navbar
