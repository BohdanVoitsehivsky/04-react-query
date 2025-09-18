import {  useEffect, useState } from 'react'
import fetchMovies, { type MovieHttpResponse } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import toast, { Toaster } from "react-hot-toast";
import MovieModal from '../MovieModal/MovieModal';
import css from "./App.module.css"
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ReactPaginate from 'react-paginate';




function App() {



const [query, setQuery] = useState("");
const [page, setPage] = useState(1);
const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
const {data, isLoading, isError} = useQuery<MovieHttpResponse>({
  queryKey: ["movies", query, page],
  queryFn: ()=> fetchMovies(query, page),
  enabled: Boolean(query),
  placeholderData: keepPreviousData,
})
const movies = data?.results ?? [];
const totalPages = data?.total_pages ?? 0;

useEffect(()=> {
  if(!isLoading && query && movies.length === 0) {
    toast.error("No movies found for your request.")
  }
},[movies, isLoading, query])


const handleSearch = (newQuery:string) => {
  if(newQuery !== query) {
    setQuery(newQuery);
    setPage(1);
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
      {isLoading && <Loader/>}
      {isError && toast.error("There was an error, please try again...")}
     {!isLoading && movies.length > 0 && (
      <>
        
      

      {totalPages > 1 && (
        <ReactPaginate 
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
        />

      )}
      <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal}/>
        
      )} 


    </div>


      
    </>
  )



}
export default App