import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AuthProvider from './components/AuthProvider';
import AuthRequired from "./components/AuthRequired";
import Layout from "./components/Layout";
import Feed from "./components/Feed";
import ArticleList from "./components/ArticleList";
import ArticleCreate from "./components/ArticleCreate";
import ArticleView from "./components/ArticleView";
import Comments from "./components/Comments";
import Search from "./components/Search";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Accounts from "./components/Accounts";
import NotFound from "./components/NotFound";
import FollowersList from "./components/FollowersList";
import FollowingList from "./components/FollowingList";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 인증이 필요한 Route */}
          <Route path="/" element={
            <AuthRequired>
              <Layout />
            </AuthRequired>
          }>
            <Route index element={<Feed />} />
            <Route path="articles" element={<ArticleList />} />
            <Route path="search" element={<Search />} />
            <Route path="create" element={<ArticleCreate />} />
            <Route path="articles/:articleId">
              <Route index element={<ArticleView />} />
              <Route path="comments" element={<Comments />} />
            </Route>
            <Route path="profile/:username" element={<Profile />} />
            <Route path="profile/:username/followers" element={<FollowersList />} />
            <Route path="profile/:username/following" element={<FollowingList />} />
            <Route path="accounts/edit" element={<Accounts />} />
          </Route>

          {/* 인증이 필요하지 않은 Route */}
          <Route path="login" element={<Login />} /> 
          <Route path="register" element={<Register />} /> 
          <Route path="*" element={<NotFound />}/> 
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App;
