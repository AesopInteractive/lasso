=== Editus ===
Contributors: nphaskins, hyunster, michaelbeil
Plugin URI: https://edituswp.com
Requires at least: 3.5
Tested up to: 4.8
Stable tag: 0.9.15.3

Front-end editing and creation suite.

== Description ==

Front-end editing and creation suite.


== Changelog ==
= 0.9.15.3 =
* More fix for custom post types
* New option to set the tag for the "Italic" style

= 0.9.15.2 =
* Fix for post delete
* Settings page update. New option to set the tag for the "Bold" style
* Added style to hide controls from printing

= 0.9.15.1 =
* Insert HTML button can now process 3rd party shortcodes 

= 0.9.15.0 =
* The Post List dialog now displays draft posts
* The Post List dialog now displays custom post types properly.


= 0.9.14.6 =
* Added settings option to specify allowed post types
* Option to add H4-H6 buttons
* Now the post list doesn't list pages if the user doesn't have a permission to edit pages
* The post settings dialog box now shows the category list
* The post settings dialog box now shows the names of the categories, not slugs. This fixes the
  issues with non-English category names.

= 0.9.14.3 =
* Further fixes to shortcode handling. Remove the scripts inserted by the shortcodes

= 0.9.14.2 =
* Editus tag classes now removed when saving
* Fixed support email

= 0.9.14.1 =
* Fixed a bug involving an empty post
* Fixed the icon file missing.

= 0.9.14.0 =
* Inserting H2 and H3 now also inserts p tags 
* Fixed the tour dialog getting stuck at loading 
* Fixed an issue where a component somtimes goes invisible after editing
* All contenteditable attributes removed before being saved

= 0.9.13.9 =
* Fixed a bug where shortcodes were not properly restored while saving using REST API
* Links are now always clickable.


= 0.9.13.7 =
* Aesop Video Component is now updated using AJAX
* Fix for the publish button 

= 0.9.13.6 =
* Fixed an issue with saving post titles
* Aesop Content Component is now updated using AJAX
* UI fixes for small mobile devices

= 0.9.13.5 =
* Now Editus uses REST API to save posts when it can.
* REST API saving can also be disabled from the options.
* Addressed the issue where cursor jumps when pasting texts.
* Filters \' in components when edited. Filters it back to single apostrophe


= 0.9.13.3 =
* Fixed an issue with REST API codes causing an error during the loading of javascripts.
* Fixes for dialog text colors on certain themes.
* Dialog behaviors improved for mobile platforms.


= 0.9.13.2 =
* Fixed some styling issues for mobile.
* Fixed an issue in third party shortcode handling.

= 0.9.13.1 =
* Save removes html comments

= 0.9.13.0 =
* Added REST API v2 support
* Fixed a bug automatically entering Edit Mode when it shouldn't.

= 0.9.12.2 =
* Fixed some issues with "Read Only" item options
* Added an option to show the "Ignored Items" and keep them read only

= 0.9.12.0 =
* Aesop Hero Gallery has been added
* Fixed several issues with Gallery AJAX update
* When a new post is created Editus automatically enters Edit Mode

= 0.9.11.1 =
* Added an option to open a link a new browser tab.

= 0.9.11.0 =
* Now Gallery components update without having to reload the page, using AJAX. 
* Also fixed a bug in gallery image update.

= 0.9.10.5 =
* Major new features in Beta:
* Added Color Text Button Options.
* Added Text Alignment Button Options.

= 0.9.10.2 =
* Added a new option to set non-editable elements that are parts of the post.
* Live update improvement for Video Component.

= 0.9.10.1 =
* Restored mobile support, for both phones and tablets
* A few more style fixes

= 0.9.10.0 =
* Fixed a FireFox bug where links could not be inserted
* Fixed a bug involving texts without any tags, resulting in the first lines disappearing
* Further style fixes
* New components shows setting dialogs when inserted for more intuitive user interface
* Added Auto Save option
* Disabled for mobile devices for now.
* Added Aesop Gallery Pop support


