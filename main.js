// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcSBGY5uRf5-KSS8qCL7uyiN0bdG7HCFc",
  authDomain: "sasnkrit-mitra-app.firebaseapp.com",
  projectId: "sasnkrit-mitra-app",
  storageBucket: "sasnkrit-mitra-app.firebasestorage.app",
  messagingSenderId: "930289396247",
  appId: "1:930289396247:web:043e7c1b95434f69b94a52",
};

// Initialize Firebase if no app is already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Wrap DOM interaction code in a load listener
window.addEventListener('load', () => {

	console.log('Window loaded.'); // Add this to confirm the load event is firing

	const getLessonsForModule = (moduleId) => {
		// This is a placeholder function. You'll likely fetch real lesson data here.
		return [{
			id: 1, // Assuming you want an id for the first lesson too
			name: `Lesson 1.1 for Module ${moduleId}`
		}, {
			id: 2,
			name: `Lesson 1.2 for Module ${moduleId}`
		}, ];
	};

	const openLessonSelectionModal = (moduleId) => {
		const modal = document.getElementById('lesson-selection-modal');
		const modalTitle = document.getElementById('lesson-selection-modal-title');
		const lessonList = document.getElementById('lesson-list');

		// Assuming you have a way to get lessons for a module
		const lessons = getLessonsForModule(moduleId);

		if (modal && modalTitle && lessonList) {
			modalTitle.textContent = `Lessons for Module ${moduleId}`; // Example title
			lessonList.innerHTML = ''; // Clear previous lessons

			lessons.forEach(lesson => {
				const lessonItem = document.createElement('li');
				lessonItem.textContent = lesson.name; // Example lesson property
				lessonList.appendChild(lessonItem);
			});
			modal.classList.remove('hidden'); // Show the modal
		}
	};

	// Keep track of the currently playing message ID
	let playingMessageId = null;

	// Ensure voices are loaded before attempting to speak
	// Some browsers load voices asynchronously
	window.speechSynthesis.onvoiceschanged = () => {
		console.log('Speech synthesis voices loaded or changed.');
		// You might want to update UI elements here if they depend on voice availability
	};

	// Function to handle speech synthesis
	const handleSpeak = (messageId, text, selectedVoice) => {

		const voices = window.speechSynthesis.getVoices();
		if (voices.length === 0) {
			console.error('No speech synthesis voices available.');
			window.updateAudioIcons(); // Make sure this function exists and updates UI accordingly
			return; // Stop the function execution if no voices
		}

		// Stop any currently playing speech
		if (window.speechSynthesis.speaking && playingMessageId !== messageId) {
			window.speechSynthesis.cancel();
			playingMessageId = null; // Reset
			window.updateAudioIcons(); // Update icons after cancelling
		}

		if (playingMessageId === messageId) {
			// If the same message is playing, stop it
			window.speechSynthesis.cancel();
			playingMessageId = null; // Reset
			window.updateAudioIcons(); // Update icons after cancelling
		} else {
			// Strip HTML tags from the text
			const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");

			const utterance = new SpeechSynthesisUtterance(cleanText);

			// Try to find an English voice first for testing
			let voice = voices.find(v => v.lang.startsWith('en-US'));

			// If no English voice, try the selected voice
			if (!voice) {
				voice = voices.find(v => v.name === selectedVoice);
			}
			// If still no voice, try a Sanskrit voice as a last resort
			if (!voice) {
				 voice = voices.find(v => v.lang.startsWith('sa-IN'));
			}

			if (voice) {
				utterance.voice = voice;
			} else {
				console.warn('No suitable speech synthesis voice found. Using browser default.');
				// The browser will use a default voice if utterance.voice is not set
			}

			utterance.onend = () => {
				playingMessageId = null;
				window.updateAudioIcons(); // Update icons when speech ends
			};
			utterance.onerror = (event) => {
				// These errors are expected when the user clicks another button
				// or stops audio manually. We can safely ignore them.
				if (event.error === 'canceled' || event.error === 'interrupted') {
					console.log(`Speech was intentionally ${event.error}.`);
					return; 
				}

				// Log any other, unexpected errors
				console.error('An unexpected speech synthesis error occurred:', event);
				playingMessageId = null;
				window.updateAudioIcons();
			};
			window.speechSynthesis.speak(utterance);
		}
	};
	// Toggle mobile menu: checks if all required elements exist before adding event listeners.
	if (showMenuButton && hideMenuButton && mobileMenu) {
		showMenuButton.addEventListener('click', () => {
			mobileMenu.classList.remove('-translate-x-full');
		});

		hideMenuButton.addEventListener('click', () => {
			mobileMenu.classList.add('-translate-x-full');
		});

		// Close mobile menu when a link is clicked
		mobileMenuLinks.forEach(link => {
			link.addEventListener('click', () => {
				mobileMenu.classList.add('-translate-x-full');
			});
		});
	} else {
		console.error("One or more mobile menu elements not found.");
	}

	// Toggle search overlay
	if (showSearchButton && hideSearchButton && searchOverlay) {
		showSearchButton.addEventListener('click', () => {
			searchOverlay.classList.remove('hidden');
			if (searchInput) {
				searchInput.focus();
			}
		});

		hideSearchButton.addEventListener('click', () => {
			searchOverlay.classList.add('hidden');
		});
	} else {
		console.error("One or more search overlay elements not found.");
	}

	// Close search overlay when clicking outside
	if (searchOverlay) {
		searchOverlay.addEventListener('click', (event) => {
			if (event.target === searchOverlay) {
				searchOverlay.classList.add('hidden');
			}
		});
	}

	// Simulate search functionality (replace with actual search implementation) - checks if both input and results elements exist.
	// Simulate search functionality (replace with actual search implementation)
	if (searchInput && searchResults) {
		searchInput.addEventListener('input', () => {
			const query = searchInput.value.toLowerCase();
			searchResults.innerHTML = ''; // Clear previous results

			if (query.length > 0) {
				// Dummy search results
				const dummyResults = [
					'Introduction to Sanskrit',
					'Sanskrit Grammar',
					'Vedic Literature',
					'Mahabharata',
					'Ramayana',
					'Upanishads',
				];

				const filteredResults = dummyResults.filter(item => item.toLowerCase().includes(query));

				if (filteredResults.length > 0) {
					const ul = document.createElement('ul');
					ul.className = 'list-none p-0 m-0';
					filteredResults.forEach(result => {
						const li = document.createElement('li');
						li.className = 'py-2 border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-700 px-2';
						li.textContent = result;
						li.addEventListener('click', () => {
							alert(`Navigating to: ${result}`);
							// In a real app, you would navigate to the corresponding page
							if (searchOverlay) {
								searchOverlay.classList.add('hidden'); // Close search overlay after selection
							}
						});
						ul.appendChild(li);
					});
					searchResults.appendChild(ul);
				} else {
					searchResults.innerHTML = '<p class="p-2">No results found.</p>';
				}
			}
		});
	} else {
		console.error("Search input or results container not found."); // Clarified error message.
	}

	// Handles Google Sign-in button click. Checks if the button element exists before adding the event listener.
	if (googleSigninBtn) { // Check if the element exists
		googleSigninBtn.addEventListener("click", () => { // Added check for googleSigninBtn
			console.log('Google Sign-In button clicked!');
			const provider = new GoogleAuthProvider();
			signInWithPopup(auth, provider)
				.then((result) => {
					// Signed in
					console.log("Signed in with Google:", result.user);
				})
				.catch((error) => console.error("Google Sign-In error:", error));
		});
	} else {
		console.error("Element with ID 'google-signin-btn' not found.");
	}
});
