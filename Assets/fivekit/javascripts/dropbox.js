// Generated by CoffeeScript 1.9.3

/*

DropBox (Handle for drag, drop events)

  new Html5Kit.DropBox({
    el: $('#dropbox')
    onDragIn: () ->
    onDragOver: () ->
    onDragOut: () ->
    onDrop: () ->
  });
 */

(function() {
  if (typeof window.FiveKit === "undefined") {
    window.FiveKit = {};
  }

  FiveKit.DropBox = (function() {
    function DropBox(options) {
      var self;
      this.options = options;
      jQuery.event.props.push("dataTransfer");
      this.el = $(this.options.el);
      self = this;
      this.el.on("dragenter", function(e) {
        $(this).addClass('dropbox-drag-over');
        if (self.options.debug && window.console) {
          console.log('dropbox-drag-in');
        }
        if (self.options.onDragIn) {
          self.options.onDragIn.call(this, e);
        }
        return false;
      });
      this.el.on("dragover", function(e) {
        if (self.options.onDragOver) {
          self.options.onDragOver.call(this, e);
        }
        return false;
      });
      this.el.on("dragleave", function(e) {
        $(this).removeClass('dropbox-drag-over');
        if (self.options.debug && window.console) {
          console.log('dropbox-drag-out');
        }
        if (self.options.onDragOut) {
          self.options.onDragOut.call(this, e);
        }
        return false;
      });
      this.el.on("drop", function(e) {
        $(this).removeClass('dropbox-drag-over');
        if (self.options.debug && window.console) {
          console.log('dropbox-drag-drop', e);
        }
        if (self.options.onDrop) {
          self.options.onDrop.call(this, e);
        }
        return false;
      });
    }

    return DropBox;

  })();

}).call(this);
