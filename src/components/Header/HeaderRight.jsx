import useAuthStore from "@/zustand/authStore";
import useCartStore from "@/zustand/cartStore";
import {CgProfile} from "react-icons/cg";
import {CiShoppingCart} from "react-icons/ci";
import {FiLogIn, FiUserPlus} from "react-icons/fi";
import {MdAddShoppingCart} from "react-icons/md";
import {Link} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import axiosInstance from "@/Axios/AxiosInstance";
import {RiCoinsFill} from "react-icons/ri";

export default function HeaderRight() {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const items = useCartStore((state) => state.items);
    const setCartItems = useCartStore((state) => state.setCartItems);
    const cartCount = items.length;
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Logout Mutation
    const {mutate: logout} = useMutation({
        mutationFn: () =>
            axiosInstance.post("/auth/logout", null, {
                withCredentials: true,
            }),
        onMutate: () => {
            // Immediate client-side cleanup for better UX
            localStorage.removeItem("userInfo");
            localStorage.removeItem("cartItems");
            setUser(null);
            setCartItems([]);
            queryClient.clear();
        },
        onSuccess: () => {
            navigate("/login", {replace: true});
        },
        onError: (error) => {
            console.error("Logout error:", error);
            navigate("/login", {replace: true});
        },
    });

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <div className="flex items-center gap-6">
            {/* Profile Link with Image and Name */}
            {user && (
                <Link to={`/profile/${user._id}`} className="hidden md:flex items-center gap-2">
                    <div className="relative">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture.url}
                                alt="Profile"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                                <CgProfile />
                            </div>
                        )}
                    </div>
                    <p className="capitalize text-gray-700 hover:text-black transition-colors">
                        {user.name || "Profile"}
                    </p>
                </Link>
            )}

            {/* Cart Link */}
            <Link to="/cart" className="hidden md:block">
                <NavItem icon={<MdAddShoppingCart />} title="Cart" count={cartCount} />
            </Link>

            {/* Shop Link */}
            <Link to="/shop" className="hidden md:block">
                <NavItem icon={<CiShoppingCart />} title="Shop" />
            </Link>

            {/* Coins Display - Clickable to Profile with coupons tab */}
            {user && (
                <Link
                    to={`/profile/${user._id}?tab=coupons`}
                    className="hidden md:flex items-center gap-2 cursor-pointer"
                >
                    <RiCoinsFill className="h-6 w-6 text-yellow-500" />
                    <span className="font-semibold text-gray-700">{user.coins}</span>
                </Link>
            )}

            {/* Auth Buttons */}
            {!user ? (
                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="hidden md:flex items-center px-5 py-2 border border-black text-black rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        <FiLogIn className="text-lg mr-2" />
                        <span>Login</span>
                    </Link>
                    <Link
                        to="/register"
                        className="hidden md:flex items-center px-5 py-2 bg-black text-white rounded-md shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        <FiUserPlus className="text-lg mr-2" />
                        <span>Register</span>
                    </Link>
                </div>
            ) : (
                <Link
                    to="#"
                    onClick={handleLogout}
                    className="hidden md:flex items-center px-5 py-2 border border-black text-black rounded-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    <FiLogIn className="text-lg mr-2" />
                    <span>Logout</span>
                </Link>
            )}
        </div>
    );
}

function NavItem({icon, title, count}) {
    return (
        <div className="flex items-center gap-2 group">
            <div className="relative">
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-xl group-hover:bg-gray-200 transition-colors">
                    {icon}
                </div>
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                        {count}
                    </span>
                )}
            </div>
            <p className="capitalize text-gray-700 group-hover:text-black transition-colors">
                {title}
            </p>
        </div>
    );
}
