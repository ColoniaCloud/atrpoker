<?php
/**
 * ATRPoker – Endpoint REST público de registro de usuarios
 *
 * Registra POST en /wp-json/atrpoker/v1/register
 * Devuelve el JWT (mismo formato que /wp-json/jwt-auth/v1/token) para
 * permitir auto-login después del registro.
 *
 * Requiere el plugin "JWT Authentication for WP REST API" activo
 * (para que el frontend pueda usar el token devuelto).
 *
 * Pegá este código en el functions.php del tema hijo, o guardalo como
 * un plugin en /wp-content/plugins/atrpoker-register/atrpoker-register.php
 * agregando el header de plugin en las primeras líneas.
 *
 * Header de plugin (si lo usás como plugin independiente):
 * -------------------------------------------------------
 * Plugin Name: ATRPoker Registro de Usuarios
 * Description: Endpoint REST público de registro con auto-login JWT.
 * Version: 1.0.0
 * Author: ATRPoker
 * -------------------------------------------------------
 */

add_action( 'rest_api_init', function () {
    register_rest_route( 'atrpoker/v1', '/register', [
        'methods'             => 'POST',
        'callback'            => 'atrpoker_register_user',
        'permission_callback' => '__return_true', // Endpoint público
        'args'                => [
            'username' => [
                'required' => true,
                'type'     => 'string',
            ],
            'email' => [
                'required' => true,
                'type'     => 'string',
                'format'   => 'email',
            ],
            'password' => [
                'required' => true,
                'type'     => 'string',
            ],
            'name' => [
                'required' => false,
                'type'     => 'string',
            ],
        ],
    ] );
} );

function atrpoker_register_user( WP_REST_Request $request ) {
    // Permitir desactivar el registro globalmente vía constante
    if ( defined( 'ATRPOKER_DISABLE_REGISTER' ) && ATRPOKER_DISABLE_REGISTER ) {
        return new WP_Error( 'registration_disabled', 'El registro está desactivado.', [ 'status' => 403 ] );
    }

    $username = sanitize_user( $request->get_param( 'username' ), true );
    $email    = sanitize_email( $request->get_param( 'email' ) );
    $password = (string) $request->get_param( 'password' );
    $name     = sanitize_text_field( (string) $request->get_param( 'name' ) );

    // ── Validaciones ──────────────────────────────────────────────────────

    if ( empty( $username ) || strlen( $username ) < 3 ) {
        return new WP_Error( 'invalid_username', 'El usuario debe tener al menos 3 caracteres.', [ 'status' => 400 ] );
    }

    if ( ! is_email( $email ) ) {
        return new WP_Error( 'invalid_email', 'El email no es válido.', [ 'status' => 400 ] );
    }

    if ( strlen( $password ) < 8 ) {
        return new WP_Error( 'weak_password', 'La contraseña debe tener al menos 8 caracteres.', [ 'status' => 400 ] );
    }

    if ( username_exists( $username ) ) {
        return new WP_Error( 'username_exists', 'Ese nombre de usuario ya está en uso.', [ 'status' => 409 ] );
    }

    if ( email_exists( $email ) ) {
        return new WP_Error( 'email_exists', 'Ese email ya está registrado.', [ 'status' => 409 ] );
    }

    // ── Crear el usuario ──────────────────────────────────────────────────

    $user_id = wp_create_user( $username, $password, $email );

    if ( is_wp_error( $user_id ) ) {
        return new WP_Error(
            'registration_failed',
            $user_id->get_error_message(),
            [ 'status' => 400 ]
        );
    }

    // Display name opcional
    if ( ! empty( $name ) ) {
        wp_update_user( [
            'ID'           => $user_id,
            'display_name' => $name,
            'first_name'   => $name,
        ] );
    }

    // Rol por defecto (configurable vía filtro)
    $default_role = apply_filters( 'atrpoker_register_default_role', get_option( 'default_role', 'subscriber' ) );
    $user = new WP_User( $user_id );
    $user->set_role( $default_role );

    // Email opcional de bienvenida (lo manda WP de fábrica)
    wp_new_user_notification( $user_id, null, 'admin' );

    // ── Generar JWT con el plugin JWT Authentication ──────────────────────
    // Reutilizamos su endpoint internamente para devolver el mismo shape.

    $jwt_request = new WP_REST_Request( 'POST', '/jwt-auth/v1/token' );
    $jwt_request->set_param( 'username', $username );
    $jwt_request->set_param( 'password', $password );

    $jwt_response = rest_do_request( $jwt_request );

    if ( $jwt_response->is_error() ) {
        // Usuario creado pero no se pudo generar el token: devolvemos éxito sin token
        return new WP_REST_Response( [
            'success' => true,
            'user_id' => $user_id,
            'token'   => null,
            'message' => 'Usuario creado. Iniciá sesión manualmente.',
        ], 201 );
    }

    $jwt_data = $jwt_response->get_data();

    return new WP_REST_Response( [
        'success'           => true,
        'user_id'           => $user_id,
        'token'             => $jwt_data['token']             ?? null,
        'user_email'        => $jwt_data['user_email']        ?? $email,
        'user_nicename'     => $jwt_data['user_nicename']     ?? $username,
        'user_display_name' => $jwt_data['user_display_name'] ?? ( $name ?: $username ),
    ], 201 );
}
