// @depends PxLoader.js

/**
 * PxLoader plugin to load Json files
 */
function PxLoaderJson(url, tags, priority) {
    var self = this,
        loader = null;

    this.json = {};
    this.tags = tags;
    this.priority = priority;

    var onReadyStateChange = function () {
        if (self.json.readyState == 'complete') {
            removeEventHandlers();
            loader.onLoad(self);
        }
    };

    var onLoad = function() {
        removeEventHandlers();
        loader.onLoad(self);
    };

    var onError = function() {
        removeEventHandlers();
        loader.onError(self);
    };

    var removeEventHandlers = function() {
        /*
        self.unbind('load', onLoad);
        self.unbind('readystatechange', onReadyStateChange);
        self.unbind('error', onError);
        */
    };

    this.start = function(pxLoader) {
        // we need the loader ref so we can notify upon completion
        loader = pxLoader;

        console.log('loading json');
        $.getJSON(url, function(data) {
                    self.json.frames = data.frames;
                    self.json.meta = data.meta;
                    self.json.readyState = 'complete';
                    self.json.complete = true;
                    onLoad();
                });
        /*
                .success()
                .error()(function() {
                        onError();
                    })
                .complete();
                */
    };

    // called by PxLoader to check status of image (fallback in case
    // the event listeners are not triggered).
    this.checkStatus = function() {
        if (self.json.complete) {
            removeEventHandlers();
            loader.onLoad(self);
        }
    };

    // called by PxLoader when it is no longer waiting
    this.onTimeout = function() {
        removeEventHandlers();
        if (self.json.complete) {
            loader.onLoad(self);
        }
        else {
            loader.onTimeout(self);
        }
    };

    // returns a name for the resource that can be used in logging
    this.getName = function() {
        return url;
    };

}

// add a convenience method to PxLoader for adding JSON file
PxLoader.prototype.addJson = function(url, tags, priority) {
    var jsonLoader = new PxLoaderJson(url, tags, priority);
    this.add(jsonLoader);

    // return the json object to the caller
    return jsonLoader.json;
};
