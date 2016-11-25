$(function () {
    $(document).foundation();

    $('[data-components-menu-toggle]').hover(function () {
        $('[data-components-menu]').show();
    })

    $('[data-components-menu]').mouseleave(function () {
        $(this).hide()
    });
});
