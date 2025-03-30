export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm sm:text-base font-medium">
                    &copy; {new Date().getFullYear()}{" "}
                    <span className="text-white font-semibold">DasTeck</span>. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
}
