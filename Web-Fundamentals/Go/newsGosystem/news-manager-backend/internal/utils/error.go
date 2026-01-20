package utils

import "errors"

var (
    ErrJWTSecretNotSet = errors.New("JWT_SECRET not set in environment variables")
    ErrInvalidToken    = errors.New("invalid token")
)