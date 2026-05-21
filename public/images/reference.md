import React from 'react';



const Input = () => {

&nbsp; return (

&nbsp;   <form className="max-w-xs mx-auto flex justify-center items-center flex-col">

&nbsp;     <label htmlFor="quantity-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose quantity:</label>

&nbsp;     <div className="relative flex items-center max-w-\[8rem]">

&nbsp;       <button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">

&nbsp;         <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">

&nbsp;           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h16" />

&nbsp;         </svg>

&nbsp;       </button>

&nbsp;       <input type="text" id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={999} required />

&nbsp;       <button type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">

&nbsp;         <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">

&nbsp;           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 1v16M1 9h16" />

&nbsp;         </svg>

&nbsp;       </button>

&nbsp;     </div>

&nbsp;     <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">

&nbsp;       Please select a 5 digit number from 0 to 9.

&nbsp;     </p>

&nbsp;   </form>

&nbsp; );

}



export default Input;


cards := 

search:- import React from 'react';
import styled from 'styled-components';

const Input = () => {
  return (
    <StyledWrapper>
      <div className="input-container">
        <input className="input" name="text" type="text" placeholder="Search the internet..." />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .input {
    width: 100%;
    max-width: 270px;
    height: 60px;
    padding: 12px;
    font-size: 18px;
    font-family: "Courier New", monospace;
    color: #000;
    background-color: #fff;
    border: 4px solid #000;
    border-radius: 0;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 8px 8px 0 #000;
  }

  .input::placeholder {
    color: #888;
  }

  .input:hover {
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0 #000;
  }

  .input:focus {
    background-color: #000;
    color: #fff;
    border-color: #ffffff;
  }

  .input:focus::placeholder {
    color: #fff;
  }

  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  @keyframes blink {
    50% {
      border-color: transparent;
    }
  }

  .input:focus::after {
    content: "|";
    position: absolute;
    right: 10px;
    animation: blink 0.7s step-end infinite;
  }

  .input:valid {
    animation: typing 2s steps(30, end);
  }
  .input-container {
    position: relative;
    width: 100%;
    max-width: 270px;
  }

  .input {
    width: 100%;
    height: 60px;
    padding: 12px;
    font-size: 18px;
    font-family: "Courier New", monospace;
    color: #000;
    background-color: #fff;
    border: 4px solid #000;
    border-radius: 0;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 8px 8px 0 #000;
  }

  .input::placeholder {
    color: #888;
  }

  .input:hover {
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0 #000;
  }

  .input:focus {
    background-color: #010101;
    color: #fff;
    border-color: #d6d9dd;
  }

  .input:focus::placeholder {
    color: #fff;
  }

  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px) rotate(-5deg);
    }
    50% {
      transform: translateX(5px) rotate(5deg);
    }
    75% {
      transform: translateX(-5px) rotate(-5deg);
    }
    100% {
      transform: translateX(0);
    }
  }

  .input:focus {
    animation: shake 0.5s ease-in-out;
  }

  @keyframes glitch {
    0% {
      transform: none;
      opacity: 1;
    }
    7% {
      transform: skew(-0.5deg, -0.9deg);
      opacity: 0.75;
    }
    10% {
      transform: none;
      opacity: 1;
    }
    27% {
      transform: none;
      opacity: 1;
    }
    30% {
      transform: skew(0.8deg, -0.1deg);
      opacity: 0.75;
    }
    35% {
      transform: none;
      opacity: 1;
    }
    52% {
      transform: none;
      opacity: 1;
    }
    55% {
      transform: skew(-1deg, 0.2deg);
      opacity: 0.75;
    }
    50% {
      transform: none;
      opacity: 1;
    }
    72% {
      transform: none;
      opacity: 1;
    }
    75% {
      transform: skew(0.4deg, 1deg);
      opacity: 0.75;
    }
    80% {
      transform: none;
      opacity: 1;
    }
    100% {
      transform: none;
      opacity: 1;
    }
  }

  .input:not(:placeholder-shown) {
    animation: glitch 1s linear infinite;
  }

  .input-container::after {
    content: "|";
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #000;
    animation: blink 0.7s step-end infinite;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  .input:focus + .input-container::after {
    color: #fff;
  }

  .input:not(:placeholder-shown) {
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 0px 0px 0 #000;
  }`;

export default Input;


social links :- import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <span>Social</span>
        <a className="social-link" href="#">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 461.001 461.001" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <g> <path style={{fill: '#F61C0D'}} d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728 c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137 C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607 c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z" /> </g> </g></svg>
        </a>
        <a className="social-link" href="#">
          <svg fill="#000000" viewBox="0 0 512 512" id="icons" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z" /></g></svg>
        </a>
        <a className="social-link" href="#">
          <svg viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <g> <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fillRule="nonzero"> </path> </g> </g></svg>
        </a>
        <a className="social-link" href="#">
          <svg fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="icon"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M488.1 414.7V303.4L300.9 428l83.6 55.8zm254.1 137.7v-79.8l-59.8 39.9zM512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm278 533c0 1.1-.1 2.1-.2 3.1 0 .4-.1.7-.2 1a14.16 14.16 0 0 1-.8 3.2c-.2.6-.4 1.2-.6 1.7-.2.4-.4.8-.5 1.2-.3.5-.5 1.1-.8 1.6-.2.4-.4.7-.7 1.1-.3.5-.7 1-1 1.5-.3.4-.5.7-.8 1-.4.4-.8.9-1.2 1.3-.3.3-.6.6-1 .9-.4.4-.9.8-1.4 1.1-.4.3-.7.6-1.1.8-.1.1-.3.2-.4.3L525.2 786c-4 2.7-8.6 4-13.2 4-4.7 0-9.3-1.4-13.3-4L244.6 616.9c-.1-.1-.3-.2-.4-.3l-1.1-.8c-.5-.4-.9-.7-1.3-1.1-.3-.3-.6-.6-1-.9-.4-.4-.8-.8-1.2-1.3a7 7 0 0 1-.8-1c-.4-.5-.7-1-1-1.5-.2-.4-.5-.7-.7-1.1-.3-.5-.6-1.1-.8-1.6-.2-.4-.4-.8-.5-1.2-.2-.6-.4-1.2-.6-1.7-.1-.4-.3-.8-.4-1.2-.2-.7-.3-1.3-.4-2-.1-.3-.1-.7-.2-1-.1-1-.2-2.1-.2-3.1V427.9c0-1 .1-2.1.2-3.1.1-.3.1-.7.2-1a14.16 14.16 0 0 1 .8-3.2c.2-.6.4-1.2.6-1.7.2-.4.4-.8.5-1.2.2-.5.5-1.1.8-1.6.2-.4.4-.7.7-1.1.6-.9 1.2-1.7 1.8-2.5.4-.4.8-.9 1.2-1.3.3-.3.6-.6 1-.9.4-.4.9-.8 1.3-1.1.4-.3.7-.6 1.1-.8.1-.1.3-.2.4-.3L498.7 239c8-5.3 18.5-5.3 26.5 0l254.1 169.1c.1.1.3.2.4.3l1.1.8 1.4 1.1c.3.3.6.6 1 .9.4.4.8.8 1.2 1.3.7.8 1.3 1.6 1.8 2.5.2.4.5.7.7 1.1.3.5.6 1 .8 1.6.2.4.4.8.5 1.2.2.6.4 1.2.6 1.7.1.4.3.8.4 1.2.2.7.3 1.3.4 2 .1.3.1.7.2 1 .1 1 .2 2.1.2 3.1V597zm-254.1 13.3v111.3L723.1 597l-83.6-55.8zM281.8 472.6v79.8l59.8-39.9zM512 456.1l-84.5 56.4 84.5 56.4 84.5-56.4zM723.1 428L535.9 303.4v111.3l103.6 69.1zM384.5 541.2L300.9 597l187.2 124.6V610.3l-103.6-69.1z" /> </g></svg>
        </a>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card svg {
    height: 25px;
  }

  .card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e7e7e7;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    overflow: hidden;
    height: 50px;
    width: 200px;
  }

  .card::before, .card::after {
    position: absolute;
    display: flex;
    align-items: center;
    width: 50%;
    height: 100%;
    transition: 0.25s linear;
    z-index: 1;
  }

  .card::before {
    content: "";
    left: 0;
    justify-content: flex-end;
    background-color: #4d60b6;
  }

  .card::after {
    content: "";
    right: 0;
    justify-content: flex-start;
    background-color: #4453a6;
  }

  .card:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }

  .card:hover span {
    opacity: 0;
    z-index: -3;
  }

  .card:hover::before {
    opacity: 0.5;
    transform: translateY(-100%);
  }

  .card:hover::after {
    opacity: 0.5;
    transform: translateY(100%);
  }

  .card span {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: whitesmoke;
    font-family: 'Fira Mono', monospace;
    font-size: 24px;
    font-weight: 700;
    opacity: 1;
    transition: opacity 0.25s;
    z-index: 2;
  }

  .card .social-link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25%;
    height: 100%;
    color: whitesmoke;
    font-size: 24px;
    text-decoration: none;
    transition: 0.25s;
  }

  .card .social-link svg {
    text-shadow: 1px 1px rgba(31, 74, 121, 0.7);
    transform: scale(1);
  }

  .card .social-link:hover {
    background-color: rgba(249, 244, 255, 0.774);
    animation: bounce_613 0.4s linear;
  }

  @keyframes bounce_613 {
    40% {
      transform: scale(1.4);
    }

    60% {
      transform: scale(0.8);
    }

    80% {
      transform: scale(1.2);
    }

    100% {
      transform: scale(1);
    }
  }`;

export default Card;
s

after buy now button for final confirmation for payment link :- import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="head">Window</div>
        <div className="content">
          This is a neobrutalist-style window with a button and space for any content
          you want!
          <br />
          <button className="button">Button</button>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    font-family: Montserrat, sans-serif;
    width: 300px;
    height: 250px;
    translate: -6px -6px;
    background: #ff66a3;
    border: 3px solid #000000;
    box-shadow: 12px 12px 0 #000000;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .head {
    font-family: Montserrat, sans-serif;
    font-size: 14px;
    font-weight: 900;
    width: 100%;
    height: 32px;
    background: #ffffff;
    padding: 5px 12px;
    color: #000000;
    border-bottom: 3px solid #000000;
  }

  .content {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 600;
  }

  .button {
    padding: 5px 10px;
    margin-top: 10px;
    border: 3px solid #000000;
    box-shadow: 3px 3px 0 #000000;
    font-weight: 750;
    background: #4ade80;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .button:hover {
    translate: 1.5px 1.5px;
    box-shadow: 1.5px 1.5px 0 #000000;
    background: #1ac2ff;
  }

  .button:active {
    translate: 3px 3px;
    box-shadow: 0 0 0 #000000;
  }

  .card:hover {
    translate: -6px;
  }`;

export default Card;


All product images :-
-----------------------------------------------------------------------------------------------------------------------------------



import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <p className="heading">
          Popular this month
        </p>
        <p>
          Powered By
        </p>
        <p>Uiverse
        </p></div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 190px;
    height: 254px;
    background-color: #000;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: 12px;
    gap: 12px;
    border-radius: 8px;
    cursor: pointer;
    color: white;
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    left: -5px;
    margin: auto;
    width: 200px;
    height: 264px;
    border-radius: 10px;
    background: linear-gradient(-45deg, #e81cff 0%, #40c9ff 100% );
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #fc00ff 0%, #00dbde 100% );
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
  }

  .heading {
    font-size: 20px;
    text-transform: capitalize;
    font-weight: 700;
  }

  .card p:not(.heading) {
    font-size: 14px;
  }

  .card p:last-child {
    color: #e81cff;
    font-weight: 600;
  }

  .card:hover::after {
    filter: blur(30px);
  }

  .card:hover::before {
    transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  }`;

