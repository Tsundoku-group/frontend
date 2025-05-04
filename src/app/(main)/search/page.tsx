'use client';

import React from "react";

export default function Search({ searchParams }) {
    return (
        <>
            <p>{ searchParams.term }</p>
        </>
    )
}
