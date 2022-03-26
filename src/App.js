
import './App.css';
import {FaSearch} from "react-icons/fa"
import { useState,useEffect } from 'react';
import Photo from "./Photo/photo"

const clientID = `?client_id=c32Kp2w1QY28y6UJIMAVZnUBut7u6ux2lpJcrdvuvi8`
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;


function App() {
  //loading state
  //photo state
  //state page
  //state queries
 const [loading, setLoading] = useState(false)
 const [photos, setPhotos] = useState([])
 const [page,setPage] = useState(1)
 const [query,setQuery] = useState("")

const fetchImages= async()=>{
  setLoading(true)
  let url ;
  const urlPage = `&page=${page}`;
  const urlQuery = `&query=${query}`;

  if(query){
    url=`${searchUrl}${clientID}${urlPage}${urlQuery}`
  }
  else{
    url = `${mainUrl}${clientID}${urlPage}`
  }

  try{
    const res = await fetch(url)
    const data = await res.json();
    setPhotos((oldPhoto)=>{
      if(query && page===1){
        return data.results
      }
      else if(query){
          return [...oldPhoto , ...data.results]
      }
      else{
        return[...oldPhoto,...data]
      }
    })
  }
  catch(err){
    setLoading(false)
  }
}

useEffect(() => {
  fetchImages()
}, [page])

useEffect(()=>{
  //listening to scrolls
  const event = window.addEventListener("scroll",()=>{
    if((!loading && window.innerHeight + window.scrollY)>= document.body.scrollHeight - 2){
      setPage((oldPage)=>{
        return oldPage + 1
      })
    }
  })
  //cleanup function by removing the listener
  return ()=>window.removeEventListener("scroll",event)
},[])

const handleSubmit = (e) =>{
  e.preventDefault();
  setPage(1);
  fetchImages();
}


  return (
    <>
      <main>
        <section className='search'>
          <form className='search-form'>
            <input className='form-input' type="text" placeholder = "search" value={query} onChange={(e)=>{
              setQuery(e.target.value);
            }} />
              <button type="submit" className='submit-btn' onClick={handleSubmit}><FaSearch/></button>
          </form>
        </section>
        <section className='photos'>
          <div className='photos-center'>
            {
              photos.map((item,index)=>{
                return(
                  <>
                    <Photo key={index} {...item}/>
                  </>
                )
              })
            }
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
