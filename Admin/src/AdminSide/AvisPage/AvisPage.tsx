import { useEffect, useState } from "react";
import AvisFragment from "./AvisFragment";
import Admin from "../../Backend/Admin.js";

export default function AvisPage() {
  const [avis, setAvis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSeen , setShowSeen] = useState(false)

  useEffect(() => {
    const fetchAvis = async () => {
      const a = await Admin.getInstance().getAvis(showSeen);
      setAvis(a);
      setIsLoading(false);
    };
    fetchAvis();
  }, []);

  useEffect(() => {
    const fetchAvis = async () => {
      setIsLoading(true)
      const a = await Admin.getInstance().getAvis(showSeen);
      setAvis(a);
      setIsLoading(false);
    };
    fetchAvis();
  }, [showSeen]);

  return (
    <>

    <button
    onClick={()=>setShowSeen(!showSeen)}>{!showSeen? "Show les avis deja lu" : "Show le avis non lu"}</button>
    <h2>Liste des avis {!showSeen? "non lu":"lu"}</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : avis?.length === 0 ? (
        <div>Aucun avis posté</div>
      ) : (
        avis?.map((oneAvis, index) => {
          return <AvisFragment key={index} avis={avis} oneAvis={oneAvis} index={index} setAvis={setAvis}/>;
        })
      )}
    </>
  );
}
/*

//
//
*/
