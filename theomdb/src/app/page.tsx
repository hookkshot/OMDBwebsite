'use client';
import styles from "./page.module.css";
import { useEffect, useState } from "react";

interface Media {
  id: string;
  name: string;
  year: string;
  imageUrl: string;
  description: string;
  ageRating: string;
  genre: string;
  cast: string;
  length: string;
  ratings: {
    imdb: string;
    rottenTomatoes: string;
    metacritic: string;
  }
}

interface MediaSearchResult {
  ImdbId: string;
  Title: string;
  Type: string;
  Year: string;
  Poster: string;
}

const omdbApi = "http://www.omdbapi.com/?i=tt3896198&apikey=f9d0bba"

const MediaListItem = (props: {media: MediaSearchResult}) => {
  return <div tabIndex={0} className={styles.mediaListItem}>
      <img src={props.media.Poster} className={styles.mediaListItemPoster} />
      <div>
        <h4>{props.media.Title}</h4>
        <div>{props.media.Year}</div>
      </div>
    </div>;
}

export default function Home() {
  const [medias, setMedias] = useState<MediaSearchResult[]>([])
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        console.log(json);
        setLoading(false);
      } else {
        setMedias([]);
        setLoading(false);
      }
    }, 750);

    return () => clearTimeout(getMedia);
      
  }, [ searchQuery ])

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
            <div>{medias.length > 0 ? medias.map((m) => {
              return <MediaListItem key={m.ImdbId} media={m} />
              }) : <div className={styles.mediaListItem}>No results</div>}
            </div>
          }
        </div>
        <div className={styles.mediaDisplay}>
          Media
        </div>
      </main>
    </div>
  );
}
