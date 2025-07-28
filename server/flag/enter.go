package flag

import (
	//"errors"
	"fmt"
	"os"
	"server/global"

	"github.com/urfave/cli"
	"go.uber.org/zap"
)

var (
	sqlFlag = cli.BoolFlag{
		Name:  "sql",
		Usage: "Initialize the structure of the database table",
	}
	sqlExportFlag = &cli.BoolFlag{
		Name:  "sql-export",
		Usage: "Exports SQL data to a specified file.",
	}
	sqlImportFlag = &cli.StringFlag{
		Name:  "sql-import",
		Usage: "Imports SQL data from a specified file.",
	}
)

func Run(c *cli.Context) {
	if c.NumFlags() > 1 {
		err := cli.NewExitError("Only one command cna be specified", 1)
		global.Log.Error("Invalid command used", zap.Error(err))
		os.Exit(1)
	}
	switch {
	case c.Bool(sqlFlag.Name):
		if err := SQL(); err != nil {
			global.Log.Error("Filed to initialize the database table", zap.Error(err))
			return
		} else {
			global.Log.Info("Initialize the database table successfully")
		}
	case c.Bool(sqlExportFlag.Name):
		if err := SQLExport(); err != nil {
			global.Log.Error("Failed to export SQL data:", zap.Error(err))
		} else {
			global.Log.Info("Successfully exported SQL data")
		}
	// case c.IsSet(sqlImportFlag.Name):
	// 	if errs := SQLImport(c.String(sqlImportFlag.Name)); len(errs) > 0 {
	// 		var combinedErrors string
	// 		for _, err := range errs {
	// 			combinedErrors += err.Error() + "\n"
	// 		}
	// 		err := errors.New(combinedErrors)
	// 		global.Log.Error("Failed to import SQL data:", zap.Error(err))
	// 	} else {
	// 		global.Log.Info("Successfully imported SQL data")
	// 	}
	default:
		err := cli.NewExitError("Unknown command", 1)
		global.Log.Error("Invalid command used", zap.Error(err))
		os.Exit(1)
	}
}

func NewApp() *cli.App {
	app := cli.NewApp()
	app.Name = "go_blog"
	app.Flags = []cli.Flag{
		sqlFlag,
		sqlExportFlag,
	}
	app.Action = Run
	return app
}

func InitFlag() {
	if len(os.Args) > 1 {
		app := NewApp()
		err := app.Run(os.Args)
		if err != nil {
			global.Log.Error("Filed to run the flag", zap.Error(err))
			os.Exit(1)
		}
		if os.Args[1] == "-h" || os.Args[1] == "--help" {
			fmt.Println("Display help message...")
		}
		os.Exit(0)
	}
}
