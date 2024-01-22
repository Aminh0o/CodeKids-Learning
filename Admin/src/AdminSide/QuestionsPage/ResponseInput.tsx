export default function ResponseInput(params) {
  // NOTUSED
  // TODO TOFIX
  return (
    <>
      <input
        type="checkbox"
        checked={correct == "0"}
        onInput={() => params.handleCheckBoxChange("0")}
      />
      <input
        type="text"
        placeholder="la reponse 0"
        onInput={(e) => params.handleResponseChange(0, e.target.value)}
      />
      <br />
    </>
  );
}
