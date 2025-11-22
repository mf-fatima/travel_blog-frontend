
import type { FormEvent } from 'react';
import './PageBottomSection.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaYoutube, FaRss } from 'react-icons/fa';

// Component for the Newsletter Signup Form
const NewsletterSignup = () => {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Logic to handle form submission (e.g., send data to a backend service)
		console.log("Newsletter subscribed!");
	};

	return (
		<section className="newsletter-section">
			<div className="newsletter-collage-placeholder" />

			<div className="newsletter-content">
				<h2>Newsletter</h2>
				<p>Subscribe to my newsletter for the latest blog posts, tips, & travel guides. Let's stay updated!</p>
				<form className="newsletter-form" onSubmit={handleSubmit}>
					<input
						type="email"
						placeholder="Email"
						aria-label="Email subscription input"
						required
					/>
					<button type="submit">SUBSCRIBE</button>
				</form>
			</div>
		</section>
	);
};

// Component for the Footer
const Footer = () => {
	return (
		<footer className="site-footer">
			<div className="social-icons">
				<a href="#" aria-label="Facebook"><FaFacebookF /></a>
				<a href="#" aria-label="Twitter"><FaTwitter /></a>
				<a href="#" aria-label="Instagram"><FaInstagram /></a>
				<a href="#" aria-label="Pinterest"><FaPinterestP /></a>
				<a href="#" aria-label="YouTube"><FaYoutube /></a>
				<a href="#" aria-label="RSS Feed"><FaRss /></a>
			</div>

			<p className="copyright">&copy; The World Travel Guy 2023</p>

			<div className="footer-links">
				<a href="#">Affiliate Disclosure</a>
				<span>•</span>
				<a href="#">Privacy Policy</a>
				<span>•</span>
				<a href="#">Terms Of Use</a>
			</div>

			<p className="disclosure-text">
				Some of the pages in my travel blog contain affiliate links. Whenever you buy something through one of these links, I get a small commission at no extra cost to you. As an affiliate, I only recommend products and services that I believe are high quality and helpful to my readers. Thanks for your support.
			</p>
		</footer>
	);
};

// Main component to combine the sections
const PageBottomSection = () => {
	return (
		<div>
			<NewsletterSignup />
			<Footer />
		</div>
	);
};

export default PageBottomSection;



