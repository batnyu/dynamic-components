import { Editor } from 'tinymce';

export const Constants = {
  defaultTinyHTML:
    '<div style="color: #ffffff; width: 100%"><p style="font-family: Arial,serif; text-align: center;"><span class="lmp_normal">&#8205;</span></p></div>',
};

export function init_instance_callback(editor: Editor) {
  //Change style
  editor.on('ExecCommand', function (event) {
    if (
      event.command == 'mceToggleFormat' &&
      event.value != 'bold' &&
      event.value != 'italic' &&
      event.value != 'underline'
    ) {
      clearText(editor);
    }
  });
  //Key up
  editor.on('keyup', function (event) {
    if ((event.ctrlKey && event.key === 'A') || event.key === ' ') return;
    // Save caret position
    const bm = editor.selection.getBookmark();
    event.preventDefault();
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // shift + enter : disable feature
        event.target.innerHTML = event.target.innerHTML.replace('<br>', '');
      } else {
        // enter : replace br per space
        event.target.innerHTML = event.target.innerHTML.replace(
          '<br data-mce-bogus="1">',
          '&#8205;'
        );
      }
    }
    clearText(editor);

    // Update caret position
    editor.selection.moveToBookmark(bm);

    //Remove all content (backspace, delete, cut content)
    if (
      (event.key === 'Backspace' ||
        event.key === 'Delete' ||
        (event.ctrlKey && event.key === 'x')) &&
      event.target.innerText.length <= 1
    ) {
      event.preventDefault();
      editor.setContent(Constants.defaultTinyHTML);
    }
  });
}

export class EditorConfig {
  static editorConfig = {
    menubar: false,
    inline: true,
    preview_styles: false,
    plugins: ['emoticons', 'paste', 'contextmenu', 'noneditable'],
    contextmenu: 'copy',
    language: 'en',
    emoticons_database: 'emojis',
    entity_encoding: 'numeric',
    element_format: 'html',
    encoding: 'xml',
    font_formats:
      // eslint-disable-next-line max-len
      'Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Comic Sans MS=comic sans ms,sans-serif; Helvetica=helvetica; Impact=impact,chicago; Trebuchet MS=trebuchet ms,geneva;',
    toolbar:
      'bold italic underline forecolor | fontselect | styleselect | alignleft aligncenter alignright | emoticons | customInsertButton',
    base_url: '/tinymce',
    suffix: '.min',
    formats: {
      underline: {
        inline: 'span',
        styles: { 'text-decoration': 'underline' },
        exact: false, // allow merge underline with custom classes
      },
      'custom-smaller': {
        attributes: { class: 'lmp_smaller' },
        deep: true,
        exact: false,
        inline: 'span',
      },
      'custom-small': {
        attributes: { class: 'lmp_small' },
        deep: true,
        exact: false,
        inline: 'span',
      },
      'custom-normal': {
        attributes: { class: 'lmp_normal' },
        deep: true,
        exact: false,
        inline: 'span',
      },
      'custom-big': {
        attributes: { class: 'lmp_big' },
        deep: true,
        exact: false,
        inline: 'span',
      },
      'custom-bigger': {
        attributes: { class: 'lmp_bigger' },
        deep: true,
        exact: false,
        inline: 'span',
      },
    },
    style_formats: [
      { title: 'smaller', format: 'custom-smaller' },
      { title: 'small', format: 'custom-small' },
      { title: 'normal', format: 'custom-normal' },
      { title: 'big', format: 'custom-big' },
      { title: 'bigger', format: 'custom-bigger' },
    ],
    paste_as_text: true,
    forced_root_block: true,
    // init_instance_callback: init_instance_callback,
    extended_valid_elements: 'dynamic-value[*]',
    custom_elements: '~dynamic-value',
    setup: function (editor: Editor) {
      editor.ui.registry.addButton('customInsertButton', {
        text: 'My Button',
        onAction: function (_) {
          editor.insertContent(
            '<dynamic-value class="mceNonEditable">POI name</dynamic-value>'
          );
        },
      });
    },
  };
}

function clearText(editor: Editor) {
  //Remove all br
  editor.editorManager.activeEditor
    .getBody()
    .querySelectorAll('br')
    .forEach((elm) => {
      elm.parentNode?.removeChild(elm);
    });

  //Remove all wrong tags
  const firstChild = editor.editorManager.activeEditor.getBody().firstChild;
  if (firstChild) {
    removeTags(firstChild, 0);
  }
}

function removeTags(childNode: ChildNode, level: number) {
  //Force first level with p centered
  if (level === 0) {
    for (let i = 0; i < childNode.childNodes.length; i++) {
      if (childNode.childNodes[i].nodeName !== 'P') {
        const p = document.createElement('p');
        p.setAttribute('style', 'text-align: center;');
        p.innerHTML = (<Element>childNode.childNodes[i]).innerHTML;
        if (p.innerText === 'undefined') {
          p.innerHTML = '';
          p.innerText = '';
        }
        childNode.insertBefore(p, childNode.childNodes[i]);
        const nextSibling = childNode.childNodes[i].nextSibling;
        if (nextSibling) {
          childNode.removeChild(nextSibling);
        }
      }
    }
  }
  //Force second level with span normal
  if (level === 1) {
    for (let i = 0; i < childNode.childNodes.length; i++) {
      if (childNode.childNodes[i].nodeName !== 'SPAN') {
        const span = document.createElement('span');
        span.setAttribute('class', 'lmp_normal');
        span.innerHTML =
          (<Element>childNode.childNodes[i]).innerHTML ||
          (<Element>childNode.childNodes[i]).nodeValue ||
          '';
        childNode.insertBefore(span, childNode.childNodes[i]);
        const nextSibling = childNode.childNodes[i].nextSibling;
        if (nextSibling) {
          childNode.removeChild(nextSibling);
        }
      } else {
        if (!(<Element>childNode.childNodes[i]).hasAttribute('class'))
          (<Element>childNode.childNodes[i]).setAttribute(
            'class',
            'lmp_normal'
          );
      }
    }
  }

  //Remove all wrong/empty tags
  for (let i = 0; i < childNode.childNodes.length; i++) {
    const elm = <Element>childNode.childNodes[i];
    if (elm.childNodes.length > 0) removeTags(elm, level + 1);

    if (
      elm.nodeName !== '#text' &&
      !(
        elm.nodeName === 'SPAN' &&
        elm.hasAttribute('data-mce-type') &&
        elm.getAttribute('data-mce-type') === 'bookmark'
      )
    ) {
      if (elm.innerHTML !== '') {
        elm.innerHTML = elm.innerHTML.replace('&#8205;', '');
      }
      if (elm.innerHTML === '') {
        elm.remove();
      } else if (
        elm.nodeName !== 'SPAN' &&
        elm.nodeName !== 'EM' &&
        elm.nodeName !== 'STRONG' &&
        level > 1
      ) {
        elm.outerHTML = elm.innerHTML;
      }
    }
  }

  //Remove span in span
  if (
    childNode.nodeName === 'SPAN' &&
    level === 2 &&
    childNode.childNodes.length === 1 &&
    childNode.childNodes[0].nodeName === 'SPAN'
  ) {
    if (!(<Element>childNode.childNodes[0]).hasAttribute('class'))
      (<Element>childNode.childNodes[0]).setAttribute('class', 'lmp_normal');
    (<Element>childNode).outerHTML = (<Element>childNode).innerHTML;
  }
}
