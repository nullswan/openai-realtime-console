import { useParams } from 'react-router-dom';

function Learning() {
  const { subjectId, priorityId } = useParams();

  return (
    <div>
      <h1>{subjectId}</h1>
      <p>Priority: {priorityId}</p>
    </div>
  );
}
export default Learning;