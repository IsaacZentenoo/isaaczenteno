import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import CommentSection from '../components/CommentSection';

function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/movies/${id}`).then(res => setMovie(res.data));
  }, [id]);

  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} (${movie.year})`;
    }
    return () => {
      document.title = 'Star Wars Fandom';
    };
  }, [movie]);

  const handleLike = () => {
    axios.post(`http://localhost:4000/api/movies/${id}/like`).then(res => setMovie(res.data));
  };

  const handleDislike = () => {
    axios.post(`http://localhost:4000/api/movies/${id}/dislike`).then(res => setMovie(res.data));
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <Container className="py-4">
      <h2 className="text-center mb-2">{movie.title} ({movie.year})</h2>
      <h5 className="text-center text-secondary mb-4">Episode {movie.episode}</h5>
      <div className="d-flex flex-column flex-md-row align-items-center mb-4 gap-4">
        <img
          src={`/images/${movie.poster}`}
          alt={movie.title}
          style={{ maxWidth: '320px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        />
        <div className="d-flex flex-column align-items-start gap-2">
          <Button variant="success" onClick={handleLike} className="mb-2">
            👍 {movie.likes}
          </Button>
          <Button variant="danger" onClick={handleDislike}>
            👎 {movie.dislikes}
          </Button>
        </div>
      </div>
      {}
      {movie.best_character && (
        <div className="mb-4 p-3 bg-light rounded shadow-sm">
          <h4 className="mb-3">Best Character</h4>
          <div className="d-flex flex-row align-items-start gap-3">
            <img
              src={`/images/${movie.best_character.image}`}
              alt={movie.best_character.name}
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', background: '#eee' }}
              onError={e => { e.target.onerror = null; e.target.src = '/images/default-character.png'; }}
            />
            <div style={{ flex: 1 }}>
              <h5 className="mb-1">{movie.best_character.name}</h5>
              <div className="text-muted mb-1">{movie.best_character.affiliation}</div>
              <div style={{ fontSize: '0.95em' }}>{movie.best_character.bio}</div>
            </div>
          </div>
        </div>
      )}
      <CommentSection movieId={id} />
    </Container>
  );
}

export default MoviePage;
