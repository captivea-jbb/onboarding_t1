odoo.define('sync_website_product_image_zoom.product_imagezoom', function(require) {
"use strict";

    require('web.dom_ready');
    $(document).on('click', '.product_detail_img', function(elem) {
        var $itemdata = []
        var $image = $(elem.currentTarget).parents('.col-md-6').find('.carousel-inner').children();
        var $index_current = $(elem.currentTarget).parents('.col-md-6').find('li.active').data('slide-to');
        _.each($image, function (elem) {
            var $image_src = $(elem).find('.product_detail_img').attr('src')
            $itemdata.push({'src': $image_src,'w': 0,'h': 0,})
        });
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var items = $itemdata;
        var options = {
            index: $index_current,
        };
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.listen('gettingData', function(index, item) {
            if (item.w < 1 || item.h < 1) { // unknown size
                var img = new Image();
                img.onload = function() { // will get size after load
                item.w = this.width; // set image width
                item.h = this.height; // set image height
                   gallery.invalidateCurrItems(); // reinit Items
                   gallery.updateSize(true); // reinit Items
                }
            img.src = item.src; // let's download image
            }
        });
        gallery.init();
    })
});