import Orders from './pages/Admin/mobile/Orders/Orders';
import OrdersDesktop from './pages/Admin/desktop/Orders/OrdersDesktop';

// function App() {

//   return (
//     <Orders />
//   )
// }

// export default App


import { useMediaQuery } from 'react-responsive';

function App() {
  const isMobile = useMediaQuery({ maxWidth: 1080 });
  
  return (
    <div>
      {isMobile ? <Orders /> : <OrdersDesktop />}
    </div>
  );
}

export default App
