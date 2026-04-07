import Script from "next/script";
import { JITSI_EXTERNAL_API_URL } from "@/app/lib/runtime-config";

export const metadata = {
    title: "Live Call",
    description: "Video calling with Jitsi",
};

export default function LiveCallLayout({ children }) {
    return (
        <>
            <Script
                src={JITSI_EXTERNAL_API_URL}
                strategy="beforeInteractive"
            />
            {children}
        </>
    );
}