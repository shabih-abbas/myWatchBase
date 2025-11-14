import styles from "./MovieCredits.module.css";
import fallback from "../../assets/fallback.png";
export default function MovieCredits({ actors, directors, writers }) {
  return (
    <section className={styles.credits}>
      <CrewList crew={directors} type="Direction" />
      <CrewList crew={writers} type="Writing" />
      <CrewList crew={actors} type="Cast" />
    </section>
  );
}

function CrewList({ crew, type }) {
  if (crew.length > 0) {
    return (
      <div className={styles.crewListCtn}>
        <h2 className={styles.typeHeading}>{type}</h2>
        <ul className={styles.crewList}>
          {crew.map((member) => (
            <li key={member.id} className={styles.crewMember}>
              <Profile
                img={member.profile}
                name={member.name}
                character={member.character}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
}

function Profile({ img, name, character }) {
  const baseImgUrl = "https://image.tmdb.org/t/p/w45";
  return (
    <div className={styles.profile}>
      <img
        src={img ? baseImgUrl + img : fallback}
        alt={name}
        className={styles.profileImg}
      />
      <h3 className={styles.name}>{name}</h3>
      {character ? <p className={styles.character}>{character}</p> : null}
    </div>
  );
}
