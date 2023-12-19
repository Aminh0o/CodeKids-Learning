import { useEffect, useState } from "react";
import AvisFragment from "./AvisFragment";
import Admin from "../../Backend/Admin.js";

export default function AvisPage() {
  const [avis, setAvis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchAvis = async () => {
      const a = await Admin.getInstance().getAvis();
      setAvis(a);
      setIsLoading(false);
    };
    fetchAvis();
  }, []);
  console.log(avis);

  const LoadedAvis = () => {
    if (isLoading) return <div>Loading...</div>;
    if (avis?.length == 0) return <div>Aucun avis posté</div>;
    return(    
      avis?.map((avis, index) => {
        return <AvisFragment key={index} avis={avis} />;
      });
    
    
    )
  }

  return (
    <div>
      <span>tmp : all shown</span>
      <LoadedAvis />
    </div>
  );
}
/*

//
//
*/
