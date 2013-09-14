/// Basic navigation buttons in mode line
/// include mode-line-button library
load_paths.unshift("chrome://conkeror-contrib/content/");
require("mode-line-buttons.js");

// The variable specifies the path to all the image
// default is ~/.conkerorrc/tmtxt-conkeror-mac-modeline-buttons/images/
var tmtxt_modeline_buttons_image_path = get_home_directory();
tmtxt_modeline_buttons_image_path.appendRelativePath(".conkerorrc");
tmtxt_modeline_buttons_image_path.appendRelativePath("tmtxt-conkeror-mac-modeline-buttons");
tmtxt_modeline_buttons_image_path.appendRelativePath("images");

/// Function to replace make_button_widget
function tmtxt_make_button_widget (command, attributes) {
    if (typeof attributes == "string")
        // Simple case
        attributes = { src: tmtxt_modeline_buttons_image_path + attributes + ".png" };

    function new_widget (window) {
        button_widget.call(this, window);
    }
    new_widget.prototype = {
        constructor: new_widget,
        __proto__: button_widget.prototype,
        command: command,
        attributes: attributes
    };
    new_widget.mode_line_adder = function (window) {
        var widget = new new_widget(window);
        window.mode_line.add_widget(widget, widget.make_element(window));
    };

    return new_widget;
}

/// The array to hold all the mode line buttons
var tmtxt_mode_line_button_widgets = new Array();

/// Function to replace the function mode_line_add_buttons
function tmtxt_mode_line_add_buttons (buttons, prepend) {
  for (var i = 0, n = buttons.length; i < n; i++) {
	

	// code from conkeror sourse file
    var j = prepend ? n - i - 1 : i;

	// my custom code
	if(typeof buttons[j][1]  == "string")
	  buttons[j][1] = { src: "file:///Volumes/tmtxt/" + buttons[j][1] + ".png" };

	/// code from conkeror source file
	var w = make_button_widget(buttons[j][0], buttons[j][1]);
    add_hook("mode_line_hook", mode_line_adder(w), prepend);

	// My custom code
	tmtxt_mode_line_button_widgets[i] = w; // add the button to the array

  }
}

/// The array to hold the definition for the mode line buttons
tmtxt_standard_mode_line_buttons = [
    ["back", "go-back"],
    ["find-url-new-buffer", "new"]
];

/// Interactive function to show the mode line buttons
interactive("tmtxt-add-mode-line-nav-buttons", "Add basic navigation buttons to the mode line",
			function(I){
			  // check if the array that hold all the button widgets contains no element
			  if(tmtxt_mode_line_button_widgets.length == 0){
				// add the button
				tmtxt_mode_line_add_buttons(tmtxt_standard_mode_line_buttons, true);

				// restart mode line
				mode_line_mode(false);
				mode_line_mode(true);
			  }
			  
			});

/// Interactive function to hide the mode line buttons
interactive("tmtxt-remove-mode-line-nav-buttons", "Remove navigation buttons from mode line", 
			function(I){
			  // loop through the array to remove hook
			  for(var i=0; i<tmtxt_mode_line_button_widgets.length;i++){
				remove_hook("mode_line_hook", mode_line_adder(tmtxt_mode_line_button_widgets[i]));
			  }

			  // remove all widgets in the array
			  tmtxt_mode_line_button_widgets.length = 0;

			  // restart mode line
			  mode_line_mode(false);
			  mode_line_mode(true);
			});

provide("tmtxt-conkeror-mac-modeline-buttons");
