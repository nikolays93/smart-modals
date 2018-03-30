jQuery(document).ready(function($) {
    function getCookie(e){var o=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return o?decodeURIComponent(o[1]):void 0}
    // name, value, options[expires, path]
    function setCookie(e,o,i){var r=(i=i||{}).expires;if("number"==typeof r&&r){var t=new Date;t.setTime(t.getTime()+1e3*r),r=i.expires=t}r&&r.toUTCString&&(i.expires=r.toUTCString());var n=e+"="+(o=encodeURIComponent(o));for(var a in i){n+="; "+a;var m=i[a];!0!==m&&(n+="="+m)}document.cookie=n}

    function increase_click_count( modal_id ) {
        $.ajax({
            type: 'POST',
            url: LWM_Settings.ajax_url,
            data: {
                action: 'increase_click_count',
                nonce: LWM_Settings.nonce,
                modal_id: modal_id
            },
            success: function(response){
                //alert('Получено с сервера: ' + response);
            }
        }).fail(function() {
            console.log('Warning: Ajax Fatal Error!');
        });
    }

    function openLWModal(index, val, ignoreCookie = false) {
        var disabled = getCookie('lwdisabled');
        disabled = disabled ? JSON.parse( disabled ) : {};

        if( !ignoreCookie && index in disabled ) return;
        try {
            $.fancybox.open({
                src  : '#modal_' + index,
                type : 'inline',
                opts : {
                    afterShow : function( instance, current ) {
                        if(!ignoreCookie) {
                            /**
                             * @todo
                             * Записывать для каждого окна время, до когда его дизактивировать
                             * и после сверять с существующим временем
                             */
                            disabled[ index ] = 1;
                            setCookie( 'lwdisabled', JSON.stringify(disabled), {expires: 60 * 60 * val.disable_ontime} ); // hours
                        }

                        increase_click_count( index );
                    }
                }
            });
        } catch(e) {
            console.error('Библиотека не установленна');
            console.log(e);
        }

    }

    if( LWModals.modal_selector ){
        // if( LWModals.modal_type == 'fancybox3' ){
            $( LWModals.modal_selector ).each(function(index, el) {
                $(this).attr('data-fancybox', $(this).attr('rel') );
            });

            var fancyModal = $( LWModals.modal_selector ).fancybox({
                animationEffect : LWModals.openCloseEffect,
                transitionEffect : LWModals.nextPrevEffect,
            });
        // }
    }

    var opened = {};
    $.each(LWModals.modals, function(modal_id, modal) {
        if( 'shortcode' == modal.trigger_type ) return;

        var ignore = modal.disable_ontime <= 0;
        switch ( modal.trigger_type ) {
            case 'onclick':
                $(modal.trigger).on('click', function(event) {
                    openLWModal(modal_id, modal, true);
                });
            break;
            case 'onload':
                setTimeout(function(){
                    openLWModal(modal_id, modal, ignore);
                }, modal.trigger * 1000 );
            break;
            case 'onclose':
                $(document).on('mouseleave', function(event) {
                    var is_opened = modal_id in opened;
                    if( !is_opened )
                        openLWModal(modal_id, modal, ignore);

                    opened[ modal_id ] = true;
                });
            break;
      }
    });

    $('[data-modal-id]').on('click', function(event) {
        var modal_id = +$(this).attr( 'data-modal-id' );
        if( modal_id >= 1 ) {
            increase_click_count( modal_id );
        }
    });
});