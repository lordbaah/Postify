const Footer = () => {
  return (
    <footer className="bg-red-500 text-white p-4 text-center mt-auto rounded-t-xl shadow-lg">
      <div className="container mx-auto">
        <p>
          &copy; {new Date().getFullYear()} My Blog App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
