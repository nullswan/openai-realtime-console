import { useParams } from 'react-router-dom';

function Learning() {
  const { subject, priority } = useParams();

  return (
    <div>
      <h1>{subject}</h1>
      <p>Priority: {priority}</p>
    </div>
  );
}
export default Learning;