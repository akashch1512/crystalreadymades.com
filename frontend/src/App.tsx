import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ProductProvider } from './contexts/ProductContext';
import { OrderProvider } from './contexts/OrderContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';
import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <NotificationProvider>
                <OrderProvider>
                  <ToastProvider>
                    <AppRouter />
                  </ToastProvider>
                </OrderProvider>
              </NotificationProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
