import React from 'react';
import { useCart } from '../../contexts/CartContext';

const formatCurrency = (value: number) => `Rs. ${value.toFixed(2)}`;

const OrderReview: React.FC = () => {
  const { items, subtotal, tax, shipping, discount, total } = useCart();

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {items.map(item => {
          const itemPrice = item.salePrice || item.price;
          const itemTotal = itemPrice * item.quantity;
          const originalTotal = item.price * item.quantity;

          return (
            <div
              key={item.id}
              className="flex gap-3 rounded-xl border border-line bg-surface p-3"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-line bg-surface-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover object-center"
                />
                <span className="absolute right-1.5 top-1.5 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold leading-5 text-white">
                  {item.quantity}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="line-clamp-2 text-sm font-medium leading-5 text-text">
                  {item.name}
                </h4>
                <p className="mt-1 text-xs text-muted">
                  Qty {item.quantity}
                  {typeof item.availableQuantity === 'number' && (
                    <span> - {item.availableQuantity} available</span>
                  )}
                </p>
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-semibold text-text">
                    {formatCurrency(itemTotal)}
                  </span>
                  {item.salePrice && (
                    <span className="text-xs text-muted line-through">
                      {formatCurrency(originalTotal)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-line bg-surface-muted/60 p-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4 text-muted">
            <span>Subtotal</span>
            <span className="font-medium text-text">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between gap-4 text-muted">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between gap-4 text-muted">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between gap-4 text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="divider flex justify-between gap-4 pt-3 text-base font-semibold text-text">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
