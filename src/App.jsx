// Import routing components from react-router-dom for application navigation
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

// Import layout components (header and footer)
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

// Import authentication related pages
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ResetPasswordVerify from "./pages/auth/ResetPasswordVerify";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Import main application pages
import Home from "./pages/home/home";
import CartPage from "./pages/payment/CartPage";
import OrderSuccessPage from "./pages/payment/OrderSuccessPage";
import SellerUpgradeSuccessPage from "./pages/payment/SellerUpgradeSuccessPage";
import ProductDetails from "./pages/productdetails/ProductDetailsPage";
import Profile from "./pages/Profile/Profile";
import Shop from "./pages/shop/Shop";

// Import authentication state management
import useAuthStore from "./zustand/authStore";

function App() {
    // Get current user from Zustand authentication store
    const user = useAuthStore((state) => state.user);

    return (
        // Set up router for the entire application
        <BrowserRouter>
            {/* Global header component appears on all pages */}
            <Header />

            {/* Define all application routes */}
            <Routes>
                {/* Public Routes - Accessible to all users */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/users/:id/password-reset/:token" element={<ResetPasswordVerify />} />
                <Route path="/reset-password/:id/:token" element={<ResetPasswordPage />} />
                <Route path="/users/:userId/verify/:token" element={<VerifyEmail />} />

                {/* Protected Routes - Only accessible if user is authenticated */}
                {/* Navigate to login if user tries to access without authentication */}
                <Route
                    path="/profile/:id"
                    element={user ? <Profile /> : <Navigate to="/login" />}
                />

                <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />

                <Route
                    path="/order-success"
                    element={user ? <OrderSuccessPage /> : <Navigate to="/login" />}
                />

                <Route
                    path="/seller-upgrade-success"
                    element={user ? <SellerUpgradeSuccessPage /> : <Navigate to="/login" />}
                />
            </Routes>

            {/* Global footer component appears on all pages */}
            <Footer />
        </BrowserRouter>
    );
}


export default App;