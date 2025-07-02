import { Route, Routes } from 'react-router-dom';
import './App.css';
import CustomersRoute from './Routers/CustomersRoute';
import AdminRouters from './Routers/AdminRouters';
import MyprofileRouters from './Routers/MyprofileRouters';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './Routers/ProtectedRoute';

function App() {
  return (
    <div className="">
      <ToastContainer />
      <Routes>
        <Route path="/*" element={<CustomersRoute />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole={["ADMIN"]}>
              <AdminRouters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myprofile/*"
          element={
            <ProtectedRoute requiredRole={['CUSTOMER', 'ADMIN']}>
              <MyprofileRouters />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
