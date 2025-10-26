package middleware

import (
	"server/global"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Cors returns a CORS middleware configured for the application
func Cors() gin.HandlerFunc {
	config := cors.Config{
		// AllowOriginFunc is a custom function to validate the origin
		AllowOriginFunc: func(origin string) bool {
			// Allow requests with no origin (mobile apps, curl, Postman, etc.)
			if origin == "" {
				return true
			}

			// Check if we're in development mode
			if global.Config.System.Env == "debug" {
				// In development, allow localhost on different ports
				allowedOrigins := []string{
					"http://localhost:3000",
					"http://127.0.0.1:3000",
					"http://localhost:3001",
					"http://127.0.0.1:3001",
					// Also allow Next.js dev server variations
					"http://localhost:3000/",
					"http://127.0.0.1:3000/",
				}

				for _, allowedOrigin := range allowedOrigins {
					if origin == allowedOrigin || origin == allowedOrigin[:len(allowedOrigin)-1] {
						return true
					}
				}
				return false
			}

			// In production, check against a whitelist of allowed origins
			// Update these with your actual production domains
			allowedOrigins := []string{
				"https://yourdomain.com",
				"https://www.yourdomain.com",
			}

			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					return true
				}
			}

			return false
		},
		// AllowMethods specifies the HTTP methods allowed for CORS
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
			"PATCH",
		},
		// AllowHeaders specifies the headers allowed for CORS
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
			"X-Requested-With",
			"Cache-Control",
		},
		// ExposeHeaders specifies the headers that are safe to expose to the API
		ExposeHeaders: []string{
			"Content-Length",
			"Content-Type",
		},
		// AllowCredentials indicates whether the request can include user credentials
		AllowCredentials: true,
		// MaxAge determines how long a preflight request can be cached
		MaxAge: 12 * time.Hour,
	}

	return cors.New(config)
}
