import {SVGProps} from "react";

const StatsIcon = ({className, ...props}: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 48 48"
        className={className}
        {...props}
    >
        <rect width="7.68" height="34.586" x="20.16" y="6.707" fill="currentColor" stroke="currentColor" strokeLinecap="round"
              strokeLinejoin="round" rx="2.327"></rect>
        <rect width="7.68" height="15.244" x="33.821" y="26.049" fill="currentColor" stroke="currentColor" strokeLinecap="round"
              strokeLinejoin="round" rx="2.327"></rect>
        <rect width="7.68" height="24.721" x="6.5" y="16.572" fill="currentColor" stroke="currentColor" strokeLinecap="round"
              strokeLinejoin="round" rx="2.327"></rect>
    </svg>
);

export default StatsIcon;