import {  useState } from 'react'
import fetchMovies from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import toast, { Toaster } from "react-hot-toast";
import MovieModal from '../MovieModal/MovieModal';
import css from "./App.module.css"




function App() {


const [movies, setMovies] = useState<Movie[]>([]);
const [loading, setLoading] = useState(false);
const [selectedMovie, setSelectedMovie] = useState<Movie |null>(null);


const handleSearch = async(query:string) => {
  try {
    setLoading(true);
    setMovies([]);
    

    const result = await fetchMovies(query)

    if(result.length === 0) {
      toast.error("No movies found for your request.");
      return;
    }
    setMovies(result);


  } catch(error) {
    console.error(error);
    toast.error("There was an error, please try again...");
  } finally{
    setLoading(false);
  }
};

const handleSelectMovie = (movie: Movie) => {
  setSelectedMovie(movie);
  
}

const handleCloseModal = () => {
  setSelectedMovie(null)
}



 
 

  return (
    <>
    <Toaster position='top-right'/>
    <SearchBar onSearch={handleSearch}/>
    <div className={css.app}>
      {loading&& <Loader/>}
      {!loading && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal}/>
        
      )}


    </div>


      
    </>
  )



}
export default App