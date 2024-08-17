import React from 'react'

function Footer() {

  function updateFooterPosition() {
    console.log('this is it')
    const footer = document.querySelector(".footer-container");
    if (document.body.scrollHeight > window.innerHeight) {
      footer.classList.remove("sticky-footer");
    } else {
      footer.classList.add("sticky-footer");
    }
  }

  // window.addEventListener("resize", updateFooterPosition);
  // window.addEventListener("load", updateFooterPosition);

  return (
    <div className="footer-container">
      <p>
        <i className='fas fa-quote-right quote quote-to-turn'></i>
        Build & maintained by <strong>Shivdutt</strong>
        <i className='fas fa-quote-right quote'></i>
      </p>
      <ul className="socials-container">
        <li>
          <a target="_blank" href="https://github.com/shivdutt-B" className="github-link">
            <i className="fab fa-github"></i>
          </a>

        </li>
        <li>
          <a target="_blank" href="https://www.linkedin.com/in/shivdutt-bhadakwad-07a462280/" className="linkedin-link">
            <i className="fab fa-linkedin-in"></i>
          </a>

        </li>
        <li>
          <a target="_blank" href="https://x.com/shivdutt059" className="twitter-link">
            <i className="fab fa-twitter"></i>
          </a>

        </li>

      </ul>
    </div>
  )
}

export default Footer