'use client';
import styles from "./page.module.css";
import { useEffect, useState } from "react";

interface Media {
  Title: string;
  Year: string;
  Rated: string;
  Genre: string;
  Director: string;
  Actors: string;
  Poster: string;
  Ratings: MediaRating[];
  imdbID: string;
  Plot: string;
  Runtime: string;
}

interface MediaRating {
  Source: string;
  Value: string;
}

interface MediaSearchResult {
  imdbID: string;
  Title: string;
  Type: string;
  Year: string;
  Poster: string;
}

const omdbApi = "http://www.omdbapi.com/?apikey=f9d0bba"

const MediaListItem = (props: {media: MediaSearchResult, onClick: () => void, selected: boolean }) => {
  return <div tabIndex={0} className={styles.mediaListItem} onClick={props.onClick}>
      <img src={props.media.Poster} className={styles.mediaListItemPoster} />
      <div>
        <h4>{props.media.Title}</h4>
        <div>{props.media.Year}</div>
      </div>
    </div>;
}

const MediaDisplay = (props: {media: Media, watched: boolean, setWatched: (id: string) => void}) => {
  return <>
    <div className={styles.meta}>
      <img src={props.media.Poster} alt={props.media.Title} className={styles.poster} />
      <div className={styles.metaItems}>
        <div className={styles.metaWatchlist}><button className={`${props.watched ? styles.watched : undefined}`} onClick={() => props.setWatched(props.media.imdbID)}>Watchlist</button></div>
        <h2>{props.media.Title}</h2>
        <div>
          <span className={styles.rated}>{props.media.Rated}</span> {props.media.Year} - {props.media.Genre} - {props.media.Runtime}
        </div>
        <div>{props.media.Actors}</div>
      </div>
    </div>
    <hr />
    <p>{props.media.Plot}</p>
    <hr />
    <div className={styles.mediaRatings}>
      {props.media.Ratings.map((r, index) => {
        return <div key={index} className={styles.mediaRating}>
          <h3>{r.Value}</h3>
          <p>{r.Source}</p>
        </div>;
      })}
    </div>
  </>
}

const maxYear = new Date().getFullYear()+1;
const minYear = 1888 //Earliest movie in imdb

