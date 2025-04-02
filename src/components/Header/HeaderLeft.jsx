import {Link} from "react-router-dom";

export default function HeaderLeft() {
    return (
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <span className="text-4xl font-bold tracking-wide font-poppins text-gray-900">
                Das
                <span className="text-4xl font-medium tracking-wide text-gray-500">
                    Tech<span className="text-5xl font-bold text-yellow-500">.</span>
                </span>
            </span>
        </Link>
    );
}
