/*

notie - a clean and simple notification suite for javascript, with no dependencies

Copyright (c) 2016 Jared Reich

Licensed under the MIT license:
http://www.opensource.org/licenses/mit-license.php

Project demo:
https://jaredreich.com/projects/notie

Version:  3.1.0
========================================
		Delete Input&Select fn
========================================

*/

var notie = function() {

	// Default options
	var options = {
		animationDelay: 300,
		backgroundClickDismiss: true
	}
	function setOptions(customOptions) {
		// Custom options
		for (var key in customOptions) {
			options[key] = customOptions[key];
		}
	}


	// alert
    // **************

	// create alert container
	var alertOuter = document.createElement('div');
	alertOuter.id = 'notie-alert-outer';

	// Hide alert on click
    alertOuter.onclick = function() {
        clearTimeout(alertTimeout1);
        clearTimeout(alertTimeout2);
        alertHide();
    };

	// add alert to body
	document.body.appendChild(alertOuter);

	// create alert inner container
	var alertInner = document.createElement('div');
    alertInner.id = 'notie-alert-inner';
    alertOuter.appendChild(alertInner);

	// create alert content container
	var alertContent = document.createElement('div');
    alertContent.id = 'notie-alert-content';
    alertInner.appendChild(alertContent);

	// Initialize alert text
    var alertText = document.createElement('span');
    alertText.id = 'notie-alert-text';
    alertContent.appendChild(alertText);

	// alert helper variables
    var alertIsShowing = false;
    var alertTimeout1;
    var alertTimeout2;
    var wasClickedCounter = 0;

	function alert(type, message, seconds) {

		blur();

        wasClickedCounter++;

        setTimeout(function() {
            wasClickedCounter--;
        }, (options.animationDelay + 10));

        if (wasClickedCounter === 1) {

            if (alertIsShowing) {

                clearTimeout(alertTimeout1);
                clearTimeout(alertTimeout2);

                alertHide(function() {
                    alertShow(type, message, seconds);
                });

            }
            else {
                alertShow(type, message, seconds);
            }

        }

    }

    function alertShow(type, message, seconds) {

        alertIsShowing = true;

        var duration = 0;
        if (typeof seconds === 'undefined' || seconds === 0) {
            var duration = 86400000;
        }
        else if (seconds > 0 && seconds < 1) {
            duration = 1000;
        }
        else {
            duration = seconds * 1000;
        }

		// Remove all color classes first
		removeClass(alertOuter, 'notie-background-success');
		removeClass(alertOuter, 'notie-background-warning');
		removeClass(alertOuter, 'notie-background-error');
		removeClass(alertOuter, 'notie-background-info');

        // Set notie type (background color)
        switch(type) {
            case 1:
				addClass(alertOuter, 'notie-background-success');
                break;
            case 2:
                addClass(alertOuter, 'notie-background-warning');
                break;
            case 3:
                addClass(alertOuter, 'notie-background-error');
                break;
            case 4:
                addClass(alertOuter, 'notie-background-info');
                break;
        }

        // Set notie text
        alertText.innerHTML = message;

        alertOuter.style.top = '-10000px';
        alertOuter.style.display = 'table';
        alertOuter.style.top = '-' + alertOuter.offsetHeight - 5 + 'px';

        alertTimeout1 = setTimeout(function() {

			addClass(alertOuter, 'notie-transition');

            alertOuter.style.top = 0+"px";

            alertTimeout2 = setTimeout(function() {

                alertHide(function() {
                    // Nothing
                });

            }, duration);

        }, 20);

    }

    function alertHide(callback) {

        alertOuter.style.top = '-' + alertOuter.offsetHeight - 5 + 'px';

        setTimeout(function() {

			removeClass(alertOuter, 'notie-transition');

            alertOuter.style.top = '-10000px';

            alertIsShowing = false;

            if (callback) { callback(); }

        }, (options.animationDelay + 10));

    }



	// confirm
    // **************

	var confirmOuter = document.createElement('div');
    confirmOuter.id = 'notie-confirm-outer';

	var confirmInner = document.createElement('div');
    confirmInner.id = 'notie-confirm-inner';
    confirmOuter.appendChild(confirmInner);

	var confirmText = document.createElement('span');
    confirmText.id = 'notie-confirm-text';
    confirmInner.appendChild(confirmText);

	var confirmYes = document.createElement('div');
    confirmYes.id = 'notie-confirm-yes'
    confirmOuter.appendChild(confirmYes);

    var confirmNo = document.createElement('div');
   	confirmNo.id = 'notie-confirm-no';
	confirmOuter.appendChild(confirmNo);

	var confirmTextYes = document.createElement('span');
    confirmTextYes.id = 'notie-confirm-text-yes';
    confirmYes.appendChild(confirmTextYes);

    var confirmTextNo = document.createElement('span');
    confirmTextNo.id = 'notie-confirm-text-no';
    confirmNo.appendChild(confirmTextNo);

	var confirmBackground = document.createElement('div');
    confirmBackground.id = 'notie-confirm-background';
	addClass(confirmBackground, 'notie-transition');

	// Hide notie.confirm on no click and background click
    confirmBackground.onclick = function() {
        if (options.backgroundClickDismiss) {
            confirmHide();
        }
    };

	// Attach confirm elements to the body element
    document.body.appendChild(confirmOuter);
    document.body.appendChild(confirmBackground);

	// confirm helper variables
    var confirmIsShowing = false;

    function confirm(title, yesText, noText, yesCallback, noCallback) {

		blur();

        if (alertIsShowing) {
            // Hide notie.alert
            clearTimeout(alertTimeout1);
            clearTimeout(alertTimeout2);
            alertHide(function() {
                confirmShow(title, yesText, noText, yesCallback, noCallback);
            });
        }
        else {
            confirmShow(title, yesText, noText, yesCallback, noCallback);
        }


    }
    function confirmShow(title, yesText, noText, yesCallback, noCallback) {

        scrollDisable();

        // Yes callback function
        confirmYes.onclick = function() {
            confirmHide();
			if (yesCallback) {
				setTimeout(function() {
					yesCallback();
				}, (options.animationDelay + 10));
			}
        }

		// No callback function
		confirmNo.onclick = function() {
            confirmHide();
            if (noCallback) {
				setTimeout(function() {
					noCallback();
				}, (options.animationDelay + 10));
			}
        }

        function confirmShowInner() {

            // Set confirm text
            confirmText.innerHTML = title;
            confirmTextYes.innerHTML = yesText;
            confirmTextNo.innerHTML = noText;

            // Get confirm's height
            confirmOuter.style.top = '-10000px';
            confirmOuter.style.display = 'table';
            confirmOuter.style.top = '-' + confirmOuter.offsetHeight - 5 + 'px';
            confirmBackground.style.display = 'block';

            setTimeout(function() {

                addClass(confirmOuter, 'notie-transition');

                confirmOuter.style.top = 80+"px";
                confirmBackground.style.opacity = '0.75';

                setTimeout(function() {
                    confirmIsShowing = true;
                }, (options.animationDelay + 10));

            }, 20);

        }

        if (confirmIsShowing) {
            confirmHide();
            setTimeout(function() {
                confirmShowInner();
            }, (options.animationDelay + 10));
        }
        else {
            confirmShowInner();
        }

    }

    function confirmHide() {

        confirmOuter.style.top = '-' + confirmOuter.offsetHeight - 5 + 'px';
        confirmBackground.style.opacity = '0';

        setTimeout(function() {

            removeClass(confirmOuter, 'notie-transition');
			confirmOuter.style.top = '-10000px';
            confirmBackground.style.display = 'none';

            scrollEnable();

            confirmIsShowing = false;

        }, (options.animationDelay + 10));

    }


	// Internal helper functions
	// #################

	function addClass(element, className) {
		if (element.classList) {
			element.classList.add(className);
		}
		else {
			element.className += ' ' + className;
		}
	}
	function removeClass(element, className) {
		if (element.classList) {
			element.classList.remove(className);
		}
		else {
			element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	function blur() {
		document.activeElement.blur();
	}

	var originalBodyHeight, originalBodyOverflow;
    function scrollDisable() {
        originalBodyHeight = document.body.style.height;
        originalBodyOverflow = document.body.style.overflow;
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
    }
    function scrollEnable() {
        document.body.style.height = originalBodyHeight;
        document.body.style.overflow = originalBodyOverflow;
    }

	// Event listener for keydown enter and escape keys
    window.addEventListener('keydown', function(event) {
        var enterClicked = (event.which == 13 || event.keyCode == 13);
        var escapeClicked = (event.which == 27 || event.keyCode == 27);
        if (alertIsShowing) {
            if (enterClicked || escapeClicked) {
                clearTimeout(alertTimeout1);
                clearTimeout(alertTimeout2);
                alertHide();
            }
        }
        else if (confirmIsShowing) {
            if (enterClicked) {
                confirmYes.click();
            }
            else if (escapeClicked) {
                confirmHide();
            }
        }

    });




    return {
		setOptions: setOptions,
        alert: alert,
        confirm: confirm,
    };

}();

// Node.js
if (typeof module === 'object' && module.exports) {
    module.exports = notie;
}
