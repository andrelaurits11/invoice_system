import ErrorPage from '../components/ErrorPage';

const Custom401 = () => (
  <ErrorPage statusCode={401} message='Autentimine nõutud' />
);
export default Custom401;
