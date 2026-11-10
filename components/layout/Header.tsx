import Link from "next/link";

const Header = () => {
    return (
        <header className="flex items-center justify-around px-4 py-4 bg-card border-b border-border">
            <h1 className="text-2xl font-bold">Likhon</h1>
            <div>
                <Link href="/login" className="bg-button text-button-foreground px-4 py-2 rounded-xl">Login</Link>
            </div>
        </header>
    )
}

export default Header;