= 0.9.9.10 =
* Fixed the error reporting for AJAX calls
* Fixed the short code wrapping for non core Aesop components
* Fixed a bug with creating gallery

= 0.9.9.9 =
* replaced the deprecated JQuery calls to live()

= 0.9.9.8 =
* fixed a bug in the shortcode saving codes
* some form style and color adjustments

= 0.9.9.7 =
* added the following filter:
   lasso_user_can_filter
* fixed a bug in adding a custom type post 

= 0.9.9.6 =
* added the following hooks:
   lasso_title_class
   lasso_content_class
   lasso_featured_image_class
   lasso_dont_save
* Tour dialog loading code has been changed.

= 0.9.9.5 =
* multi site menu restored

= 0.9.9.3 =
* fixed unsaved data check
* swapping gallery updates the images in the gallery sidebar
* added button to create gallery to the gallery sidebar.

= 0.9.9.1 =
* fixed some styling issues where edit boxes and some buttons were not readable under certain themes
* fixed the issue where featured images were not updated in the post settings dialog box
* Editus now auto-detects article class if it's .entry-content
* Editus now auto-detects title class if it's .entry-header
* most short codes are now preserved (props Rouven Hurling)
* multi-site menu has been changed (props Philipp Stracker)
* post type issue with non-english sites fixed (props Philipp Stracker)

= 0.9.8.2 =
* fixed references to lasso.is

= 0.9.8.1 =
* fixed a capability issue that was allowing contributors to edit others posts

= 0.9.8 =
* renamed Lasso to Editus

= 0.9.7 =
* updated TGM Plugin Activation to latest (props Ahmad Awais)
* improved live editing video source switching in Video Component
* added dismissable license notices if license is not supplied, expired, or invalid
* fixed a capability issue with saving that was introduced with WordPress 4.2.3

= 0.9.6 =
* added the ability to access and restore post and page revisions
* fixed a bug introduced on the last update with new posts/pages being duplicated when created
* fixed authors not being able to publish posts
* fixed a bug with Lasso Meta API not saving

= 0.9.5 =
* added ability to search posts and pages within the all posts modal introduced with 0.9.4
* added abilty to choose post type to create within new post creation modal
* component now slides into view on settings click
* fixed bug with video component not switching providers
* fixed bug with galleries not saving gallery images properly
* improved Meta API for developers wishing to integrate within Lasso's post settings
* mobile style improvement - props @peiche

= 0.9.4.1 =
* fixed bug with automatic updates - props @pippinsplugins
* fixed bug with admins not seeing all posts in addition to their own

= 0.9.4 =
* added ability to access and delete posts and pages (and custom post types with a filter) from the front-end (requires the WP REST API plugin). If the user is an Author or Contributor they will only be shown their posts or pages.
* added ability to add a post from anywhere on the site
* added ability to set featured image within settings modal if current theme supports post thumbnails
* added ability to add categories and tags within settings modal
* added CMD + S hot key to save post while in editor
* added a close button to exit the editor
* added a new API to allow third-party addons to add new settings modals (beta). They appear as a tab and work with only a filter. This is in preparation for releasing ACF, CMB2, and Ninja Forms integration addons.
* added Canvas and Exposure themes to automatic theme support
* fixed bug with tour hide not calculating correctly
* fixed bug with Author or Contributor roles not being able to put a post in draft
* fixed options not being cleaned up on uninstall
* improved automatic theme support means supported themes work out of the box with no setup
* improved user interface colors to better match WordPress design patterns
* improved drag and drop detection between paragraphs
* improved toolbar width logic - props @peiche
* improved CSS selector performance
* replaced tour GIFs with images

= 0.9.3 =
* fixed .entry-content being applied as a default Article CSS Class
* allow escaping the warning modal that warns users if no Article CSS class is present
* fixed image control setting with images inserted without Aesop Story Engine active
* fixed feautred image not being saved

