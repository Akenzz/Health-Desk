module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/app/api/auth/login/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
const SALT = '53KLGWV4CDV0bymo';
const BASE_API_URL = ("TURBOPACK compile-time value", "http://localhost:9112") || 'http://localhost:9112';
function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha256').update(password + SALT).digest('hex');
}
function validateLoginData(data) {
    const errors = {};
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Invalid email format';
    }
    if (!data.password || data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }
    if (![
        'patient',
        'doctor',
        'admin',
        'pharmacist'
    ].includes(data.role)) {
        errors.role = 'Invalid role';
    }
    return errors;
}
async function fetchUserName(email, phone, role, token) {
    try {
        let apiUrl;
        console.log("Fetching user name for email:", email, "role:", role);
        if (role === 'patient') {
            apiUrl = `${BASE_API_URL}/read/data/patient-name?email=${encodeURIComponent(phone)}`;
        } else if (role === 'doctor') {
            apiUrl = `${BASE_API_URL}/read/data/doctor-name?email=${encodeURIComponent(email)}`;
        } else if (role === 'pharmacist') {
            return 'Test Pharmacist';
        }
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch user name: ${response.status}`);
        const result = await response.json();
        return result.value || 'Unknown-User';
    } catch (error) {
        console.error('Error fetching user name:', error);
        return 'Unknown-User';
    }
}
async function fetchPatientPhone(email, token) {
    try {
        const apiUrl = `${BASE_API_URL}/read/data/patient-phone?email=${encodeURIComponent(email)}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch patient phone: ${response.status}`);
        const result = await response.json();
        return result.value || null;
    } catch (error) {
        console.error('Error fetching patient phone:', error);
        return null;
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, role, roleCode } = body;
        const validationErrors = validateLoginData({
            email,
            password,
            role
        });
        if (Object.keys(validationErrors).length > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            }, {
                status: 400
            });
        }
        const hashedPassword = hashPassword(password);
        const authUrl = `${BASE_API_URL}/auth/check/password?email=${encodeURIComponent(email)}&password=${hashedPassword}&role=${roleCode}`;
        const authResponse = await fetch(authUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!authResponse.ok) {
            const errorText = await authResponse.text();
            console.error('Authentication API error:', errorText);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Authentication service unavailable'
            }, {
                status: 502
            });
        }
        const authResult = await authResponse.json();
        if (!authResult.valid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Invalid credentials'
            }, {
                status: 401
            });
        }
        let phone = null;
        if (role === 'patient') {
            phone = await fetchPatientPhone(email, authResult.token);
        }
        const userName = await fetchUserName(email, phone, role, authResult.token);
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Login successful',
            userName,
            role,
            email
        });
        response.cookies.set({
            name: 'token',
            value: authResult.token,
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 12
        });
        response.cookies.set('userName', userName);
        response.cookies.set('role', role);
        response.cookies.set('email', email);
        if (role === 'patient' && phone) {
            response.cookies.set('phone', phone);
        }
        return response;
    } catch (error) {
        console.error('Login API error:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Unable to connect to authentication service'
            }, {
                status: 503
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        message: 'Method not allowed'
    }, {
        status: 405
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__05f69e61._.js.map