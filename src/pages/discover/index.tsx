import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { RoadmapResponse } from '../profile';

export default function Discover() {
  interface RoadmapResponse {
    subject: string;
    topics: string[];
    description: string[]
    image: string[]
  }
  const { subjectId } = useParams<{ subjectId: string }>();
  const subjects: Map<string, RoadmapResponse> = new Map();
  return (
    <div className="min-h-screen bg-white ">
      <Header />
      <div>{subjectId}</div>
    </div>
  );
}
