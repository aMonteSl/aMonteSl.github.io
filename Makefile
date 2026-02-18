.PHONY: help dev build lint deploy clean install

help:
	@echo "📋 Available commands:"
	@echo ""
	@echo "  make dev              - Start development server (http://localhost:3000)"
	@echo "  make build            - Build for production (generates ./out)"
	@echo "  make lint             - Run ESLint"
	@echo "  make deploy [MSG]     - Deploy to GitHub Pages (e.g. make deploy MSG=\"New features\")"
	@echo "  make clean            - Remove build artifacts (.next, out, .deploycount)"
	@echo "  make install          - Install dependencies (npm ci)"
	@echo "  make help             - Show this help message"
	@echo ""

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

deploy:
ifdef MSG
	npm run deploy "$(MSG)"
else
	npm run deploy
endif

clean:
	rm -rf .next out .deploycount
	@echo "✅ Cleaned build artifacts"

install:
	npm ci
	@echo "✅ Dependencies installed"

.DEFAULT_GOAL := help
