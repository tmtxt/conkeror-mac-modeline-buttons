/// Author: Tran Xuan Truong
/// Webiste: truongtx.me
/// Email: me@truongtx.me
/// Version: 1.0

/// Basic navigation buttons in mode line

////////////////////////////////////////////////////////////////////////////////
/// Steps how to add your own custom buttons list

// First, create an empty array for holding the widgets
// var cmmb_navigation_widgets = new Array();

// Second, create an array for button definitions
// cmmb_navigation_buttons = [
//     ["find-url", "open"],
//     ["find-url-new-buffer", "new"],
//     ["back", "go-back"],
//     ["forward", "go-forward"],
//     ["reload", "refresh"],
//     ["kill-current-buffer", "close"],
//     ["buffer-previous", "go-up"],
//     ["buffer-next", "go-down"],
//   ["minibuffer-abort","cancel"],
// ];
// Each item in the array is also another array.
// The first element in that array indicates the interactive command to be execute
// when clicking on the button
// The second element in that array is the name of the image file (without
// extension) in PNG format
// By default, the images are located under
// ~/.conkerorrc/conkeror-mac-modeline-buttons/images

// Next, define an interactive command like this and pass in the two arrays that
// you have created before. This command is for adding the buttons
// interactive("cmmb-add-navigation-buttons", "Add basic navigation buttons to the mode line",
// 			function(I){
// 			  cmmb_add_buttons(cmmb_navigation_buttons, true, cmmb_navigation_widgets);
// 			});

// After that, define another interactive command for removing modeline buttons
// and pass in the widgets array that you have created before
// interactive("cmmb-remove-navigation-buttons", "Remove navigation buttons from mode line", 
// 			function(I){
// 			  cmmb_remove_buttons(cmmb_navigation_widgets);
// 			});

// Finally, bind that two interactive commands to the keystrokes that you want

//////////////////////
/// include mode-line-button library
load_paths.unshift("chrome://conkeror-contrib/content/");
require("mode-line-buttons.js");

//////////////////////
/// Code for adding and removing buttons
// The variable specifies the path to all the image
// default is ~/.conkerorrc/conkeror-mac-modeline-buttons/images/
var cmmb_image_path;
cmmb_image_path = get_home_directory();
cmmb_image_path.append(".conkerorrc");
cmmb_image_path.append("conkeror-mac-modeline-buttons");
cmmb_image_path.append("images");
cmmb_image_path = make_uri(cmmb_image_path).spec;

/// Function to replace the function mode_line_add_buttons
/// Input
/// buttons: array of button definition (see more below)
/// prepend: usually true
/// widgets_array: the array to hold the widgets
function cmmb_add_buttons (buttons, prepend, widgets_array) {
  // check if the widget_arrays has no elements
  if(widgets_array.length == 0){
	// loop through the array
	for (var i = 0, n = buttons.length; i < n; i++) {
	  
	  // code from conkeror sourse file, don't care
      var j = prepend ? n - i - 1 : i;

	  // my custom code
	  if(typeof buttons[j][1]  == "string")
		buttons[j][1] = { src: "file://" + cmmb_image_path + buttons[j][1] + ".png" };

	  /// code from conkeror source file, don't care
	  var w = make_button_widget(buttons[j][0], buttons[j][1]);
      add_hook("mode_line_hook", mode_line_adder(w), prepend);

	  // My custom code
	  widgets_array[i] = w; // add the button to the array
	}

	// restart the modeline
	cmmb_restart_modeline();
  }
}

/// Function to restart the mode line
function cmmb_restart_modeline(){
  // restart mode line
  mode_line_mode(false);
  mode_line_mode(true);
}

/// Function to remove the buttons
function cmmb_remove_buttons(widgets_array){
  // loop through the array to remove hook
  for(var i=0; i<widgets_array.length;i++){
	remove_hook("mode_line_hook", mode_line_adder(widgets_array[i]));
  }

  // remove all widgets in the array
  widgets_array.length = 0;

  // restart the mode line
  cmmb_restart_modeline();
}

//////////////////////
/// Navigation buttons
/// The array to hold all the mode line navigation button widgets
var cmmb_navigation_widgets = new Array();
/// The array to hold the definition for the mode line navigation buttons
var cmmb_navigation_buttons = [
    ["find-url", "open"],
    ["find-url-new-buffer", "new"],
    ["back", "go-back"],
    ["forward", "go-forward"],
    ["reload", "refresh"],
    ["kill-current-buffer", "close"],
    ["buffer-previous", "go-up"],
    ["buffer-next", "go-down"],
  ["minibuffer-abort","cancel"],
];
/// Interactive function to show the mode line navigation buttons
interactive("cmmb-add-navigation-buttons", "Add basic navigation buttons to the mode line",
			function(I){
			  cmmb_add_buttons(cmmb_navigation_buttons, true, cmmb_navigation_widgets);
			});
/// Interactive function to hide the mode line navigation buttons
interactive("cmmb-remove-navigation-buttons", "Remove navigation buttons from mode line", 
			function(I){
			  cmmb_remove_buttons(cmmb_navigation_widgets);
			});

//////////////////////


/// provide the library
provide("conkeror-mac-modeline-buttons");
