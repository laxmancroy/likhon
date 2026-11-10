"use client";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        await signIn.email({
            email,
            password,
        }, {
            onSuccess: () => {
                router.push("/dashboard");
            },
            onError: (ctx) => {
                setError(ctx.error.message);
            }
        });

    }

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-10 bg-background text-foreground">
            <div className="w-full max-w-md bg-card text-card-foreground border border-border p-8 rounded-2xl">
                <h2 className="text-center font-bold text-2xl mb-4">Login to Likhon</h2>
                <form onSubmit={handleLogin}>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email" 
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-button mb-3" 
                        required />
                    <br />
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password" 
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-button mb-3" 
                        required />
                    <br />
                        {
                            error && (
                                <p className="text-red-500">
                                    {error}
                                </p>
                            )
                        }
                    <br />
                    <input type="submit" value="Login" className="bg-button text-button-foreground font-semibold w-full py-3 rounded-xl hover:cursor-pointer" />
                </form>
                <p className="text-center mt-3">Not a User? <Link href="/register" className="text-button">Register Now</Link>.</p>
            </div>

        </div>
    )
}

export default Login;