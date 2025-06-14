import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  HeartIcon,
  BackspaceIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

function PhotoDetails({ addToFavorites, removeFromFavorites, favorites }) {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/${id}?client_id=${
            import.meta.env.VITE_UNSPLASH_API_KEY
          }`
        );
        const data = await response.json();
        setPhoto(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photo details:", error);
        setLoading(false);
      }
    };
    fetchPhoto();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!photo) return <div className="text-center mt-10">Photo not found</div>;
  console.log(favorites);

  const isFavorite = favorites.find((fav) => fav.id === photo.id);

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.urls.regular);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      let filename = photo.alt_description || "unnamed_photo";
      filename = filename
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 20)
        .toLowerCase();
      link.download = `${filename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="relative w-full px-[2%] sm:px-[10%]">
      <img
        src={photo.urls.regular}
        alt="background"
        className="absolute inset-0 w-full h-[70%] object-cover z-0 brightness-50 hidden sm:block"
      />
      <div className="relative z-10 w-full">
        <div className="container mx-auto flex justify-between items-center py-[20px]">
          <div className="flex items-center">
            <img
              src={photo.user.profile_image.small}
              alt={photo.user.name}
              className="rounded-[7px] border border-white mr-2 w-12 h-12 sm:w-10 sm:h-10"
            />
            <div>
              <p className="text-black sm:text-white text-xl">
                {photo.user.name}
              </p>
              <p className="text-gray-500 sm:text-white text-sm">{`@${photo.user.username}`}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() =>
                isFavorite
                  ? removeFromFavorites(photo.id)
                  : addToFavorites(photo)
              }
              className="w-10 h-10 bg-white rounded-[5px] flex items-center justify-center shadow hover:shadow-md transition"
            >
              {isFavorite ? (
                <BackspaceIcon className="w-6 h-6 text-black" />
              ) : (
                <HeartIcon className="w-6 h-6 text-black" />
              )}
            </button>
            <button
              onClick={handleDownload}
              className="bg-yellow-400 text-black px-3 py-2 rounded flex items-center justify-center gap-2"
            >
              <ArrowDownTrayIcon className="h-6 w-6" />
              <span className="hidden mr-2 sm:inline text-lg">Download</span>
            </button>
          </div>
        </div>
        <img
          src={photo.urls.regular}
          alt={photo.alt_description}
          className="max-h-screen w-auto object-contain mx-auto mb-14"
        />
      </div>
    </div>
  );
}

export default PhotoDetails;
