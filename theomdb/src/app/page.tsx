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

const MediaListItem = (props: {media: Media}) => {
  return props.media.name;
}

export default function Home() {
  const [medias, setMedias] = useState<Media[]>([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMedias([]);
    setLoading(false);
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerStretch}>
          <input />
        </div>
        <div>
          <input type="range" />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mediaList}>
          <div>{medias.length} results</div>
          {loading ? <div>Loading...</div> : 
            <div>{medias.length > 0 ? medias.map((m) => {
              return <MediaListItem key={m.id} media={m} />
              }) : <div>No results</div>}
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
