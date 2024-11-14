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
  Ratings: [];
  imdbID: string;
  Plot: string;
  Runtime: string;
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

const MediaDisplay = (props: {media: Media}) => {
  return <>
    <div className={styles.meta}>
      <img src={props.media.Poster} alt={props.media.Title} className={styles.poster} />
      <div className={styles.metaItems}>
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
    <div>
      
    </div>
  </>
}

export default function Home() {
  const [medias, setMedias] = useState<MediaSearchResult[]>([])
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedMedia, setSelectedMedia] = useState("");
  const [selectedMediaResult, setSelectedMediaResult] = useState<Media | undefined>(undefined);

  useEffect(() => {
    setMedias([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    const getMedia = setTimeout(async () => {
      if(searchQuery !== "") {
        const response = await fetch(`${omdbApi}&s=${searchQuery}`);

        const json = await response.json();
        setMedias(json.Search);
        setLoading(false);
        setSelectedMedia("");
      } else {
        setMedias([]);
        setLoading(false);
      }
    }, 750);

    return () => clearTimeout(getMedia);
      
  }, [ searchQuery ])

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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerStretch}>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div>
          <input type="range" />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mediaList}>
          <div className={styles.mediaListItem}>{medias.length} results</div>
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
        </div>
        <div className={styles.mediaDisplay}>
          {selectedMediaResult !== undefined ? <MediaDisplay media={selectedMediaResult} /> : "No media selected."}
        </div>
      </main>
    </div>
  );
}
