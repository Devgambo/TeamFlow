import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignupMutation } from "@/features/auth/authApiSlice"
import { useDispatch } from "react-redux"
import { setUserCredentials } from "@/features/auth/authSlice"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"

const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    avatar: z
        .custom((fileList) => fileList instanceof FileList && fileList.length > 0, "Avatar is required")
        .transform((fileList) => fileList[0]), // Convert FileList to single file
    role: z.enum(["MEMBER", "ADMIN"], { message: "Role must be either Member or Admin" }),
})


export function SingupForm({ className }) {


    const {
        register,
        handleSubmit,
        setValue
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            role: "MEMBER",
            avatar: undefined
        }
    })
    const { user, isLoggedIn } = useSelector((state) => state.auth)
    const [signup, { isLoading }] = useSignupMutation();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoggedIn && user) {
            if (user.role === "ADMIN") {
                navigate("/dashboard-admin")
            } else if (user.role === "MEMBER") {
                navigate("/dashboard-member")
            }
        }
    }, [isLoggedIn, user, navigate])


    const onSubmit = async (data) => {
        try {
            console.log(data)
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('role', data.role);
            formData.append('avatar', data.avatar);
            
            const response = await signup(formData).unwrap()
            toast.success("User signed up successfully")
            dispatch(setUserCredentials(response.data))
            console.log(response)
        } catch (error) {
            console.error(error)
            toast.error(error?.data?.message || "Something went wrong")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create a new account</h1>
                <p className="text-balance text-sm text-slate-500 dark:text-slate-400">
                    Enter all the required details and enjoy Teamflow
                </p>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input {...register("username")} name="username" id="username" type="username" placeholder="username" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input {...register("email")} name="email" id="email" type="email" placeholder="x@xox.com" required />
                </div>
                <div className="grid gap-2">
                    {/* TODO: EYE OPENER FOR PASSWORD */}
                    <div className="flex items-center">
                        <Label htmlFor="password">Create Password</Label>
                    </div>
                    <Input {...register("password")} name="password" id="password" type="password" placeholder="********" required />
                </div>
                <div className="gap-2 flex flex-row">
                    <Label
                        htmlFor="avatar-upload"
                        className={`
                        flex flex-row gap-2.5
                        bg-base-content hover:scale-105
                        p-4 rounded-full cursor-pointer 
                        transition-all duration-200`}
                    >
                        <Camera className="w-5 h-5 text-base-200" />
                        Upload avatar
                        <Input
                            {...register("avatar")}
                            name="avatar"
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                        />
                    </Label>
                    <div className="py-3">
                        <Select
                            defaultValue="MEMBER"
                            onValueChange={(value) => setValue("role", value)} // Use setValue instead
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MEMBER">Member</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button type="submit" className=" cursor-pointer w-full">
                    SignUp
                </Button>

                <div
                    className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-200 dark:after:border-slate-800">
                    <span
                        className="relative z-10 bg-purple-950 rounded-full px-2 text-white dark:bg-slate-950 dark:text-grey-400">
                        Or continue with
                    </span>
                </div>

                {/* TODO : GOOGLE AUTH */}
                <Button disabled={isLoading} variant="ghost" className=" w-full">
                    <svg width="62" height="63" viewBox="0 0 62 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M59.659 26.023L34.3693 26.0217C33.2526 26.0217 32.3474 26.9414 32.3474 28.0761V36.2852C32.3474 37.4196 33.2526 38.3395 34.3692 38.3395H48.6108C47.0513 42.4519 44.1407 45.8958 40.4272 48.0841L46.4997 58.7656C56.2409 53.0411 62 42.997 62 31.7532C62 30.1523 61.8838 29.0078 61.6516 27.7192C61.475 26.7401 60.6385 26.023 59.659 26.023Z" fill="#167EE6" />
                        <path d="M30.9961 50.6739C24.0266 50.6739 17.9422 46.8046 14.6745 41.0789L4.16263 47.2354C9.51203 56.656 19.5332 62.9999 30.9961 62.9999C36.6194 62.9999 41.9255 61.4615 46.4963 58.7804V58.7658L40.4238 48.0841C37.6461 49.7211 34.4317 50.6739 30.9961 50.6739Z" fill="#12B347" />
                        <path d="M46.5005 58.78V58.7654L40.4279 48.0837C37.6502 49.7206 34.4361 50.6735 31.0002 50.6735V62.9996C36.6236 62.9996 41.9299 61.4611 46.5005 58.78Z" fill="#0F993E" />
                        <path d="M12.1306 31.4999C12.1306 28.0092 13.0682 24.7435 14.6789 21.9212L4.16702 15.7646C1.51394 20.3945 0 25.7714 0 31.4999C0 37.2285 1.51394 42.6054 4.16702 47.2352L14.6789 41.0787C13.0682 38.2564 12.1306 34.9907 12.1306 31.4999Z" fill="#FFD500" />
                        <path d="M30.9961 12.3261C35.5409 12.3261 39.7156 13.967 42.9763 16.6965C43.7808 17.3698 44.9499 17.3212 45.6868 16.5725L51.411 10.7561C52.247 9.90659 52.1875 8.51604 51.2944 7.72879C45.8312 2.91288 38.7228 0 30.9961 0C19.5332 0 9.51203 6.3439 4.16263 15.7646L14.6745 21.9211C17.9422 16.1954 24.0266 12.3261 30.9961 12.3261Z" fill="#FF4B26" />
                        <path d="M42.9805 16.6965C43.7849 17.3698 44.9542 17.3212 45.691 16.5725L51.4152 10.7561C52.2511 9.90659 52.1915 8.51604 51.2985 7.72879C45.8353 2.91276 38.727 0 31.0002 0V12.3261C35.545 12.3261 39.7197 13.967 42.9805 16.6965Z" fill="#D93F21" />
                    </svg>
                    Google
                </Button>
            </div>
            <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                    Log In
                </a>
            </div>
        </form>
    );
}