export default Card;


when they click on procced to payment or make payment then :- import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="left-side">
          <div className="card">
            <div className="card-line" />
            <div className="buttons" />
          </div>
          <div className="post">
            <div className="post-line" />
            <div className="screen">
              <div className="dollar">$</div>
            </div>
            <div className="numbers" />
            <div className="numbers-line2" />
          </div>
        </div>
        <div className="right-side">
          <div className="new">New Transaction</div>
          <svg viewBox="0 0 451.846 451.847" height={512} width={512} xmlns="http://www.w3.org/2000/svg" className="arrow"><path fill="#cfcfcf" data-old_color="#000000" className="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z" /></svg>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    background-color: #ffffff;
    display: flex;
    width: 460px;
    height: 120px;
    position: relative;
    border-radius: 6px;
    transition: 0.3s ease-in-out;
  }

  .container:hover {
    transform: scale(1.03);
    width: 220px;
  }

  .container:hover .left-side {
    width: 100%;
  }

  .left-side {
    background-color: #5de2a3;
    width: 130px;
    height: 120px;
    border-radius: 4px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s;
    flex-shrink: 0;
    overflow: hidden;
  }

  .right-side {
    width: calc(100% - 130px);
    display: flex;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
    justify-content: space-between;
    white-space: nowrap;
    transition: 0.3s;
  }

  .right-side:hover {
    background-color: #f9f7f9;
  }

  .arrow {
    width: 20px;
    height: 20px;
    margin-right: 20px;
  }

  .new {
    font-size: 23px;
    font-family: "Lexend Deca", sans-serif;
    margin-left: 20px;
  }

  .card {
    width: 70px;
    height: 46px;
    background-color: #c7ffbc;
    border-radius: 6px;
    position: absolute;
    display: flex;
    z-index: 10;
    flex-direction: column;
    align-items: center;
    -webkit-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72);
    -moz-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72);
    -webkit-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72);
  }

  .card-line {
    width: 65px;
    height: 13px;
    background-color: #80ea69;
    border-radius: 2px;
    margin-top: 7px;
  }

  @media only screen and (max-width: 480px) {
    .container {
      transform: scale(0.7);
    }

    .container:hover {
      transform: scale(0.74);
    }

    .new {
      font-size: 18px;
    }
  }

  .buttons {
    width: 8px;
    height: 8px;
    background-color: #379e1f;
    box-shadow: 0 -10px 0 0 #26850e, 0 10px 0 0 #56be3e;
    border-radius: 50%;
    margin-top: 5px;
    transform: rotate(90deg);
    margin: 10px 0 0 -30px;
  }

  .container:hover .card {
    animation: slide-top 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) both;
  }

  .container:hover .post {
    animation: slide-post 1s cubic-bezier(0.165, 0.84, 0.44, 1) both;
  }

  @keyframes slide-top {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    50% {
      -webkit-transform: translateY(-70px) rotate(90deg);
      transform: translateY(-70px) rotate(90deg);
    }

    60% {
      -webkit-transform: translateY(-70px) rotate(90deg);
      transform: translateY(-70px) rotate(90deg);
    }

    100% {
      -webkit-transform: translateY(-8px) rotate(90deg);
      transform: translateY(-8px) rotate(90deg);
    }
  }

  .post {
    width: 63px;
    height: 75px;
    background-color: #dddde0;
    position: absolute;
    z-index: 11;
    bottom: 10px;
    top: 120px;
    border-radius: 6px;
    overflow: hidden;
  }

  .post-line {
    width: 47px;
    height: 9px;
    background-color: #545354;
    position: absolute;
    border-radius: 0px 0px 3px 3px;
    right: 8px;
    top: 8px;
  }

  .post-line:before {
    content: "";
    position: absolute;
    width: 47px;
    height: 9px;
    background-color: #757375;
    top: -8px;
  }

  .screen {
    width: 47px;
    height: 23px;
    background-color: #ffffff;
    position: absolute;
    top: 22px;
    right: 8px;
    border-radius: 3px;
  }

  .numbers {
    width: 12px;
    height: 12px;
    background-color: #838183;
    box-shadow: 0 -18px 0 0 #838183, 0 18px 0 0 #838183;
    border-radius: 2px;
    position: absolute;
    transform: rotate(90deg);
    left: 25px;
    top: 52px;
  }

  .numbers-line2 {
    width: 12px;
    height: 12px;
    background-color: #aaa9ab;
    box-shadow: 0 -18px 0 0 #aaa9ab, 0 18px 0 0 #aaa9ab;
    border-radius: 2px;
    position: absolute;
    transform: rotate(90deg);
    left: 25px;
    top: 68px;
  }

  @keyframes slide-post {
    50% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    100% {
      -webkit-transform: translateY(-70px);
      transform: translateY(-70px);
    }
  }

  .dollar {
    position: absolute;
    font-size: 16px;
    font-family: "Lexend Deca", sans-serif;
    width: 100%;
    left: 0;
    top: 0;
    color: #4b953b;
    text-align: center;
  }

  .container:hover .dollar {
    animation: fade-in-fwd 0.3s 1s backwards;
  }

  @keyframes fade-in-fwd {
    0% {
      opacity: 0;
      transform: translateY(-5px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }`;

export default Card;

------------------------------------------------------------
css:-



.card {
 width: 190px;
 height: 254px;
 border-radius: 30px;
 background: #212121;
 box-shadow: 15px 15px 30px rgb(25, 25, 25),
             -15px -15px 30px rgb(60, 60, 60);
}





product card :=
----------------------------------------------------------------------------------------------------------------





 import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <p className="heading">
          Popular this month
        </p>
        <p>
          Powered By
        </p>
        <p>Uiverse
        </p></div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 190px;
    height: 254px;
    background-color: #000;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: 12px;
    gap: 12px;
    border-radius: 8px;
    cursor: pointer;
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    left: -5px;
    margin: auto;
    width: 200px;
    height: 264px;
    border-radius: 10px;
    background: linear-gradient(-45deg, #e81cff 0%, #40c9ff 100% );
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #fc00ff 0%, #00dbde 100% );
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
  }

  .heading {
    font-size: 20px;
    text-transform: capitalize;
    font-weight: 700;
  }

  .card p:not(.heading) {
    font-size: 14px;
  }

  .card p:last-child {
    color: #e81cff;
    font-weight: 600;
  }

  .card:hover::after {
    filter: blur(30px);
  }

  .card:hover::before {
    transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  }`;

export default Card;



---------------------------------------------------------
css:-

.card {
  position: relative;
  width: 190px;
  height: 254px;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding: 12px;
  gap: 12px;
  border-radius: 8px;
  cursor: pointer;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  left: -5px;
  margin: auto;
  width: 200px;
  height: 264px;
  border-radius: 10px;
  background: linear-gradient(-45deg, #e81cff 0%, #40c9ff 100% );
  z-index: -10;
  pointer-events: none;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card::after {
  content: "";
  z-index: -1;
  position: absolute;
  inset: 0;
  background: linear-gradient(-45deg, #fc00ff 0%, #00dbde 100% );
  transform: translate3d(0, 0, 0) scale(0.95);
  filter: blur(20px);
}

.heading {
  font-size: 20px;
  text-transform: capitalize;
  font-weight: 700;
}

.card p:not(.heading) {
  font-size: 14px;
}

.card p:last-child {
  color: #e81cff;
  font-weight: 600;
}

.card:hover::after {
  filter: blur(30px);
}

.card:hover::before {
  transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
}








loader (##use this exact in site):=
------------------------------------------------------------------------------------------------------------------------------



import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="box1" />
        <div className="box2" />
        <div className="box3" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    width: 112px;
    height: 112px;
  }

  .box1,
  .box2,
  .box3 {
    border: 16px solid #f5f5f5;
    box-sizing: border-box;
    position: absolute;
    display: block;
  }

  .box1 {
    width: 112px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
    animation: abox1 4s 1s forwards ease-in-out infinite;
  }

  .box2 {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
    animation: abox2 4s 1s forwards ease-in-out infinite;
  }

  .box3 {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
    animation: abox3 4s 1s forwards ease-in-out infinite;
  }

  @keyframes abox1 {
    0% {
      width: 112px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    12.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    25% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    37.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    50% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    62.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    75% {
      width: 48px;
      height: 112px;
      margin-top: 0px;
      margin-left: 0px;
    }

    87.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    100% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }
  }

  @keyframes abox2 {
    0% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    12.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    25% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    37.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    50% {
      width: 112px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    62.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }

    75% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }

    87.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }

    100% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }
  }

  @keyframes abox3 {
    0% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }

    12.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }

    25% {
      width: 48px;
      height: 112px;
      margin-top: 0px;
      margin-left: 64px;
    }

    37.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 64px;
    }

    50% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 64px;
    }

    62.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 64px;
    }

    75% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 64px;
    }

    87.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 64px;
    }

    100% {
      width: 112px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }
  }`;

export default Loader;



-------------------------------------------------------
css:-


.loader {
  width: 112px;
  height: 112px;
}

.box1,
.box2,
.box3 {
  border: 16px solid #f5f5f5;
  box-sizing: border-box;
  position: absolute;
  display: block;
}

.box1 {
  width: 112px;
  height: 48px;
  margin-top: 64px;
  margin-left: 0px;
  animation: abox1 4s 1s forwards ease-in-out infinite;
}

.box2 {
  width: 48px;
  height: 48px;
  margin-top: 0px;
  margin-left: 0px;
  animation: abox2 4s 1s forwards ease-in-out infinite;
}

.box3 {
  width: 48px;
  height: 48px;
  margin-top: 0px;
  margin-left: 64px;
  animation: abox3 4s 1s forwards ease-in-out infinite;
}

@keyframes abox1 {
  0% {
    width: 112px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  12.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  25% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  37.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  50% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  62.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  75% {
    width: 48px;
    height: 112px;
    margin-top: 0px;
    margin-left: 0px;
  }

  87.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  100% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }
}

@keyframes abox2 {
  0% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  12.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  25% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  37.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  50% {
    width: 112px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  62.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }

  75% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }

  87.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }

  100% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }
}

@keyframes abox3 {
  0% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }

  12.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }

  25% {
    width: 48px;
    height: 112px;
    margin-top: 0px;
    margin-left: 64px;
  }

  37.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 64px;
  }

  50% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 64px;
  }

  62.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 64px;
  }

  75% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 64px;
  }

  87.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 64px;
  }

  100% {
    width: 112px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }
}





input area (must use in every typing  area):=
-------------------------------------------------------------------------------------------------------------- 



import React from 'react';
import styled from 'styled-components';

const Input = () => {
  return (
    <StyledWrapper>
      <div className="input-container">
        <input className="input" name="text" type="text" placeholder="Search the internet..." />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .input {
    width: 100%;
    max-width: 270px;
    height: 60px;
    padding: 12px;
    font-size: 18px;
    font-family: "Courier New", monospace;
    color: #000;
    background-color: #fff;
    border: 4px solid #000;
    border-radius: 0;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 8px 8px 0 #000;
  }

  .input::placeholder {
    color: #888;
  }

  .input:hover {
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0 #000;
  }

  .input:focus {
    background-color: #000;
    color: #fff;
    border-color: #ffffff;
  }

  .input:focus::placeholder {
    color: #fff;
  }

  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  @keyframes blink {
    50% {
      border-color: transparent;
    }
  }

  .input:focus::after {
    content: "|";
    position: absolute;
    right: 10px;
    animation: blink 0.7s step-end infinite;
  }

  .input:valid {
    animation: typing 2s steps(30, end);
  }
  .input-container {
    position: relative;
    width: 100%;
    max-width: 270px;
  }

  .input {
    width: 100%;
    height: 60px;
    padding: 12px;
    font-size: 18px;
    font-family: "Courier New", monospace;
    color: #000;
    background-color: #fff;
    border: 4px solid #000;
    border-radius: 0;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 8px 8px 0 #000;
  }

  .input::placeholder {
    color: #888;
  }

  .input:hover {
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0 #000;
  }

  .input:focus {
    background-color: #010101;
    color: #fff;
    border-color: #d6d9dd;
  }

  .input:focus::placeholder {
    color: #fff;
  }

  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px) rotate(-5deg);
    }
    50% {
      transform: translateX(5px) rotate(5deg);
    }
    75% {
      transform: translateX(-5px) rotate(-5deg);
    }
    100% {
      transform: translateX(0);
    }
  }

  .input:focus {
    animation: shake 0.5s ease-in-out;
  }

  @keyframes glitch {
    0% {
      transform: none;
      opacity: 1;
    }
    7% {
      transform: skew(-0.5deg, -0.9deg);
      opacity: 0.75;
    }
    10% {
      transform: none;
      opacity: 1;
    }
    27% {
      transform: none;
      opacity: 1;
    }
    30% {
      transform: skew(0.8deg, -0.1deg);
      opacity: 0.75;
    }
    35% {
      transform: none;
      opacity: 1;
    }
    52% {
      transform: none;
      opacity: 1;
    }
    55% {
      transform: skew(-1deg, 0.2deg);
      opacity: 0.75;
    }
    50% {
      transform: none;
      opacity: 1;
    }
    72% {
      transform: none;
      opacity: 1;
    }
    75% {
      transform: skew(0.4deg, 1deg);
      opacity: 0.75;
    }
    80% {
      transform: none;
      opacity: 1;
    }
    100% {
      transform: none;
      opacity: 1;
    }
  }

  .input:not(:placeholder-shown) {
    animation: glitch 1s linear infinite;
  }

  .input-container::after {
    content: "|";
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #000;
    animation: blink 0.7s step-end infinite;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  .input:focus + .input-container::after {
    color: #fff;
  }

  .input:not(:placeholder-shown) {
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 0px 0px 0 #000;
  }`;

