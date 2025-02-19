import React from "react";
import { useNavigate } from "react-router-dom";
import AboutUsImg from "../../assets/images/aboutus_3.png";
import MissionImg from "../../assets/images/mission.png";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-12 px-[20px] md:px-[40px] lg:px-[100px]">
      <div className="flex flex-col justify-between">
        <img
          src={AboutUsImg}
          alt="About Us"
          className="rounded-[20px] object-cover h-[300px] sm:h-[400px] lg:h-[520px]"
        />

        <div className="flex border items-center lg:items-start flex-col w-full gap-6 py-10 sm:gap-8 lg:gap-10">
          <h1 className="font-nonito_sans font-bold text-3xl sm:text-4xl lg:text-level-1 leading-tight sm:leading-[1.2] lg:leading-[56px] text-primary tracking-[0.042em] text-center lg:text-left">
            Discover Reliable Services, Anytime, Anywhere
          </h1>

          <p className="font-inter font-medium text-base sm:text-level-5 leading-relaxed text-content text-center lg:text-justify max-w-2xl lg:max-w-none mx-auto lg:mx-0 tracking-[0.5px]">
            Transforming how people connect, collaborate, and get things done.
            At JumaConnect, we believe in empowering individuals and businesses
            to thrive by bridging the gap between those who need jobs completed
            and skilled service providers ready to deliver. Whether you’re
            looking for a reliable handyman, a talented graphic designer, a
            cleaner, or help with everyday errands, we’re here to make the
            process seamless, secure, and efficient.
          </p>

          <button
            onClick={() => navigate("/service-pro")}
            className="bg-primary flex items-center justify-center text-white font-inter font-semibold text-[16px] leading-[17px] w-full sm:w-[214px] h-[49px] rounded-xl hover:bg-primary/90 transition-colors"
          >
            Find a Service-Pro
          </button>
        </div>
      </div>
      <div className="w-full py-8 sm:py-12 lg:py-[88px] z-10">
        <div className=" flex flex-col items-center lg:flex-row min-h-[506px] lg:relative">
          <div className="relative lg:absolute z-10 w-full lg:w-[640px] flex flex-col gap-4 mb-6 lg:mb-0">
            <div className="bg-white rounded-[20px] border-b-2 border-[#DDE1E6] lg:min-h-[257px] sm:min-h-[200px] p-6 lg:p-10 lg:h-[92px]">
              <h1 className="font-nonito_sans text-primary text-3xl sm:text-4xl lg:text-level-1 leading-tight lg:leading-[60px] font-bold mb-6 sm:mb-8 lg:mb-10 text-center lg:text-left">
                Our Mission
              </h1>
              <p className="font-inter font-medium text-base sm:text-level-5 leading-relaxed text-content text-center lg:text-left max-w-2xl lg:max-w-none mx-auto lg:mx-0 tracking-[0.5px]">
                To create a trusted, accessible, and innovative platform that
                connects clients with skilled professionals, fostering economic
                growth and opportunities.
              </p>
            </div>
          </div>

          <div className="relative lg:absolute right-0 w-full lg:w-[791px] h-[300px] sm:h-[400px] lg:h-[506px] ">
            <img
              src={MissionImg}
              alt="Service illustration"
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
