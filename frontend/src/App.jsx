import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/AdminLayout'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/user/Home'
import Login from './pages/user/Login'
import Register from './pages/user/Register'
import ProductList from './pages/user/ProductList'
import ProductDetail from './pages/user/ProductDetail'
import Cart from './pages/user/Cart'
import Checkout from './pages/user/Checkout'
import OrderHistory from './pages/user/OrderHistory'
import OrderDetail from './pages/user/OrderDetail'
import Profile from './pages/user/Profile'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import Categories from './pages/admin/Categories'
import Products from './pages/admin/Products'
import Orders from './pages/admin/Orders'
import OrderDetailAdmin from './pages/admin/OrderDetail'
import LowStock from './pages/admin/LowStock'
import Reviews from './pages/admin/Reviews'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminLayout><Users /></AdminLayout></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminLayout><Categories /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminLayout><Products /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminLayout><Orders /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders/:id" element={<AdminRoute><AdminLayout><OrderDetailAdmin /></AdminLayout></AdminRoute>} />
            <Route path="/admin/low-stock" element={<AdminRoute><AdminLayout><LowStock /></AdminLayout></AdminRoute>} />
            <Route path="/admin/reviews" element={<AdminRoute><AdminLayout><Reviews /></AdminLayout></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
