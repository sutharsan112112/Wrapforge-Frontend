import React from "react";

const AboutUs = () => (
    <>
    <section className="py-16 px-4 text-center bg-white mx-4 md:mx-20 my-10 rounded-xl">
        <h2 className="text-4xl font-extrabold text-yellow-600 mb-10 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
          About Us
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-8">
          <img src="src/assets/images/about 1.png" alt="Mechanic 1" className="w-[300px] h-[200px] object-cover rounded-md shadow-lg" />
          <img src="src/assets/images/about 2.png" alt="Mechanic 2" className="w-[300px] h-[200px] object-cover rounded-md shadow-lg" />
        </div>

        <p className="max-w-4xl mx-auto text-base font-bold text-black leading-relaxed text-justify px-4 text-lg">
          WrapForge is a web platform for vehicle modifications, providing a user-friendly space for enthusiasts to visualize, design, and customize their vehicles using tools like 3D modeling. <br />
          Combining automotive creativity with cutting-edge technology, WrapForge aims to make your dream vehicle a reality.
        </p>
    </section>
</>
);

export default AboutUs;