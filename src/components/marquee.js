import React from "react";
import "./marquee.css"; // Ensure you're importing the correct CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faInfoCircle,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

const Marquee = () => {
  return (
    <div className="marquee">
      <div className="marquee-content">
        <span>
          <FontAwesomeIcon icon={faHeart} />
          {/* Space after icon */}
          &nbsp;&nbsp;Stay informed! Get the latest health tips and updates.
          {/* Space after icon */}
        </span>
        <span>
          <FontAwesomeIcon icon={faInfoCircle} />
          {/* Space after icon */}
          &nbsp;&nbsp;Your health matters! Join our community for support and
          resources.
          {/* Space after icon */}
        </span>
        <span>
          <FontAwesomeIcon icon={faUserPlus} />
          {/* Space after icon */}
          &nbsp;&nbsp;Together we can make a difference! Volunteer and help
          those in need.
          {/* Space after icon */}
        </span>
      </div>
    </div>
  );
};

export default Marquee;
