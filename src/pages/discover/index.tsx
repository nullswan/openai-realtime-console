import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";

export default function Discover() {
  const { subjectId } = useParams<{ subjectId: string }>();

  return (
    <div className="min-h-screen bg-white ">
      <Header />
      <div>
        {subjectId}
      </div>
    </div>
  )
}