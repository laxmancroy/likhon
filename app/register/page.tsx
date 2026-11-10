"use client";

import { signUp } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        await signUp.email(
            {
                name,
                email,
                password,
            },
            {
                onSuccess: () => {
                    router.push("/dashboard");
                },
                onError: (ctx) => {
                    setError(ctx.error.message);
                }
            },
        );
    }
    return (
        <div className="min-h-[calc(100vh-120px)] flex items-center  justify-center">
            <div className="w-full max-w-md bg-card text-card-foreground px-4 py-6 border border-border rounded-xl">
                <h2 className="text-2xl font-bold text-center">Create and Account</h2>
                <form onSubmit={handleSignup}>
                    <label className="block text-sm font-medium py-2">Name</label>
                    <input 
                    type="text" 
                    value={ name }
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full border border-border py-3 px-4 outline-none rounded-xl placeholder:text-sm focus:border-button" required />
                    <label className="block py-2 text-sm font-medium">Email</label>
                    <input 
                    type="email" 
                    value={ email }
                    onChange={ (e) => setEmail(e.target.value) }
                    placeholder="john@email.com" 
                    className="w-full border border-border py-3 px-4 rounded-xl outline-none placeholder:text-sm focus:border-button" required />
                    <label className="block py-2 text-sm font-medium">Password</label>
                    <input 
                    type="text" 
                    value={ password }
                    onChange={ (e) => setPassword(e.target.value) }
                    placeholder="Enter your password" 
                    className="w-full border border-border px-4 py-3 outline-none rounded-xl focus:border-button" />
                    <input type="submit" value="Registration" className="w-full bg-button text-button-foreground rounded-xl py-3 my-4 hover:cursor-pointer" required />
                </form>
                <p className="text-center">If you have already an account, <Link href="/login" className="text-button">Log In</Link></p>
            </div>

        </div>
    )
}

export default Register;