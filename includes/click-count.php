<?php

namespace NikolayS93\LWModal;

if ( ! defined( 'ABSPATH' ) )
    exit; // disable direct access

add_action( 'wp_ajax_nopriv_increase_click_count', __NAMESPACE__ . '\increase_click_count' );
add_action( 'wp_ajax_increase_click_count', __NAMESPACE__ . '\increase_click_count' );
function increase_click_count() {
    if( ! wp_verify_nonce( $_POST['nonce'], 'Secret' ) ) {
        wp_die('Ошибка! нарушены правила безопасности');
    }

    $modal_id = absint( $_POST['modal_id'] );
    if( $modal_id < 1 ) {
        wp_die('Не передан ID модального окна');
    }

    $count = get_post_meta( $modal_id, '_count', true );
    update_post_meta( $modal_id, '_count', + $count + 1 );

    echo $count;
    wp_die();
}