export default Input;
 

---------------------------------------------------
css:- 

.input {
  width: 100%;
  max-width: 270px;
  height: 60px;
  padding: 12px;
  font-size: 18px;
  font-family: "Courier New", monospace;
  color: #000;
  background-color: #fff;
  border: 4px solid #000;
  border-radius: 0;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 8px 8px 0 #000;
}

.input::placeholder {
  color: #888;
}

.input:hover {
  transform: translate(-4px, -4px);
  box-shadow: 12px 12px 0 #000;
}

.input:focus {
  background-color: #000;
  color: #fff;
  border-color: #ffffff;
}

.input:focus::placeholder {
  color: #fff;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

.input:focus::after {
  content: "|";
  position: absolute;
  right: 10px;
  animation: blink 0.7s step-end infinite;
}

.input:valid {
  animation: typing 2s steps(30, end);
}
.input-container {
  position: relative;
  width: 100%;
  max-width: 270px;
}

.input {
  width: 100%;
  height: 60px;
  padding: 12px;
  font-size: 18px;
  font-family: "Courier New", monospace;
  color: #000;
  background-color: #fff;
  border: 4px solid #000;
  border-radius: 0;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 8px 8px 0 #000;
}

.input::placeholder {
  color: #888;
}

.input:hover {
  transform: translate(-4px, -4px);
  box-shadow: 12px 12px 0 #000;
}

.input:focus {
  background-color: #010101;
  color: #fff;
  border-color: #d6d9dd;
}

.input:focus::placeholder {
  color: #fff;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px) rotate(-5deg);
  }
  50% {
    transform: translateX(5px) rotate(5deg);
  }
  75% {
    transform: translateX(-5px) rotate(-5deg);
  }
  100% {
    transform: translateX(0);
  }
}

