// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: "#222",
        color: "#fff",
        textAlign: "center",
        padding: "20px 10px",
      }}
    >
      <div>&copy; {new Date().getFullYear()} Blogify. All rights reserved.</div>
      <div style={{ fontSize: "0.9rem", marginTop: "5px", color: "#ccc" }}>
        Personally developed by Dhiyanesh
      </div>
      <div style={{ fontSize: "0.9rem", marginTop: "5px", color: "#ccc" }}>
        Contact <span className="text-primary"><a href="https://mail.google.com/mail/u/0/?to=dhiyaneshb.23aid@kongu.edu&fs=1&tf=cm">dhiyaneshb.23aid@kongu.edu</a></span> for further details.
      </div>
    </footer>
  );
};

export default Footer;