export default function Home() {
  const [medias, setMedias] = useState<MediaSearchResult[]>([])
  const [mediaLoaded, setMediaLoaded] = useState(0);
  const [mediaTotal, setMediaTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");


  const [searchYear1, setSearchYear1] = useState(minYear);
  const [searchYear2, setSearchYear2] = useState(maxYear);

  const minSearchYear = Math.min(searchYear1, searchYear2);
  const maxSearchYear = Math.max(searchYear1, searchYear2);

  const [selectedMedia, setSelectedMedia] = useState("");
  const [selectedMediaResult, setSelectedMediaResult] = useState<Media | undefined>(undefined);

  const [ loadingMore, setLoadingMore ] = useState(false);

  const [ watchlist, setWatchlist ] = useState<string[]>([]);

  const filterMediaByYear = (result: MediaSearchResult[]) => {
    return result.filter(m => {
      const year = Number.parseInt(m.Year);
      return year >= minSearchYear && year <= maxSearchYear;
    });
  }

  useEffect(() => {
    setMedias([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    const getMedia = setTimeout(async () => {
      if(searchQuery !== "") {
        let search = [`s=${searchQuery}`];
        if(searchType !== "") {
          search.push(`type=${searchType}`);
        }

        const response = await fetch(`${omdbApi}&${search.join("&")}`);

        if(!response.ok) {
          setMedias([]);
          setMediaTotal(0);
        }else{
          const json = await response.json();
          console.log(json);
          if(json.Error !== undefined){
            console.error(json.Error);
            setMedias([]);
            setMediaTotal(0);
          }else{
            setMedias(filterMediaByYear(json.Search));
            setMediaLoaded(json.Search.length)
            setMediaTotal(json.totalResults);
          }
        }

        setLoading(false);
        setSelectedMedia("");
      } else {
        setMedias([]);
        setLoading(false);
      }
    }, 750);

    return () => clearTimeout(getMedia);
      
  }, [ searchQuery, searchType, searchYear1, searchYear2 ])

  useEffect(() => {
    const getMedia = setTimeout(async () => {
      if(selectedMedia !== ""){
        const response = await fetch(`${omdbApi}&i=${selectedMedia}`);

        if(!response.ok) {
          //Error control          
        } else {
          const json = await response.json();
          setSelectedMediaResult(json);
        }
      }else{
        setSelectedMediaResult(undefined);
      }
    }, 1000);

    return () => clearTimeout(getMedia);
  }, [selectedMedia])

  const loadMore = async () => {
    setLoadingMore(true);
    let search = [`s=${searchQuery}`,`page=${mediaLoaded/10+1}`];
    if(searchType !== "") {
      search.push(`type=${searchType}`);
    }

    const response = await fetch(`${omdbApi}&${search.join("&")}`);

    if(response.ok){
      const json = await response.json();
      if(json.Error !== undefined){
      }else{
        setMedias((current) => {
          return [
            ...current,
            ...filterMediaByYear(json.Search)
          ]
        });
        setMediaLoaded((current) => {
          return current + json.Search.length}
        )
        setMediaTotal(json.totalResults);
      }
    }
    setLoadingMore(false);
  }

  const toggleWatchlist = (id: string) => {
    const index = watchlist.indexOf(id)
    if(index === -1){
      setWatchlist((list) => {
        return [ ...list, id];
      })
    } else {
      setWatchlist((list) => {
        return [ ... list.filter(l => l !== id)];
      })
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerSearch}>
          <i className="fa-solid fa-magnifying-glass fa-xl"></i>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div>
          <label className={styles.searchLabel}>Year</label>
          <div className={styles.searchYear}>
            {minSearchYear}
            <div className={styles.searchYearRange}>
              <input type="range" value={searchYear1} min={minYear} max={maxYear} onChange={(e) => setSearchYear1(e.target.valueAsNumber)} />
              <input type="range" value={searchYear2} min={minYear} max={maxYear} onChange={(e) => setSearchYear2(e.target.valueAsNumber)} />
            </div>
            {maxSearchYear}
          </div>
        </div>
        <div>
          <label className={styles.searchLabel}>Type</label>
          <div className={styles.searchRadio}>
            <input type="radio" id="searchTypeAny" name="searchType" value="" onChange={() => setSearchType("")} checked={searchType === ""} />
            <label htmlFor="searchTypeAny">Any</label>
            <input type="radio" id="searchTypeMovies"  name="searchType" value="" onChange={() => setSearchType("movie")} checked={searchType === "movie"} />
            <label htmlFor="searchTypeMovies">Movies</label>
            <input type="radio" id="searchTypeSeries"  name="searchType" value="" onChange={() => setSearchType("series")} checked={searchType === "series"} />
            <label htmlFor="searchTypeSeries">Series</label>
            <input type="radio" id="searchTypeEpisode"  name="searchType" value="" onChange={() => setSearchType("episode")} checked={searchType === "episode"} />
            <label htmlFor="searchTypeEpisode">Episodes</label>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mediaList}>
          <div className={styles.mediaListItem}>{mediaTotal} results</div>
          {loading ? <div className={styles.mediaListItem}>Loading...</div> : 
            <div>{medias.length > 0 ? medias.map((m, index) => {
              return <MediaListItem 
                key={index}
                media={m}
                onClick={() => setSelectedMedia(m.imdbID)}
                selected={m.imdbID === selectedMedia}
                />
              }) : <div className={styles.mediaListItem}>No results</div>}
            </div>
          }
          { mediaLoaded !== mediaTotal && !loadingMore && <div className={styles.mediaListItem} onClick={() => loadMore()}>Load more</div>}
        </div>
        <div className={styles.mediaDisplay}>
          {selectedMediaResult !== undefined ? <MediaDisplay media={selectedMediaResult} watched={watchlist.some(w => w === selectedMediaResult.imdbID)} setWatched={(id) => toggleWatchlist(id)} /> : "No media selected."}
        </div>
      </main>
    </div>
  );
}
