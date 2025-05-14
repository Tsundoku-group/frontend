const MinusRedCircle = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="256"
        height="256"
        viewBox="0 0 256 256"
        className={className}
    >
        <g
            transform="translate(1.4066 1.4066) scale(2.81 2.81)"
            style={{
                stroke: 'none',
                strokeWidth: 0,
                strokeDasharray: 'none',
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                strokeMiterlimit: 10,
                fill: 'none',
                fillRule: 'nonzero',
                opacity: 1,
            }}
        >
            <circle
                cx="45"
                cy="45"
                r="45"
                transform="matrix(1 0 0 1 0 0)"
                style={{
                    stroke: 'none',
                    strokeWidth: 1,
                    strokeDasharray: 'none',
                    strokeLinecap: 'butt',
                    strokeLinejoin: 'miter',
                    strokeMiterlimit: 10,
                    fill: 'rgb(230,62,50)',
                    fillRule: 'nonzero',
                    opacity: 1,
                }}
            />
            <path
                d="M 70.216 47 H 19.784 c -1.104 0 -2 -0.896 -2 -2 s 0.896 -2 2 -2 h 50.432 c 1.104 0 2 0.896 2 2 S 71.32 47 70.216 47 z"
                transform="matrix(1 0 0 1 0 0)"
                style={{
                    stroke: 'none',
                    strokeWidth: 1,
                    strokeDasharray: 'none',
                    strokeLinecap: 'butt',
                    strokeLinejoin: 'miter',
                    strokeMiterlimit: 10,
                    fill: 'rgb(255,255,255)',
                    fillRule: 'nonzero',
                    opacity: 1,
                }}
            />
        </g>
    </svg>
);

export default MinusRedCircle;