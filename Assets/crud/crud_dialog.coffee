# vim:sw=2:ts=2:sts=2:
class CRUDDialog
  constructor: (path,args,opts) ->
    $('.ui-dialog').remove() if $('.ui-dialog').get(0)

    $.get path, args, (html) ->
      $el = $(html)
      CRUD.initEditRegion($el,{
        setupAction: (a) ->
          a.plug ActionMsgbox,
          disableScroll: true
          container: $el.find('.action-result-container').first()
        actionOptions: {
          beforeSubmit: opts.beforeSubmit
          onSuccess: (resp) ->
            opts.onSuccess(resp,$el) if opts.onSuccess
            setTimeout((->
              $el.dialog('close')
              $el.remove()
            ),1000)
        }
      })
      # use as a dialog
      dialogOptions = $.extend({ minWidth: 800, modal: true }, opts.dialogOptions)
      $el.dialog(dialogOptions)
      use_tinymce('adv1', { popup: true })
      opts.init($el) if opts.init
window.CRUDDialog = CRUDDialog
