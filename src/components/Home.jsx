import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import background from "../assets/homeBackground.png";
import debounce from "lodash.debounce";

function Home() {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedQuery = useMemo(
    () =>
      debounce((value) => {
        fetchPhotos(value);
      }, 500),
    []
  );

  useEffect(() => {
    if (query === "") {
      fetchPhotos("");
    } else {
      debouncedQuery(query);
    }
    return () => debouncedQuery.cancel();
  }, [query]);

  const fetchPhotos = async (searchTerm) => {
    setLoading(true);
    try {
      const url = searchTerm
        ? `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=9&client_id=${
            import.meta.env.VITE_UNSPLASH_API_KEY
          }`
        : `https://api.unsplash.com/photos/random?count=9&client_id=${
            import.meta.env.VITE_UNSPLASH_API_KEY
          }`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPhotos(searchTerm ? data.results : data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="relative w-full h-[150px] sm:h-[100px] mb-[50px] sm:mb-0 flex items-center justify-center"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="flex justify-center w-full relative z-10">
          <div className="relative w-full p-5 sm:w-1/2">
            <input
              type="text"
              name="search"
              placeholder="Поиск"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 pl-10"
            />
            <MagnifyingGlassIcon className="absolute right-8 top-7 h-6 w-6 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="w-full h-[10px] hidden sm:block bg-[#C4C4C4] mb-[80px]" />

      {!loading ? (
        <div className="w-[96%] sm:w-[80%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 container mx-auto">
          {photos.map((photo) => (
            <div key={photo.id} className="relative">
              <Link to={`/photo/${photo.id}`}>
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  className="w-full h-48 object-cover rounded"
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="w-full text-center">Loading...</p>
      )}
    </div>
  );
}

export default Home;
