import './Hero.css';

/**
 * Esta função adiciona a secção missao/objetivo ao site
 * @param {*} props 
 * @returns Fragmet da secção missao/objetivo
 */
export default function Hero({ id, title, description }) {
  return (
    <div className={id} id={id}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}