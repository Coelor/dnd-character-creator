import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchCharacters, deleteCharacter } from "../slices/characterSlice";
import { Link } from "react-router-dom";

// Same 4-color roles
const PALETTE = {
  black:    "#081C15",
  darkgrey: "#1B4332",
  primary:  "#74C69D",
  primaryDark:"#52B788",
};

export default function CharacterPage() {
  const dispatch   = useAppDispatch();
  const characters = useAppSelector((s) => s.characters.characters);
  const loading    = useAppSelector((s) => s.characters.loading);

  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch]);

  return (
    <section className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2
          className="text-3xl font-bold"
          style={{ color: PALETTE.darkgrey }}
        >
          My Characters
        </h2>

        <Link
          to="/create"
          className="text-sm px-3 py-1 rounded"
          style={{
            backgroundColor: PALETTE.primary,
            color:           PALETTE.black,
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PALETTE.primaryDark)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PALETTE.primary)}
        >
          + Create Character
        </Link>
      </div>

      {loading ? (
        <p style={{ color: PALETTE.darkgrey }}>Loading...</p>
      ) : characters.length === 0 ? (
        <p className="italic" style={{ color: PALETTE.darkgrey }}>
          List empty
        </p>
      ) : (
        <ul className="space-y-3">
          {characters.map((char) => (
            <li
              key={char.id}
              className="p-4 rounded-xl shadow-sm flex justify-between items-center"
              style={{
                backgroundColor: PALETTE.darkgrey,
                border:          `1px solid ${PALETTE.primaryDark}`,
                color:           PALETTE.black,
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PALETTE.primary)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PALETTE.darkgrey)}
            >
              <div>
                <strong
                  className="text-lg font-bold"
                  style={{ color: PALETTE.black }}
                >
                  {char.name}
                </strong>{" "}
                —{" "}
                <span style={{ color: PALETTE.black }}>
                  {char.race} {char.class}
                </span>
              </div>

              <button
                onClick={() => dispatch(deleteCharacter(char.id))}
                style={{
                  background: "none",
                  border:     "none",
                  color:      PALETTE.darkgrey,
                  cursor:     "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = PALETTE.black)}
                onMouseOut={(e) => (e.currentTarget.style.color = PALETTE.darkgrey)}
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
