import { SingupForm } from '@/components/singup-form'
import React from 'react'
function SignupPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="src/assets/image3.png"
                    alt="Image"
                    className="absolute left-20 w-3xl object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="absolute w-38 top-0 left-0">
                    <a href="/">
                        <img src="src/assets/logo.png" alt="image" />
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <SingupForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage
