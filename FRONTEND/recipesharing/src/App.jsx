import { BrowserRouter, Route, Routes } from "react-router-dom"
import  Home  from "./components/Home.jsx";
 import About  from "./components/About.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx"
import Profile from "./components/Profile.jsx";
import MainHomePage from "./components/MainHomePage.jsx";
const App = () =>{
return <>
    <BrowserRouter>

   <Routes>
   <Route  path ="/" element={<Home />} />
   <Route path="/Register" element={<Register />} />
   <Route path="/login" element={<Login />} />
   <Route path="/Profile" element={<Profile />} />
   <Route path="/MainHomePage" element = {<MainHomePage />} />
   </Routes>

    </BrowserRouter>
</>
}

export default App;