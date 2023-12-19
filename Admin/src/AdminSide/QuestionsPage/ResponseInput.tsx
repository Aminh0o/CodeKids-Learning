export default function ResponseInput(params) {
  // TODO TOFIX
  return (
    <>
      <input
        type="checkbox"
        checked={correct == "0"}
        onChange={() => params.handleCheckBoxChange("0")}
      />
      <input
        type="text"
        placeholder="la reponse 0"
        onChange={(e) => params.handleResponseChange(0, e.target.value)}
      />
      <br />
    </>
  );
}
