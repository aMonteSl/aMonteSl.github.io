.PHONY: help dev build lint typecheck check preview ship deploy clean install

help:
	@echo "Available commands:"
	@echo ""
	@echo "  make dev              - Start development server (http://localhost:3000)"
	@echo "  make build            - Build for production (generates ./out)"
	@echo "  make lint             - Run ESLint"
	@echo "  make typecheck        - Run TypeScript without emitting files"
	@echo "  make check            - Run lint, typecheck, and translation checks"
	@echo "  make preview          - Serve ./out locally after build"
	@echo "  make ship [MSG]       - Check, build, commit, and push the current branch"
	@echo "  make clean            - Remove build artifacts"
	@echo "  make install          - Install dependencies (npm ci)"
	@echo "  make help             - Show this help message"
	@echo ""

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

typecheck:
	npm run typecheck

check:
	npm run check

preview:
	npm run preview

ship:
ifdef MSG
	npm run ship "$(MSG)"
else
	npm run ship
endif

deploy: ship

clean:
	rm -rf .next .next-dev out .deploycount
	@echo "Cleaned build artifacts"

install:
	npm ci
	@echo "Dependencies installed"

.DEFAULT_GOAL := help
