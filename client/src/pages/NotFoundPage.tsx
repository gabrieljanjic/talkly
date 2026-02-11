import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p>Page not found</p>
      <Link to="/">Go home</Link>
    </div>
  );
};

export default NotFoundPage;
