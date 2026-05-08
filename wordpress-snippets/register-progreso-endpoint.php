<?php
/**
 * ATRPoker – Endpoint REST para progreso del curriculum
 *
 * Registra GET y POST en /wp-json/atrpoker/v1/progreso
 * Requiere el plugin "JWT Authentication for WP REST API" activo.
 *
 * Pegá este código en el functions.php del tema hijo, o guardalo como
 * un plugin en /wp-content/plugins/atrpoker-progreso/atrpoker-progreso.php
 * agregando el header de plugin en las primeras líneas.
 *
 * Header de plugin (si lo usás como plugin independiente):
 * -------------------------------------------------------
 * Plugin Name: ATRPoker Progreso Curriculum
 * Description: Endpoint REST para guardar el progreso del curriculum por usuario.
 * Version: 1.0.0
 * Author: ATRPoker
 * -------------------------------------------------------
 */

add_action( 'rest_api_init', function () {

    // ── GET /wp-json/atrpoker/v1/progreso ─────────────────────────────────
    // Devuelve el progreso del usuario autenticado como JSON:
    // { "slug-del-post": true, "otro-slug": false, ... }

    register_rest_route( 'atrpoker/v1', '/progreso', [
        'methods'             => 'GET',
        'callback'            => 'atrpoker_get_progreso',
        'permission_callback' => 'atrpoker_progreso_permission',
    ] );

    // ── POST /wp-json/atrpoker/v1/progreso ────────────────────────────────
    // Body JSON esperado: { "slug": "nombre-del-post", "completed": true }
    // Actualiza solo ese slug en el mapa de progreso del usuario.

    register_rest_route( 'atrpoker/v1', '/progreso', [
        'methods'             => 'POST',
        'callback'            => 'atrpoker_save_progreso',
        'permission_callback' => 'atrpoker_progreso_permission',
        'args'                => [
            'slug' => [
                'required'          => true,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'completed' => [
                'required' => true,
                'type'     => 'boolean',
            ],
        ],
    ] );
} );

/**
 * Verificación de autenticación.
 * El plugin JWT Authentication se encarga de poblar wp_get_current_user()
 * a partir del header Authorization: Bearer {token}.
 */
function atrpoker_progreso_permission(): bool {
    return is_user_logged_in();
}

/**
 * GET — devuelve el mapa de progreso del usuario actual.
 *
 * @return WP_REST_Response
 */
function atrpoker_get_progreso(): WP_REST_Response {
    $user_id  = get_current_user_id();
    $raw      = get_user_meta( $user_id, 'atrpoker_progreso', true );
    $progreso = is_array( $raw ) ? $raw : [];

    return new WP_REST_Response( $progreso, 200 );
}

/**
 * POST — actualiza el estado de un slug en el progreso del usuario.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function atrpoker_save_progreso( WP_REST_Request $request ): WP_REST_Response {
    $user_id   = get_current_user_id();
    $slug      = $request->get_param( 'slug' );
    $completed = (bool) $request->get_param( 'completed' );

    $raw      = get_user_meta( $user_id, 'atrpoker_progreso', true );
    $progreso = is_array( $raw ) ? $raw : [];

    if ( $completed ) {
        $progreso[ $slug ] = true;
    } else {
        unset( $progreso[ $slug ] );
    }

    update_user_meta( $user_id, 'atrpoker_progreso', $progreso );

    return new WP_REST_Response( [ 'ok' => true ], 200 );
}
