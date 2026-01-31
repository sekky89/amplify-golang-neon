package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
)

func main() {
	app := fiber.New()

	app.Get("/api/v1/hello", func(c fiber.Ctx) error {
		return c.JSON(map[string]string{"message": "hello"})
	})

	log.Fatal(app.Listen(os.ExpandEnv(":${PORT}")))
}
