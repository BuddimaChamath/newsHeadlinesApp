import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, CardMedia, CardActions, Button } from "@mui/material";

function NewsCard({ data }) {
  const [imageError, setImageError] = useState(false);
  const placeholderImage = "https://via.placeholder.com/150"; // Fallback image

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Box>
      <Card>
        <CardMedia
          component="img"
          height="200"
          image={imageError ? placeholderImage : data.urlToImage || placeholderImage}
          alt={data.title}
          onError={handleImageError}
        />
        <CardContent>
          <Typography variant="h6">{data.title}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {data.source.name} - {new Date(data.publishedAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {data.author ? `By ${data.author}` : 'Author unknown'}
          </Typography>
          <Typography variant="body2">{data.description}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" href={data.url} target="_blank" rel="noopener noreferrer">
            Read More
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default NewsCard;
