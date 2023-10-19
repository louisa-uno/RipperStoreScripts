// ==UserScript==
// @name         Auto-check Bump Posts in the unread tab of the RipperStore Forum
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically checks topics with Bump replies on RipperStore Forum
// @author       Louis_45
// @match        https://forum.ripper.store/unread
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Luois45/RipperStoreScripts/main/Auto-check%20Bump%20Posts%20in%20unread%20of%20RipperStore%20Forum.js
// @downloadURL  https://raw.githubusercontent.com/Luois45/RipperStoreScripts/main/Auto-check%20Bump%20Posts%20in%20unread%20of%20RipperStore%20Forum.js
// ==/UserScript==

(function () {
	"use strict";

	function checkBumpPosts() {
		const bumpPatterns = [
			/^(holy\s*)?[bn]+u+m+p+[oa]*s*i*n*g*$/, // Matches 'bump', 'buump', 'bumpo', 'bumps', 'holy bump', 'Holy buumping', 'bumping', 'nump', 'numpiiing', etc.
			/^1+$/, // Matches '1', '11', '111', etc.
			// Add other patterns here as needed
		];

		document
			.querySelectorAll('li[component="category/topic"]')
			.forEach((topic) => {
				let replyElement = topic.querySelector(
					'div.post-content p[dir="auto"]'
				);
				if (replyElement) {
					let replyText = replyElement.textContent
						.replace(/[!+* ~.^?<>']/g, "")
						.trim()
						.toLowerCase();
					for (let pattern of bumpPatterns) {
						if (pattern.test(replyText)) {
							// Adjust the checkbox icon to appear "checked"
							let checkboxIcon = topic.querySelector(
								'i[component="topic/select"]'
							);
							if (checkboxIcon) {
								checkboxIcon.classList.remove("fa-square-o");
								checkboxIcon.classList.add("fa-check-square-o");
							}

							// Add 'selected' class to the li element
							topic.classList.add("selected");
							break;
						}
					}
				}
			});
	}

	// Function to start the observer
	function startObserver() {
		// Select the node that will be observed for mutations
		var targetNode = document.querySelector("body");

		// Options for the observer (which mutations to observe)
		var config = { childList: true, subtree: true };

		// Callback function to execute when mutations are observed
		var callback = function (mutationsList, observer) {
			for (let mutation of mutationsList) {
				if (mutation.type === "childList") {
					checkBumpPosts();
				}
			}
		};

		// Create an observer instance linked to the callback function
		var observer = new MutationObserver(callback);

		// Start observing the target node for configured mutations
		observer.observe(targetNode, config);
	}

	// Start the initial function and the observer
	$(document).ready(function () {
		checkBumpPosts();
		startObserver();
	});
})();
