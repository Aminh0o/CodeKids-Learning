export default function Footer() {

  return (
    <footer className="footer_section container-fluid footer_section">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h3>Contact Us</h3>
            <p>Email: info@codekidslearning.com</p>
            <p>Phone: +123-456-7890</p>
          </div>
          <div className="col-md-4">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#teachers">Our Teachers</a></li>
              <li><a href="#rules">Our Rules</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h3>Connect With Us</h3>
            <div className="social_icons">
              <a href="#" className="icon"><i className="fa fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa fa-youtube"></i></a>
              <a href="#" className="icon"><i className="fa fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer_bottom text-center">
        <p>&copy; 2024 CodeKids-Learning. </p><br/><p>All rights reserved.</p>
      </div>
    </footer>
  );
}

