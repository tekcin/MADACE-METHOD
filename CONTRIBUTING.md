# Contributing to MADACE-METHOD

Thank you for your interest in contributing to MADACE-METHOD! 🎉

## Code of Conduct

Be respectful, inclusive, and constructive. We're building a collaborative
community.

## How to Contribute

### 1. Report Issues

Found a bug? Have a feature request?

- Check existing issues first
- Create a new issue with clear description
- Include reproduction steps for bugs

### 2. Submit Pull Requests

**Before You Start:**

- Fork the repository
- Create a feature branch: `git checkout -b feature/your-feature`
- Follow the code style (ESLint + Prettier)

**PR Guidelines:**

- Keep PRs under 800 lines (ideal: 200-400)
- Write clear commit messages (conventional commits)
- Update documentation
- Add tests where applicable
- Run linter and formatter before committing

**Commit Format:**

```
<type>(<scope>): <description>

feat(mam): add new workflow
fix(core): resolve state machine issue
docs(readme): update installation steps
```

### 3. Create Custom Modules

Use MAB (MADACE Builder) to create custom modules:

```bash
madace builder create-module
```

Follow the standard module structure and submit for community review.

## Development Setup

```bash
# Clone and install
git clone https://github.com/your-org/MADACE-METHOD.git
cd MADACE-METHOD
npm install

# Development workflow
npm run lint:fix      # Fix linting
npm run format:fix    # Format code
npm test              # Run tests (when available)
```

## Code Style

- **ESLint 9.x** with yaml-eslint-parser
- **Prettier 3.x** for formatting
- **Husky** pre-commit hooks auto-run
- Natural language configs only (no executable code in YAML/Markdown)
- Cross-platform paths (`path.join()`, never hardcoded slashes)

## Testing

Currently in development. Test infrastructure planned for v1.0-beta.

## Documentation

- Update README.md for user-facing changes
- Update CLAUDE.md for architecture changes
- Add JSDoc comments to functions
- Create examples for new features

## Questions?

- Check [Documentation](./docs/)
- Read [CLAUDE.md](./CLAUDE.md) for architecture
- Ask in Discussions (coming soon)

## License

By contributing, you agree that your contributions will be licensed under the
MIT License.

---

Thank you for helping make MADACE-METHOD better! 🚀
