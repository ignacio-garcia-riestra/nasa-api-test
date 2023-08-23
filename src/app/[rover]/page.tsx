export default function Rover() {
  const rover = JSON.parse(localStorage.getItem("rover") || "");
  return <div>{rover ? <h1>{rover.name.toUpperCase()}</h1> : null}</div>;
}
