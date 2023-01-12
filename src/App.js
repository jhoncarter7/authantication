import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AuthContext from "./store/Auth-Context";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        {!authCtx.isLoggedIn && <Route path="/auth" element={<AuthPage />}></Route>}
       {authCtx.isLoggedIn && <Route path="/profile" element={<UserProfile />}>
        </Route>}
        {!authCtx.isLoggedIn && <Route path="*"  element={<Navigate to="/auth"/>}></Route>}
        
      </Routes>
    </Layout>
  );
}

export default App;
