(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__e053aab0._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/app/lib/auth.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/request/cookies.js [middleware-edge] (ecmascript)");
;
async function auth() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
    return {
        token: cookieStore.get('token')?.value || null,
        userName: cookieStore.get('userName')?.value || null,
        email: cookieStore.get('email')?.value || null,
        phone: cookieStore.get('phone')?.value || null,
        role: cookieStore.get('role')?.value || null
    };
}
}),
"[project]/src/middleware.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$auth$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/auth.js [middleware-edge] (ecmascript)");
;
;
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/consultation',
    '/records',
    '/Medical-assistant'
];
const authRoutes = [
    '/login',
    '/signup'
];
async function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    // console.log(token);
    const isProtectedRoute = protectedRoutes.some((route)=>pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route)=>pathname.startsWith(route));
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    if (isProtectedRoute && token) {
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$auth$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["auth"])();
        if (!data.userName || data.userName.trim() === '') {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
            response.cookies.delete('token');
            response.cookies.delete('userName');
            response.cookies.delete('email');
            response.cookies.delete('phone');
            response.cookies.delete('role');
            return response;
        }
        if (pathname.startsWith('/dashboard/')) {
            const pathParts = pathname.split('/');
            const requestedRole = pathParts[2];
            const requestedId = pathParts[3];
            if (requestedRole && requestedRole !== data.role) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(`/dashboard/${data.role}/${data.userName}`, request.url));
            }
            if (requestedId && requestedId !== data.userName) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(`/dashboard/${data.role}/${data.userName}`, request.url));
            }
        }
    }
    if (isAuthRoute && token) {
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$auth$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["auth"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(`/dashboard/${data.role}/${data.userName}`, request.url));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__e053aab0._.js.map