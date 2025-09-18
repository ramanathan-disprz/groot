import React from "react";
import "../../styles/Logo.scss";

const Logo: React.FC = () => {
    return (
        <div className="logo">
            {/* TODO Placeholder logo, replace with SVG/image later */}
            <span role="img" aria-label="calendar">📅</span>
        </div>
    );
};

export default Logo;
