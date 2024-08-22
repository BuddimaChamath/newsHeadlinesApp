import React, { useEffect, useState } from 'react';
import NewsCard from './NewsCard';
import { Grid } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

// Default fallback image URL
const FALLBACK_IMAGE = 'https://via.placeholder.com/150';

function Home() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = async (page) => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=Apple&sortBy=publishedAt&page=${page}&pageSize=10&apiKey=9855de3885d646708d6cd67fbc076db3`
      );

      if (response.status === 426) {
        throw new Error('API requires upgrade');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      return json.articles || [];
    } catch (error) {
      console.error('Error fetching news:', error);
      setHasMore(false); // Stop fetching more if there's an error
      return [];
    }
  };

  const loadMoreNews = async () => {
    try {
      const newArticles = await fetchNews(page);
      if (Array.isArray(newArticles)) {
        setNews((prevNews) => [
          ...prevNews,
          ...newArticles.map(article => ({
            ...article,
            urlToImage: article.urlToImage || FALLBACK_IMAGE // Set fallback image if none
          }))
        ]);
        setPage(page + 1);

        if (newArticles.length === 0 || newArticles.length < 10) {
          setHasMore(false);
        }
      } else {
        console.error('Unexpected format of newArticles:', newArticles);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more news:', error);
      setHasMore(false); // Stop fetching more if there's an error
    }
  };

  useEffect(() => {
    loadMoreNews();
  }, []);

  return (
    <div>
      <InfiniteScroll
        dataLength={news.length}
        next={loadMoreNews}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more news</p>}
      >
        <Grid container spacing={2}>
          {news
            .filter((article) => article.urlToImage) // Filter out articles without images
            .map((data, index) => (
              <Grid item xs={12} sm={6} md={4} key={`${data.url}-${index}`}>
                <NewsCard data={data} />
              </Grid>
            ))}
        </Grid>
      </InfiniteScroll>
    </div>
  );
}

export default Home;
