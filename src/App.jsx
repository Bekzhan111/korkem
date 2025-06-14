import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Home from "./components/Home";
import PhotoDetails from "./components/PhotoDetails";
import Favorites from "./components/Favorites";
import logo from "./assets/logo.png";
import { HeartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function App() {
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const location = useLocation();

  const addToFavorites = (photo) => {
    const updatedFavorites = [...favorites, photo];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (photoId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== photoId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const isHomePage = location.pathname === "/";
  const isFavoritesPage = location.pathname === "/favorites";
  const isPhotoDetailsPage = location.pathname.startsWith("/photo/");

  const showSearchLink = isFavoritesPage || isPhotoDetailsPage;
  const showFavoritesLink = isHomePage || isPhotoDetailsPage;

  return (
    <div className="min-h-screen">
      <div className="bg-black text-white w-full flex justify-between items-center py-4 px-[2%] sm:px-[10%]">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-10" />
        </Link>
        <div className="flex space-x-4 sm:space-x-8">
          {showSearchLink && (
            <Link
              to="/"
              className="text-white hover:text-yellow-300 transition-transform duration-200 flex items-center hover:scale-105"
            >
              <MagnifyingGlassIcon className="h-8 w-8 mr-2" />
              <span className="hidden sm:inline">Поиск</span>
            </Link>
          )}

          {showFavoritesLink && (
            <Link
              to="/favorites"
              className="text-white hover:text-yellow-300 transition-transform duration-200 flex items-center hover:scale-105"
            >
              <HeartIcon className="h-8 w-8" />
              <span className="hidden ml-2 sm:inline">Избранное</span>
            </Link>
          )}
        </div>
      </div>
      {isHomePage && (
        <div className="w-full flex justify-center">
          <Home />
        </div>
      )}
      <Routes>
        <Route
          path="/photo/:id"
          element={
            <PhotoDetails
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
              favorites={favorites}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              removeFromFavorites={removeFromFavorites}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
