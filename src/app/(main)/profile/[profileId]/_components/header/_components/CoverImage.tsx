import Image from "next/image";
import React from "react";

const CoverImage = ({ coverImageUrl }: { coverImageUrl?: string }) => (
    <div className="w-full h-24 bg-gray-700 rounded-t-2xl overflow-hidden">
        {coverImageUrl ? (
            <Image src={coverImageUrl} alt="Cover" width={300} height={400} className="object-cover" />
        ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600" />
        )}
    </div>
);

export default CoverImage;