import {Facebook, Instagram, Twitter} from "lucide-react";
import React from "react";

const SocialLinks = ({ x, instagram, facebook }: { x?: string; instagram?: string; facebook?: string }) =>
    x || instagram || facebook ? (
        <div className="flex space-x-4">
            {x && (
                <a href={x} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-6 h-6 hover:text-blue-400 transition-colors" />
                </a>
            )}
            {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-6 h-6 hover:text-pink-400 transition-colors" />
                </a>
            )}
            {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-6 h-6 hover:text-blue-700 transition-colors" />
                </a>
            )}
        </div>
    ) : null;


export default SocialLinks;