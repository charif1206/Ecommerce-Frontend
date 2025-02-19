import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import AdminDashboard from "./pages/Admin/AdminDachbord";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ResetPasswordVerify from "./pages/auth/ResetPasswordVerify";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Home from "./pages/home/home";
import CartPage from "./pages/payment/CartPage";
import CheckOutPage from "./pages/payment/CheckOutPage";
import PurchaseSuccessPage from "./pages/payment/PurchaseSuccessPage";
import ProductDetails from "./pages/productdetails/ProductDetails";
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
                <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/login" />} />
                <Route
                    path="/checkout"
                    element={user ? <CheckOutPage /> : <Navigate to="/login" />}
                />
                <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
                <Route
                    path="/checkout-success"
                    element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
                />

                {/* Admin Route */}
                <Route
                    path="/admin"
                    element={
                        user && user.roles === "admin" ? <AdminDashboard /> : <Navigate to="/" />
                    }
                />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
