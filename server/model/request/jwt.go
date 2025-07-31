package request

import (
	"server/model/appTypes"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gofrs/uuid"
)

type JwtCustomClaims struct {
	BaseClaims
	jwt.RegisteredClaims
}
type JwtCustomRefreshClaims struct {
	UserID uint
	jwt.RegisteredClaims
}

type BaseClaims struct {
	UserID uint
	UUID   uuid.UUID
	RoleID appTypes.RoleID
}