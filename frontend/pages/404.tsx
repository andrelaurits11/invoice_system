import ErrorPage from '../components/ErrorPage';

const Custom404 = () => (
  <ErrorPage statusCode={404} message='Lehte ei leitud' />
);
export default Custom404;
