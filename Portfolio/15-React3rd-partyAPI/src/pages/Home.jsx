import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';
import axios from 'axios';

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/movies').then(res => setMovies(res.data));
  }, []);

  return (
    <Container>
      <h1 className="text-center my-4">Star Wars Fandom</h1>
      <Row>
        {movies.map(movie => (
          <Col key={movie._id} md={4}>
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
