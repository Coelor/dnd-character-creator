import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchCharacters, deleteCharacter } from "../slices/characterSlice";
import { Link } from "react-router-dom";

export default function CharacterPage() {
  const dispatch   = useAppDispatch();
  const characters = useAppSelector((s) => s.characters.characters);
  const loading    = useAppSelector((s) => s.characters.loading);

  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch]);

  return (
    <section className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      {/* Header + Create button */}
      <div className="flex justify-between items-center">
        <h2
          className="text-3xl font-bold"
          style={{ color: "var(--color-darkgrey)" }}
        >
          My Characters
        </h2>
        <Link
          to="/create"
          className="text-sm px-3 py-1 rounded"
          style={{
            backgroundColor: "var(--color-primary)",
            color:           "var(--color-white)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-primary-dark)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-primary)")
          }
        >
          + Create Character
        </Link>
      </div>

      {/* Loading / Empty / List */}
      {loading ? (
        <p style={{ color: "var(--color-darkgrey)" }}>Loading...</p>
      ) : characters.length === 0 ? (
        <p className="italic" style={{ color: "var(--color-darkgrey)" }}>
          List empty
        </p>
      ) : (
        <ul className="space-y-3">
          {characters.map((char) => (
            <li
              key={char.id}
              className="p-4 rounded-xl shadow-sm flex justify-between items-center"
              style={{
                backgroundColor: "var(--color-surface)",
                border:          "1px solid var(--color-border)",
                color:           "var(--color-darkgrey)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-bg)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-surface)")
              }
            >
              <div>
                <strong
                  className="text-lg font-bold"
                  style={{ color: "var(--color-black)" }}
                >
                  {char.name}
                </strong>{" "}
                —{" "}
                <span style={{ color: "var(--color-black)" }}>
                  {char.race} {char.class}
                </span>
              </div>

              <button
                onClick={() => dispatch(deleteCharacter(char.id))}
                style={{
                  background: "none",
                  border:     "none",
                  color:      "var(--color-darkgrey)",
                  cursor:     "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "var(--color-black)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "var(--color-darkgrey)")
                }
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
