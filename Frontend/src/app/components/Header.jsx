import Link from "next/link";
import { auth } from "../lib/auth";

export default async function Header() {

    const session = (await auth()).userName;

    return (
        <header className="bg-linear-to-r from-cyan-500 to-blue-500 shadow-lg border-b border-cyan-400">
            <div className="w-full px-3 sm:px-5 lg:px-12 flex items-center justify-between h-14 sm:h-16">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity duration-200 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 shrink-0 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <img
                                src="/logo.png"
                                alt="website-logo"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white hover:text-blue-50 transition-colors duration-200 drop-shadow-sm truncate">
                            HealthDesk
                        </h1>
                    </div>
                </Link>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {session ? (
                        <Link href="/profile" className="hover:opacity-90 transition-opacity duration-200">
                            <img
                                className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full border-2 sm:border-3 border-white hover:border-blue-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                                src="/user.png"
                                alt="user"
                                width={48}
                            />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link href="/signup">
                                <button className="bg-blue-600 hover:bg-blue-100 text-white hover:text-slate-900 font-semibold text-xs sm:text-sm px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl border-2 border-white transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap">
                                    Signup
                                </button>
                            </Link>

                            <Link href="/login">
                                <button className="bg-white hover:bg-blue-50 text-cyan-600 hover:text-blue-600 font-semibold text-xs sm:text-sm px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl border-2 border-white hover:border-blue-100 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap">
                                    Login
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}