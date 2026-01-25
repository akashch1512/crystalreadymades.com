import React from 'react';
import { useCart } from '../../contexts/CartContext';

const OrderReview: React.FC = () => {
  const { items } = useCart();

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <h3 className="bg-gray-50 px-4 py-3 text-lg font-medium text-gray-900 border-b border-gray-200">
        Order Items
      </h3>
      
      <div className="divide-y divide-gray-200">
        {items.map(item => (
          <div key={item.id} className="flex p-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h4>{item.name}</h4>
                  <p className="ml-4">
                    ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 items-end justify-between text-sm">
                <p className="text-gray-500">Qty {item.quantity}</p>
                <div className="flex">
                  {item.salePrice && (
                    <p className="text-gray-500 line-through">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderReview;