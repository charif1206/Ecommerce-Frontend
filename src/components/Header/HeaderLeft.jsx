import {Link} from "react-router-dom";

export default function HeaderLeft() {
    return (
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <span className="text-4xl font-extrabold text-gray-900 tracking-wide">
                Das
                <span className="text-4xl font-light text-gray-500 tracking-wide">
                    Tech<span className="text-5xl font-black text-yellow-500">.</span>
                </span>
            </span>
        </Link>
    );
}
