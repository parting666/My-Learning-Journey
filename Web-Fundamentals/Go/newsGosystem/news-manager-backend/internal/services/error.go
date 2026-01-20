package services

import "errors"

var (
	ErrUserExists          = errors.New("username already exists")
	ErrInvalidCredentials  = errors.New("invalid username or password")
	ErrTokenGenerationFailed = errors.New("failed to generate token")
)