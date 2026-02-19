import { Suspense } from "react";
import ShowsClient from "./ShowsClient";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ShowsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>}>
            <ShowsClient />
        </Suspense>
    );
}
