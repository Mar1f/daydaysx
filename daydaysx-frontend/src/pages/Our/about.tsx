import React from "react";
import "./CardCarousel.css"; // Assuming your CSS file is in the same directory

import img1 from "../../assets/team.png";
import img2 from "../../assets/后端技术栈_1.png";
import img3 from "../../assets/后端技术栈_2.png";
import img4 from "../../assets/后端功能.png";
import img5 from "../../assets/前端技术栈.png";

const CardCarousel: React.FC = () => {
  const images = [img1, img2, img3, img4, img5];

  return (
    <div className="outer-container">
      <div className="container">
        <div className="card-box">
          {images.map((image, index) => (
            <div className="card" key={index}>
              <img src={image} alt={`card-${index}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
