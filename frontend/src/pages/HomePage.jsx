import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
function HomePage() {
    return (
        <div>
            <Navbar />
            <div className='flex px-10 py-10'>
                <div>
                    <div className='text-7xl font-bold font-roboto-slab py-10 px-10' style={{ color: '#9CB2E8' }}>
                        Supercharge Your <br />Teamwork
                    </div>
                    <div className='text-4xl font-road-rage py-10 px-10' style={{ color: '#9CB2E8' }}>
                        A powerful platform for seamless team <br />
                        collaboration, task management, and real-time <br />
                        tracking. Organize projects, boost productivity, <br />
                        and stay on top of deadlines effortlessly
                    </div>
                    <div  className='px-8'>
                    <ShimmerButton  className="shadow-2xl">
                        <span className="whitespace-pre-wrap font-righteous text-center text-2xl font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                            GET STARTED
                        </span>
                    </ShimmerButton>
                    </div>
                </div>
                <div className='w-2xl hidden md:block absolute right-10 top-30 opacity-78'>
                    <img src="src/assets/Hero.png" alt="home-image" />
                </div>
            </div>
        </div>
    )
}

export default HomePage
