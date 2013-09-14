/// Author: Tran Xuan Truong
/// Webiste: truongtx.me
/// Email: me@truongtx.me

/// Basic navigation buttons in mode line
/// include mode-line-button library
load_paths.unshift("chrome://conkeror-contrib/content/");
require("mode-line-buttons.js");

// The variable specifies the path to all the image
// default is ~/.conkerorrc/tmtxt-conkeror-mac-modeline-buttons/images/
var cmmb_image_path;
cmmb_image_path = get_home_directory();
cmmb_image_path.append(".conkerorrc");
cmmb_image_path.append("tmtxt-conkeror-mac-modeline-buttons");
cmmb_image_path.append("images");
cmmb_image_path = make_uri(cmmb_image_path).spec;

/// The array to hold all the mode line buttons
var cmmb_widgets = new Array();

/// Function to replace the function mode_line_add_buttons
function cmmb_add_buttons (buttons, prepend) {
  for (var i = 0, n = buttons.length; i < n; i++) {
	

	// code from conkeror sourse file
    var j = prepend ? n - i - 1 : i;

	// my custom code
	if(typeof buttons[j][1]  == "string")
	  buttons[j][1] = { src: "file://" + cmmb_image_path + buttons[j][1] + ".png" };

	/// code from conkeror source file
	var w = make_button_widget(buttons[j][0], buttons[j][1]);
    add_hook("mode_line_hook", mode_line_adder(w), prepend);

	// My custom code
	cmmb_widgets[i] = w; // add the button to the array

  }
}

/// The array to hold the definition for the mode line buttons
cmmb_navigation_buttons = [
    ["find-url", "open"],
    ["find-url-new-buffer", "new"],
    ["back", "go-back"],
    ["forward", "go-forward"],
    ["reload", "refresh"],
    ["kill-current-buffer", "close"],
    ["buffer-previous", "go-up"],
    ["buffer-next", "go-down"],
];

/// Interactive function to show the mode line buttons
interactive("cmmb-add-navigation-buttons", "Add basic navigation buttons to the mode line",
			function(I){
			  // check if the array that hold all the button widgets contains no element
			  if(cmmb_widgets.length == 0){
				// add the button
				cmmb_add_buttons(cmmb_navigation_buttons, true);
				
				// restart mode line
				mode_line_mode(false);
				mode_line_mode(true);
			  }
			  
			});

/// Interactive function to hide the mode line buttons
interactive("cmmb-remove-navigation-buttons", "Remove navigation buttons from mode line", 
			function(I){
			  // loop through the array to remove hook
			  for(var i=0; i<cmmb_widgets.length;i++){
				remove_hook("mode_line_hook", mode_line_adder(cmmb_widgets[i]));
			  }

			  // remove all widgets in the array
			  cmmb_widgets.length = 0;

			  // restart mode line
			  mode_line_mode(false);
			  mode_line_mode(true);
			});

provide("tmtxt-conkeror-mac-modeline-buttons");
