import { Link } from "react-router-dom";
import { MinusCircleIcon } from "@heroicons/react/24/outline";

function Favorites({ favorites, removeFromFavorites }) {
  return (
    <div className="w-full px-[2%] sm:px-[10%]">
      <p className="text-4xl font-bold mt-10 mb-12 text-center">Избранное</p>
      {favorites.length === 0 ? (
        <p>У вас пока нет избранных</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map((photo) => (
            <div key={photo.id} className="relative">
              <Link to={`/photo/${photo.id}`}>
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  className="w-full h-60 object-cover rounded"
                />
              </Link>
              <MinusCircleIcon
                onClick={() => removeFromFavorites(photo.id)}
                className="absolute w-10 top-2 right-2 p-2 bg-red-500 text-white rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
