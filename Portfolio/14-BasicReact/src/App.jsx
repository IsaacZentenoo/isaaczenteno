import React, { useState } from "react";
import sw from "../public/data/data.js";

const affiliationLogos = {
  Jedi: { src: "/images/jedi.png", color: "#007bff" },
  Sith: { src: "/images/sith.png", color: "#dc3545" },
  Rebellion: { src: "/images/rebel.png", color: "#007bff" },
  Empire: { src: "/images/empire.png", color: "#dc3545" },
};

function MovieCard({ movie, onMore, likes, dislikes, onLike, onDislike }) {
  const [hover, setHover] = useState(false);
  const affiliation = movie.best_character.affiliation;
  const logo = affiliationLogos[affiliation];

  return (
    <div
      className="card shadow-sm m-3"
      style={{ width: "18rem", minHeight: "32rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={hover && logo ? logo.src : `/images/${movie.poster}`}
        className="card-img-top"
        alt={movie.title}
        style={hover && logo ? { background: logo.color, padding: "1rem" } : {}}
      />
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title text-center mb-3">{movie.title} <span className="text-muted" style={{ fontSize: "1rem" }}>({movie.year})</span></h5>
        <button className="btn btn-outline-primary btn-sm mb-2" onClick={() => onMore(movie)}>
          More...
        </button>
        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-success btn-sm" onClick={() => onLike(movie.episode)}>
            👍 {likes}
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onDislike(movie.episode)}>
            👎 {dislikes}
          </button>
        </div>
      </div>
    </div>
  );
}

function CharacterDetail({ character, comments, onComment }) {
  const [form, setForm] = useState({ name: "", comment: "" });

  function handleSubmit(e) {
    e.preventDefault();
    if (form.name && form.comment) {
      onComment(form.name, form.comment);
      setForm({ name: "", comment: "" });
    }
  }

  return (
    <div className="card mt-4 mb-4 shadow" style={{ maxWidth: "600px", margin: "auto" }}>
      <div className="row g-0">
        <div className="col-md-4 d-flex align-items-center justify-content-center p-2">
          <img src={`/images/${character.image}`} className="img-fluid rounded" alt={character.name} style={{ maxHeight: "180px" }} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title text-center">{character.name}</h5>
            <p className="card-text text-center">{character.bio}</p>
            <form onSubmit={handleSubmit} className="mt-3">
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <textarea
                  className="form-control"
                  placeholder="Your comment"
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Add Comment</button>
            </form>
            <div className="mt-3">
              <h6 className="text-center">Comments:</h6>
              {comments.length === 0 ? <p className="text-center">No comments yet.</p> : (
                <ul className="list-group">
                  {comments.map((c, i) => (
                    <li key={i} className="list-group-item">
                      <strong>{c.name}:</strong> {c.comment}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [detail, setDetail] = useState(null);
  const [likes, setLikes] = useState(() => sw.reduce((acc, m) => ({ ...acc, [m.episode]: 0 }), {}));
  const [dislikes, setDislikes] = useState(() => sw.reduce((acc, m) => ({ ...acc, [m.episode]: 0 }), {}));
  const [comments, setComments] = useState({});

  function handleMore(movie) {
    setDetail(movie);
  }
  function handleLike(ep) {
    setLikes(l => ({ ...l, [ep]: l[ep] + 1 }));
  }
  function handleDislike(ep) {
    setDislikes(d => ({ ...d, [ep]: d[ep] + 1 }));
  }
  function handleComment(name, comment) {
    setComments(cs => ({
      ...cs,
      [detail.episode]: [...(cs[detail.episode] || []), { name, comment }],
    }));
  }

  const half = Math.ceil(sw.length / 2);
  const topMovies = sw.slice(0, half);
  const bottomMovies = sw.slice(half);

  return (
    <div className="container py-5">
      <h1 className="starwars-title">Star Wars Fandom</h1>
      <div className="horizontal-scroll mb-4">
        {topMovies.map(movie => (
          <MovieCard
            key={movie.episode}
            movie={movie}
            onMore={handleMore}
            likes={likes[movie.episode]}
            dislikes={dislikes[movie.episode]}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}
      </div>
      <div className="horizontal-scroll">
        {bottomMovies.map(movie => (
          <MovieCard
            key={movie.episode}
            movie={movie}
            onMore={handleMore}
            likes={likes[movie.episode]}
            dislikes={dislikes[movie.episode]}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}
      </div>
      {detail && (
        <CharacterDetail
          character={detail.best_character}
          comments={comments[detail.episode] || []}
          onComment={handleComment}
        />
      )}
    </div>
  );
}

export default App;
