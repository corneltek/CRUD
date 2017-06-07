// Generated by CoffeeScript 1.9.3
(function() {
  if (typeof window.FiveKit === "undefined") {
    window.FiveKit = {};
  }


  /*
  
  DropBoxUploader
    + DropBox
    + FileUploader
  
    uploader = new FiveKit.DropBoxUploader({
      el:
      onDragIn:
      onDragOut:
      onDrop:
      onTransferComplete:
      onTransferProgress:
    });
   */

  FiveKit.DropBoxUploader = (function() {
    function DropBoxUploader(options1) {
      var options;
      this.options = options1;
      this.dropboxEl = this.options.el;
      this.queueEl = this.options.queueEl;
      if (!this.queueEl) {
        this.queueEl = $('<div/>').addClass('dropbox-queue').before(this.options.el);
      }
      options = this.options;
      this.dropbox = new FiveKit.DropBox({
        el: this.dropboxEl,
        debug: true,
        onDragIn: this.options.onDragIn,
        onDragOut: this.options.onDragOut,
        onDrop: (function(_this) {
          return function(e) {

            /*
            file object:
              lastModifiedDate:
              name:
              size:
              type: image/png
              webkitRelativePath: ""
             */
            var ref, uploader;
            if (_this.options.onDrop) {
              _this.options.onDrop.call(_this, e);
            }
            if ((ref = e.dataTransfer) != null ? ref.files : void 0) {
              uploader = new FiveKit.BatchFileUploader({
                endpoint: "/bs",
                action: _this.options.action,
                progressContainer: _this.queueEl,
                onReadyStateChange: _this.options.onReadyStateChange,
                onTransferProgress: _this.options.onTransferProgress,
                onTransferComplete: _this.options.onTransferComplete,
                onTransferFinished: _this.options.onTransferFinished,
                onTransferStart: _this.options.onTransferStart
              });
              uploader.upload(e.dataTransfer.files);
            }
            return false;
          };
        })(this)
      });
    }

    return DropBoxUploader;

  })();

}).call(this);
