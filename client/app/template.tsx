"use client";

import { useState } from "react";
import { PageContext } from "@/app/Contexts/PageContext";

export default function Template({ children }: { children: React.ReactNode }) {
    const [pageVisible, setPageVisible] = useState(false);

    return (
        <PageContext.Provider value={{ pageVisible, setPageVisible }}>
            {children}
        </PageContext.Provider>
    );
}
