import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ResetPasswordVerify from "./pages/auth/ResetPasswordVerify";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Home from "./pages/home/home";
import CartPage from "./pages/payment/CartPage";
import OrderSuccessPage from "./pages/payment/OrderSuccessPage";
import SellerUpgradeSuccessPage from "./pages/payment/SellerUpgradeSuccessPage";
import ProductDetails from "./pages/productdetails/ProductDetailsPage";
import Profile from "./pages/Profile/Profile";
import Shop from "./pages/shop/Shop";
import useAuthStore from "./zustand/authStore";

function App() {
    const user = useAuthStore((state) => state.user); // Access user from Zustand store

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                {/* Public Routes */}
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
            <Footer />
        </BrowserRouter>
    );
}

export default App;
