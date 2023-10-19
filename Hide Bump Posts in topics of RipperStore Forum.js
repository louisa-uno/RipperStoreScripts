// ==UserScript==
// @name         Hide Bump posts on RipperStore Forum
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide containing various bump texts on the RipperStore forum.
// @author       Louis_45
// @match        https://forum.ripper.store/topic/*
// @updateURL    https://raw.githubusercontent.com/Luois45/RipperStoreScripts/main/Hide%20Bump%20Posts%20in%20topics%20of%20RipperStore%20Forum.js
// @downloadURL  https://raw.githubusercontent.com/Luois45/RipperStoreScripts/main/Hide%20Bump%20Posts%20in%20topics%20of%20RipperStore%20Forum.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

    // Fetch the username from the HTML
    var currentUser = document.getElementById('user-header-name').textContent.trim();

	function hideBumpPosts() {
		// List of bump text patterns
		var bumpPatterns = [
			/^(holy\s*)?[bn]+u+m+p+[oa]*s*i*n*g*$/, // Matches 'bump', 'buump', 'bumpo', 'bumps', 'holy bump', 'Holy buumping', 'bumping', 'nump', 'numpiiing', etc.
			/^1+$/, // Matches '1', '11', '111', etc.
			// Add other patterns here as needed
		];

		$('li[component="post"]').each(function () {
			var postContent = $(this)
				.find('[component="post/content"]')
				.text()
				.replace(/[!+* ~.^?]/g, "")
				.trim()
				.toLowerCase();
			var posterName = $(this).attr("data-username");

			if (posterName === currentUser) {
				return true; // Continue to the next iteration
			}

			var isBump = bumpPatterns.some((pattern) =>
				pattern.test(postContent)
			);

			if (isBump) {
				$(this).hide();
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
					hideBumpPosts();
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
		hideBumpPosts();
		startObserver();
	});
})();