= 0.9.2 =
* fixed links not working if editor was active but not in use
* massive internal rewrite to use a custom API for processing requests instead of hitting admin-ajax. This increases the saving speed and ensures compatibility for very large WordPress installations and Enterprise users. Tested and working on WordPress MU, Apache, Nginx , and HHVM.

= 0.9.1.1 =
* fixed a js error that happened if an uploaded media item wasn't large enough to be resized to large

= 0.9.1 =
* added ability to insert standard WordPress images and blockquote. If Aesop Story Engine is activated, it replaces these with Aesop Story Engine's story components.
* fixed css class names in toolbar components not being namespaced
* better iOS compatibility with editing toolbar
* removed H2 and H3 buttons from the insert HTML area if Extended Toolbar is selected as its redundant(Extended Toolbar puts H2, and H3 buttons into the toolbar)
* clarified in the instructions that the article class name in the settings should include the preceding dot
* if an embedded Tweet is in the content, we now remove it when you enter the editor so it's not save as HTML. In a future update, we plan to actually have some type of live ombed parsing system. This is a good fix for the time being.
* prepended a ul class to ul.editor-controls and ul.editor-component-controls as well as set letter-spacing to 0 in hopes of clearing up theme CSS conflicting with Lasso CSS. Normally this is bad practice (ul.this), but it's better than applying !important.

= 0.9 =
* fixed a capability issue where contributors were allowed to publish posts
* class visibility methods

= 0.8.8 =
* added an alert that pops up if the user tries to use the editor but hasn't added the required Article Class in order to use Lasso
* added all Aesop built themes to automatically supported themes list
* updated pot file

= 0.8.7 =
* added a new option that lets you list CSS classes of items to ignore on save. This makes Lasso compatible with 99.99% of all WordPress themes

= 0.8.6 =
* new pre-flight function to check to ensure plugin settings are configured
* added automatic theme support for WordPress core themes and UpThemes
* added a new define define('LASSO_AGENCY_MODE') which removes the license page and links out to Lasso website
* added a new tab for Lasso to hold the status page, license page, and settings
* added new license menu page in preperation of the public launch of this plugin
* fixed an issue with the height in the Tour slider sometimes not calculating correctly
* fixed a permission issue where a user was allowed to edit another users posts. we were using edit_posts and switched to edit_post

= 0.8.5 =
* misc bug fixes
* removed the "url helper" field for creating new posts as it was confusing some users
* added helper text to the field for creating new posts as a better visual guide
* new activation welcome screen in WordPress
* fixed the content component from not correctly saving
* added two actions: lasso_editor_controls_before && lasso_editor_controls_after
* added two css classes that get applied to the body when a featured thumbnail is added or removed : lasso-post-thumb-added && lasso-post-thumb-removed

= 0.8.1 =
* fixed media library sometimes not closing after selecting an image
* fixed bug with editing more than one standard WordPress image inserted from the backend
* fixed bugs with toolbar size with extended options on and aesop story engine off
* when live editing image, parallax, and quote and no caption or cite exists, append it live
* compatibility with the new "Pull Quote" option in Aesop 1.5 with live editing
* fixed map zoom and location not saving
* fixed map controls if map is used in sticky mode
* fixed gallery options not saving

= 0.8 =
* added a confirmation to publish in case publish button is accidentally triggered
* more mobile work for iOS
* various UX improvements and animation additions
* fixed gallery type not saving
* all strings localized
* pot file generated

= 0.7 =
* video component live editing
* content component live editing
* image component live editing
* timeline component integration plus live editable
* new welcome screen (in progress)
* 99% compatible with iOS
* responsive on screens under 600px

= 0.6.1 =
* user tour filterable
* escape editor button helper

= 0.6 =
* H2 and H3 heading support added to toolbar with option
* new user tour
* better modal positioning logic

= 0.5 =
* full gallery compatibility
* misc fixes and improvements for founder launch

= 0.3 =
* filter fixes

= 0.25 =
* full maps compatibility
* links now editable
* insert html now no longer inserting into p

= 0.2 =
* initial tracking
