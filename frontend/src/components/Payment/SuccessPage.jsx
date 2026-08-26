// import React from 'react';
// import { useLocation, Link } from 'react-router-dom';
// import Navbar from '../Navbar';
// import Footer from '../Footer';

// const SuccessPage = () => {
//   const location = useLocation();
//   const orderId = location.state?.orderId;

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Navbar />

//       <div className="flex-grow flex items-center justify-center p-6">
//         <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
//           <div className="text-6xl mb-4">🎉</div>
//           <h2 className="text-3xl font-bold text-green-700">Payment Successful!</h2>
//           <p className="text-gray-600 mt-2">Your order has been confirmed.</p>
//           {orderId && (
//             <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
//           )}
//           <Link
//             to="/customer"
//             className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
//           >
//             Go to Dashboard
//           </Link>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default SuccessPage;
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const SuccessPage = () => {
  const location = useLocation();
  const { orderId, orderIds, fromCart } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-700">Payment Successful!</h2>
          <p className="text-gray-600 mt-2">
            {fromCart ? 'Your orders have been confirmed.' : 'Your order has been confirmed.'}
          </p>
          
          {/* ✅ Show single order ID */}
          {orderId && (
            <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
          )}
          
          {/* ✅ Show multiple order IDs (from cart) */}
          {orderIds && orderIds.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Order IDs:</p>
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {orderIds.map((id, index) => (
                  <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Link
            to="/customer"
            className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SuccessPage;