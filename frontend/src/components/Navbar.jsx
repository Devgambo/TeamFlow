import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '@/features/auth/authSlice'
import toast from 'react-hot-toast'
import { useLogoutMutation } from '@/features/auth/authApiSlice'
function Navbar() {

    const [logout, {isLoading}] = useLogoutMutation('logout')
    const { isLoggedIn, user } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const logoutHandler = async()=>{
        try {
            const response = await logout()
            toast.success(`${response.message}`)
            console.log(response)
            dispatch(logoutUser())
            navigate("/")
        } catch (error) {
            console.error(error)
            toast.error(error?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className="bg-[url('https://source.unsplash.com/random')]">
            <div className='flex justify-between items-center sticky top-0 z-10 backdrop-blur-xl'>
                <div className='flex items-center'>
                    <Link to="/">
                        <div>
                            <img src="src/assets/logo.png" alt="logo" className='w-35' />
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
                        {!isLoggedIn ?
                        <>
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
                        </>
                        :
                        <>
                        <button disabled={isLoading} className='cursor-pointer' onClick={()=>logoutHandler()}>
                            <div className='rounded-full px-4 py-2' style={{ backgroundColor: '#310963' }}>
                                <span className='text-white font-roboto-slab'>Logout</span>
                            </div>
                        </button>
                        <div>
                            {/* AVATAR CIRCLE :TODO  --onclicking should redirect to profile page*/}
                            <span className='text-white font-roboto-slab'>
                                {user.username}
                            </span>
                        </div>
                        </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
