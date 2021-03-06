// Generated by CoffeeScript 1.9.3

/* 
vim:sw=2:ts=2:sts=2:

CRUDBulk maintains the record table and the related record operations like "Edit", "Delete" in each row.

Bulk Operation API

New BulkCRUD:

    productBulk = new BulkCRUD({
            container: $('#crud-list')
            menu: $('#menu')
            namespace: 'ProductBundle'
            model: 'Product'
    })
    productBulk.selectAll()
    productBulk.unselectAll()
    productBulk.runAction(...)

    productBulk.addPlugin new DeletePlugin(....)
    productBulk.addPlugin new CopyPlugin(....)
 */

(function() {
  var BulkCRUD;

  BulkCRUD = (function() {
    function BulkCRUD() {}

    BulkCRUD.prototype.handlers = {};

    BulkCRUD.prototype.init = function(config1) {
      var self;
      this.config = config1;
      this.container = this.config.container;
      this.table = this.config.table;
      this.menu = this.config.menu;
      this.namespace = this.config.namespace;
      this.model = this.config.model;
      this.csrfToken = this.config.csrfToken;
      this.findNumberOfSelectedItems().text(0);
      this.bind();
      this.menu.empty();
      this.menu.append($('<option/>'));
      self = this;
      return this.menu.change(function(e) {
        var $select, handler, val;
        $select = $(this);
        val = $(this).val();
        handler = self.handlers[val];
        if (handler) {
          handler.call(self, $select);
        }
        return $select.find('option').first().attr('selected', 'selected');
      });
    };

    BulkCRUD.prototype.bind = function() {
      var self;
      self = this;
      this.table.on("click", "tbody tr", function(e) {
        var $check, $tr;
        e.stopPropagation();
        if ($(e.target).is("span.check") || $(e.target).is(".crud-bulk-select")) {
          return;
        }
        $tr = $(this);
        $check = $tr.find('.crud-bulk-select');
        if ($check.is(':checked')) {
          $check.prop('checked', false);
          $tr.removeClass('selected active');
        } else {
          $check.prop('checked', true);
          $tr.addClass('selected active');
        }
        return self.updateNumberOfSelectedItems();
      });
      this.table.on("change", "input.crud-bulk-select", function(e) {
        var $input, $tr;
        e.stopPropagation();
        $input = $(this);
        $tr = $input.parents("tr");
        if ($input.is(':checked')) {
          $tr.addClass('selected active');
        } else {
          $tr.removeClass('selected active');
        }
        return self.updateNumberOfSelectedItems();
      });
      this.table.on("click", ".crud-bulk-select-all", (function(_this) {
        return function(e) {
          e.stopPropagation();
          return _this.toggleSelectAll(e);
        };
      })(this));

      /*
       * the region style editor
       *
      @table.on "click", ".record-edit-btn", (e) ->
        section = $btn.parents(".section").get(0)
        Region.before section, $(this).data("edit-url"), { id: id }, this
        jQuery.get $(this).data("edit-url"), { id: id}, (html) ->
          $(document.body).append(html)
       */
      this.table.on("click", ".record-edit-btn", function(e) {
        e.stopPropagation();
        CRUDModal.openFromBtn($(this), typeof config !== "undefined" && config !== null ? config.modal : void 0);
        return false;
      });
      return this.table.on("click", ".record-delete-btn", function(e) {
        var csrf, id;
        e.stopPropagation();
        if (!$(this).data("delete-action")) {
          console.error("data-delete-action undefined");
        }
        id = $(this).data("record-key");
        csrf = $(this).data("csrf-token");
        return runAction($(this).data("delete-action"), {
          id: id,
          _csrf_token: csrf
        }, {
          confirm: "確認刪除? ",
          removeTr: this
        });
      });
    };

    BulkCRUD.prototype.findNumberOfSelectedItems = function() {
      return $('.number-of-selected-items');
    };

    BulkCRUD.prototype.updateNumberOfSelectedItems = function() {
      var $checked;
      $checked = this.findSelectedCheckboxes();
      return this.findNumberOfSelectedItems().text($checked.size());
    };

    BulkCRUD.prototype.findCheckboxes = function() {
      return this.container.find('input.crud-bulk-select');
    };

    BulkCRUD.prototype.findSelectedCheckboxes = function() {
      return this.container.find('input.crud-bulk-select:checked');
    };

    BulkCRUD.prototype.findSelectedItemValues = function() {
      return this.findSelectedCheckboxes().map(function(i, e) {
        return parseInt(e.value);
      }).get();
    };

    BulkCRUD.prototype.findSelectAllCheckbox = function() {
      return this.container.find('input.crud-bulk-select-all');
    };

    BulkCRUD.prototype.unselectAll = function(e) {
      if (!e) {
        this.findSelectAllCheckbox().prop('checked', false);
      }
      this.findCheckboxes().prop('checked', false);
      this.table.find('tbody tr').removeClass('selected active');
      return this.updateNumberOfSelectedItems();
    };

    BulkCRUD.prototype.selectAll = function(e) {
      if (!e) {
        this.findSelectAllCheckbox().prop('checked', true);
      }
      this.findCheckboxes().prop('checked', true);
      this.table.find('tbody tr').addClass('selected active');
      return this.updateNumberOfSelectedItems();
    };

    BulkCRUD.prototype.toggleSelectAll = function(e) {
      if (this.findSelectAllCheckbox().is(":checked")) {
        return this.selectAll(e);
      } else {
        return this.unselectAll(e);
      }
    };

    BulkCRUD.prototype.sendAction = function(action, params, cb) {
      params = $.extend({
        "__action": action,
        "__ajax_request": 1
      }, params);
      return $.ajax({
        url: '/bs',
        type: 'post',
        data: params,
        dataType: 'json',
        success: cb
      });
    };


    /*
     * Run bulk action on the selected items.
     *
     * @param actionName short action name
     */

    BulkCRUD.prototype.runBulkAction = function(action, extraParams, callback) {
      var fullActionName;
      fullActionName = this.namespace + '::Action::Bulk' + action + this.model;
      return this.runAction(fullActionName, extraParams, callback);
    };

    BulkCRUD.prototype.runAction = function(fullActionName, extraParams, callback) {
      var items, params;
      items = this.findSelectedItemValues();
      params = $.extend({
        items: items
      }, extraParams);
      return this.sendAction(fullActionName, params, callback);
    };

    BulkCRUD.prototype.addMenuItem = function(op, label, cb) {
      var option;
      this.handlers[op] = cb;
      option = $('<option/>').text(label).val(op);
      this.menu.find('[value="' + op + '"]').remove();
      this.menu.append(option);
      return option.data('handler', cb);
    };

    BulkCRUD.prototype.addPlugin = function(plugin) {
      return plugin.register(this);
    };

    return BulkCRUD;

  })();

  window.BulkCRUD = BulkCRUD;

  window.BulkCRUDDeletePlugin = (function() {
    function BulkCRUDDeletePlugin() {}

    BulkCRUDDeletePlugin.prototype.register = function(bulk) {
      return bulk.addMenuItem('delete', '刪除', (function(_this) {
        return function(btn) {
          if (confirm("確定刪除 ?")) {
            return bulk.runBulkAction('Delete', {}, function(result) {
              if (result.success) {
                $.jGrowl(result.message);
                return Region.of(bulk.table).refresh();
              } else {
                return $.jGrowl(result.message, {
                  theme: 'error'
                });
              }
            });
          }
        };
      })(this));
    };

    return BulkCRUDDeletePlugin;

  })();

  window.BulkCRUDCopyPlugin = (function() {
    function BulkCRUDCopyPlugin() {}

    BulkCRUDCopyPlugin.prototype.register = function(bulk) {
      return bulk.addMenuItem('copy', '複製...', function(btn) {
        var $langsel, content, label, lang, languages, runbtn;
        content = $('<div/>');
        languages = {
          '': '--為新語言--',
          en: '英文',
          zh_TW: '繁體',
          ja: '日文',
          zh_CN: '簡體'
        };
        $langsel = $('<select/>');
        for (lang in languages) {
          label = languages[lang];
          $langsel.append(new Option(label, lang));
        }
        runbtn = $('<input/>').attr({
          type: 'button'
        }).val('複製');
        runbtn.click(function() {
          return bulk.runBulkAction('Copy', {
            lang: $langsel.val()
          }, function(result) {
            if (result.success) {
              $.jGrowl(result.message);
              return setTimeout((function() {
                Region.of(bulk.table).refreshWith({
                  page: 1
                });
                return content.dialog('close');
              }), 800);
            } else {
              return $.jGrowl(result.message, {
                theme: 'error'
              });
            }
          });
        });
        return content.attr({
          title: '複製'
        }).append($langsel).append(runbtn).dialog();
      });
    };

    return BulkCRUDCopyPlugin;

  })();

  window.bulkCRUD = new BulkCRUD();

}).call(this);
