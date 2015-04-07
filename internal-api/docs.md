# How Internal API Works

* All requests must be sent to the URL `home_url( 'internal-api' );
* All requests must use POST transport method.
* Callback class and method is determined by action (IE `_$POST[ 'action' ]` )
* The action must be in the form of 'namespace_class_method'
    * namespace is a subnamespace of lasso namespace. IE if action is 'foo_bar_hats', then the class used will be `\lasso\foo\bar`
    * class refers to the class used to process request.
    * method refers to the method in that class used to process request.
    * If the class or method names have underscores (_) in them, then a single dash (-) should be used instead.
        * For example, if the class is `lasso\hats\foo_bar`, and the callback method is `bar_foo` then the action would `hats_foo-bar_bar-foo`
* The class used to process the request must implement the `lasso\internal_api\api_action` interface. The inline docs of that interface make clear the requirements.
* The class used to process may optionally specify a nonce action to be used as the second param of `wp_verify_nonce()`, by declaring a public property called `nonce_action`. If this property is not set then the nonce action will be assumed to "lasso_editor".