.input:focus {
  animation: shake 0.5s ease-in-out;
}

@keyframes glitch {
  0% {
    transform: none;
    opacity: 1;
  }
  7% {
    transform: skew(-0.5deg, -0.9deg);
    opacity: 0.75;
  }
  10% {
    transform: none;
    opacity: 1;
  }
  27% {
    transform: none;
    opacity: 1;
  }
  30% {
    transform: skew(0.8deg, -0.1deg);
    opacity: 0.75;
  }
  35% {
    transform: none;
    opacity: 1;
  }
  52% {
    transform: none;
    opacity: 1;
  }
  55% {
    transform: skew(-1deg, 0.2deg);
    opacity: 0.75;
  }
  50% {
    transform: none;
    opacity: 1;
  }
  72% {
    transform: none;
    opacity: 1;
  }
  75% {
    transform: skew(0.4deg, 1deg);
    opacity: 0.75;
  }
  80% {
    transform: none;
    opacity: 1;
  }
  100% {
    transform: none;
    opacity: 1;
  }
}

.input:not(:placeholder-shown) {
  animation: glitch 1s linear infinite;
}

.input-container::after {
  content: "|";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #000;
  animation: blink 0.7s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.input:focus + .input-container::after {
  color: #fff;
}

.input:not(:placeholder-shown) {
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0px 0px 0 #000;
}












button (every clickable button where text saved use must this on them and all site where needed and should be ):=

--------------------------------------------------------------------------------------------------------------------




import React from 'react';
import styled from 'styled-components';

const Radio = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="radio-wrapper">
          <input className="input" name="btn" id="value-1" type="radio" />
          <div className="btn">
            <span aria-hidden>_</span>Cyber
            <span className="btn__glitch" aria-hidden>_Cyber🦾</span>
            <label className="number">r1</label>
          </div>
        </div>
        <div className="radio-wrapper">
          <input className="input" name="btn" id="value-2" defaultChecked="true" type="radio" />
          <div className="btn">
            _Radio<span aria-hidden>_</span>
            <span className="btn__glitch" aria-hidden>_R_a_d_i_o_</span>
            <label className="number">r2</label>
          </div>
        </div>
        <div className="radio-wrapper">
          <input className="input" name="btn" id="value-3" type="radio" />
          <div className="btn">
            Buttons<span aria-hidden />
            <span className="btn__glitch" aria-hidden>Buttons_</span>
            <label className="number">r3</label>
          </div> 
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    display: flex;
    flex-direction: row;
  }

  .radio-wrapper {
    position: relative;
    height: 38px;
    width: 84px;
    margin: 3px;
  }

  .radio-wrapper .input {
    position: absolute;
    height: 100%;
    width: 100%;
    margin: 0;
    cursor: pointer;
    z-index: 10;
    opacity: 0;
  }

  .btn {
    --primary: #ff184c;
    --shadow-primary: #fded00;
    --color: white;
    --font-size: 9px;
    --shadow-primary-hue: 180;
    --shadow-secondary-hue: 60;
    --shadow-secondary: hsl(var(--shadow-secondary-hue), 90%, 60%);
    --clip: polygon(11% 0, 95% 0, 100% 25%, 90% 90%, 95% 90%, 85% 90%, 85% 100%, 7% 100%, 0 80%);
    --border: 5px;
    --shimmy-distance: 5;
    --clip-one: polygon(0 2%, 100% 2%, 100% 95%, 95% 95%, 95% 90%, 85% 90%, 85% 95%, 8% 95%, 0 70%);
    --clip-two: polygon(0 78%, 100% 78%, 100% 100%, 95% 100%, 95% 90%, 85% 90%, 85% 100%, 8% 100%, 0 78%);
    --clip-three: polygon(0 44%, 100% 44%, 100% 54%, 95% 54%, 95% 54%, 85% 54%, 85% 54%, 8% 54%, 0 54%);
    --clip-four: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
    --clip-five: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
    --clip-six: polygon(0 40%, 100% 40%, 100% 85%, 95% 85%, 95% 85%, 85% 85%, 85% 85%, 8% 85%, 0 70%);
    --clip-seven: polygon(0 63%, 100% 63%, 100% 80%, 95% 80%, 95% 80%, 85% 80%, 85% 80%, 8% 80%, 0 70%);
    color: var(--color);
    text-transform: uppercase;
    font-size: var(--font-size);
    letter-spacing: 3px;
    position: relative;
    font-weight: 900;
    width: 100%;
    height: 100%;
    line-height: 38px;
    text-align: center;
    transition: background 0.2s, 0.3s;
  }

  .input:checked + .btn {
    --primary: #8B00FF;
    --shadow-primary: #00e572;
  }

  .input:hover + .btn {
    --primary: #cc133c;
    --font-size: 11px;
  }

  .btn:after, .btn:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    clip-path: var(--clip);
    z-index: -1;
  }

  .btn:before {
    background: var(--shadow-primary);
    transform: translate(var(--border), 0);
  }

  .btn:after {
    background: var(--primary);
  }

  .btn__tag {
    position: absolute;
    padding: 1px 4px;
    letter-spacing: 1px;
    line-height: 1;
    bottom: -5%;
    right: 5%;
    font-weight: normal;
    color: hsl(0, 0%, 0%);
    font-size: var(--label-size);
  }

  .btn__glitch {
    position: absolute;
    top: calc(var(--border) * -1);
    left: calc(var(--border) * -1);
    right: calc(var(--border) * -1);
    bottom: calc(var(--border) * -1);
    background: var(--shadow-primary);
    text-shadow: 2px 2px var(--shadow-primary), -2px -2px var(--shadow-secondary);
    clip-path: var(--clip);
    animation: glitch 2s infinite;
    display: none;
  }

  .input:hover + .btn .btn__glitch {
    display: block;
  }

  .input:checked + .btn .btn__glitch {
    display: block;
    animation: glitch 5s infinite;
  }

  .btn__glitch:before {
    content: '';
    position: absolute;
    top: calc(var(--border) * 1);
    right: calc(var(--border) * 1);
    bottom: calc(var(--border) * 1);
    left: calc(var(--border) * 1);
    clip-path: var(--clip);
    background: var(--primary);
    z-index: -1;
  }

  @keyframes glitch {
    0% {
      clip-path: var(--clip-one);
    }

    2%, 8% {
      clip-path: var(--clip-two);
      transform: translate(calc(var(--shimmy-distance) * -1%), 0);
    }

    6% {
      clip-path: var(--clip-two);
      transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }

    9% {
      clip-path: var(--clip-two);
      transform: translate(0, 0);
    }

    10% {
      clip-path: var(--clip-three);
      transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }

    13% {
      clip-path: var(--clip-three);
      transform: translate(0, 0);
    }

    14%, 21% {
      clip-path: var(--clip-four);
      transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }

    25% {
      clip-path: var(--clip-five);
      transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }

    30% {
      clip-path: var(--clip-five);
      transform: translate(calc(var(--shimmy-distance) * -1%), 0);
    }

    35%, 45% {
      clip-path: var(--clip-six);
      transform: translate(calc(var(--shimmy-distance) * -1%));
    }

    40% {
      clip-path: var(--clip-six);
      transform: translate(calc(var(--shimmy-distance) * 1%));
    }

    50% {
      clip-path: var(--clip-six);
      transform: translate(0, 0);
    }

    55% {
      clip-path: var(--clip-seven);
      transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }

    60% {
      clip-path: var(--clip-seven);
      transform: translate(0, 0);
    }

    31%, 61%, 100% {
      clip-path: var(--clip-four);
    }
  }

  .number {
    background: var(--shadow-primary);
    color: #323232;
    font-size: 5.5px;
    font-weight: 700;
    letter-spacing: 1px;
    position: absolute;
    width: 15px;
    height: 6px;
    top: 0;
    left: 81%;
    line-height: 6.2px;
  }`;

export default Radio;




--------------------------------------------------------
css:-  

.container {
  display: flex;
  flex-direction: row;
}

.radio-wrapper {
  position: relative;
  height: 38px;
  width: 84px;
  margin: 3px;
}

.radio-wrapper .input {
  position: absolute;
  height: 100%;
  width: 100%;
  margin: 0;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
}

.btn {
  --primary: #ff184c;
  --shadow-primary: #fded00;
  --color: white;
  --font-size: 9px;
  --shadow-primary-hue: 180;
  --shadow-secondary-hue: 60;
  --shadow-secondary: hsl(var(--shadow-secondary-hue), 90%, 60%);
  --clip: polygon(11% 0, 95% 0, 100% 25%, 90% 90%, 95% 90%, 85% 90%, 85% 100%, 7% 100%, 0 80%);
  --border: 5px;
  --shimmy-distance: 5;
  --clip-one: polygon(0 2%, 100% 2%, 100% 95%, 95% 95%, 95% 90%, 85% 90%, 85% 95%, 8% 95%, 0 70%);
  --clip-two: polygon(0 78%, 100% 78%, 100% 100%, 95% 100%, 95% 90%, 85% 90%, 85% 100%, 8% 100%, 0 78%);
  --clip-three: polygon(0 44%, 100% 44%, 100% 54%, 95% 54%, 95% 54%, 85% 54%, 85% 54%, 8% 54%, 0 54%);
  --clip-four: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
  --clip-five: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
  --clip-six: polygon(0 40%, 100% 40%, 100% 85%, 95% 85%, 95% 85%, 85% 85%, 85% 85%, 8% 85%, 0 70%);
  --clip-seven: polygon(0 63%, 100% 63%, 100% 80%, 95% 80%, 95% 80%, 85% 80%, 85% 80%, 8% 80%, 0 70%);
  color: var(--color);
  text-transform: uppercase;
  font-size: var(--font-size);
  letter-spacing: 3px;
  position: relative;
  font-weight: 900;
  width: 100%;
  height: 100%;
  line-height: 38px;
  text-align: center;
  transition: background 0.2s, 0.3s;
}

.input:checked + .btn {
  --primary: #8B00FF;
  --shadow-primary: #00e572;
}

.input:hover + .btn {
  --primary: #cc133c;
  --font-size: 11px;
}

.btn:after, .btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  clip-path: var(--clip);
  z-index: -1;
}

.btn:before {
  background: var(--shadow-primary);
  transform: translate(var(--border), 0);
}

.btn:after {
  background: var(--primary);
}

.btn__tag {
  position: absolute;
  padding: 1px 4px;
  letter-spacing: 1px;
  line-height: 1;
  bottom: -5%;
  right: 5%;
  font-weight: normal;
  color: hsl(0, 0%, 0%);
  font-size: var(--label-size);
}

.btn__glitch {
  position: absolute;
  top: calc(var(--border) * -1);
  left: calc(var(--border) * -1);
  right: calc(var(--border) * -1);
  bottom: calc(var(--border) * -1);
  background: var(--shadow-primary);
  text-shadow: 2px 2px var(--shadow-primary), -2px -2px var(--shadow-secondary);
  clip-path: var(--clip);
  animation: glitch 2s infinite;
  display: none;
}

.input:hover + .btn .btn__glitch {
  display: block;
}

.input:checked + .btn .btn__glitch {
  display: block;
  animation: glitch 5s infinite;
}

.btn__glitch:before {
  content: '';
  position: absolute;
  top: calc(var(--border) * 1);
  right: calc(var(--border) * 1);
  bottom: calc(var(--border) * 1);
  left: calc(var(--border) * 1);
  clip-path: var(--clip);
  background: var(--primary);
  z-index: -1;
}

@keyframes glitch {
  0% {
    clip-path: var(--clip-one);
  }

  2%, 8% {
    clip-path: var(--clip-two);
    transform: translate(calc(var(--shimmy-distance) * -1%), 0);
  }

  6% {
    clip-path: var(--clip-two);
    transform: translate(calc(var(--shimmy-distance) * 1%), 0);
  }

  9% {
    clip-path: var(--clip-two);
    transform: translate(0, 0);
  }

  10% {
    clip-path: var(--clip-three);
    transform: translate(calc(var(--shimmy-distance) * 1%), 0);
  }

  13% {
    clip-path: var(--clip-three);
    transform: translate(0, 0);
  }

  14%, 21% {
    clip-path: var(--clip-four);
    transform: translate(calc(var(--shimmy-distance) * 1%), 0);
  }

  25% {
    clip-path: var(--clip-five);
    transform: translate(calc(var(--shimmy-distance) * 1%), 0);
  }

  30% {
    clip-path: var(--clip-five);
    transform: translate(calc(var(--shimmy-distance) * -1%), 0);
  }

  35%, 45% {
    clip-path: var(--clip-six);
    transform: translate(calc(var(--shimmy-distance) * -1%));
  }

  40% {
    clip-path: var(--clip-six);
    transform: translate(calc(var(--shimmy-distance) * 1%));
  }

  50% {
    clip-path: var(--clip-six);
    transform: translate(0, 0);
  }

  55% {
    clip-path: var(--clip-seven);
    transform: translate(calc(var(--shimmy-distance) * 1%), 0);
  }

  60% {
    clip-path: var(--clip-seven);
    transform: translate(0, 0);
  }

  31%, 61%, 100% {
    clip-path: var(--clip-four);
  }
}

.number {
  background: var(--shadow-primary);
  color: #323232;
  font-size: 5.5px;
  font-weight: 700;
  letter-spacing: 1px;
  position: absolute;
  width: 15px;
  height: 6px;
  top: 0;
  left: 81%;
  line-height: 6.2px;
}






sign in page (this must use in site on appropriate place):=
------------------------------------------------------------------------------------------------------







import React from 'react';
import styled from 'styled-components';

const Form = () => {
  return (
    <StyledWrapper>
      <form action className="form">
        <p>
          Welcome,<span>sign in to continue</span>
        </p>
        <button className="oauthButton">
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </button>
        <button className="oauthButton">
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          Continue with Github
        </button>
        <div className="separator">
          <div />
          <span>OR</span>
          <div />
        </div>
        <input type="email" placeholder="Email" name="email" />
        <button className="oauthButton">
          Continue
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" /></svg>
        </button>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* DEOXY Was Here */
  .form {
    --background: #d3d3d3;
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #323232;
    padding: 20px;
    background: var(--background);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
  }

  .form > p {
    font-family: var(--font-DelaGothicOne);
    color: var(--font-color);
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
  }

  .form > p > span {
    font-family: var(--font-SpaceMono);
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 17px;
  }

  .separator {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .separator > div {
    width: 100px;
    height: 3px;
    border-radius: 5px;
    background-color: var(--font-color-sub);
  }

  .separator > span {
    color: var(--font-color);
    font-family: var(--font-SpaceMono);
    font-weight: 600;
  }

  .oauthButton {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
      /* margin: 50px auto 0 auto; */
    padding: auto 15px 15px auto;
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 16px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
    transition: all 250ms;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .oauthButton::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    background-color: #212121;
    z-index: -1;
    -webkit-box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    transition: all 250ms;
  }

  .oauthButton:hover {
    color: #e8e8e8;
  }

  .oauthButton:hover::before {
    width: 100%;
  }

  .form > input {
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }`;

export default Form;


-------------
CSS:- /* DEOXY Was Here */
.form {
  --background: #d3d3d3;
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  padding: 20px;
  background: var(--background);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
}

.form > p {
  font-family: var(--font-DelaGothicOne);
  color: var(--font-color);
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form > p > span {
  font-family: var(--font-SpaceMono);
  color: var(--font-color-sub);
  font-weight: 600;
  font-size: 17px;
}

.separator {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.separator > div {
  width: 100px;
  height: 3px;
  border-radius: 5px;
  background-color: var(--font-color-sub);
}

.separator > span {
  color: var(--font-color);
  font-family: var(--font-SpaceMono);
  font-weight: 600;
}

.oauthButton {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
    /* margin: 50px auto 0 auto; */
  padding: auto 15px 15px auto;
  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 16px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
  transition: all 250ms;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.oauthButton::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: #212121;
  z-index: -1;
  -webkit-box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
  box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
  transition: all 250ms;
}

.oauthButton:hover {
  color: #e8e8e8;
}

.oauthButton:hover::before {
  width: 100%;
}

.form > input {
  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}





------------------------------------------------------------------------------------------------------



