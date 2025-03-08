import ErrorPage from '../components/ErrorPage';

const Custom403 = () => (
  <ErrorPage statusCode={403} message='Juurdepääs keelatud' />
);
export default Custom403;
