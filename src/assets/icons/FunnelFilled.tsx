import {SVGProps} from "react";

const FunnelFilled = ({className, ...props}: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className={className}
        {...props}
    >
        <path fill="currentColor" fillRule="evenodd"
              d="M4 3a1 1 0 0 0-.8 1.6l5.6 7.467a1 1 0 0 1 .2.6V20a1 1 0 0 0 1.447.894l4-2A1 1 0 0 0 15 18v-5.333a1 1 0 0 1 .2-.6L20.8 4.6A1 1 0 0 0 20 3z"
              clipRule="evenodd"></path>
    </svg>
);

export default FunnelFilled;